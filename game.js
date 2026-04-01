// ============================================================
// GAME.JS — Main Game Controller for Animal Hotel V2 (iPad)
// ============================================================

const Game = {
  state: null,
  currentRoom: 'lobby',
  selectedAnimal: -1,
  shopTab: 'protein',
  editorRoom: -1,
  editorTab: 'color',
  dialogueQueue: [],
  dialogueActive: false,
  needDecayTimer: 0,

  // ===== INIT =====
  init() {
    Audio.init();
    Minigames.init();

    // Load assets
    Assets.load(
      (progress) => {
        const fill = document.getElementById('loading-fill');
        if (fill) fill.style.width = `${Math.floor(progress*100)}%`;
      },
      () => {
        // Done loading
        this._showScreen('screen-title');
        this._setupTitle();
        this._setupEvents();

        // Check save
        const saved = localStorage.getItem('animalhotel_v2_save');
        if (saved) {
          document.getElementById('btn-continue').style.display = 'inline-block';
        }
      }
    );
  },

  // ===== SCREEN MANAGEMENT =====
  _showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
  },

  // ===== TITLE SCREEN =====
  _setupTitle() {
    // Add animals to title
    const animalsDiv = document.getElementById('title-animals');
    ['dog','cat','owl','bear','monkey'].forEach(type => {
      const img = document.createElement('img');
      img.src = `assets/game/animals/${type}.png`;
      img.alt = type;
      animalsDiv.appendChild(img);
    });
  },

  // ===== EVENTS =====
  _setupEvents() {
    // Title buttons
    document.getElementById('btn-new-game').onclick = () => {
      Audio.play('select');
      this._showScreen('screen-charselect');
      this._setupCharSelect();
    };
    document.getElementById('btn-continue').onclick = () => {
      Audio.play('select');
      this._loadGame();
      this._enterGame();
    };

    // Close mini game
    document.getElementById('btn-close-mini').onclick = () => {
      Minigames.stop(null);
    };

    // Nav bar
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.onclick = () => {
        Audio.play('tap');
        const room = btn.dataset.room;
        this.navigateTo(room);
      };
    });

    // Close animal panel
    document.getElementById('btn-close-panel').onclick = () => {
      document.getElementById('animal-panel').style.display = 'none';
      this.selectedAnimal = -1;
    };

    // Dialogue tap
    document.getElementById('dialogue').onclick = () => {
      this._advanceDialogue();
    };

    // Keyboard save
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        this.saveGame();
      }
    });

    // Auto-save every 60s
    setInterval(() => {
      if (this.state) this._autoSave();
    }, 60000);

    // Decay timer
    setInterval(() => {
      if (this.state) this._decayNeeds();
    }, 10000);
  },

  // ===== CHARACTER SELECT =====
  _setupCharSelect() {
    const grid = document.getElementById('char-grid');
    grid.innerHTML = '';

    const chars = [
      { id:'girl', emoji:'👧', label:'Fille' },
      { id:'boy', emoji:'👦', label:'Garçon' },
      { id:'princess', emoji:'👸', label:'Princesse' },
      { id:'robot', emoji:'🤖', label:'Robot' },
    ];

    chars.forEach(ch => {
      const card = document.createElement('div');
      card.className = 'char-card';
      card.innerHTML = `<span class="char-emoji">${ch.emoji}</span><span class="char-label">${ch.label}</span>`;
      card.onclick = () => {
        Audio.play('select');
        grid.querySelectorAll('.char-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        this._selectedChar = ch.id;
        document.getElementById('name-area').style.display = 'block';
      };
      grid.appendChild(card);
    });

    document.getElementById('btn-start').onclick = () => {
      const name = document.getElementById('input-name').value.trim();
      if (!name) return;
      Audio.play('star');
      this.state = getDefaultState();
      this.state.playerName = name;
      this.state.playerChar = this._selectedChar || 'girl';

      // Give starting animal
      const starter = generateRandomAnimal();
      starter.arrivalDay = 1;
      starter.room = 0;
      this.state.animals.push(starter);

      // Give starting food
      this.state.fridge.protein.push(1,2,3);
      this.state.fridge.green.push(1,2);
      this.state.fridge.carb.push(1);

      this._enterGame();
      this._startTutorial();
    };
  },

  // ===== ENTER GAME =====
  _enterGame() {
    this._showScreen('screen-game');
    this.navigateTo('lobby');
    this._updateHUD();
  },

  // ===== NAVIGATION =====
  navigateTo(room) {
    this.currentRoom = room;
    // Update nav active state
    document.querySelectorAll('.nav-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.room === room);
    });
    // Update room name
    const names = { lobby:'🏠 Hall', rooms:'🛏️ Chambres', kitchen:'🍳 Cuisine',
      bath:'🛁 Bain', shop:'🛍️ Boutique', arcade:'🎮 Jeux', phone:'📱 Appel' };
    document.getElementById('hud-room').textContent = names[room] || room;

    this.renderCurrentRoom();
  },

  renderCurrentRoom() {
    const container = document.getElementById('room-area');
    switch(this.currentRoom) {
      case 'lobby': Scenes.renderLobby(container, this.state); break;
      case 'rooms': Scenes.renderRooms(container, this.state); break;
      case 'kitchen': Scenes.renderKitchen(container, this.state); break;
      case 'bath': Scenes.renderBath(container, this.state); break;
      case 'shop': Scenes.renderShop(container, this.state); break;
      case 'arcade': Scenes.renderArcade(container, this.state); break;
      case 'phone': Scenes.renderPhone(container, this.state); break;
    }
  },

  // ===== HUD =====
  _updateHUD() {
    if (!this.state) return;
    document.getElementById('hud-coins').textContent = `💰 ${this.state.coins}`;
    document.getElementById('hud-stars').textContent = `⭐ ${this.state.stars}`;
  },

  // ===== ANIMAL INTERACTION =====
  selectAnimal(idx, context) {
    Audio.play('tap');
    this.selectedAnimal = idx;
    const animal = this.state.animals[idx];
    if (!animal) return;
    const aType = ANIMAL_TYPES[animal.type];

    const panel = document.getElementById('animal-panel');
    panel.style.display = 'flex';

    // Set image
    document.getElementById('panel-animal-img').src = `assets/game/animals/${aType.img}.png`;
    const face = Scenes._getAnimalFace(animal);
    document.getElementById('panel-face-img').src = `assets/game/faces/${face}.png`;
    document.getElementById('panel-animal-name').textContent = `${aType.emoji} ${animal.name} le ${aType.name}`;

    // Bars
    const barsDiv = document.getElementById('panel-bars');
    barsDiv.innerHTML = '';
    const bars = [
      { key:'hunger', label:'🍖 Faim', cls:'bar-hunger' },
      { key:'happiness', label:'💕 Joie', cls:'bar-happy' },
      { key:'cleanliness', label:'🧼 Propreté', cls:'bar-clean' },
      { key:'health', label:'💚 Santé', cls:'bar-health' },
    ];
    bars.forEach(b => {
      const val = Math.max(0, Math.min(1, animal[b.key] || 0.5));
      barsDiv.innerHTML += `
        <div class="bar-row">
          <span class="bar-label">${b.label}</span>
          <div class="bar-track ${b.cls}"><div class="bar-fill" style="width:${val*100}%"></div></div>
        </div>`;
    });

    // Actions
    const actionsDiv = document.getElementById('panel-actions');
    actionsDiv.innerHTML = '';
    const actions = [
      { label:'Nourrir', ico:'🍳', cls:'act-cook', hint:'Cuisine un plat', fn:() => this.cookForAnimal(idx) },
      { label:'Caresser', ico:'💕', cls:'act-pet', hint:'Glisse sur l\'animal', fn:() => this.petAnimal(idx) },
      { label:'Laver', ico:'🛁', cls:'act-wash', hint:'Frotte pour laver', fn:() => this.washAnimal(idx) },
      { label:'Jouer', ico:'⚽', cls:'act-play', hint:'Lance la balle', fn:() => this.playWithAnimal(idx) },
      { label:'Chambre', ico:'🛏️', cls:'act-room', hint:'Personnalise', fn:() => this.openRoomEditor(animal.room >= 0 ? animal.room : 0) },
    ];
    actions.forEach(a => {
      const btn = document.createElement('button');
      btn.className = `action-btn ${a.cls}`;
      btn.innerHTML = `<span class="action-ico">${a.ico}</span>${a.label}<span class="action-hint">${a.hint}</span>`;
      btn.onclick = () => { panel.style.display = 'none'; a.fn(); };
      actionsDiv.appendChild(btn);
    });
  },

  // ===== COOKING =====
  cookForAnimal(idx) {
    const animal = this.state.animals[idx];
    if (!animal) return;

    Minigames.start('cooking', { animalType: animal.type, fridge: this.state.fridge }, (result) => {
      if (result && result.success) {
        const reaction = getFoodReaction(animal.type, result.category);
        if (reaction === 'love') {
          animal.hunger = Math.min(1, animal.hunger + 0.4);
          animal.happiness = Math.min(1, animal.happiness + 0.2);
          animal.face = 'star_eyes';
          this.notify('🤩 Miam ! Il adore !');
          this.state.stars++;
        } else if (reaction === 'like') {
          animal.hunger = Math.min(1, animal.hunger + 0.3);
          animal.face = 'happy';
          this.notify('😊 C\'est bon !');
        } else {
          animal.hunger = Math.min(1, animal.hunger + 0.1);
          animal.happiness = Math.max(0, animal.happiness - 0.1);
          animal.face = 'angry';
          this.notify('😤 Beurk !');
        }
        this.state.coins += 5;
        this._updateHUD();
        setTimeout(() => { animal.face = 'neutral'; }, 3000);
        this.renderCurrentRoom();
      }
    });
  },

  // ===== PETTING =====
  petAnimal(idx) {
    const animal = this.state.animals[idx];
    if (!animal) return;
    Minigames.start('petting', { animalType: animal.type }, (result) => {
      if (result && result.success) {
        animal.happiness = Math.min(1, animal.happiness + 0.3);
        animal.face = 'love';
        this.notify('💕 Il est tellement content !');
        this.state.coins += 3;
        this._updateHUD();
        setTimeout(() => { animal.face = 'neutral'; }, 3000);
        this.renderCurrentRoom();
      }
    });
  },

  // ===== WASHING =====
  washAnimal(idx) {
    const animal = this.state.animals[idx];
    if (!animal) return;
    Minigames.start('washing', { animalType: animal.type }, (result) => {
      if (result && result.success) {
        animal.cleanliness = Math.min(1, animal.cleanliness + 0.5);
        animal.health = Math.min(1, animal.health + 0.1);
        animal.face = 'happy';
        this.notify('✨ Tout propre !');
        this.state.coins += 4;
        this._updateHUD();
        setTimeout(() => { animal.face = 'neutral'; }, 3000);
        this.renderCurrentRoom();
      }
    });
  },

  // ===== PLAY =====
  playWithAnimal(idx) {
    const animal = this.state.animals[idx];
    if (!animal) return;
    const playType = ANIMAL_TYPES[animal.type]?.playType === 'yarn' ? 'petting' : 'play_ball';
    Minigames.start(playType, { animalType: animal.type }, (result) => {
      if (result && result.success) {
        animal.happiness = Math.min(1, animal.happiness + 0.4);
        animal.face = 'excited';
        this.notify('🎉 Trop fun !');
        this.state.coins += 5;
        this.state.stars++;
        this._updateHUD();
        setTimeout(() => { animal.face = 'neutral'; }, 3000);
        this.renderCurrentRoom();
      }
    });
  },

  // ===== ROOM EDITOR =====
  openRoomEditor(roomIdx) {
    this.editorRoom = roomIdx;
    document.getElementById('animal-panel').style.display = 'none';
    this.navigateTo('rooms');
    // Show editor inline (simplified)
    this.notify(`🛏️ Chambre ${roomIdx+1} sélectionnée`);
    // TODO: full room editor UI
  },

  // ===== FRIDGE =====
  openFridge() {
    const total = Object.values(this.state.fridge).reduce((s,a) => s+a.length, 0);
    this.showDialogue('Frigo', `Tu as ${total} ingrédients dans le frigo.\n🥩 Protéines: ${this.state.fridge.protein.length}\n🥬 Légumes: ${this.state.fridge.green.length}\n🍞 Féculents: ${this.state.fridge.carb.length}\n🧂 Sauces: ${this.state.fridge.condiment.length}`);
  },

  // ===== COOKING (from kitchen) =====
  startCooking() {
    if (this.state.animals.length === 0) {
      this.notify('Aucun animal à nourrir !');
      return;
    }
    // Cook for first animal by default
    this.cookForAnimal(0);
  },

  // ===== SHOP =====
  buyFood(category, idx) {
    const price = FOOD_CATEGORIES[category].price;
    if (this.state.coins < price) {
      this.notify('💰 Pas assez de pièces !');
      Audio.play('sad');
      return;
    }
    this.state.coins -= price;
    this.state.fridge[category].push(idx);
    Audio.play('buy');
    this.notify(`✅ Acheté ! (Frigo: ${this.state.fridge[category].length})`);
    this._updateHUD();
  },

  buyItem(item) {
    if (this.state.coins < item.price) {
      this.notify('💰 Pas assez de pièces !');
      Audio.play('sad');
      return;
    }
    this.state.coins -= item.price;
    this.state.inventory.push(item.id);
    Audio.play('buy');
    this.notify(`✅ ${item.name} acheté !`);
    this._updateHUD();
  },

  // ===== PHONE =====
  makePhoneCall() {
    if (this.state.animals.length >= 6) {
      this.notify('🏨 L\'hôtel est plein ! (6/6)');
      return;
    }
    Audio.play('phone');
    const animal = generateRandomAnimal();
    animal.arrivalDay = this.state.day;
    // Assign to first free room
    for (let i = 0; i < 6; i++) {
      if (!this.state.animals.find(a => a.room === i)) {
        animal.room = i;
        break;
      }
    }
    if (animal.room === -1) animal.room = this.state.animals.length;
    this.state.animals.push(animal);

    const aType = ANIMAL_TYPES[animal.type];
    const msg = OWNER_MESSAGES[Math.floor(Math.random()*OWNER_MESSAGES.length)].replace('{animal}', animal.name);
    this.showDialogue('📞 Propriétaire', `${msg}\n\n${aType.emoji} ${animal.name} le ${aType.name} arrive !\nSéjour: ${animal.stayDuration} jours`);

    this.state.coins += 10;
    this._updateHUD();
    this.renderCurrentRoom();
  },

  // ===== ARCADE =====
  startArcadeGame(gameId) {
    const typeMap = { log_jump:'log_jump', hidden:'hidden', catch:'catch_stars', memory:'memory' };
    const type = typeMap[gameId] || gameId;
    Minigames.start(type, {}, (result) => {
      if (result) {
        const score = result.score || 0;
        const coins = Math.floor(score * 2);
        this.state.coins += coins;
        if (gameId === 'log_jump') this.state.highScores.logJump = Math.max(this.state.highScores.logJump, score);
        if (gameId === 'hidden') this.state.highScores.hiddenAnimals = Math.max(this.state.highScores.hiddenAnimals, score);
        this._updateHUD();
        this.notify(`🎮 Score: ${score} — +${coins} 💰`);
        this.renderCurrentRoom();
      }
    });
  },

  // ===== DIALOGUE =====
  showDialogue(speaker, text, choices) {
    const dial = document.getElementById('dialogue');
    dial.style.display = 'block';
    document.getElementById('dial-speaker').textContent = speaker;
    document.getElementById('dial-text').textContent = text;
    this.dialogueActive = true;

    const choicesDiv = document.getElementById('dial-choices');
    if (choices && choices.length > 0) {
      choicesDiv.style.display = 'block';
      choicesDiv.innerHTML = '';
      choices.forEach(ch => {
        const div = document.createElement('div');
        div.className = 'dial-choice';
        div.textContent = ch.text;
        div.onclick = (e) => {
          e.stopPropagation();
          this._closeDialogue();
          if (ch.fn) ch.fn();
        };
        choicesDiv.appendChild(div);
      });
    } else {
      choicesDiv.style.display = 'none';
    }
  },

  _advanceDialogue() {
    if (!this.dialogueActive) return;
    this._closeDialogue();
  },

  _closeDialogue() {
    document.getElementById('dialogue').style.display = 'none';
    this.dialogueActive = false;
  },

  // ===== TUTORIAL =====
  _startTutorial() {
    const animal = this.state.animals[0];
    const aType = animal ? ANIMAL_TYPES[animal.type] : null;
    const name = animal ? animal.name : 'ton animal';

    this.showDialogue('🐾 Bienvenue !',
      `Salut ${this.state.playerName} ! Bienvenue à l'Animal Hotel !\n\n` +
      `${aType ? aType.emoji : '🐶'} ${name} vient d'arriver. Prends bien soin de lui !\n\n` +
      `👆 Tape sur un animal pour le nourrir, caresser, laver ou jouer.\n` +
      `📱 Utilise le menu en bas pour naviguer entre les pièces.\n` +
      `💰 Gagne des pièces en t'occupant des animaux !`
    );
    this.state.tutorialDone = true;
  },

  // ===== NOTIFICATIONS =====
  notify(text) {
    const el = document.getElementById('notif');
    el.textContent = text;
    el.style.display = 'block';
    // Reset animation
    el.style.animation = 'none';
    el.offsetHeight; // trigger reflow
    el.style.animation = '';
    setTimeout(() => { el.style.display = 'none'; }, 2500);
  },

  // ===== SAVE / LOAD =====
  saveGame() {
    if (!this.state) return;
    localStorage.setItem('animalhotel_v2_save', JSON.stringify(this.state));
    Audio.play('save');
    const el = document.getElementById('save-indicator');
    el.style.display = 'block';
    el.style.animation = 'none';
    el.offsetHeight;
    el.style.animation = '';
    setTimeout(() => { el.style.display = 'none'; }, 2000);
  },

  _autoSave() {
    if (!this.state) return;
    localStorage.setItem('animalhotel_v2_save', JSON.stringify(this.state));
  },

  _loadGame() {
    try {
      const data = localStorage.getItem('animalhotel_v2_save');
      if (data) {
        this.state = JSON.parse(data);
        // Ensure defaults for new fields
        if (!this.state.highScores) this.state.highScores = { logJump:0, hiddenAnimals:0 };
        if (!this.state.fridge) this.state.fridge = { protein:[], green:[], carb:[], condiment:[] };
        if (!this.state.inventory) this.state.inventory = [];
        if (!this.state.rooms) this.state.rooms = {};
      }
    } catch(e) {
      console.error('Load failed:', e);
      this.state = getDefaultState();
    }
  },

  // ===== NEED DECAY =====
  _decayNeeds() {
    if (!this.state) return;
    this.state.animals.forEach(animal => {
      const aType = ANIMAL_TYPES[animal.type];
      if (!aType) return;
      const decay = 0.01;
      animal.hunger = Math.max(0, animal.hunger - decay * (aType.careNeeds.hunger || 0.5));
      animal.happiness = Math.max(0, animal.happiness - decay * (aType.careNeeds.happiness || 0.5));
      animal.cleanliness = Math.max(0, animal.cleanliness - decay * (aType.careNeeds.cleanliness || 0.5));
      // Health decays if other needs are very low
      if (animal.hunger < 0.2 || animal.happiness < 0.2) {
        animal.health = Math.max(0, animal.health - 0.005);
      }
    });
    // Re-render if on a room with animals
    if (['lobby','kitchen','bath'].includes(this.currentRoom)) {
      this.renderCurrentRoom();
    }
  },

  // ===== DAY CYCLE =====
  advanceDay() {
    this.state.day++;
    // Check for departures
    this.state.animals = this.state.animals.filter(a => {
      if (this.state.day - a.arrivalDay >= a.stayDuration) {
        const avg = (a.hunger + a.happiness + a.cleanliness + a.health) / 4;
        const tip = Math.floor(avg * 20);
        this.state.coins += tip;
        this.state.totalAnimalsServed++;
        if (avg > 0.7) this.state.stars++;
        this.notify(`👋 ${a.name} est parti ! Pourboire: ${tip} 💰`);
        return false;
      }
      return true;
    });
    this._updateHUD();
    this.renderCurrentRoom();
  },
};

// ===== START =====
window.addEventListener('DOMContentLoaded', () => Game.init());
// Resume audio on first touch
document.addEventListener('touchstart', () => Audio.resume(), { once: true });
document.addEventListener('click', () => Audio.resume(), { once: true });
