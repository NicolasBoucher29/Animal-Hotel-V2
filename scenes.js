// ============================================================
// SCENES.JS — Room scene rendering for Animal Hotel V2
// ============================================================

const Scenes = {

  // Render the lobby scene
  renderLobby(container, state) {
    container.innerHTML = '';
    container.className = 'room-scene room-lobby';

    // Decorations
    const decos = [
      { emoji:'🌿', style:'top:5%;left:5%;font-size:40px;' },
      { emoji:'🌸', style:'top:3%;right:8%;font-size:35px;' },
      { emoji:'🪴', style:'bottom:15%;left:3%;font-size:45px;' },
      { emoji:'🖼️', style:'top:8%;left:40%;font-size:50px;' },
      { emoji:'🛎️', style:'top:12%;right:25%;font-size:35px;cursor:pointer;', id:'bell' },
    ];
    decos.forEach(d => {
      const el = document.createElement('div');
      el.className = 'room-deco';
      el.style.cssText = d.style;
      el.textContent = d.emoji;
      if (d.id) el.id = `deco-${d.id}`;
      container.appendChild(el);
    });

    // Welcome text
    const welcome = document.createElement('div');
    welcome.style.cssText = 'margin-top:8px;text-align:center;z-index:2;';
    welcome.innerHTML = `<span style="font-size:16px;font-weight:800;color:var(--text);">
      Bienvenue ${state.playerName} ! 🐾</span>
      <br><span style="font-size:12px;color:var(--text-light);font-weight:600;">
      Jour ${state.day} — ${state.animals.length} animaux à l'hôtel</span>`;
    container.appendChild(welcome);

    // Animals in lobby
    this._renderAnimals(container, state, 'lobby');

    // Tip at bottom
    if (!state.tutorialDone) {
      const tip = document.createElement('div');
      tip.style.cssText = 'position:absolute;bottom:10px;left:50%;transform:translateX(-50%);font-size:12px;color:var(--text-light);font-weight:600;text-align:center;background:rgba(255,255,255,0.7);padding:6px 16px;border-radius:20px;';
      tip.textContent = '👆 Tape sur un animal pour t\'en occuper !';
      container.appendChild(tip);
    }
  },

  // Render rooms scene
  renderRooms(container, state) {
    container.innerHTML = '';
    container.className = 'room-scene room-rooms';

    const title = document.createElement('div');
    title.style.cssText = 'text-align:center;margin:8px 0;';
    title.innerHTML = '<span style="font-size:18px;font-weight:900;color:var(--text);">🛏️ Chambres</span>';
    container.appendChild(title);

    const grid = document.createElement('div');
    grid.style.cssText = 'display:grid;grid-template-columns:1fr 1fr;gap:12px;padding:8px;width:100%;max-width:500px;';

    for (let i = 0; i < 6; i++) {
      const room = state.rooms[i] || {};
      const animal = state.animals.find(a => a.room === i);
      const card = document.createElement('div');
      const bg = room.color ? ROOM_COLORS[room.color]?.bg : 'linear-gradient(180deg,#f5f5f5,#e0e0e0)';
      card.style.cssText = `background:${bg};border-radius:16px;padding:16px;text-align:center;
        box-shadow:0 3px 12px var(--shadow);cursor:pointer;min-height:100px;position:relative;`;
      card.innerHTML = `
        <div style="font-size:12px;font-weight:800;color:var(--text-light);margin-bottom:6px;">Chambre ${i+1}</div>
        <div style="font-size:28px;">${room.bed ? ROOM_BEDS[room.bed] || '🛏️' : '🛏️'}</div>
        ${animal ? `<img src="assets/game/animals/${ANIMAL_TYPES[animal.type].img}.png"
          style="width:50px;height:auto;margin-top:4px;filter:drop-shadow(1px 2px 1px rgba(0,0,0,0.1));" alt="">
          <div style="font-size:10px;font-weight:700;color:var(--text);">${animal.name}</div>` :
          '<div style="font-size:11px;color:var(--text-light);margin-top:8px;">Libre</div>'}
      `;
      card.onclick = () => Game.openRoomEditor(i);
      grid.appendChild(card);
    }
    container.appendChild(grid);
  },

  // Render kitchen scene
  renderKitchen(container, state) {
    container.innerHTML = '';
    container.className = 'room-scene room-kitchen';

    // Decorations
    this._addDeco(container, '💨', 'top:5%;right:20%;font-size:30px;opacity:0.4;');

    const title = document.createElement('div');
    title.style.cssText = 'text-align:center;margin:8px 0;z-index:2;';
    title.innerHTML = '<span style="font-size:18px;font-weight:900;color:var(--text);">🍳 Cuisine</span>';
    container.appendChild(title);

    // Fridge
    const fridge = document.createElement('div');
    fridge.className = 'fridge';
    fridge.style.cssText += ';position:relative;margin:12px;';
    fridge.textContent = '🧊';
    fridge.onclick = () => Game.openFridge();
    const fridgeLabel = document.createElement('div');
    fridgeLabel.style.cssText = 'font-size:11px;font-weight:700;color:var(--text);margin-top:6px;text-align:center;';
    const totalFood = Object.values(state.fridge).reduce((s,a) => s + a.length, 0);
    fridgeLabel.textContent = `Frigo (${totalFood} items)`;

    // Stove
    const stove = document.createElement('div');
    stove.className = 'stove';
    stove.style.cssText += ';position:relative;margin:12px;cursor:pointer;';
    stove.textContent = '🔥';
    stove.onclick = () => Game.startCooking();
    const stoveLabel = document.createElement('div');
    stoveLabel.style.cssText = 'font-size:11px;font-weight:700;color:var(--text);margin-top:6px;text-align:center;';
    stoveLabel.textContent = 'Cuisinière';

    const kitchenLayout = document.createElement('div');
    kitchenLayout.style.cssText = 'display:flex;gap:24px;align-items:flex-end;margin-top:16px;';
    const fridgeWrap = document.createElement('div');
    fridgeWrap.style.cssText = 'text-align:center;';
    fridgeWrap.appendChild(fridge);
    fridgeWrap.appendChild(fridgeLabel);
    const stoveWrap = document.createElement('div');
    stoveWrap.style.cssText = 'text-align:center;';
    stoveWrap.appendChild(stove);
    stoveWrap.appendChild(stoveLabel);
    kitchenLayout.appendChild(fridgeWrap);
    kitchenLayout.appendChild(stoveWrap);
    container.appendChild(kitchenLayout);

    // Animals that can be fed
    const hint = document.createElement('div');
    hint.style.cssText = 'margin-top:20px;text-align:center;font-size:13px;color:var(--text-light);font-weight:600;';
    hint.textContent = state.animals.length > 0
      ? '👆 Choisis un animal à nourrir, puis cuisine !'
      : 'Aucun animal à l\'hôtel pour le moment.';
    container.appendChild(hint);

    this._renderAnimals(container, state, 'kitchen');
  },

  // Render bath scene
  renderBath(container, state) {
    container.innerHTML = '';
    container.className = 'room-scene room-bath';

    this._addDeco(container, '💧', 'top:8%;left:10%;font-size:25px;opacity:0.3;');
    this._addDeco(container, '🫧', 'top:5%;right:15%;font-size:30px;opacity:0.3;');

    const title = document.createElement('div');
    title.style.cssText = 'text-align:center;margin:8px 0;z-index:2;';
    title.innerHTML = '<span style="font-size:18px;font-weight:900;color:var(--text);">🛁 Salle de Bain</span>';
    container.appendChild(title);

    // Bathtub
    const tub = document.createElement('div');
    tub.className = 'bathtub';
    tub.style.cssText += ';margin:20px auto;';
    tub.textContent = '🛁';
    container.appendChild(tub);

    const hint = document.createElement('div');
    hint.style.cssText = 'margin-top:12px;text-align:center;font-size:13px;color:var(--text-light);font-weight:600;';
    hint.textContent = '👆 Tape sur un animal pour le laver !';
    container.appendChild(hint);

    this._renderAnimals(container, state, 'bath');
  },

  // Render shop scene
  renderShop(container, state) {
    container.innerHTML = '';
    container.className = 'room-scene room-shop';

    const title = document.createElement('div');
    title.style.cssText = 'text-align:center;margin:8px 0;';
    title.innerHTML = '<span style="font-size:18px;font-weight:900;color:var(--text);">🛍️ Boutique</span>';
    container.appendChild(title);

    // Tabs
    const tabs = document.createElement('div');
    tabs.className = 'shop-tabs';
    const categories = [
      { id:'protein', label:'🥩 Viandes' },
      { id:'green', label:'🥬 Légumes' },
      { id:'carb', label:'🍞 Féculents' },
      { id:'condiment', label:'🧂 Sauces' },
      { id:'extras', label:'🎁 Extras' },
    ];
    categories.forEach(cat => {
      const tab = document.createElement('button');
      tab.className = 'shop-tab' + (Game.shopTab === cat.id ? ' active' : '');
      tab.textContent = cat.label;
      tab.onclick = () => { Game.shopTab = cat.id; Game.renderCurrentRoom(); };
      tabs.appendChild(tab);
    });
    container.appendChild(tabs);

    // Grid
    const grid = document.createElement('div');
    grid.className = 'shop-grid';

    if (Game.shopTab === 'extras') {
      SHOP_EXTRAS.forEach(item => {
        const card = document.createElement('div');
        card.className = 'shop-item';
        card.innerHTML = `
          <div style="font-size:40px;">${item.emoji}</div>
          <div class="shop-name">${item.name}</div>
          <div class="shop-price">💰 ${item.price}</div>`;
        card.onclick = () => Game.buyItem(item);
        grid.appendChild(card);
      });
    } else {
      const cat = Game.shopTab || 'protein';
      const catData = FOOD_CATEGORIES[cat];
      const max = Math.min(catData.count, 20);
      for (let i = 1; i <= max; i++) {
        const img = Assets.getFood(cat, i);
        const card = document.createElement('div');
        card.className = 'shop-item';
        if (img) {
          const imgEl = document.createElement('img');
          imgEl.src = img.src;
          imgEl.alt = `${cat} ${i}`;
          card.appendChild(imgEl);
        } else {
          card.innerHTML = `<div style="font-size:40px;">${catData.emoji}</div>`;
        }
        card.innerHTML += `
          <div class="shop-name">${catData.name} #${i}</div>
          <div class="shop-price">💰 ${catData.price}</div>`;
        card.onclick = () => Game.buyFood(cat, i);
        grid.appendChild(card);
      }
    }
    container.appendChild(grid);
  },

  // Render arcade scene
  renderArcade(container, state) {
    container.innerHTML = '';
    container.className = 'room-scene room-arcade';

    const title = document.createElement('div');
    title.style.cssText = 'text-align:center;margin:8px 0;';
    title.innerHTML = '<span style="font-size:18px;font-weight:900;color:var(--text);">🎮 Salle de Jeux</span>';
    container.appendChild(title);

    const grid = document.createElement('div');
    grid.className = 'arcade-grid';

    const games = [
      { id:'log_jump', ico:'🌿', name:'Saute-Bûches', desc:'Saute par-dessus les bûches et collecte des pétales !' },
      { id:'hidden',   ico:'🔍', name:'Animaux Cachés', desc:'Trouve tous les animaux cachés dans la scène !' },
      { id:'catch',    ico:'⭐', name:'Attrape-Étoiles', desc:'Attrape le maximum d\'étoiles qui tombent !' },
      { id:'memory',   ico:'🃏', name:'Mémoire', desc:'Retrouve les paires d\'animaux !' },
    ];

    games.forEach(g => {
      const card = document.createElement('div');
      card.className = 'arcade-card';
      card.innerHTML = `<span class="arcade-ico">${g.ico}</span>
        <span class="arcade-name">${g.name}</span>
        <span class="arcade-desc">${g.desc}</span>`;
      card.onclick = () => Game.startArcadeGame(g.id);
      grid.appendChild(card);
    });
    container.appendChild(grid);

    // High scores
    const scores = document.createElement('div');
    scores.style.cssText = 'margin-top:16px;text-align:center;font-size:12px;color:var(--text-light);font-weight:600;';
    scores.innerHTML = `🏆 Meilleur score Bûches: ${state.highScores.logJump} | Cachés: ${state.highScores.hiddenAnimals}`;
    container.appendChild(scores);
  },

  // Render phone scene
  renderPhone(container, state) {
    container.innerHTML = '';
    container.className = 'room-scene room-phone';

    const phone = document.createElement('div');
    phone.className = 'phone-frame';

    const screen = document.createElement('div');
    screen.className = 'phone-screen';
    screen.innerHTML = `
      <div style="font-size:40px;margin-bottom:8px;">📱</div>
      <div style="font-size:16px;font-weight:800;color:var(--text);">Téléphone</div>
      <div style="font-size:12px;color:var(--text-light);margin-top:8px;">
        Appelle pour recevoir de nouveaux animaux !
      </div>
    `;
    phone.appendChild(screen);

    // Call button
    const callBtn = document.createElement('button');
    callBtn.className = 'btn btn-green btn-small';
    callBtn.style.cssText = 'width:100%;margin-top:12px;';
    callBtn.textContent = '📞 Appeler un propriétaire';
    callBtn.onclick = () => Game.makePhoneCall();
    phone.appendChild(callBtn);

    // Animal count
    const info = document.createElement('div');
    info.style.cssText = 'font-size:12px;color:var(--text-light);margin-top:12px;font-weight:600;';
    info.textContent = `${state.animals.length}/6 animaux à l'hôtel`;
    phone.appendChild(info);

    container.appendChild(phone);
  },

  // ===== HELPERS =====

  _renderAnimals(container, state, context) {
    if (state.animals.length === 0) return;

    const area = document.createElement('div');
    area.style.cssText = 'display:flex;flex-wrap:wrap;justify-content:center;gap:12px;margin-top:16px;padding:8px;z-index:5;position:relative;';

    state.animals.forEach((animal, idx) => {
      const aType = ANIMAL_TYPES[animal.type];
      if (!aType) return;

      const div = document.createElement('div');
      div.className = 'animal-in-room';
      div.style.cssText = 'position:relative;';

      const img = document.createElement('img');
      img.src = `assets/game/animals/${aType.img}.png`;
      img.className = 'animal-idle';
      img.style.animationDelay = `${idx * 0.4}s`;
      div.appendChild(img);

      // Face overlay
      const face = this._getAnimalFace(animal);
      const faceImg = document.createElement('img');
      faceImg.src = `assets/game/faces/${face}.png`;
      faceImg.className = 'animal-face';
      div.appendChild(faceImg);

      // Name tag
      const tag = document.createElement('div');
      tag.className = 'animal-name-tag';
      tag.textContent = `${aType.emoji} ${animal.name}`;
      div.appendChild(tag);

      // Need dots
      const dots = document.createElement('div');
      dots.className = 'animal-needs-dots';
      ['hunger','happiness','cleanliness','health'].forEach(need => {
        const dot = document.createElement('div');
        const val = animal[need] || 0.5;
        dot.className = 'need-dot ' + (val > 0.6 ? 'need-full' : val > 0.3 ? 'need-mid' : 'need-low');
        dots.appendChild(dot);
      });
      div.appendChild(dots);

      div.onclick = () => Game.selectAnimal(idx, context);
      area.appendChild(div);
    });

    container.appendChild(area);
  },

  _getAnimalFace(animal) {
    const avg = (animal.hunger + animal.happiness + animal.cleanliness + animal.health) / 4;
    if (animal.face && animal.face !== 'neutral') return animal.face;
    if (avg > 0.7) return 'happy';
    if (avg > 0.5) return 'neutral';
    if (avg > 0.3) return 'sad';
    return 'crying';
  },

  _addDeco(container, emoji, style) {
    const el = document.createElement('div');
    el.className = 'room-deco';
    el.style.cssText = style;
    el.textContent = emoji;
    container.appendChild(el);
  },
};
