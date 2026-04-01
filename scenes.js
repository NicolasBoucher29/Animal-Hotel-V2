// ============================================================
// SCENES.JS — Room scene rendering for Animal Hotel V2
// ============================================================

const Scenes = {

  // Render the lobby scene
  renderLobby(container, state) {
    container.innerHTML = '';
    container.className = 'room-scene room-lobby';
    container.style.cssText = 'overflow:hidden;padding:0;';

    // === FLOOR ===
    const floor = document.createElement('div');
    floor.style.cssText = `position:absolute;bottom:0;left:0;right:0;height:45%;
      background:linear-gradient(180deg,#d4a574 0%,#c4955a 100%);`;
    container.appendChild(floor);

    // Floor pattern (wood planks)
    for (let i = 0; i < 12; i++) {
      const plank = document.createElement('div');
      plank.style.cssText = `position:absolute;bottom:${i*3.7}%;left:0;right:0;height:1px;
        background:rgba(0,0,0,0.06);`;
      floor.appendChild(plank);
    }

    // === CARPET ===
    const carpet = document.createElement('div');
    carpet.style.cssText = `position:absolute;bottom:8%;left:15%;right:15%;height:22%;
      background:linear-gradient(135deg,#c0392b,#e74c3c,#c0392b);
      border-radius:8px;border:4px solid #a93226;
      box-shadow:0 2px 8px rgba(0,0,0,0.15);`;
    container.appendChild(carpet);
    // Carpet pattern
    const carpetInner = document.createElement('div');
    carpetInner.style.cssText = `position:absolute;top:12%;left:8%;right:8%;bottom:12%;
      border:2px solid rgba(255,200,100,0.4);border-radius:4px;`;
    carpet.appendChild(carpetInner);

    // === WALL ===
    const wall = document.createElement('div');
    wall.style.cssText = `position:absolute;top:0;left:0;right:0;height:55%;
      background:linear-gradient(180deg,#fdf2e9 0%,#fae5d3 60%,#e8c9a0 100%);`;
    container.appendChild(wall);

    // Wallpaper pattern (subtle stripes)
    for (let i = 0; i < 20; i++) {
      const stripe = document.createElement('div');
      stripe.style.cssText = `position:absolute;top:0;bottom:0;left:${i*5.3}%;width:1px;
        background:rgba(0,0,0,0.03);`;
      wall.appendChild(stripe);
    }

    // Wall trim / wainscoting
    const trim = document.createElement('div');
    trim.style.cssText = `position:absolute;top:53%;left:0;right:0;height:4%;
      background:linear-gradient(180deg,#d4a574,#b8860b);
      box-shadow:0 2px 4px rgba(0,0,0,0.1);z-index:2;`;
    container.appendChild(trim);

    // === RECEPTION DESK ===
    const desk = document.createElement('div');
    desk.style.cssText = `position:absolute;top:28%;left:50%;transform:translateX(-50%);
      width:min(300px,45%);height:28%;z-index:5;`;
    container.appendChild(desk);

    // Desk body
    const deskBody = document.createElement('div');
    deskBody.style.cssText = `position:absolute;bottom:0;left:0;right:0;height:65%;
      background:linear-gradient(180deg,#8b4513,#6d3410);
      border-radius:12px 12px 4px 4px;
      box-shadow:0 4px 12px rgba(0,0,0,0.2);`;
    desk.appendChild(deskBody);
    // Desk top surface
    const deskTop = document.createElement('div');
    deskTop.style.cssText = `position:absolute;top:0;left:-5%;right:-5%;height:15%;
      background:linear-gradient(180deg,#a0522d,#8b4513);
      border-radius:8px;box-shadow:0 3px 8px rgba(0,0,0,0.15);`;
    desk.appendChild(deskTop);
    // Desk panel detail
    const deskPanel = document.createElement('div');
    deskPanel.style.cssText = `position:absolute;bottom:10%;left:10%;right:10%;height:40%;
      border:2px solid rgba(255,255,255,0.1);border-radius:6px;`;
    deskBody.appendChild(deskPanel);

    // Bell on desk
    const bell = document.createElement('div');
    bell.style.cssText = `position:absolute;top:-5%;right:15%;font-size:clamp(22px,4vw,32px);
      cursor:pointer;z-index:6;filter:drop-shadow(1px 2px 1px rgba(0,0,0,0.2));`;
    bell.textContent = '🛎️';
    bell.onclick = () => Game.notify('🔔 Ding ! Bienvenue !');
    desk.appendChild(bell);

    // Sign on desk
    const sign = document.createElement('div');
    sign.style.cssText = `position:absolute;top:-8%;left:50%;transform:translateX(-50%);
      background:linear-gradient(135deg,#fff8e1,#ffecb3);
      padding:4px 14px;border-radius:10px;
      font-size:clamp(10px,1.8vw,14px);font-weight:900;color:#8b4513;
      box-shadow:0 2px 6px rgba(0,0,0,0.1);white-space:nowrap;z-index:6;
      border:2px solid rgba(139,69,19,0.2);`;
    sign.textContent = '🐾 Animal Hotel';
    desk.appendChild(sign);

    // === WALL DECORATIONS ===
    // Pictures
    const pics = [
      { left:'5%', top:'8%', emoji:'🖼️', size:'clamp(35px,5vw,50px)' },
      { left:'82%', top:'10%', emoji:'🖼️', size:'clamp(30px,4vw,45px)' },
    ];
    pics.forEach(p => {
      const el = document.createElement('div');
      el.style.cssText = `position:absolute;left:${p.left};top:${p.top};font-size:${p.size};
        z-index:3;filter:drop-shadow(1px 2px 1px rgba(0,0,0,0.1));`;
      el.textContent = p.emoji;
      container.appendChild(el);
    });

    // Wall lamps
    ['18%','78%'].forEach(left => {
      const lamp = document.createElement('div');
      lamp.style.cssText = `position:absolute;left:${left};top:15%;z-index:3;text-align:center;`;
      lamp.innerHTML = `<div style="font-size:clamp(18px,3vw,28px);">🕯️</div>`;
      container.appendChild(lamp);
    });

    // Clock
    const clock = document.createElement('div');
    clock.style.cssText = `position:absolute;left:50%;top:5%;transform:translateX(-50%);
      font-size:clamp(28px,4.5vw,42px);z-index:3;
      filter:drop-shadow(1px 2px 1px rgba(0,0,0,0.1));`;
    clock.textContent = '🕰️';
    container.appendChild(clock);

    // === PLANTS ===
    const plants = [
      { emoji:'🪴', left:'2%', bottom:'32%', size:'clamp(35px,5vw,55px)' },
      { emoji:'🌿', right:'3%', bottom:'34%', size:'clamp(30px,4.5vw,50px)' },
      { emoji:'🪴', left:'88%', bottom:'32%', size:'clamp(35px,5vw,55px)' },
    ];
    plants.forEach(p => {
      const el = document.createElement('div');
      const pos = p.left ? `left:${p.left}` : `right:${p.right}`;
      el.style.cssText = `position:absolute;${pos};bottom:${p.bottom};font-size:${p.size};z-index:4;
        filter:drop-shadow(1px 2px 1px rgba(0,0,0,0.1));`;
      el.textContent = p.emoji;
      container.appendChild(el);
    });

    // === SOFAS ===
    ['6%','75%'].forEach((left,i) => {
      const sofa = document.createElement('div');
      sofa.style.cssText = `position:absolute;left:${left};bottom:30%;
        width:clamp(60px,12vw,100px);height:clamp(35px,6vw,50px);
        background:linear-gradient(180deg,${i===0?'#e74c3c,#c0392b':'#3498db,#2980b9'});
        border-radius:12px 12px 6px 6px;z-index:4;
        box-shadow:0 3px 8px rgba(0,0,0,0.15);`;
      container.appendChild(sofa);
      // Sofa cushions
      const cushion = document.createElement('div');
      cushion.style.cssText = `position:absolute;top:15%;left:8%;right:8%;height:45%;
        background:rgba(255,255,255,0.15);border-radius:8px;`;
      sofa.appendChild(cushion);
      // Sofa legs
      ['8%','82%'].forEach(l => {
        const leg = document.createElement('div');
        leg.style.cssText = `position:absolute;bottom:-15%;left:${l};width:10%;height:15%;
          background:#654321;border-radius:0 0 2px 2px;`;
        sofa.appendChild(leg);
      });
    });

    // === WELCOME BANNER ===
    const banner = document.createElement('div');
    banner.style.cssText = `position:absolute;top:55%;left:50%;transform:translateX(-50%);
      z-index:10;text-align:center;
      background:rgba(255,255,255,0.85);backdrop-filter:blur(8px);
      padding:8px 24px;border-radius:20px;
      box-shadow:0 3px 12px rgba(0,0,0,0.08);`;
    banner.innerHTML = `
      <div style="font-size:clamp(14px,2.5vw,18px);font-weight:900;color:var(--text);">
        Bienvenue ${state.playerName} ! 🐾
      </div>
      <div style="font-size:clamp(10px,1.8vw,13px);color:var(--text-light);font-weight:600;">
        Jour ${state.day} — ${state.animals.length} animaux à l'hôtel
      </div>`;
    container.appendChild(banner);

    // === ANIMALS on the carpet / around the lobby ===
    if (state.animals.length > 0) {
      const positions = [
        { left:'35%', bottom:'12%' },
        { left:'55%', bottom:'14%' },
        { left:'22%', bottom:'10%' },
        { left:'68%', bottom:'11%' },
        { left:'45%', bottom:'8%' },
        { left:'30%', bottom:'16%' },
      ];
      state.animals.forEach((animal, idx) => {
        const aType = ANIMAL_TYPES[animal.type];
        if (!aType) return;
        const pos = positions[idx % positions.length];

        const div = document.createElement('div');
        div.style.cssText = `position:absolute;left:${pos.left};bottom:${pos.bottom};
          z-index:${15+idx};cursor:pointer;text-align:center;
          transition:transform 0.2s;`;

        const img = document.createElement('img');
        img.src = `assets/game/animals/${aType.img}.png`;
        img.className = 'animal-idle';
        img.style.cssText = `width:clamp(55px,10vw,95px);height:auto;
          filter:drop-shadow(2px 3px 2px rgba(0,0,0,0.2));`;
        img.style.animationDelay = `${idx * 0.5}s`;
        div.appendChild(img);

        // Face
        const face = this._getAnimalFace(animal);
        const faceImg = document.createElement('img');
        faceImg.src = `assets/game/faces/${face}.png`;
        faceImg.style.cssText = `position:absolute;top:2%;left:50%;transform:translateX(-50%);
          width:clamp(22px,4vw,35px);pointer-events:none;`;
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

        div.onclick = () => Game.selectAnimal(idx, 'lobby');
        div.onmouseenter = () => div.style.transform = 'scale(1.1)';
        div.onmouseleave = () => div.style.transform = '';
        container.appendChild(div);
      });
    } else {
      // Empty lobby message
      const empty = document.createElement('div');
      empty.style.cssText = `position:absolute;bottom:18%;left:50%;transform:translateX(-50%);
        z-index:10;text-align:center;font-size:14px;color:var(--text-light);font-weight:600;
        background:rgba(255,255,255,0.7);padding:10px 20px;border-radius:16px;`;
      empty.textContent = '📱 Appelle un propriétaire pour recevoir un animal !';
      container.appendChild(empty);
    }

    // Tip
    if (!state.tutorialDone) {
      const tip = document.createElement('div');
      tip.style.cssText = `position:absolute;bottom:3%;left:50%;transform:translateX(-50%);
        font-size:12px;color:var(--text-light);font-weight:600;text-align:center;
        background:rgba(255,255,255,0.8);padding:6px 16px;border-radius:20px;z-index:20;`;
      tip.textContent = '👆 Tape sur un animal pour t\'en occuper !';
      container.appendChild(tip);
    }

    // === DOOR at top ===
    const door = document.createElement('div');
    door.style.cssText = `position:absolute;top:20%;left:50%;transform:translateX(-50%);
      width:clamp(40px,6vw,60px);height:clamp(55px,9vw,80px);
      background:linear-gradient(180deg,#8b4513,#654321);
      border-radius:20px 20px 0 0;z-index:2;
      box-shadow:0 2px 8px rgba(0,0,0,0.2);`;
    container.appendChild(door);
    // Door handle
    const handle = document.createElement('div');
    handle.style.cssText = `position:absolute;top:55%;right:15%;width:8px;height:8px;
      background:#ffd700;border-radius:50%;box-shadow:0 1px 3px rgba(0,0,0,0.3);`;
    door.appendChild(handle);
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
