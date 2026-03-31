// ============================================================
// MINIGAMES.JS — All Interactive Mini-Games (8 Epics Edition)
// ============================================================

const MinigameManager = {
    active: false,
    currentGame: null,
    result: null,
    callback: null,

    startMinigame(type, data, callback) {
        this.active = true;
        this.result = null;
        this.callback = callback || null;
        const gameMap = {
            'cooking': CookingMinigame,
            'washing': WashingMinigame,
            'petting': PettingMinigame,
            'play_dog': DogPlayMinigame,
            'play_cat': CatPlayMinigame,
            'log_jump': LogJumpMinigame,
            'hidden_animals': HiddenAnimalsMinigame,
            'grooming': WashingMinigame, // alias
            'fetch': DogPlayMinigame,    // alias
        };
        const GameClass = gameMap[type];
        if (!GameClass) { this.active = false; return; }
        this.currentGame = new GameClass(data);
        this.currentGame.init();
    },

    update(dt) {
        if (!this.active || !this.currentGame) return;
        this.currentGame.update(dt);
        if (this.currentGame.finished) {
            this.result = this.currentGame.result;
            this.active = false;
            if (this.callback) this.callback(this.result);
            this.currentGame = null;
        }
    },

    render(ctx) {
        if (!this.active || !this.currentGame) return;
        this.currentGame.render(ctx);
        // Draw intro overlay for first 2.5s
        if (this.currentGame.introTimer !== undefined && this.currentGame.introTimer < 2.5) {
            const alpha = Math.min(1, (2.5 - this.currentGame.introTimer) / 0.5);
            this._renderIntroOverlay(ctx, this.currentGame.introLines || [], alpha);
        }
    },

    _renderIntroOverlay(ctx, lines, alpha) {
        ctx.save();
        ctx.globalAlpha = alpha * 0.88;
        ctx.fillStyle = '#060616';
        ctx.fillRect(40, 90, 400, lines.length * 22 + 44);
        ctx.strokeStyle = '#5588cc';
        ctx.lineWidth = 2;
        ctx.strokeRect(40, 90, 400, lines.length * 22 + 44);
        ctx.globalAlpha = alpha;
        ctx.fillStyle = '#ffdd57';
        ctx.font = 'bold 11px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('COMMENT JOUER', 240, 108);
        ctx.fillStyle = '#ddeeff';
        ctx.font = '9px monospace';
        for (let i = 0; i < lines.length; i++) {
            ctx.fillText(lines[i], 240, 126 + i * 22);
        }
        ctx.fillStyle = 'rgba(150,170,220,0.7)';
        ctx.font = '8px monospace';
        ctx.fillText('(disparait automatiquement)', 240, 128 + lines.length * 22);
        ctx.restore();
    },

    isActive() { return this.active; }
};

// ============================================================
// EPIC 2: COOKING MINIGAME
// Go to kitchen → open fridge → select ingredient → cook → feed
// ============================================================
class CookingMinigame {
    constructor(data) {
        this.finished = false;
        this.result = { success: false, foodId: null, cooked: false };
        this.phase = 'fridge'; // fridge, cooking, done
        this.timer = 0;
        this.fridge = data.fridge || [];
        this.animalType = data.animalType || 'dog';
        this.selectedIndex = 0;
        this.selectedFood = null;
        this.cookProgress = 0;
        this.cookDuration = 3; // seconds to cook
        this.cookingActive = false;
        this.doneTimer = 0;
        this.introTimer = 0;
        this.introLines = [
            'Fleches HAUT/BAS pour choisir un ingredient',
            'Espace ou clic pour selectionner',
            'Attends que la cuisson soit terminee !',
            'Echap pour annuler',
        ];
    }

    init() {}

    update(dt) {
        this.timer += dt;
        this.introTimer += dt;

        if (this.phase === 'fridge') {
            const items = this.fridge.filter(f => f.quantity > 0);
            if (items.length === 0) {
                this.result = { success: false, foodId: null, message: 'Frigo vide !' };
                this.finished = true;
                return;
            }
            // Navigate
            if (Engine.isKeyJustPressed('ArrowUp') || Engine.isKeyJustPressed('w')) {
                this.selectedIndex = Math.max(0, this.selectedIndex - 1);
                Engine.playSound('menu');
            }
            if (Engine.isKeyJustPressed('ArrowDown') || Engine.isKeyJustPressed('s')) {
                this.selectedIndex = Math.min(items.length - 1, this.selectedIndex + 1);
                Engine.playSound('menu');
            }
            // Click/tap selection
            if (Engine.wasClicked()) {
                const mx = Engine.getMousePos().x, my = Engine.getMousePos().y;
                for (let i = 0; i < items.length; i++) {
                    const iy = 60 + i * 28;
                    if (Engine.isPointInRect(mx, my, 100, iy, 280, 24)) {
                        this.selectedIndex = i;
                        this.selectedFood = items[i].id;
                        this._startCooking();
                        return;
                    }
                }
            }
            // Keyboard select
            if (Engine.isActionPressed() && items.length > 0) {
                this.selectedFood = items[this.selectedIndex].id;
                this._startCooking();
            }
            // Cancel
            if (Engine.isCancelPressed()) {
                this.result = { success: false, foodId: null };
                this.finished = true;
            }
        }

        if (this.phase === 'cooking') {
            this.cookProgress += dt;
            // Sizzle sound periodically
            if (Math.floor(this.cookProgress * 4) !== Math.floor((this.cookProgress - dt) * 4)) {
                Engine.playSound('sizzle');
            }
            if (this.cookProgress >= this.cookDuration) {
                this.phase = 'done';
                this.doneTimer = 0;
                Engine.playSound('ding');
                // Determine the output food
                const foodData = FOOD_ITEMS[this.selectedFood];
                const outputId = (foodData && foodData.cookable) ? foodData.cookedId : this.selectedFood;
                this.result = { success: true, foodId: outputId, rawId: this.selectedFood, cooked: !!(foodData && foodData.cookable) };
            }
        }

        if (this.phase === 'done') {
            this.doneTimer += dt;
            if (Engine.isActionPressed() || this.doneTimer > 2) {
                this.finished = true;
            }
        }
    }

    _startCooking() {
        const foodData = FOOD_ITEMS[this.selectedFood];
        if (foodData && foodData.cookable) {
            this.phase = 'cooking';
            this.cookProgress = 0;
            Engine.playSound('sizzle');
        } else {
            // Not cookable, just serve raw
            this.phase = 'done';
            this.doneTimer = 0;
            this.result = { success: true, foodId: this.selectedFood, rawId: this.selectedFood, cooked: false };
            Engine.playSound('interact');
        }
    }

    render(ctx) {
        // Background
        Engine.drawRect(ctx, 0, 0, 480, 320, '#2a1a0e');

        if (this.phase === 'fridge') {
            // Fridge UI
            Engine.drawRect(ctx, 80, 20, 320, 280, '#ddeeff', 0.95);
            Engine.drawText(ctx, 'FRIGO', 240, 28, '#336', 12, 'center');
            Engine.drawText(ctx, 'Choisis un ingredient  [Fleches + Espace  ou  clic]', 240, 44, '#666', 8, 'center');

            const items = this.fridge.filter(f => f.quantity > 0);
            for (let i = 0; i < items.length && i < 8; i++) {
                const iy = 60 + i * 28;
                const isSelected = i === this.selectedIndex;
                Engine.drawRect(ctx, 100, iy, 280, 24, isSelected ? '#88bbee' : '#eef5ff');
                ctx.strokeStyle = isSelected ? '#4488cc' : '#ccddee';
                ctx.lineWidth = 1;
                ctx.strokeRect(100, iy, 280, 24);

                // Item sprite
                const sprite = SpriteManager.getItemSprite(items[i].id);
                if (sprite) PixelSprite.draw(ctx, sprite, 108, iy + 4, 2);

                const itemData = getItemData(items[i].id);
                const name = itemData ? itemData.name : items[i].id;
                Engine.drawText(ctx, name, 136, iy + 4, '#333', 8);
                Engine.drawText(ctx, 'x' + items[i].quantity, 340, iy + 4, '#666', 8);

                if (itemData && itemData.cookable) {
                    Engine.drawText(ctx, '[cuisable]', 260, iy + 14, '#cc6600', 7);
                }
            }

            Engine.drawText(ctx, 'Espace/Tap: Choisir  |  Echap: Retour', 240, 295, '#888', 7, 'center');
        }

        if (this.phase === 'cooking') {
            Engine.drawText(ctx, 'CUISINE EN COURS...', 240, 100, '#ffdd00', 12, 'center');
            // Stove animation
            const flicker = Math.sin(this.timer * 10) * 0.3;
            Engine.drawRect(ctx, 160, 140, 160, 60, '#333');
            Engine.drawRect(ctx, 170, 145, 140, 50, '#555');
            // Flames
            for (let i = 0; i < 5; i++) {
                const fx = 190 + i * 25;
                const fh = 15 + Math.sin(this.timer * 8 + i) * 8;
                Engine.drawRect(ctx, fx, 145 - fh, 10, fh, `rgba(255,${100 + Math.floor(flicker * 50)},0,0.8)`);
            }
            // Progress bar
            Engine.drawProgressBar(ctx, 140, 220, 200, 16, this.cookProgress, this.cookDuration, '#ff8800');
            Engine.drawText(ctx, Math.ceil(this.cookDuration - this.cookProgress) + 's', 240, 240, '#fff', 8, 'center');

            // Food sprite on stove
            const sprite = SpriteManager.getItemSprite(this.selectedFood);
            if (sprite) PixelSprite.draw(ctx, sprite, 228, 155, 3);
        }

        if (this.phase === 'done') {
            const foodData = getItemData(this.result.foodId);
            const name = foodData ? foodData.name : this.result.foodId;
            Engine.drawText(ctx, this.result.cooked ? 'C\'est pret !' : 'Pret a servir !', 240, 120, '#ffdd00', 12, 'center');
            Engine.drawText(ctx, name, 240, 150, '#fff', 10, 'center');

            const sprite = SpriteManager.getItemSprite(this.result.foodId);
            if (sprite) PixelSprite.draw(ctx, sprite, 224, 170, 4);

            Engine.drawText(ctx, 'Appuie pour continuer', 240, 260, '#aaa', 8, 'center');
        }
    }
}

// ============================================================
// EPIC 6: WASHING MINIGAME
// 4 phases: soap → rinse → towel → blow-dry
// ============================================================
class WashingMinigame {
    constructor(data) {
        this.finished = false;
        this.result = { success: false, score: 0 };
        this.animalType = data.animalType || 'dog';
        this.phase = 'soap'; // soap, rinse, towel, dryer, done
        this.timer = 0;

        // Zones to clean (6 body zones)
        this.zones = [
            { x: 200, y: 100, w: 40, h: 40, label: 'Tete' },
            { x: 180, y: 150, w: 60, h: 40, label: 'Corps' },
            { x: 250, y: 150, w: 40, h: 30, label: 'Queue' },
            { x: 170, y: 200, w: 30, h: 30, label: 'Patte G' },
            { x: 220, y: 200, w: 30, h: 30, label: 'Patte D' },
            { x: 260, y: 200, w: 30, h: 30, label: 'Ventre' },
        ];
        // Progress per zone per phase
        this.soapProgress = new Array(6).fill(0);
        this.dryProgress = new Array(6).fill(0);
        this.towelProgress = new Array(6).fill(0);
        this.rinseProgress = 0;
        this.phaseComplete = false;
        this.scrubTimer = 0;
        this.introTimer = 0;
        this.introLines = [
            'Phase 1 - SAVON : Glisse la souris sur chaque zone',
            'Phase 2 - DOUCHE : Clique sur la pomme de douche',
            'Phase 3 - SERVIETTE : Glisse sur chaque zone mouillée',
            'Phase 4 - SECHOIR : Clique sur les zones humides',
        ];
    }

    init() {}

    update(dt) {
        this.timer += dt;
        this.introTimer += dt;

        if (this.phase === 'soap') {
            // Drag soap across zones
            if (Engine.isMouseDown()) {
                const mp = Engine.getMousePos();
                for (let i = 0; i < this.zones.length; i++) {
                    const z = this.zones[i];
                    if (Engine.isPointInRect(mp.x, mp.y, z.x, z.y, z.w, z.h)) {
                        this.soapProgress[i] = Math.min(1, this.soapProgress[i] + dt * 1.5);
                        this.scrubTimer += dt;
                        if (this.scrubTimer > 0.2) {
                            Engine.playSound('scrub');
                            Engine.addParticleAt(mp.x, mp.y, 'bubble', 2);
                            this.scrubTimer = 0;
                        }
                    }
                }
            }
            if (this.soapProgress.every(p => p >= 0.95)) {
                this.phase = 'rinse';
                this.scrubTimer = 0;
                Engine.playSound('splash');
            }
        }

        if (this.phase === 'rinse') {
            // Tap shower handle to rinse
            if (Engine.wasClicked()) {
                const mp = Engine.getMousePos();
                // Shower handle area
                if (Engine.isPointInRect(mp.x, mp.y, 350, 60, 50, 50)) {
                    this.rinseProgress = Math.min(1, this.rinseProgress + 0.25);
                    Engine.playSound('splash');
                    // Water particles
                    for (let i = 0; i < 10; i++) {
                        Engine.addParticleAt(200 + Math.random() * 80, 80, 'bubble', 1);
                    }
                }
            }
            if (this.rinseProgress >= 1) {
                this.phase = 'towel';
                Engine.playSound('interact');
            }
        }

        if (this.phase === 'towel') {
            if (Engine.isMouseDown()) {
                const mp = Engine.getMousePos();
                for (let i = 0; i < this.zones.length; i++) {
                    const z = this.zones[i];
                    if (Engine.isPointInRect(mp.x, mp.y, z.x, z.y, z.w, z.h)) {
                        this.towelProgress[i] = Math.min(1, this.towelProgress[i] + dt * 2);
                        this.scrubTimer += dt;
                        if (this.scrubTimer > 0.15) {
                            this.scrubTimer = 0;
                        }
                    }
                }
            }
            if (this.towelProgress.every(p => p >= 0.9)) {
                this.phase = 'dryer';
            }
        }

        if (this.phase === 'dryer') {
            // Click on wet spots (zones) to dry them
            if (Engine.wasClicked()) {
                const mp = Engine.getMousePos();
                for (let i = 0; i < this.zones.length; i++) {
                    const z = this.zones[i];
                    if (Engine.isPointInRect(mp.x, mp.y, z.x, z.y, z.w, z.h)) {
                        this.dryProgress[i] = Math.min(1, this.dryProgress[i] + 0.35);
                        Engine.playSound('hairdryer');
                        Engine.addParticleAt(mp.x, mp.y, 'steam', 3);
                    }
                }
            }
            if (this.dryProgress.every(p => p >= 0.95)) {
                this.phase = 'done';
                this.result = { success: true, score: 100 };
                Engine.playSound('happy');
                // Rainbow celebration!
                for (let i = 0; i < 3; i++) {
                    Engine.addParticleAt(240, 160, 'rainbow', 8);
                }
            }
        }

        if (this.phase === 'done') {
            if (Engine.isActionPressed() || (this.timer > 2 && Engine.wasClicked())) {
                this.finished = true;
            }
        }

        // Cancel at any point
        if (Engine.isCancelPressed() && this.phase !== 'done') {
            this.result = { success: false, score: 0 };
            this.finished = true;
        }
    }

    render(ctx) {
        // Background: bathroom
        Engine.drawRect(ctx, 0, 0, 480, 320, '#ddeeff');
        // Floor tiles
        for (let x = 0; x < 480; x += 32) for (let y = 240; y < 320; y += 32) {
            Engine.drawRect(ctx, x, y, 30, 30, (Math.floor(x/32) + Math.floor(y/32)) % 2 === 0 ? '#bbddee' : '#aaccdd');
        }

        // Phase title + hint
        const titles = { soap: 'Savonne l\'animal !', rinse: 'Rince sous la douche !', towel: 'Frotte avec la serviette !', dryer: 'Seche les parties mouillees !', done: 'Tout propre !' };
        const hints  = { soap: 'Glisse la souris sur chaque zone coloree', rinse: 'Clique sur la pomme de douche', towel: 'Glisse la souris sur les zones mouillees', dryer: 'Clique sur les zones encore humides', done: 'Bravo !' };
        Engine.drawText(ctx, titles[this.phase], 240, 12, '#336', 10, 'center');
        Engine.drawText(ctx, hints[this.phase], 240, 26, '#558', 8, 'center');

        // Draw animal body outline (simplified)
        Engine.drawRect(ctx, 175, 85, 110, 150, '#ddd', 0.3);
        ctx.strokeStyle = '#888';
        ctx.lineWidth = 2;
        ctx.strokeRect(175, 85, 110, 150);

        // Draw zones
        for (let i = 0; i < this.zones.length; i++) {
            const z = this.zones[i];
            let color = '#aaa';
            let alpha = 0.6;

            if (this.phase === 'soap') {
                const mudAlpha = 1 - this.soapProgress[i];
                Engine.drawRect(ctx, z.x, z.y, z.w, z.h, '#8B4513', mudAlpha * 0.7);
                if (this.soapProgress[i] > 0) {
                    Engine.drawRect(ctx, z.x, z.y, z.w, z.h, '#aaddff', this.soapProgress[i] * 0.5);
                }
            } else if (this.phase === 'rinse') {
                Engine.drawRect(ctx, z.x, z.y, z.w, z.h, '#aaddff', 0.4);
            } else if (this.phase === 'towel') {
                const wetAlpha = 1 - this.towelProgress[i];
                Engine.drawRect(ctx, z.x, z.y, z.w, z.h, '#66aadd', wetAlpha * 0.5);
            } else if (this.phase === 'dryer') {
                const wetAlpha = 1 - this.dryProgress[i];
                if (wetAlpha > 0.1) {
                    Engine.drawRect(ctx, z.x, z.y, z.w, z.h, '#88ccee', wetAlpha * 0.6);
                    // Highlight wet spots
                    ctx.strokeStyle = '#4488cc';
                    ctx.lineWidth = 1;
                    ctx.strokeRect(z.x, z.y, z.w, z.h);
                }
            }

            // Zone label
            Engine.drawText(ctx, z.label, z.x + z.w/2, z.y + z.h + 2, '#666', 6, 'center');
        }

        // Draw animal sprite (centered, large)
        const animalSprite = SpriteManager.getAnimalSprite(this.animalType, Engine.animFrame);
        if (animalSprite) PixelSprite.draw(ctx, animalSprite, 212, 130, 4);

        // Phase-specific UI
        if (this.phase === 'rinse') {
            // Shower handle button
            Engine.drawRect(ctx, 350, 60, 50, 50, '#888');
            Engine.drawRect(ctx, 355, 65, 40, 40, '#aaa');
            Engine.drawText(ctx, 'DOUCHE', 375, 75, '#333', 7, 'center');
            Engine.drawText(ctx, 'Tap!', 375, 90, '#336', 8, 'center');
            Engine.drawProgressBar(ctx, 350, 115, 50, 8, this.rinseProgress, 1, '#4488cc');
        }

        // Phase progress
        if (this.phase === 'soap') {
            const avg = this.soapProgress.reduce((a,b) => a+b, 0) / 6;
            Engine.drawProgressBar(ctx, 140, 290, 200, 10, avg, 1, '#88bbee');
            Engine.drawText(ctx, 'Frotte partout !', 240, 275, '#666', 7, 'center');
        }
        if (this.phase === 'towel') {
            const avg = this.towelProgress.reduce((a,b) => a+b, 0) / 6;
            Engine.drawProgressBar(ctx, 140, 290, 200, 10, avg, 1, '#ffaacc');
        }
        if (this.phase === 'dryer') {
            const avg = this.dryProgress.reduce((a,b) => a+b, 0) / 6;
            Engine.drawProgressBar(ctx, 140, 290, 200, 10, avg, 1, '#ffdd88');
        }

        if (this.phase === 'done') {
            Engine.drawText(ctx, 'TOUT PROPRE !', 240, 260, '#44aa44', 14, 'center');
            // Sparkle particles are rendered by engine
        }

        // Render particles on top
        Engine.renderParticlesAbsolute(ctx);
    }
}

// ============================================================
// EPIC 4: PETTING MINIGAME
// Stroke the animal with mouse/touch drag → hearts + rainbow
// ============================================================
class PettingMinigame {
    constructor(data) {
        this.finished = false;
        this.result = { success: false, score: 0 };
        this.animalType = data.animalType || 'dog';
        this.timer = 0;
        this.strokeCount = 0;
        this.strokeTarget = 15; // strokes needed
        this.lastStrokeY = -1;
        this.happiness = 0;
        this.pawsTimer = 0;
        this.jumpTimer = 0;
        this.jumping = false;
        this.doneTimer = 0;
        this.introTimer = 0;
        this.introLines = [
            'Maintiens le clic gauche enfonce',
            'Glisse la souris de haut en bas sur l\'animal',
            'Fais ' + this.strokeTarget + ' caresses pour rendre l\'animal heureux !',
        ];
    }

    init() {}

    update(dt) {
        this.timer += dt;
        this.pawsTimer += dt;
        this.introTimer += dt;

        // Track stroking: dragging across the animal area
        if (Engine.isDragging() && Engine.isMouseDown()) {
            const mp = Engine.getMousePos();
            // Animal area: roughly center of screen
            if (Engine.isPointInRect(mp.x, mp.y, 160, 80, 160, 160)) {
                // Count as stroke when moving vertically
                const dy = mp.y - this.lastStrokeY;
                if (Math.abs(dy) > 15) {
                    this.strokeCount++;
                    this.happiness = Math.min(1, this.strokeCount / this.strokeTarget);
                    this.lastStrokeY = mp.y;

                    // Heart particles
                    Engine.addParticleAt(mp.x, mp.y, 'love', 3);

                    // Purr sound occasionally
                    if (this.strokeCount % 3 === 0) {
                        Engine.playSound('purr');
                    }
                }
            }
        } else {
            this.lastStrokeY = Engine.getMousePos().y;
        }

        // Check completion
        if (this.strokeCount >= this.strokeTarget && !this.jumping) {
            this.jumping = true;
            this.jumpTimer = 0;
            Engine.playSound('happy');
            // Rainbow burst!
            for (let i = 0; i < 5; i++) {
                Engine.addParticleAt(240 + (Math.random()-0.5)*80, 160, 'rainbow', 6);
                Engine.addParticleAt(240 + (Math.random()-0.5)*80, 160, 'glitter', 4);
            }
        }

        if (this.jumping) {
            this.jumpTimer += dt;
            if (this.jumpTimer > 2.5) {
                this.result = { success: true, score: this.strokeCount };
                this.finished = true;
            }
        }

        if (Engine.isCancelPressed()) {
            this.result = { success: this.strokeCount > 5, score: this.strokeCount };
            this.finished = true;
        }
    }

    render(ctx) {
        // Soft background
        Engine.drawRect(ctx, 0, 0, 480, 320, '#fff5f0');

        Engine.drawText(ctx, 'Caresse l\'animal !', 240, 12, '#cc6688', 10, 'center');
        Engine.drawText(ctx, 'Clic maintenu + glisse la souris de haut en bas', 240, 26, '#bb5577', 8, 'center');

        // Paws on glass effect (pulsing)
        const pawAlpha = 0.3 + Math.sin(this.pawsTimer * 3) * 0.15;
        // Left paw
        Engine.drawRect(ctx, 130, 200, 20, 25, `rgba(180,140,100,${pawAlpha})`);
        Engine.drawRect(ctx, 132, 188, 8, 12, `rgba(180,140,100,${pawAlpha})`);
        Engine.drawRect(ctx, 142, 188, 8, 12, `rgba(180,140,100,${pawAlpha})`);
        // Right paw
        Engine.drawRect(ctx, 330, 200, 20, 25, `rgba(180,140,100,${pawAlpha})`);
        Engine.drawRect(ctx, 332, 188, 8, 12, `rgba(180,140,100,${pawAlpha})`);
        Engine.drawRect(ctx, 342, 188, 8, 12, `rgba(180,140,100,${pawAlpha})`);

        // Animal (large, centered)
        const animalSprite = SpriteManager.getAnimalSprite(this.animalType, Engine.animFrame);
        let animalY = 110;
        if (this.jumping) {
            animalY -= Math.abs(Math.sin(this.jumpTimer * 6)) * 30;
        }
        if (animalSprite) PixelSprite.draw(ctx, animalSprite, 208, animalY, 5);

        // Happiness bar
        Engine.drawProgressBar(ctx, 140, 280, 200, 12, this.happiness, 1, '#ff69b4');
        Engine.drawText(ctx, 'Bonheur', 240, 295, '#cc6688', 8, 'center');

        // Stroke counter
        Engine.drawText(ctx, `${this.strokeCount}/${this.strokeTarget} caresses`, 240, 50, '#aa6688', 8, 'center');

        if (this.jumping) {
            Engine.drawText(ctx, 'SUPER CONTENT !', 240, 70, '#ff1493', 12, 'center');
        }

        Engine.renderParticlesAbsolute(ctx);
    }
}

// ============================================================
// EPIC 7: DOG PLAY MINIGAME (Throw ball)
// Hold space → power bar → throw → dog fetches
// ============================================================
class DogPlayMinigame {
    constructor(data) {
        this.finished = false;
        this.result = { success: false, score: 0 };
        this.animalType = data.animalType || 'dog';
        this.phase = 'ready'; // ready, countdown, charging, throwing, fetching, returning, done
        this.timer = 0;
        this.countdownNum = 3;
        this.power = 0;
        this.powerDir = 1;
        this.ballX = 100;
        this.ballY = 200;
        this.throwDist = 0;
        this.dogX = 100;
        this.dogTargetX = 100;
        this.fetchCount = 0;
        this.maxFetches = 5;
        this.timeLimit = 30;
        this.totalTime = 0;
        this.introTimer = 0;
        this.introLines = [
            'Maintiens ESPACE enfonce pour charger le lancer',
            'Relache ESPACE quand la barre de puissance est pleine',
            'Le chien va chercher la balle et la rapporte !',
            'Objectif : ' + this.maxFetches + ' lancers en ' + this.timeLimit + ' secondes',
        ];
    }

    init() { this.phase = 'countdown'; this.countdownNum = 3; this.timer = 0; this.introTimer = 0; }

    update(dt) {
        this.timer += dt;
        this.totalTime += dt;
        this.introTimer += dt;

        if (this.totalTime > this.timeLimit && this.phase !== 'done') {
            this.phase = 'done';
            this.result = { success: this.fetchCount >= 3, score: this.fetchCount };
            Engine.playSound(this.fetchCount >= 3 ? 'happy' : 'error');
        }

        if (this.phase === 'countdown') {
            if (this.timer > 1) {
                this.timer = 0;
                this.countdownNum--;
                if (this.countdownNum <= 0) {
                    this.phase = 'charging';
                    this.power = 0;
                }
            }
        }

        if (this.phase === 'charging') {
            // Power bar oscillates
            this.power += this.powerDir * dt * 2;
            if (this.power >= 1) { this.power = 1; this.powerDir = -1; }
            if (this.power <= 0) { this.power = 0; this.powerDir = 1; }

            if (Engine.isActionPressed() || Engine.wasClicked()) {
                this.throwDist = 50 + this.power * 280;
                this.ballX = 100;
                this.ballY = 200;
                this.phase = 'throwing';
                Engine.playSound('jump');
            }
        }

        if (this.phase === 'throwing') {
            this.ballX += dt * 400;
            this.ballY = 200 - Math.sin((this.ballX - 100) / this.throwDist * Math.PI) * 80;
            if (this.ballX >= 100 + this.throwDist) {
                this.ballX = 100 + this.throwDist;
                this.ballY = 200;
                this.phase = 'fetching';
                this.dogTargetX = this.ballX;
                Engine.playSound('bark');
            }
        }

        if (this.phase === 'fetching') {
            this.dogX += (this.dogTargetX - this.dogX) * dt * 3;
            if (Math.abs(this.dogX - this.dogTargetX) < 5) {
                this.phase = 'returning';
                this.dogTargetX = 100;
                Engine.playSound('happy');
            }
        }

        if (this.phase === 'returning') {
            this.dogX += (this.dogTargetX - this.dogX) * dt * 3;
            this.ballX = this.dogX + 10;
            if (Math.abs(this.dogX - 100) < 5) {
                this.fetchCount++;
                Engine.addParticleAt(120, 190, 'heart', 5);
                if (this.fetchCount >= this.maxFetches) {
                    this.phase = 'done';
                    this.result = { success: true, score: this.fetchCount };
                    Engine.playSound('quest');
                } else {
                    this.phase = 'charging';
                    this.power = 0;
                    this.powerDir = 1;
                    this.dogX = 100;
                }
            }
        }

        if (this.phase === 'done') {
            if (Engine.isActionPressed()) this.finished = true;
        }

        if (Engine.isCancelPressed() && this.phase === 'done') this.finished = true;
    }

    render(ctx) {
        // Park background
        Engine.drawRect(ctx, 0, 0, 480, 210, '#88ccee');
        Engine.drawRect(ctx, 0, 210, 480, 110, '#55aa44');
        // Trees
        Engine.drawRect(ctx, 20, 160, 15, 50, '#886633');
        Engine.drawRect(ctx, 5, 130, 45, 40, '#338833');
        Engine.drawRect(ctx, 420, 170, 12, 40, '#886633');
        Engine.drawRect(ctx, 407, 140, 38, 35, '#448844');

        // HUD
        Engine.drawText(ctx, `Lancers: ${this.fetchCount}/${this.maxFetches}`, 10, 10, '#fff', 8);
        Engine.drawText(ctx, `Temps: ${Math.ceil(this.timeLimit - this.totalTime)}s`, 400, 10, '#fff', 8);

        if (this.phase === 'countdown') {
            Engine.drawText(ctx, this.countdownNum.toString(), 240, 130, '#fff', 24, 'center');
        }

        if (this.phase === 'ready' || this.phase === 'countdown') {
            Engine.drawText(ctx, 'Appuie sur ESPACE pour lancer la balle !', 240, 30, '#fff', 8, 'center');
        }
        if (this.phase === 'charging') {
            Engine.drawText(ctx, 'Maintiens ESPACE... relache au bon moment !', 240, 30, '#ffdd00', 8, 'center');
            // Power bar
            Engine.drawProgressBar(ctx, 60, 260, 200, 16, this.power, 1, '#ff8800');
            Engine.drawText(ctx, 'Puissance', 170, 280, '#fff', 7, 'center');
            // Sweet spot indicator
            const sweetX = 60 + 0.7 * 200;
            Engine.drawRect(ctx, sweetX - 2, 258, 4, 20, '#00ff00');
            Engine.drawText(ctx, '|ideal', sweetX + 4, 259, '#00ff00', 6);
        }

        // Draw dog
        const dogSprite = SpriteManager.getAnimalSprite(this.animalType, Engine.animFrame);
        if (dogSprite) PixelSprite.draw(ctx, dogSprite, this.dogX - 8, 192, 2);

        // Draw ball
        if (this.phase !== 'ready' && this.phase !== 'countdown') {
            Engine.drawRect(ctx, this.ballX - 3, this.ballY - 3, 6, 6, '#cc4444');
            Engine.drawRect(ctx, this.ballX - 2, this.ballY - 2, 2, 2, '#ff8888');
        }

        // Player
        const playerSprite = SpriteManager.getPlayerSprite(Game.state ? Game.state.playerGender : 'boy', 'right', 0);
        if (playerSprite) PixelSprite.draw(ctx, playerSprite, 70, 192, 2);

        if (this.phase === 'done') {
            Engine.drawRect(ctx, 100, 80, 280, 100, '#000', 0.7);
            Engine.drawText(ctx, this.fetchCount >= 3 ? 'BRAVO !' : 'Pas mal !', 240, 100, '#ffdd00', 14, 'center');
            Engine.drawText(ctx, `${this.fetchCount} lancers reussis`, 240, 130, '#fff', 10, 'center');
            Engine.drawText(ctx, 'Appuie pour continuer', 240, 160, '#aaa', 8, 'center');
        }

        Engine.renderParticlesAbsolute(ctx);
    }
}

// ============================================================
// EPIC 7: CAT PLAY MINIGAME (Follow yarn)
// Player moves, cat follows, cat jumps to catch
// ============================================================
class CatPlayMinigame {
    constructor(data) {
        this.finished = false;
        this.result = { success: false, score: 0 };
        this.animalType = data.animalType || 'cat';
        this.timer = 0;
        this.playerX = 240; this.playerY = 200;
        this.catX = 200; this.catY = 200;
        this.catVX = 0; this.catVY = 0;
        this.catchCount = 0;
        this.catchTarget = 5;
        this.playerStopped = false;
        this.stopTimer = 0;
        this.catJumping = false;
        this.catJumpTimer = 0;
        this.distanceMoved = 0;
        this.timeLimit = 25;
        this.phase = 'playing'; // playing, done
        this.introTimer = 0;
        this.introLines = [
            'Utilise les FLECHES pour deplacer la pelote de laine',
            'Le chat te suivra automatiquement',
            'ARRETE-TOI pour que le chat saute dessus !',
            'Objectif : ' + this.catchTarget + ' attrapes en ' + this.timeLimit + ' secondes',
        ];
    }

    init() {}

    update(dt) {
        this.timer += dt;
        this.introTimer += dt;

        if (this.timer > this.timeLimit && this.phase !== 'done') {
            this.phase = 'done';
            this.result = { success: this.catchCount >= 3, score: this.catchCount };
        }

        if (this.phase === 'playing') {
            // Player movement
            const input = Engine.getMovementInput();
            const speed = 80;
            const moved = input.dx !== 0 || input.dy !== 0;

            if (moved) {
                this.playerX = Math.max(20, Math.min(460, this.playerX + input.dx * speed * dt));
                this.playerY = Math.max(80, Math.min(280, this.playerY + input.dy * speed * dt));
                this.distanceMoved += speed * dt;
                this.playerStopped = false;
                this.stopTimer = 0;
            } else {
                if (!this.playerStopped) {
                    this.playerStopped = true;
                    this.stopTimer = 0;
                }
                this.stopTimer += dt;
            }

            // Cat follows player with delay
            if (!this.catJumping) {
                const dx = this.playerX - this.catX;
                const dy = this.playerY - this.catY;
                const dist = Math.hypot(dx, dy);
                if (dist > 30) {
                    this.catX += dx * dt * 2;
                    this.catY += dy * dt * 2;
                }
            }

            // Cat jumps to catch when player stops
            if (this.playerStopped && this.stopTimer > 0.5 && !this.catJumping) {
                const dx = this.playerX - this.catX;
                const dy = this.playerY - this.catY;
                const dist = Math.hypot(dx, dy);
                if (dist < 60) {
                    this.catJumping = true;
                    this.catJumpTimer = 0;
                    Engine.playSound('jump');
                }
            }

            // Cat jump animation
            if (this.catJumping) {
                this.catJumpTimer += dt;
                this.catX += (this.playerX - this.catX) * dt * 5;
                this.catY += (this.playerY - this.catY) * dt * 5;

                if (this.catJumpTimer > 0.5) {
                    this.catJumping = false;
                    this.catchCount++;
                    Engine.playSound('happy');
                    Engine.addParticleAt(this.catX, this.catY, 'heart', 5);

                    if (this.catchCount >= this.catchTarget) {
                        this.phase = 'done';
                        this.result = { success: true, score: this.catchCount };
                        Engine.playSound('quest');
                    }
                }
            }
        }

        if (this.phase === 'done') {
            if (Engine.isActionPressed()) this.finished = true;
        }
        if (Engine.isCancelPressed() && this.phase === 'done') this.finished = true;
    }

    render(ctx) {
        // Room background
        Engine.drawRect(ctx, 0, 0, 480, 320, '#f5eed5');
        Engine.drawRect(ctx, 0, 260, 480, 60, '#ddcc99');

        // HUD
        Engine.drawText(ctx, `Attrapes: ${this.catchCount}/${this.catchTarget}`, 10, 10, '#663', 8);
        Engine.drawText(ctx, `Temps: ${Math.ceil(this.timeLimit - this.timer)}s`, 400, 10, '#663', 8);
        Engine.drawText(ctx, 'Fleches pour bouger la pelote — arrete-toi pour que le chat saute !', 240, 30, '#996', 8, 'center');

        // Yarn trail
        if (this.distanceMoved > 10) {
            ctx.strokeStyle = '#ee4488';
            ctx.lineWidth = 2;
            ctx.setLineDash([4, 4]);
            ctx.beginPath();
            ctx.moveTo(this.playerX, this.playerY);
            ctx.lineTo(this.catX, this.catY);
            ctx.stroke();
            ctx.setLineDash([]);
        }

        // Player with yarn
        const playerSprite = SpriteManager.getPlayerSprite(Game.state ? Game.state.playerGender : 'boy', 'down', Engine.animFrame);
        if (playerSprite) PixelSprite.draw(ctx, playerSprite, this.playerX - 8, this.playerY - 8, 2);
        // Yarn ball in hand
        Engine.drawRect(ctx, this.playerX + 10, this.playerY - 5, 6, 6, '#ee4488');

        // Cat
        let catDrawY = this.catY - 8;
        if (this.catJumping) {
            catDrawY -= Math.sin(this.catJumpTimer / 0.5 * Math.PI) * 25;
        }
        const catSprite = SpriteManager.getAnimalSprite(this.animalType, Engine.animFrame);
        if (catSprite) PixelSprite.draw(ctx, catSprite, this.catX - 8, catDrawY, 2);

        if (this.phase === 'done') {
            Engine.drawRect(ctx, 100, 80, 280, 100, '#000', 0.7);
            Engine.drawText(ctx, this.catchCount >= 3 ? 'BRAVO !' : 'Bien joue !', 240, 100, '#ffdd00', 14, 'center');
            Engine.drawText(ctx, `${this.catchCount} attrapes`, 240, 130, '#fff', 10, 'center');
            Engine.drawText(ctx, 'Appuie pour continuer', 240, 160, '#aaa', 8, 'center');
        }

        Engine.renderParticlesAbsolute(ctx);
    }
}

// ============================================================
// EPIC 8A: LOG JUMP MINIGAME
// Side-scrolling platformer, jump on logs/leaves, collect petals
// ============================================================
class LogJumpMinigame {
    constructor(data) {
        this.finished = false;
        this.result = { success: false, score: 0, coins: 0 };
        this.timer = 0;
        this.phase = 'playing'; // playing, dead, done

        // Player
        this.px = 60; this.py = 180;
        this.pvy = 0;
        this.onPlatform = -1;
        this.grounded = false;

        // Platforms (logs/leaves)
        this.platforms = [];
        this.scrollX = 0;
        this.scrollSpeed = 40;
        this.spawnTimer = 0;

        // Petals & power-ups
        this.petals = 0;
        this.totalPetals = 0;
        this.flowers = 0;
        this.activePowerup = null;
        this.powerupTimer = 0;
        this.distance = 0;

        // Joker (respawn)
        this.hasJoker = false;
        this.deathX = 0;
        this.deathY = 0;

        this._generateInitialPlatforms();
    }

    init() {}

    _generateInitialPlatforms() {
        let x = 40;
        for (let i = 0; i < 12; i++) {
            x += 30 + Math.random() * 40;
            this.platforms.push(this._makePlatform(x, 150 + Math.random() * 80));
        }
    }

    _makePlatform(x, y) {
        const types = ['log', 'leaf', 'wilted'];
        const type = types[Math.floor(Math.random() * types.length)];
        return {
            x, y, w: type === 'log' ? 40 : 30, h: 10,
            type, // log=stable, leaf=small+bends, wilted=collapses
            life: type === 'wilted' ? 1.5 : 999, // wilted collapses after 1.5s of standing
            standTimer: 0,
            hasPetal: Math.random() < 0.4,
            petalCollected: false,
            collapsed: false,
        };
    }

    update(dt) {
        this.timer += dt;

        if (this.phase === 'playing') {
            this.distance += this.scrollSpeed * dt;

            // Jump
            if ((Engine.isActionPressed() || Engine.wasClicked()) && this.grounded) {
                const jumpPower = this.activePowerup === 'rocket' ? -220 : -160;
                this.pvy = jumpPower;
                this.grounded = false;
                Engine.playSound('jump');
            }

            // Gravity
            this.pvy += 400 * dt;
            this.py += this.pvy * dt;

            // Scroll
            this.scrollX += this.scrollSpeed * dt;

            // Platform collision
            this.grounded = false;
            for (const p of this.platforms) {
                if (p.collapsed) continue;
                const platScreenX = p.x - this.scrollX;
                if (this.px + 8 > platScreenX && this.px - 8 < platScreenX + p.w &&
                    this.py + 16 >= p.y && this.py + 16 <= p.y + 12 && this.pvy >= 0) {
                    this.py = p.y - 16;
                    this.pvy = 0;
                    this.grounded = true;
                    this.onPlatform = p;

                    // Stand timer for wilted leaves
                    if (p.type === 'wilted') {
                        p.standTimer += dt;
                        if (p.standTimer >= p.life) {
                            p.collapsed = true;
                            this.grounded = false;
                        }
                    }

                    // Collect petal
                    if (p.hasPetal && !p.petalCollected) {
                        p.petalCollected = true;
                        this.petals++;
                        this.totalPetals++;
                        Engine.playSound('coin');
                        Engine.addParticleAt(this.px, this.py, 'sparkle', 3);

                        // Magnet power-up: collect nearby petals
                        if (this.activePowerup === 'magnet') {
                            for (const p2 of this.platforms) {
                                if (p2.hasPetal && !p2.petalCollected) {
                                    const d = Math.abs((p2.x - this.scrollX) - this.px);
                                    if (d < 100) {
                                        p2.petalCollected = true;
                                        this.petals++;
                                        this.totalPetals++;
                                    }
                                }
                            }
                        }

                        // 4 petals = flower = power-up choice
                        if (this.petals >= 4) {
                            this.petals -= 4;
                            this.flowers++;
                            this.hasJoker = true;
                            // Random power-up
                            const powers = ['magnet', 'rocket', 'freeze'];
                            this.activePowerup = powers[Math.floor(Math.random() * powers.length)];
                            this.powerupTimer = 8; // 8 seconds
                            Engine.playSound('powerup');
                            Engine.addParticleAt(this.px, this.py, 'rainbow', 10);
                        }
                    }
                    break;
                }
            }

            // Power-up timer
            if (this.activePowerup) {
                this.powerupTimer -= dt;
                if (this.activePowerup === 'freeze') {
                    // Freeze: wilted leaves don't collapse
                    for (const p of this.platforms) {
                        if (p.type === 'wilted') p.standTimer = 0;
                    }
                }
                if (this.powerupTimer <= 0) this.activePowerup = null;
            }

            // Spawn new platforms
            this.spawnTimer += dt;
            if (this.spawnTimer > 0.8) {
                this.spawnTimer = 0;
                const lastP = this.platforms[this.platforms.length - 1];
                const newX = lastP.x + 30 + Math.random() * 50;
                this.platforms.push(this._makePlatform(newX, 140 + Math.random() * 90));
            }

            // Remove off-screen platforms
            this.platforms = this.platforms.filter(p => p.x - this.scrollX > -60);

            // Fall death
            if (this.py > 340) {
                if (this.hasJoker) {
                    this.hasJoker = false;
                    // Respawn on nearest platform
                    let nearest = this.platforms.find(p => !p.collapsed && p.x - this.scrollX > 40);
                    if (nearest) {
                        this.px = nearest.x - this.scrollX;
                        this.py = nearest.y - 20;
                        this.pvy = 0;
                        Engine.playSound('powerup');
                    } else {
                        this.phase = 'dead';
                    }
                } else {
                    this.phase = 'dead';
                    Engine.playSound('fall');
                }
            }
        }

        if (this.phase === 'dead') {
            this.phase = 'done';
            const coins = Math.floor(this.distance / 50) + this.totalPetals * 2;
            this.result = { success: true, score: Math.floor(this.distance), coins: coins };
        }

        if (this.phase === 'done') {
            if (Engine.isActionPressed() || Engine.wasClicked()) this.finished = true;
        }
    }

    render(ctx) {
        // Sky
        Engine.drawRect(ctx, 0, 0, 480, 200, '#87CEEB');
        // Water
        Engine.drawRect(ctx, 0, 200, 480, 120, '#4488cc');
        // Water ripples
        for (let i = 0; i < 10; i++) {
            const rx = ((i * 53 + this.timer * 20) % 500) - 10;
            Engine.drawRect(ctx, rx, 210 + Math.sin(this.timer * 2 + i) * 3, 30, 2, '#66aadd');
        }

        // Platforms
        for (const p of this.platforms) {
            if (p.collapsed) continue;
            const sx = p.x - this.scrollX;
            if (sx < -50 || sx > 500) continue;

            let color = '#886633'; // log
            if (p.type === 'leaf') color = '#55aa44';
            if (p.type === 'wilted') {
                const fade = p.standTimer / p.life;
                color = `rgb(${130 + fade*80}, ${100 - fade*60}, ${50})`;
            }
            Engine.drawRect(ctx, sx, p.y, p.w, p.h, color);

            // Petal on platform
            if (p.hasPetal && !p.petalCollected) {
                const petalY = p.y - 10 + Math.sin(this.timer * 3) * 3;
                Engine.drawRect(ctx, sx + p.w/2 - 3, petalY, 6, 6, '#ff88aa');
                Engine.drawRect(ctx, sx + p.w/2 - 2, petalY + 1, 4, 4, '#ffaacc');
            }
        }

        // Player
        if (this.phase === 'playing') {
            Engine.drawRect(ctx, this.px - 6, this.py, 12, 16, '#4488cc');
            Engine.drawRect(ctx, this.px - 4, this.py + 2, 8, 6, '#ffd5a0');
            Engine.drawRect(ctx, this.px - 2, this.py + 4, 2, 2, '#222');
            Engine.drawRect(ctx, this.px + 2, this.py + 4, 2, 2, '#222');
        }

        // HUD
        Engine.drawRect(ctx, 0, 0, 480, 25, '#000', 0.5);
        Engine.drawText(ctx, `Distance: ${Math.floor(this.distance)}m`, 10, 5, '#fff', 8);
        Engine.drawText(ctx, `Petales: ${this.petals}/4`, 150, 5, '#ffaacc', 8);
        Engine.drawText(ctx, `Fleurs: ${this.flowers}`, 260, 5, '#ff88aa', 8);
        if (this.hasJoker) Engine.drawText(ctx, 'JOKER!', 360, 5, '#ffdd00', 8);
        if (this.activePowerup) {
            const names = { magnet: 'AIMANT', rocket: 'FUSEE', freeze: 'GEL' };
            Engine.drawText(ctx, names[this.activePowerup] + ' ' + Math.ceil(this.powerupTimer) + 's', 420, 5, '#00ff88', 8);
        }

        // Done screen
        if (this.phase === 'done') {
            Engine.drawRect(ctx, 80, 60, 320, 180, '#000', 0.85);
            Engine.drawText(ctx, 'PARTIE TERMINEE !', 240, 80, '#ffdd00', 14, 'center');
            Engine.drawText(ctx, `Distance: ${this.result.score}m`, 240, 110, '#fff', 10, 'center');
            Engine.drawText(ctx, `Petales: ${this.totalPetals}`, 240, 130, '#ffaacc', 10, 'center');
            Engine.drawText(ctx, `Pieces gagnees: ${this.result.coins}`, 240, 160, '#ffd700', 12, 'center');
            Engine.drawText(ctx, 'Appuie pour continuer', 240, 210, '#aaa', 8, 'center');
        }

        Engine.renderParticlesAbsolute(ctx);
    }
}

// ============================================================
// EPIC 8B: HIDDEN ANIMALS MINIGAME
// Find hidden dogs & cats in seasonal scenes
// ============================================================
class HiddenAnimalsMinigame {
    constructor(data) {
        this.finished = false;
        this.result = { success: false, score: 0, coins: 0 };
        this.timer = 0;
        this.timeLimit = 45; // seconds

        // Pick a random scene
        this.scene = HIDDEN_SCENES[Math.floor(Math.random() * HIDDEN_SCENES.length)];

        // Randomly place 6 animals in available spots
        const spots = [...this.scene.hideSpots];
        this.toFind = 6;
        this.animals = [];
        for (let i = 0; i < this.toFind && spots.length > 0; i++) {
            const idx = Math.floor(Math.random() * spots.length);
            const spot = spots.splice(idx, 1)[0];
            this.animals.push({
                x: spot.x, y: spot.y,
                type: Math.random() < 0.5 ? 'dog' : 'cat',
                found: false,
                size: 14 + Math.random() * 6,
            });
        }
        this.foundCount = 0;
        this.wrongTaps = 0;
        this.phase = 'playing'; // playing, done
        this.flashTimer = 0;

        // Scene decorations (procedural based on scene type)
        this.decorations = this._generateDecorations();
    }

    init() {}

    _generateDecorations() {
        const decs = [];
        const s = this.scene.id;
        // Generate background elements based on scene
        for (let i = 0; i < 20; i++) {
            const x = Math.random() * 480;
            const y = 40 + Math.random() * 240;
            if (s === 'beach') {
                decs.push({ x, y, type: Math.random() < 0.3 ? 'umbrella' : (Math.random() < 0.5 ? 'towel' : 'sand'), color: ['#ff4444','#4488cc','#ffdd88','#ff88aa','#44cc44'][Math.floor(Math.random()*5)] });
            } else if (s === 'winter') {
                decs.push({ x, y, type: Math.random() < 0.4 ? 'tree' : 'snowman', color: '#fff' });
            } else if (s === 'autumn') {
                decs.push({ x, y, type: 'tree', color: ['#cc6622','#dd8833','#aa4411','#ffaa33'][Math.floor(Math.random()*4)] });
            } else {
                decs.push({ x, y, type: Math.random() < 0.5 ? 'flower' : 'tree', color: ['#ff6688','#ffaa44','#aa66dd','#66ccaa'][Math.floor(Math.random()*4)] });
            }
        }
        return decs;
    }

    update(dt) {
        this.timer += dt;
        this.flashTimer += dt;

        if (this.phase === 'playing') {
            if (this.timer >= this.timeLimit) {
                this.phase = 'done';
                const coins = this.foundCount * 3;
                this.result = { success: this.foundCount >= 4, score: this.foundCount, coins };
            }

            // Click to find
            if (Engine.wasClicked()) {
                const mp = Engine.getMousePos();
                let foundOne = false;
                for (const a of this.animals) {
                    if (a.found) continue;
                    if (Engine.isPointInRect(mp.x, mp.y, a.x - a.size/2, a.y - a.size/2, a.size, a.size)) {
                        a.found = true;
                        this.foundCount++;
                        foundOne = true;
                        Engine.playSound('found');
                        Engine.addParticleAt(a.x, a.y, 'star', 5);
                        break;
                    }
                }
                if (!foundOne) {
                    this.wrongTaps++;
                    Engine.playSound('error');
                }

                if (this.foundCount >= this.toFind) {
                    this.phase = 'done';
                    const coins = this.foundCount * 3 + (this.wrongTaps < 3 ? 5 : 0);
                    this.result = { success: true, score: this.foundCount, coins };
                    Engine.playSound('quest');
                }
            }
        }

        if (this.phase === 'done') {
            if (Engine.isActionPressed() || (this.timer > 1 && Engine.wasClicked())) this.finished = true;
        }
    }

    render(ctx) {
        // Scene background
        Engine.drawRect(ctx, 0, 0, 480, 320, this.scene.bgColor);

        // Ground
        const groundColors = { beach: '#f0d8a0', winter: '#eeeeff', autumn: '#c8a060', spring: '#88cc66' };
        Engine.drawRect(ctx, 0, 250, 480, 70, groundColors[this.scene.id] || '#88cc66');

        // Decorations
        for (const d of this.decorations) {
            if (d.type === 'umbrella') {
                Engine.drawRect(ctx, d.x, d.y, 2, 20, '#886633');
                Engine.drawRect(ctx, d.x - 10, d.y - 5, 22, 8, d.color);
            } else if (d.type === 'towel') {
                Engine.drawRect(ctx, d.x, d.y, 20, 12, d.color);
            } else if (d.type === 'sand') {
                Engine.drawRect(ctx, d.x, d.y, 15, 10, '#ddcc88');
            } else if (d.type === 'tree') {
                Engine.drawRect(ctx, d.x + 4, d.y + 10, 6, 15, '#886633');
                Engine.drawRect(ctx, d.x - 2, d.y, 18, 14, d.color);
            } else if (d.type === 'snowman') {
                Engine.drawRect(ctx, d.x, d.y + 8, 10, 10, '#fff');
                Engine.drawRect(ctx, d.x + 2, d.y, 6, 8, '#fff');
                Engine.drawRect(ctx, d.x + 3, d.y + 2, 2, 1, '#222');
            } else if (d.type === 'flower') {
                Engine.drawRect(ctx, d.x + 2, d.y + 4, 2, 8, '#44aa44');
                Engine.drawRect(ctx, d.x, d.y, 6, 5, d.color);
            }
        }

        // Hidden animals (show small, blending)
        for (const a of this.animals) {
            if (a.found) {
                // Show found with circle
                ctx.strokeStyle = '#ffdd00';
                ctx.lineWidth = 2;
                ctx.strokeRect(a.x - a.size/2 - 2, a.y - a.size/2 - 2, a.size + 4, a.size + 4);
                // Draw animal
                const sprite = SpriteManager.getAnimalSprite(a.type, Engine.animFrame);
                if (sprite) PixelSprite.draw(ctx, sprite, a.x - 8, a.y - 8);
            } else {
                // Hidden: partially blended with background
                ctx.globalAlpha = 0.35;
                const sprite = SpriteManager.getAnimalSprite(a.type, 0);
                if (sprite) PixelSprite.draw(ctx, sprite, a.x - 8, a.y - 8);
                ctx.globalAlpha = 1;
            }
        }

        // HUD
        Engine.drawRect(ctx, 0, 0, 480, 30, '#000', 0.6);
        Engine.drawText(ctx, `${this.scene.name}`, 10, 8, '#fff', 8);
        Engine.drawText(ctx, `Trouves: ${this.foundCount}/${this.toFind}`, 150, 8, '#ffdd00', 8);
        Engine.drawText(ctx, `Temps: ${Math.ceil(this.timeLimit - this.timer)}s`, 320, 8, '#fff', 8);
        if (this.wrongTaps > 0) Engine.drawText(ctx, `Erreurs: ${this.wrongTaps}`, 420, 8, '#ff6666', 8);

        // Done
        if (this.phase === 'done') {
            Engine.drawRect(ctx, 80, 60, 320, 180, '#000', 0.85);
            Engine.drawText(ctx, this.foundCount >= this.toFind ? 'TOUS TROUVES !' : 'TEMPS ECOULE !', 240, 80, '#ffdd00', 14, 'center');
            Engine.drawText(ctx, `${this.foundCount}/${this.toFind} animaux trouves`, 240, 110, '#fff', 10, 'center');
            Engine.drawText(ctx, `Pieces gagnees: ${this.result.coins}`, 240, 140, '#ffd700', 12, 'center');
            Engine.drawText(ctx, 'Appuie pour continuer', 240, 210, '#aaa', 8, 'center');
        }

        Engine.renderParticlesAbsolute(ctx);
    }
}
