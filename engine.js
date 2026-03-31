// ============================================================
// ENGINE.JS — Core Game Engine for Animal Hotel V2 (8 Epics)
// ============================================================

const Engine = {
    canvas: null,
    ctx: null,
    width: 480,
    height: 320,
    tileSize: 16,
    lastTime: 0,
    deltaTime: 0,
    frameCount: 0,
    animFrame: 0,
    animTimer: 0,

    // Camera
    camera: { x: 0, y: 0, targetX: 0, targetY: 0, smoothing: 0.1 },

    // Input
    keys: {},
    keysJustPressed: {},
    touchDirs: {},
    touchA: false,
    touchB: false,

    // Mouse / Touch drag (for petting, washing, etc.)
    mouse: { x: 0, y: 0, down: false, dragging: false, dragStartX: 0, dragStartY: 0, dragDist: 0 },
    mouseJustClicked: false,

    // Screen transition
    transition: { active: false, alpha: 0, fadeIn: false, callback: null, speed: 3 },

    // Particles
    particles: [],

    // Audio
    audioCtx: null,
    soundEnabled: true,

    init() {
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.ctx.imageSmoothingEnabled = false;

        // Keyboard
        window.addEventListener('keydown', e => {
            if (!this.keys[e.key]) this.keysJustPressed[e.key] = true;
            this.keys[e.key] = true;
            e.preventDefault();
        });
        window.addEventListener('keyup', e => { this.keys[e.key] = false; });

        // Mouse / Touch on canvas (for minigames)
        this._setupMouseInput();
        this._setupMobileControls();

        this.lastTime = performance.now();
        requestAnimationFrame(t => this.loop(t));
    },

    _setupMouseInput() {
        const rect = () => this.canvas.getBoundingClientRect();

        const toCanvas = (clientX, clientY) => {
            const r = rect();
            return {
                x: (clientX - r.left) / r.width * this.width,
                y: (clientY - r.top) / r.height * this.height
            };
        };

        // Mouse events
        this.canvas.addEventListener('mousedown', e => {
            const pos = toCanvas(e.clientX, e.clientY);
            this.mouse.x = pos.x; this.mouse.y = pos.y;
            this.mouse.down = true;
            this.mouse.dragging = false;
            this.mouse.dragStartX = pos.x;
            this.mouse.dragStartY = pos.y;
            this.mouse.dragDist = 0;
            this.mouseJustClicked = true;
        });
        this.canvas.addEventListener('mousemove', e => {
            const pos = toCanvas(e.clientX, e.clientY);
            if (this.mouse.down) {
                this.mouse.dragDist += Math.hypot(pos.x - this.mouse.x, pos.y - this.mouse.y);
                if (this.mouse.dragDist > 3) this.mouse.dragging = true;
            }
            this.mouse.x = pos.x; this.mouse.y = pos.y;
        });
        this.canvas.addEventListener('mouseup', () => { this.mouse.down = false; });
        this.canvas.addEventListener('mouseleave', () => { this.mouse.down = false; });

        // Touch events on canvas
        this.canvas.addEventListener('touchstart', e => {
            e.preventDefault();
            const t = e.touches[0];
            const pos = toCanvas(t.clientX, t.clientY);
            this.mouse.x = pos.x; this.mouse.y = pos.y;
            this.mouse.down = true;
            this.mouse.dragging = false;
            this.mouse.dragStartX = pos.x;
            this.mouse.dragStartY = pos.y;
            this.mouse.dragDist = 0;
            this.mouseJustClicked = true;
        });
        this.canvas.addEventListener('touchmove', e => {
            e.preventDefault();
            const t = e.touches[0];
            const pos = toCanvas(t.clientX, t.clientY);
            if (this.mouse.down) {
                this.mouse.dragDist += Math.hypot(pos.x - this.mouse.x, pos.y - this.mouse.y);
                if (this.mouse.dragDist > 3) this.mouse.dragging = true;
            }
            this.mouse.x = pos.x; this.mouse.y = pos.y;
        });
        this.canvas.addEventListener('touchend', e => {
            e.preventDefault();
            this.mouse.down = false;
        });
    },

    _setupMobileControls() {
        const dpadBtns = document.querySelectorAll('.dpad-btn');
        dpadBtns.forEach(btn => {
            const dir = btn.dataset.dir;
            const start = () => { this.touchDirs[dir] = true; };
            const end = () => { this.touchDirs[dir] = false; };
            btn.addEventListener('touchstart', e => { e.preventDefault(); start(); });
            btn.addEventListener('touchend', e => { e.preventDefault(); end(); });
            btn.addEventListener('mousedown', start);
            btn.addEventListener('mouseup', end);
            btn.addEventListener('mouseleave', end);
        });

        const btnA = document.getElementById('btn-a');
        const btnB = document.getElementById('btn-b');
        const btnMenu = document.getElementById('btn-menu');

        if (btnA) {
            btnA.addEventListener('touchstart', e => { e.preventDefault(); this.keysJustPressed[' '] = true; this.keys[' '] = true; });
            btnA.addEventListener('touchend', e => { e.preventDefault(); this.keys[' '] = false; });
            btnA.addEventListener('mousedown', () => { this.keysJustPressed[' '] = true; this.keys[' '] = true; });
            btnA.addEventListener('mouseup', () => { this.keys[' '] = false; });
        }
        if (btnB) {
            btnB.addEventListener('touchstart', e => { e.preventDefault(); this.keysJustPressed['Escape'] = true; this.keys['Escape'] = true; });
            btnB.addEventListener('touchend', e => { e.preventDefault(); this.keys['Escape'] = false; });
            btnB.addEventListener('mousedown', () => { this.keysJustPressed['Escape'] = true; this.keys['Escape'] = true; });
            btnB.addEventListener('mouseup', () => { this.keys['Escape'] = false; });
        }
        if (btnMenu) {
            btnMenu.addEventListener('touchstart', e => { e.preventDefault(); this.keysJustPressed['m'] = true; });
            btnMenu.addEventListener('mousedown', () => { this.keysJustPressed['m'] = true; });
        }
    },

    loop(time) {
        this.deltaTime = Math.min((time - this.lastTime) / 1000, 0.05);
        this.lastTime = time;
        this.frameCount++;

        this.animTimer += this.deltaTime;
        if (this.animTimer > 0.125) {
            this.animTimer -= 0.125;
            this.animFrame = (this.animFrame + 1) % 2;
        }

        if (typeof Game !== 'undefined' && Game.update) Game.update(this.deltaTime);

        this.ctx.clearRect(0, 0, this.width, this.height);
        if (typeof Game !== 'undefined' && Game.render) Game.render(this.ctx);

        if (this.transition.active) this._updateTransition();

        this.keysJustPressed = {};
        this.mouseJustClicked = false;

        requestAnimationFrame(t => this.loop(t));
    },

    // ==================== INPUT ====================
    isKeyDown(key) { return this.keys[key] || false; },
    isKeyJustPressed(key) { return this.keysJustPressed[key] || false; },

    getMovementInput() {
        let dx = 0, dy = 0;
        if (this.keys['ArrowUp'] || this.keys['w'] || this.keys['W'] || this.keys['z'] || this.keys['Z'] || this.touchDirs.up) dy = -1;
        if (this.keys['ArrowDown'] || this.keys['s'] || this.keys['S'] || this.touchDirs.down) dy = 1;
        if (this.keys['ArrowLeft'] || this.keys['a'] || this.keys['A'] || this.keys['q'] || this.keys['Q'] || this.touchDirs.left) dx = -1;
        if (this.keys['ArrowRight'] || this.keys['d'] || this.keys['D'] || this.touchDirs.right) dx = 1;
        return { dx, dy };
    },

    isActionPressed() { return this.isKeyJustPressed(' ') || this.isKeyJustPressed('Enter'); },
    isCancelPressed() { return this.isKeyJustPressed('Escape') || this.isKeyJustPressed('Backspace'); },
    isMenuPressed() { return this.isKeyJustPressed('m') || this.isKeyJustPressed('M') || this.isKeyJustPressed('Tab'); },

    // Mouse helpers for minigames
    isMouseDown() { return this.mouse.down; },
    isDragging() { return this.mouse.dragging; },
    getMousePos() { return { x: this.mouse.x, y: this.mouse.y }; },
    wasClicked() { return this.mouseJustClicked; },
    getDragDistance() { return this.mouse.dragDist; },

    // Check if point is inside a rectangle
    isPointInRect(px, py, rx, ry, rw, rh) {
        return px >= rx && px <= rx + rw && py >= ry && py <= ry + rh;
    },

    // ==================== CAMERA ====================
    setCameraTarget(x, y) {
        this.camera.targetX = x * this.tileSize - this.width / 2 + this.tileSize / 2;
        this.camera.targetY = y * this.tileSize - this.height / 2 + this.tileSize / 2;
    },

    updateCamera() {
        this.camera.x += (this.camera.targetX - this.camera.x) * this.camera.smoothing;
        this.camera.y += (this.camera.targetY - this.camera.y) * this.camera.smoothing;
        if (typeof Game !== 'undefined' && Game.state) {
            const map = MapManager.getMap(Game.state.currentMap);
            const maxX = map.width * this.tileSize - this.width;
            const maxY = map.height * this.tileSize - this.height;
            this.camera.x = Math.max(0, Math.min(this.camera.x, maxX));
            this.camera.y = Math.max(0, Math.min(this.camera.y, maxY));
        }
    },

    snapCamera(x, y) {
        this.camera.targetX = x * this.tileSize - this.width / 2 + this.tileSize / 2;
        this.camera.targetY = y * this.tileSize - this.height / 2 + this.tileSize / 2;
        this.camera.x = this.camera.targetX;
        this.camera.y = this.camera.targetY;
    },

    // ==================== RENDERING ====================
    renderMap(ctx, mapId) {
        const map = MapManager.getMap(mapId);
        const startTileX = Math.max(0, Math.floor(this.camera.x / this.tileSize));
        const startTileY = Math.max(0, Math.floor(this.camera.y / this.tileSize));
        const endTileX = Math.min(map.width, Math.ceil((this.camera.x + this.width) / this.tileSize) + 1);
        const endTileY = Math.min(map.height, Math.ceil((this.camera.y + this.height) / this.tileSize) + 1);
        for (let y = startTileY; y < endTileY; y++) {
            for (let x = startTileX; x < endTileX; x++) {
                const tileId = map.tiles[y][x];
                const sprite = SpriteManager.getTileSprite(tileId);
                if (sprite) {
                    const px = x * this.tileSize - Math.floor(this.camera.x);
                    const py = y * this.tileSize - Math.floor(this.camera.y);
                    PixelSprite.draw(ctx, sprite, px, py);
                }
            }
        }
    },

    renderSprite(ctx, spriteData, tileX, tileY, flip = false) {
        const px = tileX * this.tileSize - Math.floor(this.camera.x);
        const py = tileY * this.tileSize - Math.floor(this.camera.y);
        if (px < -this.tileSize || px > this.width || py < -this.tileSize || py > this.height) return;
        if (flip) PixelSprite.drawFlipped(ctx, spriteData, px, py);
        else PixelSprite.draw(ctx, spriteData, px, py);
    },

    renderSmallSprite(ctx, spriteData, px, py, scale = 1) {
        PixelSprite.draw(ctx, spriteData, px, py, scale);
    },

    // ==================== TRANSITIONS ====================
    fadeOut(callback) {
        this.transition.active = true;
        this.transition.alpha = 0;
        this.transition.fadeIn = false;
        this.transition.callback = callback;
    },

    fadeIn() {
        this.transition.active = true;
        this.transition.alpha = 1;
        this.transition.fadeIn = true;
        this.transition.callback = null;
    },

    _updateTransition() {
        const speed = this.transition.speed * this.deltaTime;
        if (this.transition.fadeIn) {
            this.transition.alpha -= speed;
            if (this.transition.alpha <= 0) { this.transition.alpha = 0; this.transition.active = false; }
        } else {
            this.transition.alpha += speed;
            if (this.transition.alpha >= 1) {
                this.transition.alpha = 1;
                if (this.transition.callback) { this.transition.callback(); this.transition.callback = null; }
                this.fadeIn();
            }
        }
        this.ctx.fillStyle = `rgba(0,0,0,${this.transition.alpha})`;
        this.ctx.fillRect(0, 0, this.width, this.height);
    },

    // ==================== PARTICLES (expanded) ====================
    addParticle(x, y, type, count = 5) {
        const colors = {
            heart: ['#ee3344', '#ff6688'],
            star: ['#ffdd00', '#ffaa00'],
            sparkle: ['#ffffff', '#aaddff', '#ffddaa'],
            coin: ['#ffd700', '#ddb700'],
            note: ['#ff88bb', '#88bbff', '#88ff88'],
            rainbow: ['#ff0000', '#ff8800', '#ffff00', '#00ff00', '#0088ff', '#8800ff'],
            glitter: ['#ffd700', '#ff69b4', '#00ffff', '#ff00ff', '#ffffff'],
            bubble: ['#aaddff', '#88ccff', '#bbddff', '#ffffff'],
            steam: ['#cccccc', '#dddddd', '#eeeeee', '#ffffff'],
            mud: ['#8B4513', '#A0522D', '#6B3410'],
            love: ['#ff69b4', '#ff1493', '#ff6eb4', '#ee3377'],
        };
        const pColors = colors[type] || colors.sparkle;
        const isPixel = (type === 'rainbow' || type === 'glitter');

        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: x, y: y,
                vx: (Math.random() - 0.5) * (isPixel ? 100 : 60),
                vy: -Math.random() * (isPixel ? 60 : 40) - 20,
                life: isPixel ? 1.5 : 1,
                maxLife: isPixel ? 1.5 : 1,
                color: pColors[Math.floor(Math.random() * pColors.length)],
                size: Math.random() * (isPixel ? 4 : 3) + 1,
                gravity: type === 'bubble' ? -30 : (type === 'steam' ? -20 : 60),
            });
        }
    },

    // Convenience: add particles at pixel coords (not tile coords)
    addParticleAt(px, py, type, count = 5) {
        this.addParticle(px, py, type, count);
    },

    // Add particles at tile coords (converts to pixel)
    addParticleAtTile(tileX, tileY, type, count = 5) {
        this.addParticle(tileX * this.tileSize + 8, tileY * this.tileSize + 8, type, count);
    },

    updateParticles(dt) {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.x += p.vx * dt;
            p.y += p.vy * dt;
            p.vy += (p.gravity || 60) * dt;
            p.life -= dt;
            if (p.life <= 0) this.particles.splice(i, 1);
        }
    },

    renderParticles(ctx) {
        for (const p of this.particles) {
            const alpha = Math.max(0, p.life / p.maxLife);
            ctx.globalAlpha = alpha;
            ctx.fillStyle = p.color;
            const px = p.x - Math.floor(this.camera.x);
            const py = p.y - Math.floor(this.camera.y);
            ctx.fillRect(Math.floor(px), Math.floor(py), Math.ceil(p.size), Math.ceil(p.size));
        }
        ctx.globalAlpha = 1;
    },

    // Render particles at absolute screen coords (for minigames)
    renderParticlesAbsolute(ctx) {
        for (const p of this.particles) {
            const alpha = Math.max(0, p.life / p.maxLife);
            ctx.globalAlpha = alpha;
            ctx.fillStyle = p.color;
            ctx.fillRect(Math.floor(p.x), Math.floor(p.y), Math.ceil(p.size), Math.ceil(p.size));
        }
        ctx.globalAlpha = 1;
    },

    // ==================== SOUND (Web Audio — expanded) ====================
    _initAudio() {
        if (this.audioCtx) return;
        try { this.audioCtx = new (window.AudioContext || window.webkitAudioContext)(); }
        catch (e) { this.soundEnabled = false; }
    },

    playSound(type) {
        if (!this.soundEnabled) return;
        this._initAudio();
        if (!this.audioCtx) return;
        const ctx = this.audioCtx;
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);

        switch (type) {
            case 'step':
                osc.type = 'square'; osc.frequency.setValueAtTime(200, now);
                gain.gain.setValueAtTime(0.03, now); gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
                osc.start(now); osc.stop(now + 0.05); break;
            case 'interact':
                osc.type = 'sine'; osc.frequency.setValueAtTime(523, now); osc.frequency.setValueAtTime(659, now + 0.05);
                gain.gain.setValueAtTime(0.08, now); gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
                osc.start(now); osc.stop(now + 0.15); break;
            case 'coin':
                osc.type = 'sine'; osc.frequency.setValueAtTime(880, now); osc.frequency.setValueAtTime(1175, now + 0.06);
                gain.gain.setValueAtTime(0.1, now); gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
                osc.start(now); osc.stop(now + 0.2); break;
            case 'quest':
                osc.type = 'sine';
                osc.frequency.setValueAtTime(523, now); osc.frequency.setValueAtTime(659, now + 0.1);
                osc.frequency.setValueAtTime(784, now + 0.2); osc.frequency.setValueAtTime(1047, now + 0.3);
                gain.gain.setValueAtTime(0.1, now); gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
                osc.start(now); osc.stop(now + 0.5); break;
            case 'menu':
                osc.type = 'sine'; osc.frequency.setValueAtTime(440, now);
                gain.gain.setValueAtTime(0.06, now); gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
                osc.start(now); osc.stop(now + 0.08); break;
            case 'error':
                osc.type = 'square'; osc.frequency.setValueAtTime(150, now);
                gain.gain.setValueAtTime(0.06, now); gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
                osc.start(now); osc.stop(now + 0.15); break;
            case 'heal':
                osc.type = 'sine'; osc.frequency.setValueAtTime(400, now);
                osc.frequency.exponentialRampToValueAtTime(800, now + 0.3);
                gain.gain.setValueAtTime(0.08, now); gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
                osc.start(now); osc.stop(now + 0.4); break;
            // NEW SOUNDS for epics
            case 'sizzle':
                osc.type = 'sawtooth'; osc.frequency.setValueAtTime(100, now);
                osc.frequency.linearRampToValueAtTime(50, now + 0.5);
                gain.gain.setValueAtTime(0.04, now); gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
                osc.start(now); osc.stop(now + 0.5); break;
            case 'ding':
                osc.type = 'sine'; osc.frequency.setValueAtTime(1200, now);
                gain.gain.setValueAtTime(0.12, now); gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
                osc.start(now); osc.stop(now + 0.3); break;
            case 'whimper':
                osc.type = 'sine'; osc.frequency.setValueAtTime(400, now);
                osc.frequency.linearRampToValueAtTime(200, now + 0.3);
                gain.gain.setValueAtTime(0.06, now); gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
                osc.start(now); osc.stop(now + 0.4); break;
            case 'happy':
                osc.type = 'sine';
                osc.frequency.setValueAtTime(600, now); osc.frequency.setValueAtTime(800, now + 0.08);
                osc.frequency.setValueAtTime(1000, now + 0.16);
                gain.gain.setValueAtTime(0.08, now); gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
                osc.start(now); osc.stop(now + 0.3); break;
            case 'splash':
                osc.type = 'sawtooth'; osc.frequency.setValueAtTime(300, now);
                osc.frequency.linearRampToValueAtTime(100, now + 0.2);
                gain.gain.setValueAtTime(0.06, now); gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
                osc.start(now); osc.stop(now + 0.3); break;
            case 'scrub':
                osc.type = 'sawtooth'; osc.frequency.setValueAtTime(150, now);
                osc.frequency.setValueAtTime(200, now + 0.05);
                gain.gain.setValueAtTime(0.03, now); gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
                osc.start(now); osc.stop(now + 0.1); break;
            case 'hairdryer':
                osc.type = 'sawtooth'; osc.frequency.setValueAtTime(80, now);
                gain.gain.setValueAtTime(0.03, now); gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
                osc.start(now); osc.stop(now + 0.4); break;
            case 'phone':
                osc.type = 'sine';
                osc.frequency.setValueAtTime(700, now); osc.frequency.setValueAtTime(900, now + 0.15);
                osc.frequency.setValueAtTime(700, now + 0.3); osc.frequency.setValueAtTime(900, now + 0.45);
                gain.gain.setValueAtTime(0.08, now); gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
                osc.start(now); osc.stop(now + 0.6); break;
            case 'purr':
                osc.type = 'sine'; osc.frequency.setValueAtTime(60, now);
                gain.gain.setValueAtTime(0.04, now); gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
                osc.start(now); osc.stop(now + 0.5); break;
            case 'bark':
                osc.type = 'square'; osc.frequency.setValueAtTime(300, now);
                osc.frequency.setValueAtTime(250, now + 0.05);
                gain.gain.setValueAtTime(0.06, now); gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
                osc.start(now); osc.stop(now + 0.12); break;
            case 'jump':
                osc.type = 'sine'; osc.frequency.setValueAtTime(300, now);
                osc.frequency.exponentialRampToValueAtTime(600, now + 0.15);
                gain.gain.setValueAtTime(0.08, now); gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
                osc.start(now); osc.stop(now + 0.2); break;
            case 'powerup':
                osc.type = 'sine';
                osc.frequency.setValueAtTime(400, now); osc.frequency.setValueAtTime(600, now + 0.1);
                osc.frequency.setValueAtTime(800, now + 0.2); osc.frequency.setValueAtTime(1200, now + 0.3);
                gain.gain.setValueAtTime(0.1, now); gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
                osc.start(now); osc.stop(now + 0.4); break;
            case 'fall':
                osc.type = 'sine'; osc.frequency.setValueAtTime(500, now);
                osc.frequency.exponentialRampToValueAtTime(100, now + 0.4);
                gain.gain.setValueAtTime(0.08, now); gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
                osc.start(now); osc.stop(now + 0.5); break;
            case 'found':
                osc.type = 'sine';
                osc.frequency.setValueAtTime(880, now); osc.frequency.setValueAtTime(1100, now + 0.1);
                gain.gain.setValueAtTime(0.1, now); gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
                osc.start(now); osc.stop(now + 0.2); break;
            case 'buy':
                osc.type = 'sine';
                osc.frequency.setValueAtTime(660, now); osc.frequency.setValueAtTime(880, now + 0.08);
                gain.gain.setValueAtTime(0.08, now); gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
                osc.start(now); osc.stop(now + 0.2); break;
        }
    },

    // ==================== SAVE / LOAD ====================
    saveGame(state) {
        try { localStorage.setItem('animalHotelV2_save', JSON.stringify(state)); return true; }
        catch (e) { return false; }
    },
    loadGame() {
        try { const d = localStorage.getItem('animalHotelV2_save'); return d ? JSON.parse(d) : null; }
        catch (e) { return null; }
    },
    hasSaveGame() { return localStorage.getItem('animalHotelV2_save') !== null; },
    deleteSave() { localStorage.removeItem('animalHotelV2_save'); },

    // ==================== UTILITY ====================
    drawText(ctx, text, x, y, color = '#fff', size = 8, align = 'left') {
        ctx.fillStyle = color;
        ctx.font = `${size}px monospace`;
        ctx.textAlign = align;
        ctx.textBaseline = 'top';
        ctx.fillText(text, x, y);
    },

    drawRect(ctx, x, y, w, h, color, alpha = 1) {
        ctx.globalAlpha = alpha;
        ctx.fillStyle = color;
        ctx.fillRect(x, y, w, h);
        ctx.globalAlpha = 1;
    },

    drawProgressBar(ctx, x, y, w, h, value, maxValue, color, bgColor = '#333') {
        ctx.fillStyle = bgColor;
        ctx.fillRect(x, y, w, h);
        const pct = Math.max(0, Math.min(1, value / maxValue));
        ctx.fillStyle = color;
        ctx.fillRect(x, y, w * pct, h);
        ctx.strokeStyle = '#222';
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, w, h);
    },

    // Draw a button (for minigame UIs)
    drawButton(ctx, x, y, w, h, text, highlighted = false) {
        ctx.fillStyle = highlighted ? '#5588cc' : '#334466';
        ctx.fillRect(x, y, w, h);
        ctx.strokeStyle = highlighted ? '#88bbff' : '#556688';
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, w, h);
        ctx.fillStyle = '#fff';
        ctx.font = '8px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, x + w/2, y + h/2);
    },
};
