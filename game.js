// ============================================================
// GAME.JS — Main Game Controller for Animal Hotel V2
// ============================================================

const Game = {
    state: null,
    screen: 'title', // title, newgame, playing, menu, shop, room_editor, phone, arcade
    menuTab: 'animals',
    menuSelectedIndex: 0,
    shopPage: 0,
    interactingAnimal: null,
    dayTimer: 0,
    dayDuration: 180, // 3 minutes per day cycle
    eventTimer: 0,
    titleAnimTimer: 0,
    newGameStep: 0, // 0=choose gender, 1=enter name
    nameInput: '',
    feedSelectActive: false,
    feedSelectIndex: 0,

    init() {
        DialogueSystem.init();
        Engine.init();

        // Check for save
        if (Engine.hasSaveGame()) {
            this.screen = 'title';
        } else {
            this.screen = 'title';
        }
    },

    update(dt) {
        switch (this.screen) {
            case 'title': this._updateTitle(dt); break;
            case 'newgame': this._updateNewGame(dt); break;
            case 'playing': this._updatePlaying(dt); break;
            case 'menu': this._updateMenu(dt); break;
            case 'shop': this._updateShop(dt); break;
            case 'room_editor': this._updateRoomEditor(dt); break;
            case 'phone': this._updatePhone(dt); break;
            case 'arcade': this._updateArcade(dt); break;
        }
    },

    render(ctx) {
        switch (this.screen) {
            case 'title': this._renderTitle(ctx); break;
            case 'newgame': this._renderNewGame(ctx); break;
            case 'playing': this._renderPlaying(ctx); break;
            case 'menu': this._renderMenu(ctx); break;
            case 'shop': this._renderShop(ctx); break;
            case 'room_editor': this._renderRoomEditor(ctx); break;
            case 'phone': this._renderPhone(ctx); break;
            case 'arcade': this._renderArcade(ctx); break;
        }
    },

    // ==================== TITLE SCREEN ====================
    _updateTitle(dt) {
        this.titleAnimTimer += dt;

        if (Engine.isActionPressed()) {
            if (Engine.hasSaveGame()) {
                // Load saved game
                const saved = Engine.loadGame();
                if (saved) {
                    this.state = saved;
                    this._enterGame();
                    return;
                }
            }
            this.screen = 'newgame';
            this.newGameStep = 0;
            Engine.playSound('interact');
        }

        // Press N for new game (even with save)
        if (Engine.isKeyJustPressed('n') || Engine.isKeyJustPressed('N')) {
            this.screen = 'newgame';
            this.newGameStep = 0;
            Engine.playSound('interact');
        }
    },

    _renderTitle(ctx) {
        // Background
        ctx.fillStyle = '#1a1a3e';
        ctx.fillRect(0, 0, 480, 320);

        // Starfield
        for (let i = 0; i < 40; i++) {
            const sx = (i * 37 + this.titleAnimTimer * 5 * (i % 3 + 1)) % 480;
            const sy = (i * 23) % 320;
            const brightness = 0.3 + 0.7 * Math.sin(this.titleAnimTimer * 2 + i);
            ctx.fillStyle = `rgba(255,255,255,${brightness})`;
            ctx.fillRect(Math.floor(sx), Math.floor(sy), 2, 2);
        }

        // Logo
        ctx.fillStyle = '#ffdd57';
        ctx.font = 'bold 24px monospace';
        ctx.textAlign = 'center';
        const bobY = Math.sin(this.titleAnimTimer * 2) * 4;
        ctx.fillText('ANIMAL HOTEL', 240, 60 + bobY);

        ctx.fillStyle = '#ff88bb';
        ctx.font = '14px monospace';
        ctx.fillText('V2', 320, 56 + bobY);

        // Subtitle
        ctx.fillStyle = '#88bbff';
        ctx.font = '10px monospace';
        ctx.fillText("L'Hotel Magique des Animaux", 240, 95);

        // Animated animals
        const animals = ['dog', 'cat', 'rabbit', 'unicorn', 'dragon'];
        for (let i = 0; i < animals.length; i++) {
            const sprite = SpriteManager.getAnimalSprite(animals[i], Engine.animFrame);
            const ax = 80 + i * 80;
            const ay = 140 + Math.sin(this.titleAnimTimer * 3 + i * 1.2) * 6;
            PixelSprite.draw(ctx, sprite, ax, ay, 2);
        }

        // Prompt
        const blink = Math.sin(this.titleAnimTimer * 4) > 0;
        if (blink) {
            ctx.fillStyle = '#fff';
            ctx.font = '12px monospace';
            if (Engine.hasSaveGame()) {
                ctx.fillText('Espace = Continuer | N = Nouvelle Partie', 240, 250);
            } else {
                ctx.fillText('Appuie sur Espace pour commencer !', 240, 250);
            }
        }

        // Credits
        ctx.fillStyle = '#556';
        ctx.font = '8px monospace';
        ctx.fillText('Fleches/ZQSD = Bouger  |  Espace = Interagir  |  M = Menu  |  Ctrl+S = Sauvegarder', 240, 294);
        ctx.fillStyle = '#445';
        ctx.fillText('Caresser = glisse souris  |  Laver = glisse+clic  |  Lancer = maintenir Espace', 240, 306);

        ctx.textAlign = 'left';
    },

    // ==================== NEW GAME ====================
    _updateNewGame(dt) {
        if (this.newGameStep === 0) {
            // Choose gender
            if (Engine.isKeyJustPressed('ArrowLeft') || Engine.isKeyJustPressed('a') || Engine.isKeyJustPressed('q')) {
                this.newGameStep = 0;
                this._tempGender = 'boy';
                Engine.playSound('menu');
            }
            if (Engine.isKeyJustPressed('ArrowRight') || Engine.isKeyJustPressed('d')) {
                this.newGameStep = 0;
                this._tempGender = 'girl';
                Engine.playSound('menu');
            }
            if (!this._tempGender) this._tempGender = 'boy';

            if (Engine.isActionPressed()) {
                this.newGameStep = 1;
                this.nameInput = '';
                Engine.playSound('interact');
            }
        } else if (this.newGameStep === 1) {
            // Enter name
            for (const key of Object.keys(Engine.keysJustPressed)) {
                if (key.length === 1 && this.nameInput.length < 12) {
                    this.nameInput += key;
                } else if (key === 'Backspace' && this.nameInput.length > 0) {
                    this.nameInput = this.nameInput.slice(0, -1);
                }
            }

            if (Engine.isActionPressed() && this.nameInput.length > 0) {
                this._startNewGame();
            }

            if (Engine.isCancelPressed()) {
                this.newGameStep = 0;
                Engine.playSound('menu');
            }
        }
    },

    _renderNewGame(ctx) {
        ctx.fillStyle = '#1a1a3e';
        ctx.fillRect(0, 0, 480, 320);

        ctx.fillStyle = '#ffdd57';
        ctx.font = '14px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('NOUVELLE PARTIE', 240, 30);

        if (this.newGameStep === 0) {
            ctx.fillStyle = '#fff';
            ctx.font = '11px monospace';
            ctx.fillText('Choisis ton personnage', 240, 70);

            // Boy
            const boySelected = (this._tempGender || 'boy') === 'boy';
            const girlSelected = !boySelected;

            ctx.fillStyle = boySelected ? 'rgba(85,136,204,0.3)' : 'rgba(0,0,0,0.2)';
            ctx.fillRect(100, 100, 120, 150);
            if (boySelected) {
                ctx.strokeStyle = '#5588cc';
                ctx.lineWidth = 2;
                ctx.strokeRect(100, 100, 120, 150);
            }
            const boySprite = SpriteManager.getPlayerSprite('boy', 'down', Engine.animFrame);
            PixelSprite.draw(ctx, boySprite, 128, 120, 3);
            ctx.fillStyle = boySelected ? '#fff' : '#888';
            ctx.font = '10px monospace';
            ctx.fillText('Garcon', 160, 220);

            // Girl
            ctx.fillStyle = girlSelected ? 'rgba(238,136,170,0.3)' : 'rgba(0,0,0,0.2)';
            ctx.fillRect(260, 100, 120, 150);
            if (girlSelected) {
                ctx.strokeStyle = '#ee88aa';
                ctx.lineWidth = 2;
                ctx.strokeRect(260, 100, 120, 150);
            }
            const girlSprite = SpriteManager.getPlayerSprite('girl', 'down', Engine.animFrame);
            PixelSprite.draw(ctx, girlSprite, 288, 120, 3);
            ctx.fillStyle = girlSelected ? '#fff' : '#888';
            ctx.font = '10px monospace';
            ctx.fillText('Fille', 320, 220);

            ctx.fillStyle = '#888';
            ctx.font = '9px monospace';
            ctx.fillText('Fleches gauche/droite pour choisir, Espace pour confirmer', 240, 280);
        } else {
            ctx.fillStyle = '#fff';
            ctx.font = '11px monospace';
            ctx.fillText('Quel est ton prenom ?', 240, 80);

            // Name input box
            ctx.fillStyle = 'rgba(0,0,0,0.5)';
            ctx.fillRect(140, 120, 200, 40);
            ctx.strokeStyle = '#5588cc';
            ctx.lineWidth = 2;
            ctx.strokeRect(140, 120, 200, 40);

            ctx.fillStyle = '#fff';
            ctx.font = '16px monospace';
            const displayName = this.nameInput + (Math.sin(Date.now() / 300) > 0 ? '_' : '');
            ctx.fillText(displayName, 240, 133);

            ctx.fillStyle = '#888';
            ctx.font = '9px monospace';
            ctx.fillText('Tape ton nom et appuie sur Espace', 240, 200);
        }
        ctx.textAlign = 'left';
    },

    _startNewGame() {
        this.state = JSON.parse(JSON.stringify(DEFAULT_GAME_STATE));
        this.state.playerName = this.nameInput;
        this.state.playerGender = this._tempGender || 'boy';

        // Add first animal
        const firstAnimal = {
            id: 'animal_first',
            type: 'dog',
            name: 'Rex',
            ownerName: 'Sophie',
            x: 10,
            y: 10,
            mapId: 'hotel_lobby',
            hunger: 60,
            happiness: 50,
            cleanliness: 60,
            health: 100,
        };
        this.state.hotelAnimals = [firstAnimal];

        this._enterGame();

        // Start tutorial
        setTimeout(() => {
            DialogueSystem.start('tutorial_welcome', () => {
                this.state.flags.tutorial_shown = true;
                QuestManager.reportAction('flag', { flag: 'first_animal_welcomed' });
            });
        }, 500);
    },

    _enterGame() {
        this.screen = 'playing';
        Player.init(this.state);
        EntityManager.init();
        EntityManager.loadMapEntities(this.state.currentMap);
        EntityManager.loadAnimalsForMap(this.state.currentMap, this.state.hotelAnimals);
        QuestManager.init(this.state);
        Engine.snapCamera(this.state.playerX, this.state.playerY);
        this._updateHUD();

        // Auto start chapter 1 quests
        QuestManager._autoStartQuests();
    },

    // ==================== PLAYING ====================
    _updatePlaying(dt) {
        // Handle dialogue
        if (DialogueSystem.isActive()) {
            DialogueSystem.update(dt);
            return;
        }

        // Handle minigame
        if (MinigameManager.isActive()) {
            MinigameManager.update(dt);
            return;
        }

        // Handle feed selection
        if (this.feedSelectActive) {
            this._updateFeedSelect(dt);
            return;
        }

        // Menu toggle
        if (Engine.isMenuPressed()) {
            this.openMenu('animals');
            return;
        }

        // Player movement
        const input = Engine.getMovementInput();
        if (input.dx !== 0 || input.dy !== 0) {
            // Only move in one direction at a time
            let dx = 0, dy = 0;
            if (Math.abs(input.dx) >= Math.abs(input.dy)) {
                dx = input.dx;
            } else {
                dy = input.dy;
            }

            if (Player.tryMove(dx, dy, this.state.currentMap)) {
                // Moved successfully
                Engine.playSound('step');

                // Check for map exit
                const exit = MapManager.getExit(this.state.currentMap, Player.x, Player.y);
                if (exit) {
                    this._changeMap(exit.targetMap, exit.targetX, exit.targetY);
                }
            }
        }

        Player.update(dt);
        EntityManager.update(dt);
        Engine.updateParticles(dt);

        // Camera
        Engine.setCameraTarget(Player.x, Player.y);
        Engine.updateCamera();

        // Interaction
        if (Engine.isActionPressed()) {
            this._handleInteraction();
        }

        // Day/night cycle
        this.dayTimer += dt;
        this.state.timeOfDay = (this.dayTimer % this.dayDuration) / this.dayDuration;
        if (this.dayTimer >= this.dayDuration) {
            this.dayTimer = 0;
            this.state.dayCount++;
            this._onNewDay();
        }

        // Random events
        this.eventTimer += dt;
        if (this.eventTimer > 60) { // every 60 seconds
            this.eventTimer = 0;
            this._randomEvent();
        }

        // Update HUD
        this._updateHUD();

        // Update animal states in game state
        this._syncAnimalStates();
    },

    _renderPlaying(ctx) {
        // Render map
        Engine.renderMap(ctx, this.state.currentMap);

        // Render entities (includes player)
        EntityManager.render(ctx);

        // Render particles
        Engine.renderParticles(ctx);

        // Render minigame overlay
        if (MinigameManager.isActive()) {
            MinigameManager.render(ctx);
        }

        // Day/night tint
        const tod = this.state.timeOfDay;
        if (tod > 0.7) {
            const nightAlpha = Math.min(0.35, (tod - 0.7) / 0.3 * 0.35);
            ctx.fillStyle = `rgba(0,0,40,${nightAlpha})`;
            ctx.fillRect(0, 0, 480, 320);
        } else if (tod < 0.15) {
            const dawnAlpha = Math.max(0, (0.15 - tod) / 0.15 * 0.2);
            ctx.fillStyle = `rgba(255,180,100,${dawnAlpha})`;
            ctx.fillRect(0, 0, 480, 320);
        }

        // Feed selection overlay
        if (this.feedSelectActive) {
            this._renderFeedSelect(ctx);
        }
    },

    // ==================== MAP TRANSITIONS ====================
    _changeMap(mapId, targetX, targetY) {
        // Check if area is unlocked
        if (!this.state.unlockedAreas.includes(mapId)) {
            DialogueSystem.startDirect([
                { speaker: '', text: "Cette zone n'est pas encore accessible. Continue l'aventure pour la debloquer !" }
            ]);
            // Move player back
            Player.x = this.state.playerX;
            Player.y = this.state.playerY;
            Player.px = Player.x * 16;
            Player.py = Player.y * 16;
            return;
        }

        Engine.fadeOut(() => {
            // Save animal states before map change
            this._syncAnimalStates();

            this.state.currentMap = mapId;
            this.state.playerX = targetX;
            this.state.playerY = targetY;
            Player.x = targetX;
            Player.y = targetY;
            Player.px = targetX * 16;
            Player.py = targetY * 16;
            Player.walking = false;

            EntityManager.loadMapEntities(mapId);
            EntityManager.loadAnimalsForMap(mapId, this.state.hotelAnimals);
            Engine.snapCamera(targetX, targetY);

            // Report map visit for quests
            QuestManager.reportAction('visit_map', { map: mapId });
        });
    },

    // ==================== INTERACTIONS ====================
    _handleInteraction() {
        const facing = Player.getFacingTile();
        const entity = EntityManager.getEntityAt(facing.x, facing.y);

        if (entity) {
            if (entity instanceof NPCEntity) {
                this._interactNPC(entity);
            } else if (entity instanceof AnimalEntity) {
                this._interactAnimal(entity);
            } else if (entity instanceof ItemEntity) {
                this._interactItem(entity);
            }
        }
    },

    _interactNPC(npc) {
        // Report talking for quests
        QuestManager.reportAction('talk', { npcId: npc.id });

        // Check for quest
        const availableQuest = QuestManager.getAvailableQuestByNPC(npc.id);
        if (availableQuest) {
            QuestManager.startQuest(availableQuest.id);
            return;
        }

        // Special NPC interactions
        if (npc.id === 'shopkeeper') {
            // Epic 3: Real shop
            DialogueSystem.startDirect([
                { speaker: 'Felix', text: 'Bienvenue dans ma boutique ! Que veux-tu acheter ?',
                  choices: [
                    { text: 'Acheter', action: () => this.openShop() },
                    { text: 'Liste de courses', action: () => {
                        const missing = getShoppingList(this.state.fridge || []);
                        if (missing.length === 0) {
                            DialogueSystem.startDirect([{ speaker: 'Felix', text: 'Ton frigo est plein ! Pas besoin de courses.' }]);
                        } else {
                            const names = missing.map(id => { const d = getItemData(id); return d ? d.name : id; }).join(', ');
                            DialogueSystem.startDirect([{ speaker: 'Felix', text: `Il te manque: ${names}` }]);
                        }
                    }},
                    { text: 'Non merci', action: () => {} },
                  ]
                }
            ]);
            return;
        }

        if (npc.id === 'chef') {
            DialogueSystem.startDirect([
                { speaker: 'Rosa', text: 'Tu veux utiliser ma cuisine ? Le frigo est la-bas !',
                  choices: [
                    { text: 'Cuisiner', action: () => {
                        if (!this.interactingAnimal && this.state.hotelAnimals.length > 0) {
                            // Pick first animal
                            const a = this.state.hotelAnimals[0];
                            this.interactingAnimal = EntityManager.animals.find(e => e.id === a.id) || { type: a.type, name: a.name, hunger: a.hunger, happiness: a.happiness, cleanliness: a.cleanliness, health: a.health, x: 0, y: 0 };
                        }
                        if (this.interactingAnimal) this.cookForAnimal();
                    }},
                    { text: 'Non merci', action: () => {} },
                  ]
                }
            ]);
            return;
        }

        if (npc.id === 'receptionist') {
            // Epic 1 & 5: Room editor and phone
            const choices = [
                { text: 'Chambres', action: () => {
                    if (this.state.hotelAnimals.length > 0) {
                        this.openRoomEditor(0);
                    } else {
                        DialogueSystem.startDirect([{ speaker: 'Lucie', text: 'Il n\'y a pas d\'animaux pour le moment !' }]);
                    }
                }},
                { text: 'Salle de jeux', action: () => this.openArcade() },
                { text: 'Discuter', action: () => {} },
            ];
            DialogueSystem.startDirect([
                { speaker: 'Lucie', text: 'Bienvenue ! Que puis-je faire pour toi ?', choices }
            ]);
            return;
        }

        // Regular dialogue
        if (npc.dialogueId && DIALOGUES[npc.dialogueId]) {
            DialogueSystem.start(npc.dialogueId);
        } else {
            DialogueSystem.startDirect([
                { speaker: NPC_DATA[npc.id]?.name || 'NPC', text: 'Bonjour !' }
            ]);
        }
    },

    _interactAnimal(animal) {
        this.interactingAnimal = animal;

        // Build status text
        const pages = createAnimalDialogue(animal);
        pages.push({
            speaker: animal.name,
            text: `Faim: ${Math.floor(animal.hunger)}% | Joie: ${Math.floor(animal.happiness)}% | Proprete: ${Math.floor(animal.cleanliness)}%`,
            choices: [
                { text: 'Cuisiner  [Fleches/clic pour choisir, Espace pour cuisiner]', action: () => this.cookForAnimal() },
                { text: 'Caresser  [Glisse la souris sur l\'animal]', action: () => this.petAnimal() },
                { text: 'Laver     [Glisse pour savonner, clic pour rincer/secher]', action: () => this.washAnimal() },
                { text: 'Jouer     [Chien: Espace pour lancer | Chat: Fleches pour bouger]', action: () => this.playWithAnimal() },
            ]
        });

        DialogueSystem.startDirect(pages);
    },

    _interactItem(item) {
        if (item.collect()) {
            this.addItemToInventory(item.itemType, 1);
            QuestManager.reportAction('collect', { itemId: item.itemType });

            const itemData = getItemData(item.itemType);
            DialogueSystem.startDirect([
                { speaker: '', text: `Tu as trouve: ${itemData ? itemData.name : item.itemType} !` }
            ]);
        }
    },

    // ==================== ANIMAL CARE (8 Epics) ====================

    // EPIC 2: Cooking — open kitchen/fridge, cook, feed
    cookForAnimal() {
        DialogueSystem.close();
        if (!this.interactingAnimal) return;

        // Use fridge contents
        const fridge = this.state.fridge || [];
        if (fridge.filter(f => f.quantity > 0).length === 0) {
            DialogueSystem.startDirect([
                { speaker: '', text: "Le frigo est vide ! Va faire les courses au magasin." }
            ]);
            return;
        }

        const animal = this.interactingAnimal;
        MinigameManager.startMinigame('cooking', {
            fridge: fridge,
            animalType: animal.type
        }, (result) => {
            if (result.success && result.foodId) {
                // Remove from fridge
                if (result.rawId) {
                    const fridgeItem = this.state.fridge.find(f => f.id === result.rawId);
                    if (fridgeItem) {
                        fridgeItem.quantity--;
                        if (fridgeItem.quantity <= 0) {
                            this.state.fridge = this.state.fridge.filter(f => f.quantity > 0);
                        }
                    }
                }

                // Feed the animal and check reaction
                const reaction = getFoodReaction(animal.type, result.foodId);
                const foodData = getItemData(result.foodId);
                const foodName = foodData ? foodData.name : result.foodId;

                if (reaction === 'loves') {
                    animal.hunger = Math.min(100, animal.hunger + 40);
                    animal.happiness = Math.min(100, animal.happiness + 20);
                    Engine.playSound('happy');
                    Engine.addParticleAtTile(animal.x, animal.y, 'love', 8);
                    Engine.addParticleAtTile(animal.x, animal.y, 'star', 5);
                    DialogueSystem.startDirect([
                        { speaker: animal.name, text: `${foodName} ! J'ADORE ! Des etoiles dans les yeux !` }
                    ]);
                } else if (reaction === 'likes') {
                    animal.hunger = Math.min(100, animal.hunger + 30);
                    animal.happiness = Math.min(100, animal.happiness + 10);
                    Engine.playSound('interact');
                    Engine.addParticleAtTile(animal.x, animal.y, 'heart', 4);
                    DialogueSystem.startDirect([
                        { speaker: animal.name, text: `Mmmh, ${foodName}, c'est bon !` }
                    ]);
                } else if (reaction === 'hates') {
                    Engine.playSound('whimper');
                    DialogueSystem.startDirect([
                        { speaker: animal.name, text: `Beurk ! ${foodName} ?! Je n'aime pas du tout...` }
                    ]);
                } else {
                    animal.hunger = Math.min(100, animal.hunger + 20);
                    Engine.playSound('interact');
                    DialogueSystem.startDirect([
                        { speaker: animal.name, text: `${foodName}, c'est pas mal.` }
                    ]);
                }
                QuestManager.reportAction('feed');
            }
        });
    },

    // EPIC 4: Petting — stroke with drag
    petAnimal() {
        DialogueSystem.close();
        if (!this.interactingAnimal) return;

        const animal = this.interactingAnimal;
        MinigameManager.startMinigame('petting', {
            animalType: animal.type
        }, (result) => {
            if (result.success) {
                animal.happiness = Math.min(100, animal.happiness + 25);
                Engine.addParticleAtTile(animal.x, animal.y, 'rainbow', 8);
                QuestManager.reportAction('pet');
                DialogueSystem.startDirect([
                    { speaker: animal.name, text: 'C\'etait trop bien ! Je suis tellement content !' }
                ]);
            } else if (result.score > 5) {
                animal.happiness = Math.min(100, animal.happiness + 10);
                Engine.addParticleAtTile(animal.x, animal.y, 'heart', 3);
            }
        });
    },

    // EPIC 6: Washing — full bath sequence
    washAnimal() {
        DialogueSystem.close();
        if (!this.interactingAnimal) return;

        const animal = this.interactingAnimal;
        MinigameManager.startMinigame('washing', {
            animalType: animal.type
        }, (result) => {
            if (result.success) {
                animal.cleanliness = 100;
                animal.happiness = Math.min(100, animal.happiness + 15);
                QuestManager.reportAction('groom');
                Engine.addParticleAtTile(animal.x, animal.y, 'sparkle', 8);
                DialogueSystem.startDirect([
                    { speaker: animal.name, text: 'Je suis tout propre et tout beau ! Merci !' }
                ]);
            }
        });
    },

    // EPIC 7: Playing — animal-specific
    playWithAnimal() {
        DialogueSystem.close();
        if (!this.interactingAnimal) return;

        const animal = this.interactingAnimal;
        const typeData = ANIMAL_TYPES[animal.type];
        const playType = typeData && typeData.playType;

        let minigameType = 'play_dog'; // default
        if (playType === 'yarn') {
            minigameType = 'play_cat';
        } else if (playType === 'hop') {
            minigameType = 'play_cat'; // use cat play for hopping animals too
        }

        MinigameManager.startMinigame(minigameType, {
            animalType: animal.type
        }, (result) => {
            if (result.success) {
                animal.happiness = Math.min(100, animal.happiness + 25);
                // Animal gets dirty after playing outside!
                animal.cleanliness = Math.max(0, animal.cleanliness - 20);
                QuestManager.reportAction('play');
                Engine.addParticleAtTile(animal.x, animal.y, 'heart', 5);
                DialogueSystem.startDirect([
                    { speaker: animal.name, text: 'C\'etait genial ! Mais je suis un peu sale maintenant...' }
                ]);
            } else {
                animal.happiness = Math.min(100, animal.happiness + 10);
                DialogueSystem.startDirect([
                    { speaker: animal.name, text: 'Bien joue quand meme !' }
                ]);
            }
        });
    },

    // EPIC 1: Room customization
    openRoomEditor(animalIndex) {
        DialogueSystem.close();
        this.screen = 'room_editor';
        this._roomEditAnimal = animalIndex;
        this._roomEditTab = 0; // 0=color, 1=pattern, 2=bed, 3=bowl
        this._roomEditIndex = 0;
        Engine.playSound('menu');
    },

    _updateRoomEditor(dt) {
        if (Engine.isCancelPressed()) {
            this.screen = 'playing';
            return;
        }

        const tabs = [ROOM_COLORS, ROOM_PATTERNS, ROOM_BEDS, ROOM_BOWLS];
        const tab = tabs[this._roomEditTab];

        if (Engine.isKeyJustPressed('ArrowLeft') || Engine.isKeyJustPressed('q')) {
            this._roomEditTab = (this._roomEditTab + tabs.length - 1) % tabs.length;
            this._roomEditIndex = 0;
            Engine.playSound('menu');
        }
        if (Engine.isKeyJustPressed('ArrowRight') || Engine.isKeyJustPressed('d')) {
            this._roomEditTab = (this._roomEditTab + 1) % tabs.length;
            this._roomEditIndex = 0;
            Engine.playSound('menu');
        }
        if (Engine.isKeyJustPressed('ArrowUp') || Engine.isKeyJustPressed('z') || Engine.isKeyJustPressed('w')) {
            this._roomEditIndex = Math.max(0, this._roomEditIndex - 1);
            Engine.playSound('menu');
        }
        if (Engine.isKeyJustPressed('ArrowDown') || Engine.isKeyJustPressed('s')) {
            this._roomEditIndex = Math.min(tab.length - 1, this._roomEditIndex + 1);
            Engine.playSound('menu');
        }

        // Click/tap selection
        if (Engine.wasClicked()) {
            const mp = Engine.getMousePos();
            // Tab buttons (top)
            const tabNames = ['Couleur', 'Motif', 'Lit', 'Gamelle'];
            for (let i = 0; i < 4; i++) {
                if (Engine.isPointInRect(mp.x, mp.y, 20 + i * 115, 10, 110, 25)) {
                    this._roomEditTab = i;
                    this._roomEditIndex = 0;
                    Engine.playSound('menu');
                }
            }
            // Items
            for (let i = 0; i < tab.length; i++) {
                if (Engine.isPointInRect(mp.x, mp.y, 20, 50 + i * 28, 200, 24)) {
                    this._roomEditIndex = i;
                    this._applyRoomChoice();
                }
            }
        }

        if (Engine.isActionPressed()) {
            this._applyRoomChoice();
        }
    },

    _applyRoomChoice() {
        const room = this.state.rooms[this._roomEditAnimal] || this.state.rooms[0];
        const tabs = [ROOM_COLORS, ROOM_PATTERNS, ROOM_BEDS, ROOM_BOWLS];
        const item = tabs[this._roomEditTab][this._roomEditIndex];
        if (!item) return;

        // Check price
        if (item.price > 0 && this.state.coins < item.price) {
            Engine.playSound('error');
            return;
        }
        if (item.price > 0) this.state.coins -= item.price;

        if (this._roomEditTab === 0) room.color = item.id;
        if (this._roomEditTab === 1) room.pattern = item.id;
        if (this._roomEditTab === 2) room.bed = item.id;
        if (this._roomEditTab === 3) room.bowl = item.id;

        Engine.playSound('interact');
    },

    _renderRoomEditor(ctx) {
        Engine.drawRect(ctx, 0, 0, 480, 320, '#2a2a3e');

        const tabNames = ['Couleur', 'Motif', 'Lit', 'Gamelle'];
        for (let i = 0; i < 4; i++) {
            const active = i === this._roomEditTab;
            Engine.drawRect(ctx, 20 + i * 115, 10, 110, 25, active ? '#4466aa' : '#333');
            Engine.drawText(ctx, tabNames[i], 75 + i * 115, 17, active ? '#fff' : '#888', 8, 'center');
        }

        const tabs = [ROOM_COLORS, ROOM_PATTERNS, ROOM_BEDS, ROOM_BOWLS];
        const tab = tabs[this._roomEditTab];

        // Items list
        for (let i = 0; i < tab.length; i++) {
            const selected = i === this._roomEditIndex;
            Engine.drawRect(ctx, 20, 50 + i * 28, 200, 24, selected ? '#4466aa' : '#333');
            Engine.drawText(ctx, tab[i].name, 30, 56 + i * 28, '#fff', 8);
            if (tab[i].price > 0) Engine.drawText(ctx, tab[i].price + ' p', 180, 56 + i * 28, '#ffd700', 8);
            if (tab[i].color) {
                Engine.drawRect(ctx, 150, 54 + i * 28, 16, 16, tab[i].color);
            }
        }

        // Room preview
        const room = this.state.rooms[this._roomEditAnimal] || this.state.rooms[0];
        const roomColor = ROOM_COLORS.find(c => c.id === room.color);
        Engine.drawRect(ctx, 260, 50, 200, 200, roomColor ? roomColor.color : '#ddd');

        // Pattern overlay
        if (room.pattern !== 'none') {
            const patSprite = SpriteManager.getRoomPatternTile(room.pattern);
            if (patSprite) {
                for (let px = 0; px < 200; px += 16) {
                    for (let py = 0; py < 200; py += 16) {
                        ctx.globalAlpha = 0.3;
                        PixelSprite.draw(ctx, patSprite, 260 + px, 50 + py);
                        ctx.globalAlpha = 1;
                    }
                }
            }
        }

        // Bed
        const bedSprite = SpriteManager.getBedSprite(room.bed);
        if (bedSprite) PixelSprite.draw(ctx, bedSprite, 310, 140, 3);

        // Bowl
        const bowlSprite = SpriteManager.getBowlSprite(room.bowl);
        if (bowlSprite) PixelSprite.draw(ctx, bowlSprite, 360, 200, 2);

        Engine.drawText(ctx, 'Fleches: Naviguer | Espace: Choisir | Echap: Retour', 240, 305, '#888', 7, 'center');
    },

    // EPIC 8: Arcade — mini-games to earn coins
    openArcade() {
        DialogueSystem.close();
        this.screen = 'arcade';
        this._arcadeIndex = 0;
        Engine.playSound('menu');
    },

    _updateArcade(dt) {
        if (Engine.isCancelPressed()) {
            this.screen = 'playing';
            return;
        }
        if (Engine.isKeyJustPressed('ArrowUp') || Engine.isKeyJustPressed('w')) {
            this._arcadeIndex = Math.max(0, this._arcadeIndex - 1);
            Engine.playSound('menu');
        }
        if (Engine.isKeyJustPressed('ArrowDown') || Engine.isKeyJustPressed('s')) {
            this._arcadeIndex = Math.min(1, this._arcadeIndex + 1);
            Engine.playSound('menu');
        }
        if (Engine.isActionPressed()) {
            const games = ['log_jump', 'hidden_animals'];
            MinigameManager.startMinigame(games[this._arcadeIndex], {}, (result) => {
                if (result.coins > 0) {
                    this.state.coins += result.coins;
                    Engine.addParticleAtTile(Player.x, Player.y, 'coin', 5);
                    DialogueSystem.startDirect([
                        { speaker: '', text: `Tu as gagne ${result.coins} pieces !` }
                    ]);
                }
                this.screen = 'playing';
            });
        }
    },

    _renderArcade(ctx) {
        Engine.drawRect(ctx, 0, 0, 480, 320, '#1a1a3e');
        Engine.drawText(ctx, 'SALLE DE JEUX', 240, 30, '#ffdd00', 14, 'center');
        Engine.drawText(ctx, 'Gagne des pieces !', 240, 55, '#888', 8, 'center');

        const games = [
            { name: 'Saute-Bouchons', desc: 'Saute sur les rondins et ramasse les petales !' },
            { name: 'Animaux Caches', desc: 'Trouve les chiens et chats dans les images !' },
        ];

        for (let i = 0; i < games.length; i++) {
            const selected = i === this._arcadeIndex;
            Engine.drawRect(ctx, 80, 90 + i * 80, 320, 60, selected ? '#334488' : '#222244');
            ctx.strokeStyle = selected ? '#5588cc' : '#333366';
            ctx.lineWidth = 2;
            ctx.strokeRect(80, 90 + i * 80, 320, 60);
            Engine.drawText(ctx, games[i].name, 240, 102 + i * 80, selected ? '#ffdd00' : '#aaa', 11, 'center');
            Engine.drawText(ctx, games[i].desc, 240, 125 + i * 80, '#888', 7, 'center');
        }

        Engine.drawText(ctx, 'Espace: Jouer | Echap: Retour', 240, 290, '#666', 8, 'center');
    },

    // EPIC 5: Phone calls
    triggerPhoneCall(callType, animalData) {
        this.screen = 'phone';
        this._phoneCallType = callType; // 'pickup' or 'dropoff'
        this._phoneAnimalData = animalData;
        this._phoneChoiceIndex = 0;
        this._phonePhase = 'ringing'; // ringing, talking, choosing, done
        this._phoneTimer = 0;
        Engine.playSound('phone');
    },

    _updatePhone(dt) {
        this._phoneTimer += dt;

        if (this._phonePhase === 'ringing') {
            if (this._phoneTimer > 1.5 || Engine.isActionPressed()) {
                this._phonePhase = 'talking';
                this._phoneTimer = 0;
                Engine.playSound('interact');
            }
        }

        if (this._phonePhase === 'talking') {
            if (Engine.isActionPressed()) {
                this._phonePhase = 'choosing';
            }
        }

        if (this._phonePhase === 'choosing') {
            if (this._phoneCallType === 'pickup') {
                if (Engine.isKeyJustPressed('ArrowUp') || Engine.isKeyJustPressed('w')) {
                    this._phoneChoiceIndex = Math.max(0, this._phoneChoiceIndex - 1);
                    Engine.playSound('menu');
                }
                if (Engine.isKeyJustPressed('ArrowDown') || Engine.isKeyJustPressed('s')) {
                    this._phoneChoiceIndex = Math.min(PICKUP_TIMES.length - 1, this._phoneChoiceIndex + 1);
                    Engine.playSound('menu');
                }
                if (Engine.isActionPressed()) {
                    // Process pickup immediately
                    const animal = this._phoneAnimalData;
                    this._animalLeave(animal);
                    this.state.hotelAnimals = this.state.hotelAnimals.filter(a => a.id !== animal.id);
                    EntityManager.removeAnimal(animal.id);
                    this._phonePhase = 'done';
                    Engine.playSound('happy');
                }
            } else {
                // Dropoff — choose duration
                if (Engine.isKeyJustPressed('ArrowUp') || Engine.isKeyJustPressed('w')) {
                    this._phoneChoiceIndex = Math.max(0, this._phoneChoiceIndex - 1);
                    Engine.playSound('menu');
                }
                if (Engine.isKeyJustPressed('ArrowDown') || Engine.isKeyJustPressed('s')) {
                    this._phoneChoiceIndex = Math.min(STAY_DURATIONS.length - 1, this._phoneChoiceIndex + 1);
                    Engine.playSound('menu');
                }
                if (Engine.isActionPressed()) {
                    // Accept animal
                    const duration = STAY_DURATIONS[this._phoneChoiceIndex];
                    this._phoneAnimalData.stayDays = duration.days;
                    this.state.hotelAnimals.push(this._phoneAnimalData);
                    if (this.state.currentMap === 'hotel_lobby') {
                        EntityManager.loadAnimalsForMap('hotel_lobby', this.state.hotelAnimals);
                    }
                    this._phonePhase = 'done';
                    Engine.playSound('happy');
                }
            }
        }

        if (this._phonePhase === 'done') {
            if (this._phoneTimer > 1 && Engine.isActionPressed()) {
                this.screen = 'playing';
            }
        }
    },

    _renderPhone(ctx) {
        Engine.drawRect(ctx, 0, 0, 480, 320, '#1a2a1a');

        // Phone sprite
        const phoneSprite = SPRITES.phone;
        if (phoneSprite) PixelSprite.draw(ctx, phoneSprite, 220, 20, 4);

        if (this._phonePhase === 'ringing') {
            const blink = Math.sin(this._phoneTimer * 8) > 0;
            if (blink) Engine.drawText(ctx, 'DRIIIING !', 240, 80, '#ffdd00', 14, 'center');
            Engine.drawText(ctx, 'Appuie pour repondre', 240, 200, '#888', 8, 'center');
        }

        if (this._phonePhase === 'talking' || this._phonePhase === 'choosing') {
            const animal = this._phoneAnimalData;
            const typeData = ANIMAL_TYPES[animal.type];
            const msgs = this._phoneCallType === 'pickup' ? OWNER_MESSAGES.pickup_call : OWNER_MESSAGES.dropoff_call;
            let msg = msgs[Math.floor(Math.random() * msgs.length)];
            msg = msg.replace('%ANIMAL%', typeData ? typeData.name : animal.type)
                     .replace('%NAME%', animal.name)
                     .replace('%DURATION%', STAY_DURATIONS[0].label);

            // Speech bubble
            Engine.drawRect(ctx, 60, 90, 360, 50, '#fff', 0.9);
            Engine.drawText(ctx, animal.ownerName + ':', 80, 98, '#333', 8);
            Engine.drawText(ctx, msg, 80, 112, '#333', 7);
        }

        if (this._phonePhase === 'choosing') {
            if (this._phoneCallType === 'pickup') {
                Engine.drawText(ctx, 'A quelle heure passez-vous ?', 240, 155, '#ffdd00', 9, 'center');
                for (let i = 0; i < PICKUP_TIMES.length; i++) {
                    const sel = i === this._phoneChoiceIndex;
                    Engine.drawRect(ctx, 160, 170 + i * 22, 160, 18, sel ? '#4466aa' : '#333');
                    Engine.drawText(ctx, PICKUP_TIMES[i], 240, 174 + i * 22, sel ? '#fff' : '#aaa', 9, 'center');
                }
            } else {
                Engine.drawText(ctx, 'Pour combien de temps ?', 240, 155, '#ffdd00', 9, 'center');
                for (let i = 0; i < STAY_DURATIONS.length; i++) {
                    const sel = i === this._phoneChoiceIndex;
                    Engine.drawRect(ctx, 160, 170 + i * 22, 160, 18, sel ? '#4466aa' : '#333');
                    Engine.drawText(ctx, STAY_DURATIONS[i].label, 240, 174 + i * 22, sel ? '#fff' : '#aaa', 9, 'center');
                }
            }
        }

        if (this._phonePhase === 'done') {
            Engine.drawText(ctx, 'C\'est note ! Merci !', 240, 200, '#44aa44', 12, 'center');
            Engine.drawText(ctx, 'Appuie pour continuer', 240, 250, '#888', 8, 'center');
        }
    },

    // Feed select (legacy, kept for direct feeding from inventory)
    feedSelectActive: false,
    feedSelectIndex: 0,
    _feedItems: [],

    _updateFeedSelect(dt) {
        if (Engine.isKeyJustPressed('ArrowUp') || Engine.isKeyJustPressed('w')) {
            this.feedSelectIndex = Math.max(0, this.feedSelectIndex - 1); Engine.playSound('menu');
        }
        if (Engine.isKeyJustPressed('ArrowDown') || Engine.isKeyJustPressed('s')) {
            this.feedSelectIndex = Math.min(this._feedItems.length - 1, this.feedSelectIndex + 1); Engine.playSound('menu');
        }
        if (Engine.isActionPressed()) {
            const selected = this._feedItems[this.feedSelectIndex];
            if (selected && this.interactingAnimal) {
                this.interactingAnimal.feed(selected.id);
                this.removeItemFromInventory(selected.id, 1);
                QuestManager.reportAction('feed');
            }
            this.feedSelectActive = false;
        }
        if (Engine.isCancelPressed()) this.feedSelectActive = false;
    },

    _renderFeedSelect(ctx) {
        const x = 140, y = 60, w = 200;
        const h = 30 + this._feedItems.length * 24;
        ctx.fillStyle = 'rgba(0,0,20,0.9)';
        ctx.fillRect(x, y, w, h);
        ctx.strokeStyle = '#5588cc'; ctx.lineWidth = 2; ctx.strokeRect(x, y, w, h);
        ctx.fillStyle = '#ffdd57'; ctx.font = '10px monospace'; ctx.textAlign = 'center';
        ctx.fillText('Choisir nourriture', x + w/2, y + 15);
        this._feedItems.forEach((item, i) => {
            const iy = y + 28 + i * 24;
            const data = getItemData(item.id);
            const selected = i === this.feedSelectIndex;
            if (selected) { ctx.fillStyle = 'rgba(85,136,204,0.3)'; ctx.fillRect(x + 4, iy - 2, w - 8, 20); }
            ctx.fillStyle = selected ? '#fff' : '#aaa'; ctx.textAlign = 'left'; ctx.font = '9px monospace';
            ctx.fillText(`${data ? data.name : item.id} x${item.quantity}`, x + 30, iy + 10);
            const sprite = SpriteManager.getItemSprite(item.id);
            PixelSprite.draw(ctx, sprite, x + 10, iy);
        });
        ctx.textAlign = 'left';
    },

    // ==================== INVENTORY ====================
    addItemToInventory(itemId, quantity) {
        const existing = this.state.inventory.find(i => i.id === itemId);
        if (existing) {
            existing.quantity += quantity;
        } else {
            this.state.inventory.push({ id: itemId, quantity });
        }
    },

    removeItemFromInventory(itemId, quantity) {
        const existing = this.state.inventory.find(i => i.id === itemId);
        if (existing) {
            existing.quantity -= quantity;
            if (existing.quantity <= 0) {
                this.state.inventory = this.state.inventory.filter(i => i.id !== itemId);
            }
        }
    },

    hasItem(itemId, quantity = 1) {
        const existing = this.state.inventory.find(i => i.id === itemId);
        return existing && existing.quantity >= quantity;
    },

    // ==================== MENU ====================
    openMenu(tab) {
        this.screen = 'menu';
        this.menuTab = tab || 'animals';
        this.menuSelectedIndex = 0;
        document.getElementById('menu-overlay').style.display = 'block';
        this._renderMenuContent();
        Engine.playSound('menu');

        // Setup tab clicks
        document.querySelectorAll('.menu-tab').forEach(el => {
            el.classList.toggle('active', el.dataset.tab === this.menuTab);
            el.onclick = () => {
                this.menuTab = el.dataset.tab;
                document.querySelectorAll('.menu-tab').forEach(t => t.classList.toggle('active', t.dataset.tab === this.menuTab));
                this._renderMenuContent();
                Engine.playSound('menu');
            };
        });
    },

    closeMenu() {
        this.screen = 'playing';
        document.getElementById('menu-overlay').style.display = 'none';
    },

    _updateMenu(dt) {
        if (Engine.isCancelPressed() || Engine.isMenuPressed()) {
            this.closeMenu();
        }
    },

    _renderMenu(ctx) {
        // Menu is DOM-based, just keep game rendering underneath
        this._renderPlaying(ctx);
    },

    _renderMenuContent() {
        const content = document.getElementById('menu-content');
        content.innerHTML = '';

        switch (this.menuTab) {
            case 'animals':
                if (this.state.hotelAnimals.length === 0) {
                    content.innerHTML = '<div class="menu-item" style="color:#888">Aucun animal pour le moment.</div>';
                } else {
                    for (const a of this.state.hotelAnimals) {
                        const typeData = ANIMAL_TYPES[a.type];
                        const mood = ((a.hunger + a.happiness + a.cleanliness + a.health) / 4);
                        const moodColor = mood >= 70 ? '#44aa44' : mood >= 40 ? '#ffaa00' : '#cc4444';
                        content.innerHTML += `
                            <div class="menu-item">
                                <div style="color:#ffdd57;font-weight:bold">${a.name} - ${typeData ? typeData.name : a.type} ${typeData && typeData.vip ? '(VIP)' : ''}</div>
                                <div style="font-size:11px;margin-top:4px;">
                                    Faim: <span style="color:${a.hunger < 30 ? '#cc4444' : '#44aa44'}">${Math.floor(a.hunger)}%</span> |
                                    Joie: <span style="color:${a.happiness < 30 ? '#cc4444' : '#44aa44'}">${Math.floor(a.happiness)}%</span> |
                                    Proprete: <span style="color:${a.cleanliness < 30 ? '#cc4444' : '#44aa44'}">${Math.floor(a.cleanliness)}%</span> |
                                    Sante: <span style="color:${a.health < 50 ? '#cc4444' : '#44aa44'}">${Math.floor(a.health)}%</span>
                                </div>
                                <div style="font-size:10px;color:${moodColor};margin-top:2px;">Humeur: ${mood >= 70 ? 'Content' : mood >= 40 ? 'Bien' : 'Triste'}</div>
                            </div>
                        `;
                    }
                }
                break;

            case 'inventory':
                if (this.state.inventory.length === 0) {
                    content.innerHTML = '<div class="menu-item" style="color:#888">Inventaire vide.</div>';
                } else {
                    for (const inv of this.state.inventory) {
                        const data = getItemData(inv.id);
                        content.innerHTML += `
                            <div class="menu-item">
                                <span style="color:#ffdd57">${data ? data.name : inv.id}</span> x${inv.quantity}
                                <div style="font-size:10px;color:#888">${data ? data.description : ''}</div>
                            </div>
                        `;
                    }
                }
                content.innerHTML += `<div class="menu-item" style="color:#ffd700">Pieces: ${this.state.coins} | Etoiles: ${this.state.stars}</div>`;
                break;

            case 'quests':
                const active = QuestManager.activeQuests;
                if (active.length === 0) {
                    content.innerHTML = '<div class="menu-item" style="color:#888">Aucune quete active.</div>';
                } else {
                    for (const q of active) {
                        let objText = q.objectives.map(o =>
                            `${o.progress >= o.count ? '[OK]' : `[${o.progress}/${o.count}]`} ${o.text}`
                        ).join('<br>');
                        content.innerHTML += `
                            <div class="menu-item">
                                <div style="color:#ffdd57;font-weight:bold">${q.name}</div>
                                <div style="font-size:10px;color:#aaa;margin-top:2px;">${q.description}</div>
                                <div style="font-size:10px;color:#88bbff;margin-top:4px;">${objText}</div>
                            </div>
                        `;
                    }
                }
                // Completed quests
                if (QuestManager.completedQuests.length > 0) {
                    content.innerHTML += '<div style="color:#888;padding:8px;font-size:10px;">-- Quetes terminees --</div>';
                    for (const qId of QuestManager.completedQuests) {
                        const qData = QUEST_DATA[qId];
                        if (qData) {
                            content.innerHTML += `<div class="menu-item" style="color:#555">[OK] ${qData.name}</div>`;
                        }
                    }
                }
                break;

            case 'save':
                content.innerHTML = `
                    <div class="menu-item" onclick="Game.saveCurrentGame()" style="cursor:pointer;color:#44aa44">
                        Sauvegarder la partie
                    </div>
                    <div class="menu-item" style="color:#888">
                        Jour ${this.state.dayCount} | Chapitre ${this.state.chapter}
                    </div>
                    <div class="menu-item" style="color:#888">
                        ${this.state.hotelAnimals.length} animaux | ${this.state.coins} pieces | ${this.state.stars} etoiles
                    </div>
                `;
                break;
        }
    },

    // ==================== SHOP ====================
    openShop() {
        DialogueSystem.close();
        this.screen = 'shop';
        this.shopPage = 0;
        this.menuSelectedIndex = 0;
        Engine.playSound('menu');
    },

    _updateShop(dt) {
        if (Engine.isCancelPressed()) {
            this.screen = 'playing';
            return;
        }

        // Navigate shelves (left/right) and items (up/down)
        if (!this._shopShelfIndex) this._shopShelfIndex = 0;
        if (!this._shopItemIndex) this._shopItemIndex = 0;

        if (Engine.isKeyJustPressed('ArrowLeft') || Engine.isKeyJustPressed('q')) {
            this._shopShelfIndex = Math.max(0, this._shopShelfIndex - 1);
            this._shopItemIndex = 0;
            Engine.playSound('menu');
        }
        if (Engine.isKeyJustPressed('ArrowRight') || Engine.isKeyJustPressed('d')) {
            this._shopShelfIndex = Math.min(SHOP_SHELVES.length - 1, this._shopShelfIndex + 1);
            this._shopItemIndex = 0;
            Engine.playSound('menu');
        }

        const shelf = SHOP_SHELVES[this._shopShelfIndex];
        if (shelf) {
            if (Engine.isKeyJustPressed('ArrowUp') || Engine.isKeyJustPressed('w') || Engine.isKeyJustPressed('z')) {
                this._shopItemIndex = Math.max(0, this._shopItemIndex - 1);
                Engine.playSound('menu');
            }
            if (Engine.isKeyJustPressed('ArrowDown') || Engine.isKeyJustPressed('s')) {
                this._shopItemIndex = Math.min(shelf.items.length - 1, this._shopItemIndex + 1);
                Engine.playSound('menu');
            }

            // Click/tap
            if (Engine.wasClicked()) {
                const mp = Engine.getMousePos();
                // Shelf tabs at top
                for (let i = 0; i < SHOP_SHELVES.length; i++) {
                    if (Engine.isPointInRect(mp.x, mp.y, 10 + i * 78, 35, 74, 20)) {
                        this._shopShelfIndex = i;
                        this._shopItemIndex = 0;
                        Engine.playSound('menu');
                    }
                }
                // Item rows
                for (let i = 0; i < shelf.items.length; i++) {
                    if (Engine.isPointInRect(mp.x, mp.y, 80, 90 + i * 36, 320, 32)) {
                        this._shopItemIndex = i;
                        this.buyItem(shelf.items[i]);
                    }
                }
            }

            if (Engine.isActionPressed()) {
                const itemId = shelf.items[this._shopItemIndex];
                if (itemId) this.buyItem(itemId);
            }
        }
    },

    _renderShop(ctx) {
        this._renderPlaying(ctx);

        // Shop overlay (Epic 3: real shop with shelves)
        ctx.fillStyle = 'rgba(0,0,20,0.92)';
        ctx.fillRect(10, 25, 460, 270);
        ctx.strokeStyle = '#5588cc';
        ctx.lineWidth = 2;
        ctx.strokeRect(10, 25, 460, 270);

        ctx.fillStyle = '#ffdd57';
        ctx.font = '12px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('BOUTIQUE DE FELIX', 240, 48);

        // Coins
        ctx.fillStyle = '#ffd700';
        ctx.font = '9px monospace';
        ctx.fillText(`Pieces: ${this.state.coins}`, 400, 48);

        // Shopping list indicator
        const missing = getShoppingList(this.state.fridge || []);
        if (missing.length > 0) {
            ctx.fillStyle = '#ff8888';
            ctx.font = '7px monospace';
            ctx.fillText(`${missing.length} article(s) manquant(s) au frigo`, 240, 60);
        }

        // Shelf tabs
        for (let i = 0; i < SHOP_SHELVES.length; i++) {
            const active = i === (this._shopShelfIndex || 0);
            Engine.drawRect(ctx, 10 + i * 78, 65, 74, 20, active ? '#446688' : '#223344');
            Engine.drawText(ctx, SHOP_SHELVES[i].name, 47 + i * 78, 70, active ? '#fff' : '#888', 6, 'center');
        }

        // Items in selected shelf
        const shelf = SHOP_SHELVES[this._shopShelfIndex || 0];
        if (shelf) {
            for (let i = 0; i < shelf.items.length; i++) {
                const itemId = shelf.items[i];
                const data = getItemData(itemId);
                if (!data) continue;
                const y = 90 + i * 36;
                const selected = i === (this._shopItemIndex || 0);

                Engine.drawRect(ctx, 80, y, 320, 32, selected ? 'rgba(85,136,204,0.3)' : 'rgba(30,30,50,0.5)');
                if (selected) {
                    ctx.strokeStyle = '#5588cc'; ctx.lineWidth = 1; ctx.strokeRect(80, y, 320, 32);
                }

                // Sprite
                const sprite = SpriteManager.getItemSprite(itemId);
                if (sprite) PixelSprite.draw(ctx, sprite, 90, y + 4, 2);

                // Name + description
                Engine.drawText(ctx, data.name, 118, y + 4, selected ? '#fff' : '#ccc', 9);
                Engine.drawText(ctx, data.description || '', 118, y + 16, '#888', 6);

                // Price
                const canAfford = this.state.coins >= data.buyPrice;
                Engine.drawText(ctx, `${data.buyPrice} p`, 370, y + 8, canAfford ? '#ffd700' : '#cc4444', 9);

                // In fridge indicator
                const inFridge = (this.state.fridge || []).find(f => f.id === itemId);
                if (inFridge && inFridge.quantity > 0) {
                    Engine.drawText(ctx, `(frigo: ${inFridge.quantity})`, 370, y + 20, '#66aa66', 6);
                }
            }
        }

        ctx.textAlign = 'center';
        ctx.fillStyle = '#888';
        ctx.font = '8px monospace';
        ctx.fillText('G/D: Rayon | H/B: Article | Espace: Acheter | Echap: Fermer', 240, 283);
        ctx.textAlign = 'left';
    },

    buyItem(itemId) {
        const data = getItemData(itemId);
        if (!data) return;

        if (this.state.coins < data.buyPrice) {
            Engine.playSound('error');
            return;
        }

        this.state.coins -= data.buyPrice;

        // Food items go to fridge, tools go to inventory
        if (data.type === 'food' || data.type === 'ingredient') {
            this.addToFridge(itemId, 1);
        } else {
            this.addItemToInventory(itemId, 1);
        }
        QuestManager.reportAction('buy', { itemId });
        Engine.playSound('buy');
    },

    addToFridge(itemId, quantity) {
        if (!this.state.fridge) this.state.fridge = [];
        const existing = this.state.fridge.find(f => f.id === itemId);
        if (existing) {
            existing.quantity += quantity;
        } else {
            this.state.fridge.push({ id: itemId, quantity });
        }
    },

    // ==================== DAY CYCLE & EVENTS ====================
    _onNewDay() {
        // Auto-save each new day (silent)
        this._autoSave();

        // EPIC 5: Phone call for new animal (instead of just appearing)
        if (this.state.hotelAnimals.length < 6 && Math.random() < 0.5) {
            this._phoneCallNewAnimal();
        }

        // Check for animal pickup (stay expired)
        for (let i = this.state.hotelAnimals.length - 1; i >= 0; i--) {
            const a = this.state.hotelAnimals[i];
            if (a.stayDays !== undefined) {
                a.stayDays--;
                if (a.stayDays <= 0) {
                    // EPIC 5: Phone call for pickup
                    this._phoneCallPickup(a);
                    return; // One at a time
                }
            }
        }
    },

    _phoneCallNewAnimal() {
        const includeVIP = this.state.stars >= 5;
        const type = getRandomAnimalType(includeVIP);
        const typeData = ANIMAL_TYPES[type];
        const ownerName = getRandomOwnerName();
        const names = ['Milo', 'Luna', 'Noisette', 'Caramel', 'Plume', 'Flocon', 'Biscuit', 'Cookie', 'Pompon', 'Bulle'];
        const name = names[Math.floor(Math.random() * names.length)];

        const animal = {
            id: 'animal_' + Date.now(),
            type,
            name,
            ownerName,
            x: 14 + Math.floor(Math.random() * 3) - 1,
            y: 8 + Math.floor(Math.random() * 4),
            mapId: 'hotel_lobby',
            hunger: 50 + Math.random() * 30,
            happiness: 50 + Math.random() * 30,
            cleanliness: 50 + Math.random() * 30,
            health: 80 + Math.random() * 20,
        };

        // Trigger phone call
        this.triggerPhoneCall('dropoff', animal);
    },

    _phoneCallPickup(animal) {
        this.triggerPhoneCall('pickup', animal);
    },

    // Legacy: direct arrival (for tutorial)
    _newAnimalArrival() {
        this._phoneCallNewAnimal();
    },

    _animalLeave(animal) {
        const typeData = ANIMAL_TYPES[animal.type];
        const avg = (animal.hunger + animal.happiness + animal.cleanliness + animal.health) / 4;

        if (avg >= 60) {
            // Happy departure
            const coinReward = 20 + Math.floor(avg / 2);
            const starReward = avg >= 80 ? 2 : 1;
            this.state.coins += coinReward;
            this.state.stars += starReward;

            DialogueSystem.startDirect([
                { speaker: animal.ownerName, text: `Merci d'avoir pris soin de ${animal.name} !` },
                { speaker: '', text: `Tu recois ${coinReward} pieces et ${starReward} etoile(s) !` },
            ]);
            Engine.addParticle(Player.x, Player.y, 'star');
        } else {
            // Sad departure
            this.state.coins += 5;
            DialogueSystem.startDirect([
                { speaker: animal.ownerName, text: `${animal.name} n'a pas l'air tres content...` },
                { speaker: '', text: `Tu recois 5 pieces. Essaie de faire mieux !` },
            ]);
        }

        // Remove from entity manager
        EntityManager.removeAnimal(animal.id);
    },

    _randomEvent() {
        const events = [
            () => {
                // Nothing
            },
            () => {
                // Random coin find
                this.state.coins += 5;
                Engine.addParticle(Player.x, Player.y, 'coin');
                DialogueSystem.startDirect([
                    { speaker: '', text: 'Tu as trouve 5 pieces par terre !' }
                ]);
            },
        ];
        events[Math.floor(Math.random() * events.length)]();
    },

    // ==================== STATE SYNC ====================
    _syncAnimalStates() {
        // Update game state with current entity states
        for (const entity of EntityManager.animals) {
            const stateAnimal = this.state.hotelAnimals.find(a => a.id === entity.id);
            if (stateAnimal) {
                stateAnimal.hunger = entity.hunger;
                stateAnimal.happiness = entity.happiness;
                stateAnimal.cleanliness = entity.cleanliness;
                stateAnimal.health = entity.health;
                stateAnimal.x = entity.x;
                stateAnimal.y = entity.y;
            }
        }
    },

    // ==================== SAVE ====================
    _buildSaveState() {
        this._syncAnimalStates();
        const state = { ...this.state };
        state.playerX = Player.x;
        state.playerY = Player.y;
        state.playerDirection = Player.direction;
        const questState = QuestManager.serialize();
        state.activeQuests = questState.activeQuests;
        state.completedQuests = questState.completedQuests;
        return state;
    },

    _autoSave() {
        Engine.saveGame(this._buildSaveState());
        this._showSaveToast('Sauvegarde auto...');
    },

    saveCurrentGame() {
        if (Engine.saveGame(this._buildSaveState())) {
            Engine.playSound('quest');
            this._showSaveToast('Partie sauvegardee !');
        } else {
            this._showSaveToast('Erreur de sauvegarde...');
        }
    },

    _showSaveToast(msg) {
        let toast = document.getElementById('save-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'save-toast';
            toast.style.cssText = 'position:absolute;top:48px;right:8px;background:rgba(0,180,80,0.92);color:#fff;padding:5px 12px;border-radius:6px;font-family:monospace;font-size:12px;z-index:50;pointer-events:none;transition:opacity 0.5s';
            document.getElementById('game-wrapper').appendChild(toast);
        }
        toast.textContent = msg;
        toast.style.opacity = '1';
        clearTimeout(this._saveToastTimer);
        this._saveToastTimer = setTimeout(() => { toast.style.opacity = '0'; }, 1800);
    },

    // ==================== HUD ====================
    _updateHUD() {
        const loc = document.getElementById('hud-location');
        const coins = document.getElementById('hud-coins');
        const stars = document.getElementById('hud-stars');
        if (loc) {
            const map = MapManager.getMap(this.state.currentMap);
            loc.textContent = map.name || this.state.currentMap;
        }
        if (coins) coins.textContent = this.state.coins + ' pieces';
        if (stars) stars.textContent = this.state.stars + ' etoiles';
    },
};

// ==================== BOOT ====================
window.addEventListener('load', () => {
    Game.init();
});

// Resume audio context on first user interaction
document.addEventListener('click', () => {
    if (Engine.audioCtx && Engine.audioCtx.state === 'suspended') {
        Engine.audioCtx.resume();
    }
}, { once: true });
document.addEventListener('keydown', () => {
    if (Engine.audioCtx && Engine.audioCtx.state === 'suspended') {
        Engine.audioCtx.resume();
    }
}, { once: true });
