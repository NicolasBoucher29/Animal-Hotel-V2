// ============================================================
// SCENES.JS — Room scene rendering for Animal Hotel V2
// ============================================================

const Scenes = {

  _viewingRoom: null, // which room interior is open (null = show hallway)

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

  // Render rooms scene — hallway view with 6 doors
  renderRooms(container, state) {
    // If a specific room is selected, render the interior instead
    if (this._viewingRoom !== undefined && this._viewingRoom !== null) {
      this.renderRoomInterior(container, state, this._viewingRoom);
      return;
    }

    container.innerHTML = '';
    container.className = 'room-scene room-rooms';
    container.style.cssText = 'overflow:hidden;padding:0;position:relative;';

    // === HALLWAY BACKGROUND ===
    // Ceiling
    const ceiling = document.createElement('div');
    ceiling.style.cssText = `position:absolute;top:0;left:0;right:0;height:22%;
      background:linear-gradient(180deg,#e8d5c4 0%,#d4b896 100%);`;
    container.appendChild(ceiling);

    // Ceiling light strip
    const ceilLight = document.createElement('div');
    ceilLight.style.cssText = `position:absolute;top:8%;left:20%;right:20%;height:6px;
      background:rgba(255,255,200,0.6);border-radius:4px;
      box-shadow:0 0 20px 8px rgba(255,255,180,0.4);`;
    container.appendChild(ceilLight);

    // Floor
    const hallFloor = document.createElement('div');
    hallFloor.style.cssText = `position:absolute;bottom:0;left:0;right:0;height:35%;
      background:linear-gradient(180deg,#c8a070 0%,#a07840 100%);`;
    container.appendChild(hallFloor);
    // Floor planks
    for (let i = 0; i < 8; i++) {
      const plank = document.createElement('div');
      plank.style.cssText = `position:absolute;top:${i*12.5}%;left:0;right:0;height:1px;
        background:rgba(0,0,0,0.08);`;
      hallFloor.appendChild(plank);
    }
    // Floor highlight
    const floorHL = document.createElement('div');
    floorHL.style.cssText = `position:absolute;top:0;left:30%;right:30%;height:3px;
      background:rgba(255,255,255,0.15);border-radius:0 0 4px 4px;`;
    hallFloor.appendChild(floorHL);

    // Wall (sides)
    const wallLeft = document.createElement('div');
    wallLeft.style.cssText = `position:absolute;top:22%;left:0;width:8%;bottom:35%;
      background:linear-gradient(90deg,#c4a882,#d4b896);`;
    container.appendChild(wallLeft);
    const wallRight = document.createElement('div');
    wallRight.style.cssText = `position:absolute;top:22%;right:0;width:8%;bottom:35%;
      background:linear-gradient(270deg,#c4a882,#d4b896);`;
    container.appendChild(wallRight);

    // Back wall (end of corridor)
    const backWall = document.createElement('div');
    backWall.style.cssText = `position:absolute;top:22%;left:8%;right:8%;bottom:35%;
      background:linear-gradient(180deg,#f2e4d4 0%,#e8d5c0 100%);`;
    container.appendChild(backWall);
    // Wallpaper stripes on back wall
    for (let i = 0; i < 12; i++) {
      const s = document.createElement('div');
      s.style.cssText = `position:absolute;top:0;bottom:0;left:${i*9}%;width:1px;
        background:rgba(0,0,0,0.04);`;
      backWall.appendChild(s);
    }

    // Wall trim (floor/wall divider)
    const trimTop = document.createElement('div');
    trimTop.style.cssText = `position:absolute;top:22%;left:0;right:0;height:3px;
      background:linear-gradient(90deg,#b8860b,#d4a017,#b8860b);z-index:2;`;
    container.appendChild(trimTop);
    const trimBot = document.createElement('div');
    trimBot.style.cssText = `position:absolute;bottom:35%;left:0;right:0;height:3px;
      background:linear-gradient(90deg,#b8860b,#d4a017,#b8860b);z-index:2;`;
    container.appendChild(trimBot);

    // Hallway carpet runner
    const runner = document.createElement('div');
    runner.style.cssText = `position:absolute;bottom:35%;left:30%;right:30%;height:6%;
      background:linear-gradient(90deg,#8b2252,#c0392b,#8b2252);
      border-radius:0 0 4px 4px;z-index:2;`;
    container.appendChild(runner);

    // Ceiling lamp
    const lamp = document.createElement('div');
    lamp.style.cssText = `position:absolute;top:2%;left:50%;transform:translateX(-50%);
      font-size:clamp(22px,3.5vw,32px);z-index:3;`;
    lamp.textContent = '💡';
    container.appendChild(lamp);

    // === TITLE ===
    const titleBar = document.createElement('div');
    titleBar.style.cssText = `position:absolute;top:0;left:0;right:0;z-index:20;
      display:flex;align-items:center;justify-content:center;padding:6px;
      background:rgba(255,255,255,0.75);backdrop-filter:blur(6px);`;
    titleBar.innerHTML = `<span style="font-size:16px;font-weight:900;color:var(--text);">🛏️ Couloir des Chambres</span>`;
    container.appendChild(titleBar);

    // === DOORS (3 left + 3 right) ===
    const ROOM_DOOR_COLORS = [
      '#e74c3c','#3498db','#27ae60',
      '#f39c12','#9b59b6','#e91e63'
    ];
    const doorPositions = [
      // Left side (rooms 1, 3, 5)
      { side:'left', left:'10%',  top:'24%' },
      { side:'left', left:'10%',  top:'40%' },
      { side:'left', left:'10%',  top:'56%' },
      // Right side (rooms 2, 4, 6)
      { side:'right', right:'10%', top:'24%' },
      { side:'right', right:'10%', top:'40%' },
      { side:'right', right:'10%', top:'56%' },
    ];

    for (let i = 0; i < 6; i++) {
      const pos = doorPositions[i];
      const roomState = state.rooms ? (state.rooms[i] || {}) : {};
      const animal = state.animals.find(a => a.room === i);
      const doorColor = ROOM_DOOR_COLORS[i];

      const doorWrap = document.createElement('div');
      const posStr = pos.side === 'left'
        ? `left:${pos.left};`
        : `right:${pos.right};`;
      doorWrap.style.cssText = `position:absolute;${posStr}top:${pos.top};
        width:clamp(72px,14vw,110px);cursor:pointer;z-index:10;
        transition:transform 0.18s;`;

      // Door frame
      const doorFrame = document.createElement('div');
      doorFrame.style.cssText = `width:100%;
        height:clamp(72px,13vw,100px);
        background:linear-gradient(180deg,#8b6914,#6d4c10);
        border-radius:8px 8px 0 0;
        box-shadow:3px 3px 10px rgba(0,0,0,0.25);
        padding:4px;box-sizing:border-box;`;

      // Door panel
      const doorPanel = document.createElement('div');
      doorPanel.style.cssText = `width:100%;height:100%;
        background:linear-gradient(160deg,${doorColor},${doorColor}cc);
        border-radius:6px 6px 0 0;position:relative;
        display:flex;flex-direction:column;align-items:center;justify-content:space-between;
        padding:6px 4px 4px;box-sizing:border-box;`;

      // Number plate
      const numPlate = document.createElement('div');
      numPlate.style.cssText = `background:rgba(255,255,255,0.9);
        border-radius:6px;padding:2px 8px;
        font-size:clamp(11px,2vw,14px);font-weight:900;color:#333;
        box-shadow:0 1px 3px rgba(0,0,0,0.15);`;
      numPlate.textContent = `N° ${i + 1}`;
      doorPanel.appendChild(numPlate);

      // Animal peek or free sign
      if (animal) {
        const aType = ANIMAL_TYPES[animal.type];
        if (aType) {
          const peek = document.createElement('img');
          peek.src = `assets/game/animals/${aType.img}.png`;
          peek.style.cssText = `width:clamp(28px,5.5vw,45px);height:auto;
            filter:drop-shadow(1px 2px 2px rgba(0,0,0,0.2));`;
          doorPanel.appendChild(peek);
          const nameLbl = document.createElement('div');
          nameLbl.style.cssText = `font-size:clamp(8px,1.5vw,11px);font-weight:800;
            color:rgba(255,255,255,0.95);text-align:center;line-height:1.1;`;
          nameLbl.textContent = animal.name;
          doorPanel.appendChild(nameLbl);
        }
      } else {
        const free = document.createElement('div');
        free.style.cssText = `font-size:clamp(9px,1.6vw,12px);color:rgba(255,255,255,0.8);
          font-weight:700;text-align:center;`;
        free.textContent = 'Libre';
        doorPanel.appendChild(free);
        const lock = document.createElement('div');
        lock.style.cssText = `font-size:clamp(14px,2.5vw,22px);`;
        lock.textContent = '🔑';
        doorPanel.appendChild(lock);
      }

      // Door handle
      const handle = document.createElement('div');
      handle.style.cssText = `position:absolute;
        ${pos.side === 'left' ? 'right:8%' : 'left:8%'};
        top:55%;width:clamp(6px,1vw,9px);height:clamp(6px,1vw,9px);
        background:radial-gradient(circle,#ffd700,#b8860b);
        border-radius:50%;box-shadow:0 1px 3px rgba(0,0,0,0.3);`;
      doorPanel.appendChild(handle);

      // Door step
      const step = document.createElement('div');
      step.style.cssText = `width:110%;margin-left:-5%;height:6px;
        background:linear-gradient(180deg,#a07838,#7a5a28);
        border-radius:0 0 4px 4px;`;

      doorFrame.appendChild(doorPanel);
      doorWrap.appendChild(doorFrame);
      doorWrap.appendChild(step);

      doorWrap.onclick = () => {
        Scenes._viewingRoom = i;
        Game.renderCurrentRoom();
      };
      doorWrap.onmouseenter = () => doorWrap.style.transform = 'scale(1.06) translateY(-3px)';
      doorWrap.onmouseleave = () => doorWrap.style.transform = '';
      container.appendChild(doorWrap);
    }
  },

  // Render room interior when a door is clicked
  renderRoomInterior(container, state, roomIdx) {
    container.innerHTML = '';
    container.className = 'room-scene room-interior';
    container.style.cssText = 'overflow:hidden;padding:0;position:relative;';

    const animal = state.animals.find(a => a.room === roomIdx);
    const aType = animal ? ANIMAL_TYPES[animal.type] : null;

    // Room wall color palette (one per room)
    const wallPalettes = [
      { wall:'#fce4ec', wall2:'#f8bbd0', floor:'#d7ccc8', floor2:'#bcaaa4', accent:'#e91e63' },
      { wall:'#e3f2fd', wall2:'#bbdefb', floor:'#cfd8dc', floor2:'#b0bec5', accent:'#2196f3' },
      { wall:'#e8f5e9', wall2:'#c8e6c9', floor:'#d7ccc8', floor2:'#bcaaa4', accent:'#4caf50' },
      { wall:'#fff8e1', wall2:'#ffe082', floor:'#ffe0b2', floor2:'#ffcc80', accent:'#ff9800' },
      { wall:'#f3e5f5', wall2:'#e1bee7', floor:'#d7ccc8', floor2:'#bcaaa4', accent:'#9c27b0' },
      { wall:'#fce4ec', wall2:'#f48fb1', floor:'#efebe9', floor2:'#d7ccc8', accent:'#e91e63' },
    ];
    const pal = wallPalettes[roomIdx % wallPalettes.length];

    // === BACK WALL ===
    const wall = document.createElement('div');
    wall.style.cssText = `position:absolute;top:0;left:0;right:0;height:62%;
      background:linear-gradient(180deg,${pal.wall} 0%,${pal.wall2} 100%);`;
    container.appendChild(wall);

    // Wallpaper pattern (small polka dots)
    for (let r = 0; r < 5; r++) {
      for (let c = 0; c < 10; c++) {
        const dot = document.createElement('div');
        dot.style.cssText = `position:absolute;
          top:${12 + r * 18}%;left:${5 + c * 10}%;
          width:5px;height:5px;border-radius:50%;
          background:rgba(255,255,255,0.5);`;
        wall.appendChild(dot);
      }
    }

    // Wall trim
    const wallTrim = document.createElement('div');
    wallTrim.style.cssText = `position:absolute;top:62%;left:0;right:0;height:4px;
      background:linear-gradient(90deg,${pal.accent}88,${pal.accent},${pal.accent}88);z-index:3;`;
    container.appendChild(wallTrim);

    // === FLOOR ===
    const floor = document.createElement('div');
    floor.style.cssText = `position:absolute;bottom:0;left:0;right:0;height:38%;
      background:linear-gradient(180deg,${pal.floor} 0%,${pal.floor2} 100%);`;
    container.appendChild(floor);
    // Floor planks
    for (let i = 0; i < 6; i++) {
      const plank = document.createElement('div');
      plank.style.cssText = `position:absolute;top:${i * 17}%;left:0;right:0;height:1px;
        background:rgba(0,0,0,0.07);`;
      floor.appendChild(plank);
    }

    // === WINDOW (right wall) ===
    const win = document.createElement('div');
    win.style.cssText = `position:absolute;top:8%;right:6%;
      width:clamp(70px,14vw,110px);height:clamp(80px,16vw,120px);
      background:linear-gradient(160deg,#87ceeb,#b0e0ff,#87ceeb);
      border:4px solid #fff;border-radius:4px;
      box-shadow:2px 2px 8px rgba(0,0,0,0.15);z-index:3;overflow:hidden;`;
    container.appendChild(win);
    // Window cross
    const winH = document.createElement('div');
    winH.style.cssText = `position:absolute;top:50%;left:0;right:0;height:3px;
      background:rgba(255,255,255,0.8);transform:translateY(-50%);`;
    win.appendChild(winH);
    const winV = document.createElement('div');
    winV.style.cssText = `position:absolute;left:50%;top:0;bottom:0;width:3px;
      background:rgba(255,255,255,0.8);transform:translateX(-50%);`;
    win.appendChild(winV);
    // Sun
    const sun = document.createElement('div');
    sun.style.cssText = `position:absolute;top:10%;right:15%;font-size:clamp(16px,3vw,24px);`;
    sun.textContent = '☀️';
    win.appendChild(sun);
    // Cloud
    const cloud = document.createElement('div');
    cloud.style.cssText = `position:absolute;top:40%;left:5%;font-size:clamp(12px,2vw,18px);opacity:0.8;`;
    cloud.textContent = '⛅';
    win.appendChild(cloud);
    // Window curtains
    const curtainL = document.createElement('div');
    curtainL.style.cssText = `position:absolute;top:-5%;left:-8%;width:30%;height:110%;
      background:linear-gradient(180deg,${pal.accent}cc,${pal.accent}88);
      border-radius:0 0 50% 0;transform:rotate(-2deg);z-index:4;`;
    win.appendChild(curtainL);
    const curtainR = document.createElement('div');
    curtainR.style.cssText = `position:absolute;top:-5%;right:-8%;width:30%;height:110%;
      background:linear-gradient(180deg,${pal.accent}cc,${pal.accent}88);
      border-radius:0 0 0 50%;transform:rotate(2deg);z-index:4;`;
    win.appendChild(curtainR);

    // === BED (left side, against back wall) ===
    const bedArea = document.createElement('div');
    bedArea.style.cssText = `position:absolute;left:4%;bottom:32%;
      width:clamp(100px,22vw,175px);z-index:5;`;
    container.appendChild(bedArea);

    // Bed frame
    const bedFrame = document.createElement('div');
    bedFrame.style.cssText = `width:100%;
      height:clamp(55px,11vw,85px);
      background:linear-gradient(180deg,#8b4513,#6d3410);
      border-radius:10px 10px 4px 4px;
      box-shadow:0 4px 12px rgba(0,0,0,0.2);
      position:relative;`;
    bedArea.appendChild(bedFrame);
    // Mattress
    const mattress = document.createElement('div');
    mattress.style.cssText = `position:absolute;top:8%;left:5%;right:5%;height:55%;
      background:linear-gradient(180deg,#fff8f0,#fff0e0);
      border-radius:6px;`;
    bedFrame.appendChild(mattress);
    // Pillow
    const pillow = document.createElement('div');
    pillow.style.cssText = `position:absolute;top:8%;left:8%;width:35%;height:55%;
      background:linear-gradient(160deg,${pal.accent}44,${pal.accent}22);
      border-radius:5px;border:1px solid rgba(255,255,255,0.6);`;
    bedFrame.appendChild(pillow);
    // Blanket
    const blanket = document.createElement('div');
    blanket.style.cssText = `position:absolute;top:8%;right:8%;width:45%;height:55%;
      background:linear-gradient(160deg,${pal.accent}99,${pal.accent}66);
      border-radius:5px;`;
    bedFrame.appendChild(blanket);
    // Headboard
    const headboard = document.createElement('div');
    headboard.style.cssText = `position:absolute;top:-22%;left:0;right:0;height:28%;
      background:linear-gradient(180deg,#a0521a,#8b4513);
      border-radius:10px 10px 0 0;
      box-shadow:0 -2px 6px rgba(0,0,0,0.1);`;
    bedFrame.appendChild(headboard);
    // Bed legs
    ['8%','82%'].forEach(l => {
      const leg = document.createElement('div');
      leg.style.cssText = `position:absolute;bottom:-12%;left:${l};width:8%;height:14%;
        background:#5a3008;border-radius:0 0 3px 3px;`;
      bedFrame.appendChild(leg);
    });
    // Bed label
    const bedLabel = document.createElement('div');
    bedLabel.style.cssText = `text-align:center;margin-top:4px;
      font-size:clamp(9px,1.5vw,12px);font-weight:700;color:var(--text-light);`;
    bedLabel.textContent = '🛏️ Lit';
    bedArea.appendChild(bedLabel);

    // === BOWLS (right side on floor) ===
    // Water bowl
    const waterWrap = document.createElement('div');
    waterWrap.style.cssText = `position:absolute;right:6%;bottom:34%;
      text-align:center;z-index:5;`;
    const waterBowl = document.createElement('div');
    waterBowl.style.cssText = `width:clamp(44px,9vw,72px);height:clamp(28px,5.5vw,46px);
      background:linear-gradient(180deg,#e3f2fd,#90caf9);
      border-radius:50% 50% 50% 50% / 30% 30% 70% 70%;
      border:3px solid #64b5f6;
      box-shadow:0 3px 8px rgba(0,0,0,0.12);
      position:relative;overflow:hidden;margin:0 auto;`;
    // Water ripple effect
    const waterRipple = document.createElement('div');
    waterRipple.style.cssText = `position:absolute;top:30%;left:20%;right:20%;
      height:4px;background:rgba(255,255,255,0.5);border-radius:4px;`;
    waterBowl.appendChild(waterRipple);
    const waterLabel = document.createElement('div');
    waterLabel.style.cssText = `font-size:clamp(8px,1.4vw,11px);font-weight:700;
      color:var(--text-light);margin-top:3px;`;
    waterLabel.textContent = '💧 Eau';
    waterWrap.appendChild(waterBowl);
    waterWrap.appendChild(waterLabel);
    container.appendChild(waterWrap);

    // Food bowl
    const foodWrap = document.createElement('div');
    foodWrap.style.cssText = `position:absolute;right:20%;bottom:34%;
      text-align:center;z-index:5;`;
    const foodBowl = document.createElement('div');
    foodBowl.style.cssText = `width:clamp(44px,9vw,72px);height:clamp(28px,5.5vw,46px);
      background:linear-gradient(180deg,#fff8e1,#ffe082);
      border-radius:50% 50% 50% 50% / 30% 30% 70% 70%;
      border:3px solid #ffd54f;
      box-shadow:0 3px 8px rgba(0,0,0,0.12);
      position:relative;overflow:hidden;margin:0 auto;`;
    // Food content
    const foodContent = document.createElement('div');
    foodContent.style.cssText = `position:absolute;top:5%;left:10%;right:10%;bottom:20%;
      background:linear-gradient(180deg,#8d6e63,#6d4c41);
      border-radius:40% 40% 0 0;`;
    foodBowl.appendChild(foodContent);
    const foodLabel = document.createElement('div');
    foodLabel.style.cssText = `font-size:clamp(8px,1.4vw,11px);font-weight:700;
      color:var(--text-light);margin-top:3px;`;
    foodLabel.textContent = '🍖 Nourriture';
    foodWrap.appendChild(foodBowl);
    foodWrap.appendChild(foodLabel);
    container.appendChild(foodWrap);

    // === WALL DECORATIONS ===
    // Picture frame
    const pic = document.createElement('div');
    pic.style.cssText = `position:absolute;top:10%;left:30%;
      width:clamp(45px,9vw,70px);height:clamp(40px,8vw,60px);
      background:#fff;border:4px solid ${pal.accent};
      border-radius:4px;z-index:3;
      box-shadow:2px 2px 6px rgba(0,0,0,0.12);
      display:flex;align-items:center;justify-content:center;
      font-size:clamp(20px,4vw,34px);`;
    pic.textContent = aType ? aType.emoji : '🐾';
    container.appendChild(pic);

    // Star decoration
    const starDeco = document.createElement('div');
    starDeco.style.cssText = `position:absolute;top:6%;left:6%;
      font-size:clamp(16px,3vw,24px);z-index:3;opacity:0.6;`;
    starDeco.textContent = '⭐';
    container.appendChild(starDeco);

    // Plant in corner
    const plant = document.createElement('div');
    plant.style.cssText = `position:absolute;left:2%;bottom:32%;
      font-size:clamp(28px,5.5vw,45px);z-index:3;
      filter:drop-shadow(1px 2px 2px rgba(0,0,0,0.15));`;
    plant.textContent = '🪴';
    container.appendChild(plant);

    // === ANIMAL ===
    if (animal && aType) {
      const animalDiv = document.createElement('div');
      animalDiv.style.cssText = `position:absolute;left:50%;bottom:32%;
        transform:translateX(-50%);z-index:10;text-align:center;cursor:pointer;
        transition:transform 0.2s;`;

      const animalImg = document.createElement('img');
      animalImg.src = `assets/game/animals/${aType.img}.png`;
      animalImg.className = 'animal-idle';
      animalImg.style.cssText = `width:clamp(70px,14vw,110px);height:auto;
        filter:drop-shadow(2px 4px 3px rgba(0,0,0,0.2));`;
      animalDiv.appendChild(animalImg);

      // Face
      const face = this._getAnimalFace(animal);
      const faceImg = document.createElement('img');
      faceImg.src = `assets/game/faces/${face}.png`;
      faceImg.style.cssText = `position:absolute;top:4%;left:50%;transform:translateX(-50%);
        width:clamp(24px,4.5vw,38px);pointer-events:none;`;
      animalDiv.appendChild(faceImg);

      // Name tag
      const nameTag = document.createElement('div');
      nameTag.className = 'animal-name-tag';
      nameTag.textContent = `${aType.emoji} ${animal.name}`;
      animalDiv.appendChild(nameTag);

      // Need dots
      const dots = document.createElement('div');
      dots.className = 'animal-needs-dots';
      ['hunger','happiness','cleanliness','health'].forEach(need => {
        const dot = document.createElement('div');
        const val = animal[need] || 0.5;
        dot.className = 'need-dot ' + (val > 0.6 ? 'need-full' : val > 0.3 ? 'need-mid' : 'need-low');
        dots.appendChild(dot);
      });
      animalDiv.appendChild(dots);

      animalDiv.onclick = () => {
        const idx = state.animals.indexOf(animal);
        Game.selectAnimal(idx, 'rooms');
      };
      animalDiv.onmouseenter = () => animalDiv.style.transform = 'translateX(-50%) scale(1.08)';
      animalDiv.onmouseleave = () => animalDiv.style.transform = 'translateX(-50%)';
      container.appendChild(animalDiv);
    } else {
      // Empty room message
      const emptyMsg = document.createElement('div');
      emptyMsg.style.cssText = `position:absolute;left:50%;bottom:42%;transform:translateX(-50%);
        z-index:10;text-align:center;
        background:rgba(255,255,255,0.8);padding:10px 20px;
        border-radius:16px;font-size:13px;color:var(--text-light);font-weight:700;`;
      emptyMsg.textContent = '🔑 Chambre libre';
      container.appendChild(emptyMsg);
    }

    // === ROOM NUMBER BADGE ===
    const badge = document.createElement('div');
    badge.style.cssText = `position:absolute;top:6%;left:50%;transform:translateX(-50%);
      background:${pal.accent};color:#fff;
      padding:5px 18px;border-radius:20px;
      font-size:clamp(13px,2.2vw,17px);font-weight:900;z-index:20;
      box-shadow:0 2px 8px rgba(0,0,0,0.15);`;
    badge.textContent = `Chambre N° ${roomIdx + 1}`;
    container.appendChild(badge);

    // === BACK BUTTON ===
    const backBtn = document.createElement('button');
    backBtn.style.cssText = `position:absolute;top:3%;left:3%;z-index:30;
      background:rgba(255,255,255,0.9);border:none;border-radius:12px;
      padding:7px 14px;cursor:pointer;font-size:clamp(12px,2vw,15px);
      font-weight:800;color:var(--text);box-shadow:0 2px 8px rgba(0,0,0,0.12);
      font-family:var(--font);`;
    backBtn.innerHTML = '← Couloir';
    backBtn.onclick = () => {
      Scenes._viewingRoom = null;
      Game.renderCurrentRoom();
    };
    container.appendChild(backBtn);
  },

  // ======================================================================
  // KITCHEN — Real kitchen scene with wall, counter, fridge, stove, shelf
  // ======================================================================
  renderKitchen(container, state) {
    container.innerHTML = '';
    container.className = 'room-scene room-kitchen';
    container.style.cssText = 'overflow:hidden;padding:0;position:relative;';

    // === WALL ===
    const wall = document.createElement('div');
    wall.style.cssText = `position:absolute;top:0;left:0;right:0;height:55%;
      background:linear-gradient(180deg,#fff8e1 0%,#ffecb3 100%);`;
    container.appendChild(wall);
    // Tile pattern (kitchen tiles)
    for (let r = 0; r < 6; r++) {
      for (let c = 0; c < 12; c++) {
        const tile = document.createElement('div');
        tile.style.cssText = `position:absolute;
          top:${r * 16.6}%;left:${c * 8.33}%;width:8.33%;height:16.6%;
          border:1px solid rgba(255,255,255,0.6);box-sizing:border-box;
          background:${(r+c)%2===0?'rgba(255,255,255,0.15)':'transparent'};`;
        wall.appendChild(tile);
      }
    }

    // === FLOOR ===
    const floor = document.createElement('div');
    floor.style.cssText = `position:absolute;bottom:0;left:0;right:0;height:45%;
      background:linear-gradient(180deg,#efebe9 0%,#d7ccc8 100%);`;
    container.appendChild(floor);
    // Checkered floor tiles
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 8; c++) {
        const ft = document.createElement('div');
        ft.style.cssText = `position:absolute;
          top:${r * 25}%;left:${c * 12.5}%;width:12.5%;height:25%;
          background:${(r+c)%2===0?'rgba(255,255,255,0.3)':'transparent'};
          box-sizing:border-box;`;
        floor.appendChild(ft);
      }
    }

    // === COUNTER (along back wall) ===
    const counter = document.createElement('div');
    counter.style.cssText = `position:absolute;top:40%;left:0;right:0;height:15%;
      background:linear-gradient(180deg,#8d6e63,#6d4c41);z-index:3;
      box-shadow:0 4px 12px rgba(0,0,0,0.15);`;
    container.appendChild(counter);
    // Counter top surface
    const counterTop = document.createElement('div');
    counterTop.style.cssText = `position:absolute;top:-5px;left:0;right:0;height:8px;
      background:linear-gradient(180deg,#a1887f,#8d6e63);border-radius:2px;`;
    counter.appendChild(counterTop);
    // Cabinet doors
    for (let i = 0; i < 5; i++) {
      const cab = document.createElement('div');
      cab.style.cssText = `position:absolute;top:20%;left:${3+i*19.5}%;width:17%;height:65%;
        border:2px solid rgba(255,255,255,0.15);border-radius:4px;box-sizing:border-box;`;
      counter.appendChild(cab);
      const knob = document.createElement('div');
      knob.style.cssText = `position:absolute;top:45%;right:10%;width:6px;height:6px;
        background:#ffd54f;border-radius:50%;`;
      cab.appendChild(knob);
    }

    // === FRIDGE (left side, tall) ===
    const fridgeWrap = document.createElement('div');
    fridgeWrap.style.cssText = `position:absolute;left:3%;top:5%;z-index:5;cursor:pointer;
      transition:transform 0.15s;`;
    fridgeWrap.onmouseenter = () => fridgeWrap.style.transform = 'scale(1.04)';
    fridgeWrap.onmouseleave = () => fridgeWrap.style.transform = '';
    const fridgeBody = document.createElement('div');
    fridgeBody.style.cssText = `width:clamp(55px,11vw,85px);
      height:clamp(110px,22vw,170px);
      background:linear-gradient(180deg,#eceff1,#cfd8dc);
      border-radius:8px;box-shadow:3px 4px 12px rgba(0,0,0,0.2);
      position:relative;`;
    // Fridge top door
    const fridgeTop = document.createElement('div');
    fridgeTop.style.cssText = `position:absolute;top:3%;left:5%;right:5%;height:35%;
      border:2px solid rgba(0,0,0,0.08);border-radius:4px;`;
    const fridgeHandleT = document.createElement('div');
    fridgeHandleT.style.cssText = `position:absolute;top:30%;right:8%;width:4px;height:30%;
      background:#b0bec5;border-radius:3px;`;
    fridgeTop.appendChild(fridgeHandleT);
    fridgeBody.appendChild(fridgeTop);
    // Fridge bottom door
    const fridgeBot = document.createElement('div');
    fridgeBot.style.cssText = `position:absolute;top:42%;left:5%;right:5%;height:55%;
      border:2px solid rgba(0,0,0,0.08);border-radius:4px;`;
    const fridgeHandleB = document.createElement('div');
    fridgeHandleB.style.cssText = `position:absolute;top:20%;right:8%;width:4px;height:25%;
      background:#b0bec5;border-radius:3px;`;
    fridgeBot.appendChild(fridgeHandleB);
    fridgeBody.appendChild(fridgeBot);
    fridgeWrap.appendChild(fridgeBody);
    // Fridge label
    const totalFood = Object.values(state.fridge).reduce((s,a) => s + a.length, 0);
    const fridgeLbl = document.createElement('div');
    fridgeLbl.style.cssText = `text-align:center;margin-top:4px;
      font-size:clamp(9px,1.5vw,12px);font-weight:800;color:var(--text);`;
    fridgeLbl.textContent = `🧊 Frigo (${totalFood})`;
    fridgeWrap.appendChild(fridgeLbl);
    fridgeWrap.onclick = () => Game.openFridge();
    container.appendChild(fridgeWrap);

    // === STOVE (center, on counter) ===
    const stoveWrap = document.createElement('div');
    stoveWrap.style.cssText = `position:absolute;left:50%;top:26%;transform:translateX(-50%);
      z-index:6;cursor:pointer;transition:transform 0.15s;text-align:center;`;
    stoveWrap.onmouseenter = () => stoveWrap.style.transform = 'translateX(-50%) scale(1.06)';
    stoveWrap.onmouseleave = () => stoveWrap.style.transform = 'translateX(-50%)';
    const stoveBody = document.createElement('div');
    stoveBody.style.cssText = `width:clamp(80px,16vw,120px);height:clamp(50px,10vw,70px);
      background:linear-gradient(180deg,#37474f,#263238);
      border-radius:8px;box-shadow:2px 3px 8px rgba(0,0,0,0.2);
      position:relative;display:flex;align-items:center;justify-content:center;gap:8px;`;
    // Burners
    ['30%','70%'].forEach(left => {
      const burner = document.createElement('div');
      burner.style.cssText = `width:clamp(18px,3.5vw,28px);height:clamp(18px,3.5vw,28px);
        border-radius:50%;background:radial-gradient(circle,#ef5350,#c62828);
        box-shadow:0 0 8px rgba(244,67,54,0.4);`;
      stoveBody.appendChild(burner);
    });
    stoveWrap.appendChild(stoveBody);
    // Steam
    const steam = document.createElement('div');
    steam.style.cssText = `position:absolute;top:-12px;left:50%;transform:translateX(-50%);
      font-size:clamp(14px,2.5vw,20px);opacity:0.5;`;
    steam.textContent = '💨';
    stoveWrap.appendChild(steam);
    const stoveLbl = document.createElement('div');
    stoveLbl.style.cssText = `margin-top:3px;font-size:clamp(9px,1.5vw,12px);
      font-weight:800;color:var(--text);`;
    stoveLbl.textContent = '🔥 Cuisiner';
    stoveWrap.appendChild(stoveLbl);
    stoveWrap.onclick = () => Game.startCooking();
    container.appendChild(stoveWrap);

    // === SHELF (above counter, right side) ===
    const shelf = document.createElement('div');
    shelf.style.cssText = `position:absolute;right:4%;top:4%;z-index:4;`;
    const shelfBoard = document.createElement('div');
    shelfBoard.style.cssText = `width:clamp(80px,16vw,120px);height:8px;
      background:linear-gradient(180deg,#8d6e63,#6d4c41);
      border-radius:3px;box-shadow:0 2px 6px rgba(0,0,0,0.15);`;
    shelf.appendChild(shelfBoard);
    // Items on shelf
    const shelfItems = document.createElement('div');
    shelfItems.style.cssText = `display:flex;justify-content:center;gap:4px;
      margin-bottom:2px;`;
    ['🫙','🧂','🍶'].forEach(e => {
      const s = document.createElement('div');
      s.style.cssText = `font-size:clamp(16px,3vw,24px);`;
      s.textContent = e;
      shelfItems.appendChild(s);
    });
    shelf.insertBefore(shelfItems, shelfBoard);
    // Second shelf
    const shelf2 = document.createElement('div');
    shelf2.style.cssText = `margin-top:8px;`;
    const shelfBoard2 = document.createElement('div');
    shelfBoard2.style.cssText = `width:clamp(80px,16vw,120px);height:8px;
      background:linear-gradient(180deg,#8d6e63,#6d4c41);
      border-radius:3px;box-shadow:0 2px 6px rgba(0,0,0,0.15);`;
    shelf2.appendChild(shelfBoard2);
    const shelfItems2 = document.createElement('div');
    shelfItems2.style.cssText = `display:flex;justify-content:center;gap:4px;margin-bottom:2px;`;
    ['🥫','🫒','🍯'].forEach(e => {
      const s = document.createElement('div');
      s.style.cssText = `font-size:clamp(16px,3vw,24px);`;
      s.textContent = e;
      shelfItems2.appendChild(s);
    });
    shelf2.insertBefore(shelfItems2, shelfBoard2);
    shelf.appendChild(shelf2);
    container.appendChild(shelf);

    // === WINDOW ===
    const win = document.createElement('div');
    win.style.cssText = `position:absolute;top:4%;left:30%;
      width:clamp(55px,11vw,80px);height:clamp(50px,10vw,70px);
      background:linear-gradient(160deg,#b3e5fc,#e1f5fe);
      border:4px solid #fff;border-radius:4px;z-index:2;
      box-shadow:2px 2px 6px rgba(0,0,0,0.1);`;
    const winX = document.createElement('div');
    winX.style.cssText = `position:absolute;top:50%;left:0;right:0;height:3px;
      background:rgba(255,255,255,0.8);transform:translateY(-50%);`;
    win.appendChild(winX);
    const winY = document.createElement('div');
    winY.style.cssText = `position:absolute;left:50%;top:0;bottom:0;width:3px;
      background:rgba(255,255,255,0.8);transform:translateX(-50%);`;
    win.appendChild(winY);
    container.appendChild(win);

    // === ANIMALS (on the floor in front of counter) ===
    this._renderAnimalsOnFloor(container, state, 'kitchen', 58);

    // === HINT ===
    const hint = document.createElement('div');
    hint.style.cssText = `position:absolute;bottom:3%;left:50%;transform:translateX(-50%);
      z-index:20;background:rgba(255,255,255,0.85);backdrop-filter:blur(6px);
      padding:6px 16px;border-radius:20px;font-size:clamp(10px,1.8vw,13px);
      font-weight:700;color:var(--text-light);text-align:center;white-space:nowrap;`;
    hint.textContent = state.animals.length > 0
      ? '👆 Tape sur un animal pour cuisiner !'
      : 'Aucun animal à l\'hôtel.';
    container.appendChild(hint);

    // === TITLE BADGE ===
    this._titleBadge(container, '🍳 Cuisine');
  },

  // ======================================================================
  // BATHROOM — Real bathroom with tiles, bathtub, mirror, sink, towels
  // ======================================================================
  renderBath(container, state) {
    container.innerHTML = '';
    container.className = 'room-scene room-bath';
    container.style.cssText = 'overflow:hidden;padding:0;position:relative;';

    // === WALL (light blue tiles) ===
    const wall = document.createElement('div');
    wall.style.cssText = `position:absolute;top:0;left:0;right:0;height:58%;
      background:linear-gradient(180deg,#e0f7fa 0%,#b2ebf2 100%);`;
    container.appendChild(wall);
    // Tile grid
    for (let r = 0; r < 6; r++) {
      for (let c = 0; c < 10; c++) {
        const tile = document.createElement('div');
        tile.style.cssText = `position:absolute;
          top:${r*16.6}%;left:${c*10}%;width:10%;height:16.6%;
          border:1px solid rgba(255,255,255,0.7);box-sizing:border-box;
          ${(r+c)%3===0?'background:rgba(255,255,255,0.2);':''}`;
        wall.appendChild(tile);
      }
    }

    // === FLOOR (bathroom tiles) ===
    const floor = document.createElement('div');
    floor.style.cssText = `position:absolute;bottom:0;left:0;right:0;height:42%;
      background:linear-gradient(180deg,#e8eaf6 0%,#c5cae9 100%);`;
    container.appendChild(floor);
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 8; c++) {
        const ft = document.createElement('div');
        ft.style.cssText = `position:absolute;
          top:${r*25}%;left:${c*12.5}%;width:12.5%;height:25%;
          background:${(r+c)%2===0?'rgba(255,255,255,0.3)':'transparent'};
          box-sizing:border-box;`;
        floor.appendChild(ft);
      }
    }

    // Wall trim
    const trim = document.createElement('div');
    trim.style.cssText = `position:absolute;top:58%;left:0;right:0;height:4px;
      background:linear-gradient(90deg,#0097a7,#00bcd4,#0097a7);z-index:3;`;
    container.appendChild(trim);

    // === BATHTUB (center-left) ===
    const tubWrap = document.createElement('div');
    tubWrap.style.cssText = `position:absolute;left:5%;top:28%;z-index:5;`;
    // Tub body
    const tubBody = document.createElement('div');
    tubBody.style.cssText = `width:clamp(120px,25vw,190px);height:clamp(60px,12vw,95px);
      background:linear-gradient(180deg,#fff,#eceff1);
      border-radius:0 0 50% 50% / 0 0 40% 40%;
      border:4px solid #b0bec5;box-shadow:3px 4px 12px rgba(0,0,0,0.15);
      position:relative;overflow:hidden;`;
    // Water inside
    const water = document.createElement('div');
    water.style.cssText = `position:absolute;bottom:0;left:5%;right:5%;height:60%;
      background:linear-gradient(180deg,rgba(100,181,246,0.5),rgba(66,165,245,0.7));
      border-radius:0 0 50% 50%;`;
    tubBody.appendChild(water);
    // Bubbles
    ['15%','35%','55%','75%'].forEach((l,i) => {
      const bub = document.createElement('div');
      bub.style.cssText = `position:absolute;bottom:${40+i*8}%;left:${l};
        width:${10+i*3}px;height:${10+i*3}px;border-radius:50%;
        background:rgba(255,255,255,0.7);border:1px solid rgba(255,255,255,0.9);`;
      tubBody.appendChild(bub);
    });
    tubWrap.appendChild(tubBody);
    // Faucet
    const faucet = document.createElement('div');
    faucet.style.cssText = `position:absolute;top:-15px;right:15%;
      width:clamp(25px,5vw,40px);height:clamp(20px,4vw,30px);
      background:linear-gradient(180deg,#bdbdbd,#9e9e9e);
      border-radius:0 0 8px 8px;z-index:6;`;
    const faucetHead = document.createElement('div');
    faucetHead.style.cssText = `position:absolute;top:0;left:50%;transform:translateX(-50%);
      width:70%;height:40%;background:linear-gradient(180deg,#e0e0e0,#bdbdbd);
      border-radius:4px 4px 0 0;`;
    faucet.appendChild(faucetHead);
    tubWrap.appendChild(faucet);
    // Tub feet
    ['5%','85%'].forEach(l => {
      const foot = document.createElement('div');
      foot.style.cssText = `position:absolute;bottom:-8px;left:${l};
        width:12px;height:10px;background:#9e9e9e;border-radius:0 0 4px 4px;`;
      tubBody.appendChild(foot);
    });
    container.appendChild(tubWrap);

    // === MIRROR (on wall, right) ===
    const mirror = document.createElement('div');
    mirror.style.cssText = `position:absolute;top:5%;right:8%;
      width:clamp(50px,10vw,75px);height:clamp(60px,12vw,90px);
      background:linear-gradient(160deg,#e3f2fd,#bbdefb,#e1f5fe);
      border:5px solid #fff;border-radius:50% 50% 4px 4px;z-index:3;
      box-shadow:2px 2px 10px rgba(0,0,0,0.1);`;
    container.appendChild(mirror);

    // === SINK (below mirror, right) ===
    const sink = document.createElement('div');
    sink.style.cssText = `position:absolute;top:38%;right:6%;z-index:4;`;
    const sinkBody = document.createElement('div');
    sinkBody.style.cssText = `width:clamp(55px,11vw,80px);height:clamp(25px,5vw,40px);
      background:linear-gradient(180deg,#fff,#e0e0e0);
      border-radius:0 0 50% 50% / 0 0 40% 40%;
      border:3px solid #bdbdbd;`;
    sink.appendChild(sinkBody);
    const sinkTap = document.createElement('div');
    sinkTap.style.cssText = `position:absolute;top:-10px;left:50%;transform:translateX(-50%);
      width:12px;height:15px;background:#9e9e9e;border-radius:3px;`;
    sink.appendChild(sinkTap);
    container.appendChild(sink);

    // === TOWEL RACK (left wall) ===
    const rack = document.createElement('div');
    rack.style.cssText = `position:absolute;top:8%;left:4%;z-index:3;`;
    const rackBar = document.createElement('div');
    rackBar.style.cssText = `width:clamp(35px,7vw,55px);height:5px;
      background:#9e9e9e;border-radius:3px;`;
    rack.appendChild(rackBar);
    const towel = document.createElement('div');
    towel.style.cssText = `width:clamp(28px,5.5vw,42px);height:clamp(35px,7vw,55px);
      background:linear-gradient(180deg,#f48fb1,#ec407a);
      border-radius:0 0 4px 4px;margin:0 auto;
      box-shadow:1px 2px 4px rgba(0,0,0,0.1);`;
    rack.appendChild(towel);
    container.appendChild(rack);

    // === BATH MAT ===
    const mat = document.createElement('div');
    mat.style.cssText = `position:absolute;bottom:22%;left:10%;
      width:clamp(70px,14vw,100px);height:clamp(25px,5vw,40px);
      background:linear-gradient(90deg,#c5cae9,#9fa8da,#c5cae9);
      border-radius:6px;z-index:4;`;
    container.appendChild(mat);

    // === SOAP & SHAMPOO ===
    const soap = document.createElement('div');
    soap.style.cssText = `position:absolute;top:20%;left:38%;
      font-size:clamp(16px,3vw,24px);z-index:4;`;
    soap.textContent = '🧴';
    container.appendChild(soap);
    const duck = document.createElement('div');
    duck.style.cssText = `position:absolute;top:32%;left:22%;
      font-size:clamp(14px,2.5vw,20px);z-index:6;`;
    duck.textContent = '🦆';
    container.appendChild(duck);

    // === ANIMALS ===
    this._renderAnimalsOnFloor(container, state, 'bath', 60);

    // === HINT ===
    const hint = document.createElement('div');
    hint.style.cssText = `position:absolute;bottom:3%;left:50%;transform:translateX(-50%);
      z-index:20;background:rgba(255,255,255,0.85);backdrop-filter:blur(6px);
      padding:6px 16px;border-radius:20px;font-size:clamp(10px,1.8vw,13px);
      font-weight:700;color:var(--text-light);text-align:center;white-space:nowrap;`;
    hint.textContent = '👆 Tape sur un animal pour le laver !';
    container.appendChild(hint);

    this._titleBadge(container, '🛁 Salle de Bain');
  },

  // ======================================================================
  // SHOP — Real supermarket with aisles, shelves, products, checkout
  // ======================================================================
  renderShop(container, state) {
    container.innerHTML = '';
    container.className = 'room-scene room-shop';
    container.style.cssText = 'overflow:hidden;padding:0;position:relative;';

    // === WALL ===
    const wall = document.createElement('div');
    wall.style.cssText = `position:absolute;top:0;left:0;right:0;height:25%;
      background:linear-gradient(180deg,#e8f5e9 0%,#c8e6c9 100%);z-index:0;`;
    container.appendChild(wall);

    // === FLOOR ===
    const floor = document.createElement('div');
    floor.style.cssText = `position:absolute;bottom:0;left:0;right:0;height:75%;
      background:linear-gradient(180deg,#fafafa 0%,#eeeeee 100%);z-index:0;`;
    container.appendChild(floor);
    // Floor grid lines
    for (let i = 0; i < 6; i++) {
      const line = document.createElement('div');
      line.style.cssText = `position:absolute;top:${i*20}%;left:0;right:0;height:1px;
        background:rgba(0,0,0,0.04);`;
      floor.appendChild(line);
    }

    // === SHOP SIGN ===
    const sign = document.createElement('div');
    sign.style.cssText = `position:absolute;top:2%;left:50%;transform:translateX(-50%);
      background:linear-gradient(135deg,#4caf50,#66bb6a);color:#fff;
      padding:5px 20px;border-radius:20px;z-index:10;
      font-size:clamp(13px,2.2vw,17px);font-weight:900;
      box-shadow:0 3px 10px rgba(76,175,80,0.3);`;
    sign.textContent = '🛒 Supermarché';
    container.appendChild(sign);

    // === SHELVES WITH PRODUCTS (category tabs as aisles) ===
    const categories = [
      { id:'protein', label:'🥩 Viandes', color:'#ef5350' },
      { id:'green', label:'🥬 Légumes', color:'#66bb6a' },
      { id:'carb', label:'🍞 Féculents', color:'#ffa726' },
      { id:'condiment', label:'🧂 Sauces', color:'#ab47bc' },
      { id:'extras', label:'🎁 Extras', color:'#42a5f5' },
    ];

    // Aisle tabs (as shelf labels at top)
    const aisleBar = document.createElement('div');
    aisleBar.style.cssText = `position:absolute;top:18%;left:0;right:0;z-index:10;
      display:flex;gap:4px;padding:0 6px;overflow-x:auto;`;
    categories.forEach(cat => {
      const tab = document.createElement('div');
      const isActive = (Game.shopTab || 'protein') === cat.id;
      tab.style.cssText = `flex-shrink:0;padding:5px 10px;border-radius:10px;
        font-size:clamp(9px,1.6vw,12px);font-weight:800;cursor:pointer;
        transition:all 0.15s;white-space:nowrap;
        ${isActive
          ? `background:${cat.color};color:#fff;box-shadow:0 2px 8px ${cat.color}44;`
          : 'background:rgba(255,255,255,0.8);color:var(--text);'}`;
      tab.textContent = cat.label;
      tab.onclick = () => { Game.shopTab = cat.id; Game.renderCurrentRoom(); };
      aisleBar.appendChild(tab);
    });
    container.appendChild(aisleBar);

    // === PRODUCT SHELF ===
    const shelfArea = document.createElement('div');
    shelfArea.style.cssText = `position:absolute;top:28%;left:0;right:0;bottom:0;
      overflow-y:auto;padding:6px;z-index:5;
      -webkit-overflow-scrolling:touch;`;

    // Shelf background (wooden shelf look)
    const shelfBg = document.createElement('div');
    shelfBg.style.cssText = `min-height:100%;position:relative;`;

    const currentCat = Game.shopTab || 'protein';

    if (currentCat === 'extras') {
      const grid = document.createElement('div');
      grid.style.cssText = `display:grid;grid-template-columns:repeat(3,1fr);gap:8px;padding:4px;`;
      SHOP_EXTRAS.forEach(item => {
        const card = this._shopCard(`<div style="font-size:32px;">${item.emoji}</div>`, item.name, item.price);
        card.onclick = () => Game.buyItem(item);
        grid.appendChild(card);
      });
      shelfBg.appendChild(grid);
    } else {
      const catData = FOOD_CATEGORIES[currentCat];
      const max = Math.min(catData.count, 20);
      const grid = document.createElement('div');
      grid.style.cssText = `display:grid;grid-template-columns:repeat(3,1fr);gap:8px;padding:4px;`;
      for (let i = 1; i <= max; i++) {
        const img = Assets.getFood(currentCat, i);
        let imgHtml;
        if (img) {
          imgHtml = `<img src="${img.src}" style="width:42px;height:42px;object-fit:contain;" alt="">`;
        } else {
          imgHtml = `<div style="font-size:32px;">${catData.emoji}</div>`;
        }
        const card = this._shopCard(imgHtml, `${catData.name} #${i}`, catData.price);
        ((idx) => { card.onclick = () => Game.buyFood(currentCat, idx); })(i);
        grid.appendChild(card);
      }
      shelfBg.appendChild(grid);
    }

    shelfArea.appendChild(shelfBg);
    container.appendChild(shelfArea);

    // === COIN DISPLAY ===
    const coins = document.createElement('div');
    coins.style.cssText = `position:absolute;top:5%;right:4%;z-index:15;
      background:rgba(255,255,255,0.9);padding:4px 12px;border-radius:14px;
      font-size:clamp(11px,1.8vw,14px);font-weight:800;color:var(--text);
      box-shadow:0 2px 6px rgba(0,0,0,0.1);`;
    coins.textContent = `💰 ${state.coins}`;
    container.appendChild(coins);
  },

  // ======================================================================
  // ARCADE — Real game room with arcade machines, carpet, neon lights
  // ======================================================================
  renderArcade(container, state) {
    container.innerHTML = '';
    container.className = 'room-scene room-arcade';
    container.style.cssText = 'overflow:hidden;padding:0;position:relative;';

    // === DARK WALL ===
    const wall = document.createElement('div');
    wall.style.cssText = `position:absolute;top:0;left:0;right:0;height:50%;
      background:linear-gradient(180deg,#1a237e 0%,#283593 100%);`;
    container.appendChild(wall);
    // Star / neon dots on wall
    for (let i = 0; i < 15; i++) {
      const star = document.createElement('div');
      const size = 2 + Math.random() * 4;
      star.style.cssText = `position:absolute;
        top:${10 + Math.random()*80}%;left:${5 + Math.random()*90}%;
        width:${size}px;height:${size}px;border-radius:50%;
        background:${['#ff4081','#ffeb3b','#00e5ff','#76ff03'][i%4]};
        box-shadow:0 0 ${size*2}px ${['#ff4081','#ffeb3b','#00e5ff','#76ff03'][i%4]}88;
        opacity:0.7;`;
      wall.appendChild(star);
    }

    // === CARPET FLOOR ===
    const floor = document.createElement('div');
    floor.style.cssText = `position:absolute;bottom:0;left:0;right:0;height:50%;
      background:linear-gradient(180deg,#4a148c 0%,#311b92 100%);`;
    container.appendChild(floor);
    // Carpet pattern (zigzag)
    for (let i = 0; i < 8; i++) {
      const zig = document.createElement('div');
      zig.style.cssText = `position:absolute;top:${i*12.5}%;left:0;right:0;height:2px;
        background:rgba(255,255,255,0.06);`;
      floor.appendChild(zig);
    }

    // === NEON SIGN ===
    const neon = document.createElement('div');
    neon.style.cssText = `position:absolute;top:3%;left:50%;transform:translateX(-50%);
      z-index:10;font-size:clamp(16px,2.8vw,22px);font-weight:900;
      color:#ff4081;text-shadow:0 0 10px #ff4081,0 0 20px #ff408188;
      padding:5px 18px;border:2px solid #ff408166;border-radius:12px;
      background:rgba(0,0,0,0.3);`;
    neon.textContent = '🎮 ARCADE';
    container.appendChild(neon);

    // === HIGH SCORES ===
    const hs = document.createElement('div');
    hs.style.cssText = `position:absolute;top:3%;right:3%;z-index:10;
      font-size:clamp(9px,1.5vw,12px);font-weight:700;color:#ffeb3b;
      background:rgba(0,0,0,0.4);padding:4px 10px;border-radius:10px;`;
    hs.textContent = `🏆 ${state.highScores.logJump}`;
    container.appendChild(hs);

    // === ARCADE MACHINES (4 games) ===
    const games = [
      { id:'log_jump', ico:'🌿', name:'Saute-Bûches', color:'#4caf50',
        desc:'Saute et collecte !' },
      { id:'hidden', ico:'🔍', name:'Animaux Cachés', color:'#ff9800',
        desc:'Trouve-les tous !' },
      { id:'catch', ico:'⭐', name:'Attrape-Étoiles', color:'#2196f3',
        desc:'Attrape les étoiles !' },
      { id:'memory', ico:'🃏', name:'Mémoire', color:'#e91e63',
        desc:'Retrouve les paires !' },
    ];

    const machineGrid = document.createElement('div');
    machineGrid.style.cssText = `position:absolute;top:16%;left:0;right:0;bottom:5%;
      display:grid;grid-template-columns:1fr 1fr;gap:10px;padding:8px;z-index:5;
      overflow-y:auto;`;

    games.forEach(g => {
      const machine = document.createElement('div');
      machine.style.cssText = `background:linear-gradient(180deg,${g.color}dd,${g.color}aa);
        border-radius:14px;padding:12px 8px;text-align:center;cursor:pointer;
        box-shadow:0 4px 15px ${g.color}44,inset 0 1px 0 rgba(255,255,255,0.2);
        transition:transform 0.15s;display:flex;flex-direction:column;
        align-items:center;justify-content:center;gap:4px;min-height:90px;`;
      // Arcade screen
      const screen = document.createElement('div');
      screen.style.cssText = `width:80%;background:rgba(0,0,0,0.3);
        border-radius:8px;padding:8px 4px;`;
      screen.innerHTML = `
        <div style="font-size:clamp(24px,4.5vw,36px);">${g.ico}</div>
        <div style="font-size:clamp(10px,1.8vw,13px);font-weight:900;color:#fff;
          margin-top:2px;">${g.name}</div>`;
      machine.appendChild(screen);
      // Insert coin label
      const coin = document.createElement('div');
      coin.style.cssText = `font-size:clamp(8px,1.3vw,11px);font-weight:700;
        color:rgba(255,255,255,0.8);margin-top:4px;`;
      coin.textContent = '▶ JOUER';
      machine.appendChild(coin);
      machine.onclick = () => Game.startArcadeGame(g.id);
      machine.onmouseenter = () => machine.style.transform = 'scale(1.04) translateY(-2px)';
      machine.onmouseleave = () => machine.style.transform = '';
      machineGrid.appendChild(machine);
    });
    container.appendChild(machineGrid);
  },

  // ======================================================================
  // PHONE — Real smartphone on a desk with yes/no call interface
  // ======================================================================
  renderPhone(container, state) {
    container.innerHTML = '';
    container.className = 'room-scene room-phone';
    container.style.cssText = 'overflow:hidden;padding:0;position:relative;';

    // === BACKGROUND (desk / table) ===
    const bg = document.createElement('div');
    bg.style.cssText = `position:absolute;top:0;left:0;right:0;bottom:0;
      background:linear-gradient(180deg,#efebe9 0%,#d7ccc8 50%,#bcaaa4 100%);`;
    container.appendChild(bg);
    // Wood grain
    for (let i = 0; i < 8; i++) {
      const grain = document.createElement('div');
      grain.style.cssText = `position:absolute;top:${50 + i*6}%;left:0;right:0;height:1px;
        background:rgba(0,0,0,0.05);`;
      bg.appendChild(grain);
    }

    // === SMARTPHONE ===
    const phone = document.createElement('div');
    phone.style.cssText = `position:absolute;top:50%;left:50%;
      transform:translate(-50%,-50%);
      width:clamp(180px,38vw,280px);height:clamp(320px,65vw,480px);
      background:linear-gradient(180deg,#212121,#424242);
      border-radius:28px;z-index:10;
      box-shadow:0 8px 30px rgba(0,0,0,0.3),
        inset 0 1px 0 rgba(255,255,255,0.1);
      display:flex;flex-direction:column;align-items:center;
      padding:10px;box-sizing:border-box;`;
    container.appendChild(phone);

    // Notch / camera
    const notch = document.createElement('div');
    notch.style.cssText = `width:35%;height:6px;background:#000;
      border-radius:0 0 8px 8px;margin-bottom:6px;position:relative;`;
    const cam = document.createElement('div');
    cam.style.cssText = `position:absolute;top:1px;left:50%;transform:translateX(-50%);
      width:4px;height:4px;border-radius:50%;background:#333;`;
    notch.appendChild(cam);
    phone.appendChild(notch);

    // Phone screen
    const phoneScreen = document.createElement('div');
    phoneScreen.style.cssText = `flex:1;width:100%;
      background:linear-gradient(180deg,#e8f5e9,#f1f8e9);
      border-radius:16px;overflow:hidden;position:relative;
      display:flex;flex-direction:column;`;
    phone.appendChild(phoneScreen);

    // Status bar
    const statusBar = document.createElement('div');
    statusBar.style.cssText = `width:100%;padding:4px 10px;box-sizing:border-box;
      display:flex;justify-content:space-between;align-items:center;
      font-size:clamp(7px,1.2vw,10px);font-weight:700;color:#333;
      background:rgba(255,255,255,0.5);`;
    statusBar.innerHTML = `<span>🐾 Animal Hotel</span><span>📶 ████ 🔋</span>`;
    phoneScreen.appendChild(statusBar);

    // Main content area
    const content = document.createElement('div');
    content.style.cssText = `flex:1;display:flex;flex-direction:column;
      align-items:center;justify-content:center;padding:12px;gap:8px;`;
    phoneScreen.appendChild(content);

    // Check if we're in a call (pending call state)
    if (state._pendingCall) {
      // INCOMING CALL screen
      const caller = state._pendingCall;
      const callerDiv = document.createElement('div');
      callerDiv.style.cssText = `text-align:center;`;
      callerDiv.innerHTML = `
        <div style="font-size:clamp(36px,7vw,56px);margin-bottom:6px;">📞</div>
        <div style="font-size:clamp(12px,2vw,16px);font-weight:900;color:#333;">
          Appel entrant...
        </div>
        <div style="font-size:clamp(10px,1.7vw,13px);color:#666;font-weight:700;
          margin-top:6px;">
          ${caller.ownerName}
        </div>`;
      content.appendChild(callerDiv);

      // Message bubble
      const bubble = document.createElement('div');
      bubble.style.cssText = `background:#fff;border-radius:16px;padding:10px 14px;
        max-width:90%;margin-top:8px;
        box-shadow:0 2px 8px rgba(0,0,0,0.08);
        font-size:clamp(10px,1.7vw,13px);color:#333;font-weight:600;
        line-height:1.4;text-align:center;`;
      const aType = ANIMAL_TYPES[caller.type];
      bubble.innerHTML = `"Bonjour ! Est-ce que vous pouvez garder mon animal <b>${aType.emoji} ${caller.name}</b> pendant <b>${caller.stayDuration} jours</b> ?"`;
      content.appendChild(bubble);

      // Yes / No buttons
      const btnRow = document.createElement('div');
      btnRow.style.cssText = `display:flex;gap:16px;margin-top:12px;`;

      const yesBtn = document.createElement('button');
      yesBtn.style.cssText = `width:clamp(55px,12vw,80px);height:clamp(55px,12vw,80px);
        border-radius:50%;border:none;cursor:pointer;
        background:linear-gradient(135deg,#4caf50,#66bb6a);
        color:#fff;font-size:clamp(22px,4.5vw,34px);
        box-shadow:0 4px 15px rgba(76,175,80,0.4);
        font-family:var(--font);transition:transform 0.15s;`;
      yesBtn.textContent = '✅';
      yesBtn.onclick = () => Game.acceptCall();
      yesBtn.onmouseenter = () => yesBtn.style.transform = 'scale(1.1)';
      yesBtn.onmouseleave = () => yesBtn.style.transform = '';
      btnRow.appendChild(yesBtn);

      const noBtn = document.createElement('button');
      noBtn.style.cssText = `width:clamp(55px,12vw,80px);height:clamp(55px,12vw,80px);
        border-radius:50%;border:none;cursor:pointer;
        background:linear-gradient(135deg,#ef5350,#e53935);
        color:#fff;font-size:clamp(22px,4.5vw,34px);
        box-shadow:0 4px 15px rgba(244,67,54,0.4);
        font-family:var(--font);transition:transform 0.15s;`;
      noBtn.textContent = '❌';
      noBtn.onclick = () => Game.declineCall();
      noBtn.onmouseenter = () => noBtn.style.transform = 'scale(1.1)';
      noBtn.onmouseleave = () => noBtn.style.transform = '';
      btnRow.appendChild(noBtn);

      content.appendChild(btnRow);

      // Yes / No labels
      const lblRow = document.createElement('div');
      lblRow.style.cssText = `display:flex;gap:16px;`;
      const yesLbl = document.createElement('div');
      yesLbl.style.cssText = `width:clamp(55px,12vw,80px);text-align:center;
        font-size:clamp(9px,1.5vw,12px);font-weight:800;color:#4caf50;`;
      yesLbl.textContent = 'Oui';
      lblRow.appendChild(yesLbl);
      const noLbl = document.createElement('div');
      noLbl.style.cssText = `width:clamp(55px,12vw,80px);text-align:center;
        font-size:clamp(9px,1.5vw,12px);font-weight:800;color:#ef5350;`;
      noLbl.textContent = 'Non';
      lblRow.appendChild(noLbl);
      content.appendChild(lblRow);

    } else {
      // IDLE phone screen — contacts / call button
      const idle = document.createElement('div');
      idle.style.cssText = `text-align:center;`;
      idle.innerHTML = `
        <div style="font-size:clamp(36px,7vw,56px);margin-bottom:8px;">📱</div>
        <div style="font-size:clamp(13px,2.2vw,17px);font-weight:900;color:#333;">
          Téléphone
        </div>
        <div style="font-size:clamp(10px,1.7vw,13px);color:#666;font-weight:600;
          margin-top:6px;">
          ${state.animals.length}/6 animaux à l'hôtel
        </div>`;
      content.appendChild(idle);

      // Call button
      const callBtn = document.createElement('button');
      callBtn.style.cssText = `width:clamp(65px,14vw,90px);height:clamp(65px,14vw,90px);
        border-radius:50%;border:none;cursor:pointer;
        background:linear-gradient(135deg,#4caf50,#66bb6a);
        color:#fff;font-size:clamp(28px,5.5vw,42px);
        box-shadow:0 4px 20px rgba(76,175,80,0.4);
        margin-top:16px;font-family:var(--font);transition:transform 0.15s;`;
      callBtn.textContent = '📞';
      callBtn.onclick = () => Game.makePhoneCall();
      callBtn.onmouseenter = () => callBtn.style.transform = 'scale(1.1)';
      callBtn.onmouseleave = () => callBtn.style.transform = '';
      content.appendChild(callBtn);

      const callLbl = document.createElement('div');
      callLbl.style.cssText = `font-size:clamp(10px,1.7vw,13px);font-weight:800;
        color:#4caf50;margin-top:6px;`;
      callLbl.textContent = 'Appeler';
      content.appendChild(callLbl);

      // Recent calls (show current animals)
      if (state.animals.length > 0) {
        const recent = document.createElement('div');
        recent.style.cssText = `width:100%;margin-top:12px;`;
        const recTitle = document.createElement('div');
        recTitle.style.cssText = `font-size:clamp(9px,1.4vw,11px);font-weight:700;
          color:#999;text-align:left;padding:0 4px;margin-bottom:4px;`;
        recTitle.textContent = 'ANIMAUX À L\'HÔTEL';
        recent.appendChild(recTitle);
        state.animals.slice(0, 4).forEach(a => {
          const aType = ANIMAL_TYPES[a.type];
          if (!aType) return;
          const row = document.createElement('div');
          row.style.cssText = `display:flex;align-items:center;gap:6px;
            padding:5px 6px;background:rgba(255,255,255,0.6);
            border-radius:8px;margin-bottom:3px;`;
          row.innerHTML = `
            <span style="font-size:clamp(14px,2.5vw,20px);">${aType.emoji}</span>
            <span style="font-size:clamp(9px,1.5vw,12px);font-weight:700;color:#333;flex:1;">
              ${a.name}
            </span>
            <span style="font-size:clamp(8px,1.2vw,10px);color:#999;font-weight:600;">
              Jour ${a.arrivalDay || '?'}
            </span>`;
          recent.appendChild(row);
        });
        content.appendChild(recent);
      }
    }

    // Home button (bottom of phone)
    const homeBtn = document.createElement('div');
    homeBtn.style.cssText = `width:28px;height:4px;background:#666;
      border-radius:3px;margin-top:8px;`;
    phone.appendChild(homeBtn);
  },

  // ===== HELPERS =====

  // Render animals positioned on the floor (absolute) for immersive rooms
  _renderAnimalsOnFloor(container, state, context, bottomPct) {
    if (state.animals.length === 0) return;
    const positions = [
      { left:'25%', offset:0 },
      { left:'55%', offset:2 },
      { left:'40%', offset:-1 },
      { left:'70%', offset:1 },
      { left:'15%', offset:3 },
      { left:'60%', offset:-2 },
    ];

    state.animals.forEach((animal, idx) => {
      const aType = ANIMAL_TYPES[animal.type];
      if (!aType) return;
      const pos = positions[idx % positions.length];

      const div = document.createElement('div');
      div.style.cssText = `position:absolute;left:${pos.left};
        bottom:${bottomPct - 18 + pos.offset}%;
        z-index:${15 + idx};cursor:pointer;text-align:center;
        transition:transform 0.2s;`;

      const img = document.createElement('img');
      img.src = `assets/game/animals/${aType.img}.png`;
      img.className = 'animal-idle';
      img.style.cssText = `width:clamp(50px,9vw,80px);height:auto;
        filter:drop-shadow(2px 3px 2px rgba(0,0,0,0.2));`;
      img.style.animationDelay = `${idx * 0.5}s`;
      div.appendChild(img);

      const face = this._getAnimalFace(animal);
      const faceImg = document.createElement('img');
      faceImg.src = `assets/game/faces/${face}.png`;
      faceImg.style.cssText = `position:absolute;top:2%;left:50%;transform:translateX(-50%);
        width:clamp(20px,3.5vw,30px);pointer-events:none;`;
      div.appendChild(faceImg);

      const tag = document.createElement('div');
      tag.className = 'animal-name-tag';
      tag.textContent = `${aType.emoji} ${animal.name}`;
      div.appendChild(tag);

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
      div.onmouseenter = () => div.style.transform = 'scale(1.1)';
      div.onmouseleave = () => div.style.transform = '';
      container.appendChild(div);
    });
  },

  // Title badge helper
  _titleBadge(container, text) {
    const badge = document.createElement('div');
    badge.style.cssText = `position:absolute;top:0;left:0;right:0;z-index:20;
      display:flex;align-items:center;justify-content:center;padding:6px;
      background:rgba(255,255,255,0.75);backdrop-filter:blur(6px);`;
    badge.innerHTML = `<span style="font-size:clamp(13px,2.2vw,17px);font-weight:900;
      color:var(--text);">${text}</span>`;
    container.appendChild(badge);
  },

  // Shop card helper
  _shopCard(imgHtml, name, price) {
    const card = document.createElement('div');
    card.style.cssText = `background:#fff;border-radius:12px;padding:8px 4px;
      text-align:center;cursor:pointer;transition:transform 0.15s;
      box-shadow:0 2px 8px rgba(0,0,0,0.06);`;
    card.innerHTML = `
      <div style="height:44px;display:flex;align-items:center;justify-content:center;">
        ${imgHtml}
      </div>
      <div style="font-size:clamp(8px,1.3vw,10px);font-weight:700;color:var(--text);
        margin-top:3px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${name}</div>
      <div style="font-size:clamp(9px,1.5vw,12px);font-weight:800;color:#4caf50;
        margin-top:2px;">💰 ${price}</div>`;
    card.onmouseenter = () => card.style.transform = 'scale(1.05)';
    card.onmouseleave = () => card.style.transform = '';
    return card;
  },

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

      const face = this._getAnimalFace(animal);
      const faceImg = document.createElement('img');
      faceImg.src = `assets/game/faces/${face}.png`;
      faceImg.className = 'animal-face';
      div.appendChild(faceImg);

      const tag = document.createElement('div');
      tag.className = 'animal-name-tag';
      tag.textContent = `${aType.emoji} ${animal.name}`;
      div.appendChild(tag);

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
