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
