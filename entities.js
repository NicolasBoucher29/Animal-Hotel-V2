// ============================================================
// ENTITIES.JS — Entity System for Animal Hotel V2
// ============================================================

// ==================== PLAYER ENTITY ====================
const Player = {
    x: 14,
    y: 10,
    px: 14 * 16, // pixel position for smooth movement
    py: 10 * 16,
    direction: 'down',
    walking: false,
    walkTimer: 0,
    walkSpeed: 5, // tiles per second
    walkFrame: 0,
    gender: 'boy',
    moveBuffer: 0,

    init(state) {
        this.x = state.playerX;
        this.y = state.playerY;
        this.px = this.x * 16;
        this.py = this.y * 16;
        this.direction = state.playerDirection || 'down';
        this.gender = state.playerGender || 'boy';
        this.walking = false;
    },

    update(dt) {
        // Smooth pixel movement toward target tile
        const targetPx = this.x * 16;
        const targetPy = this.y * 16;
        const moveSpeed = this.walkSpeed * 16 * dt;

        if (Math.abs(this.px - targetPx) > 0.5) {
            this.px += Math.sign(targetPx - this.px) * Math.min(moveSpeed, Math.abs(targetPx - this.px));
            this.walking = true;
        } else if (Math.abs(this.py - targetPy) > 0.5) {
            this.py += Math.sign(targetPy - this.py) * Math.min(moveSpeed, Math.abs(targetPy - this.py));
            this.walking = true;
        } else {
            this.px = targetPx;
            this.py = targetPy;
            this.walking = false;
        }

        // Walk animation
        if (this.walking) {
            this.walkTimer += dt;
            if (this.walkTimer > 0.15) {
                this.walkTimer -= 0.15;
                this.walkFrame = (this.walkFrame + 1) % 2;
            }
        } else {
            this.walkFrame = 0;
            this.walkTimer = 0;
        }
    },

    tryMove(dx, dy, mapId) {
        // Can only move if at target position
        if (this.walking) return false;

        // Set direction even if can't move
        if (dx < 0) this.direction = 'left';
        else if (dx > 0) this.direction = 'right';
        else if (dy < 0) this.direction = 'up';
        else if (dy > 0) this.direction = 'down';

        const newX = this.x + dx;
        const newY = this.y + dy;

        // Check walkability
        if (!MapManager.isWalkable(mapId, newX, newY)) return false;

        // Check entity collisions
        if (EntityManager.hasBlockingEntity(mapId, newX, newY)) return false;

        this.x = newX;
        this.y = newY;
        return true;
    },

    getFacingTile() {
        const dirs = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };
        const [dx, dy] = dirs[this.direction];
        return { x: this.x + dx, y: this.y + dy };
    },

    render(ctx) {
        const sprite = SpriteManager.getPlayerSprite(this.gender, this.direction, this.walkFrame);
        const px = this.px - Math.floor(Engine.camera.x);
        const py = this.py - Math.floor(Engine.camera.y);
        const flip = this.direction === 'right';
        if (flip) {
            PixelSprite.drawFlipped(ctx, sprite, px, py);
        } else {
            PixelSprite.draw(ctx, sprite, px, py);
        }
    }
};

// ==================== ANIMAL ENTITY ====================
class AnimalEntity {
    constructor(data) {
        this.id = data.id || 'animal_' + Date.now();
        this.type = data.type; // dog, cat, etc.
        this.name = data.name || 'Animal';
        this.ownerName = data.ownerName || '';
        this.x = data.x || 5;
        this.y = data.y || 5;
        this.px = this.x * 16;
        this.py = this.y * 16;
        this.direction = 'down';
        this.mapId = data.mapId || 'animal_room';

        // Needs (0-100)
        this.hunger = data.hunger !== undefined ? data.hunger : 70;
        this.happiness = data.happiness !== undefined ? data.happiness : 70;
        this.cleanliness = data.cleanliness !== undefined ? data.cleanliness : 70;
        this.health = data.health !== undefined ? data.health : 100;

        // AI state
        this.aiState = 'idle';
        this.aiTimer = Math.random() * 3;
        this.wanderTarget = null;
        this.walking = false;
        this.animFrame = 0;
        this.animTimer = 0;

        // Emotion
        this.emotionBubble = null;
        this.emotionTimer = 0;

        // VIP
        this.typeData = ANIMAL_TYPES[this.type] || ANIMAL_TYPES.dog;
        this.isVIP = this.typeData.vip;
    }

    update(dt) {
        // Decay needs over time
        const typeData = this.typeData;
        this.hunger = Math.max(0, this.hunger - typeData.careNeeds.hunger * dt * 2);
        this.happiness = Math.max(0, this.happiness - typeData.careNeeds.happiness * dt * 1.5);
        this.cleanliness = Math.max(0, this.cleanliness - typeData.careNeeds.cleanliness * dt * 1);
        if (this.hunger < 20 || this.cleanliness < 20) {
            this.health = Math.max(0, this.health - typeData.careNeeds.health * dt * 3);
        }

        // Show emotion bubbles based on needs
        this.emotionTimer -= dt;
        if (this.emotionTimer <= 0) {
            this.emotionTimer = 3;
            if (this.hunger < 30) this.emotionBubble = 'hungry';
            else if (this.happiness < 30) this.emotionBubble = 'sad';
            else if (this.happiness > 80) this.emotionBubble = 'happy';
            else this.emotionBubble = null;
        }

        // AI behavior
        this.aiTimer -= dt;
        if (this.aiTimer <= 0) {
            this._updateAI();
        }

        // Smooth movement
        const targetPx = this.x * 16;
        const targetPy = this.y * 16;
        const speed = 32 * dt;
        if (Math.abs(this.px - targetPx) > 0.5) {
            this.px += Math.sign(targetPx - this.px) * Math.min(speed, Math.abs(targetPx - this.px));
            this.walking = true;
        } else if (Math.abs(this.py - targetPy) > 0.5) {
            this.py += Math.sign(targetPy - this.py) * Math.min(speed, Math.abs(targetPy - this.py));
            this.walking = true;
        } else {
            this.px = targetPx;
            this.py = targetPy;
            this.walking = false;
        }

        // Animation
        this.animTimer += dt;
        if (this.animTimer > 0.3) {
            this.animTimer -= 0.3;
            this.animFrame = (this.animFrame + 1) % 2;
        }
    }

    _updateAI() {
        // Simple wander AI
        this.aiTimer = 1 + Math.random() * 3;

        if (this.walking) return;

        const action = Math.random();
        if (action < 0.4) {
            // Idle
            this.aiState = 'idle';
        } else {
            // Try to wander
            const dirs = [[0, -1], [0, 1], [-1, 0], [1, 0]];
            const dir = dirs[Math.floor(Math.random() * dirs.length)];
            const newX = this.x + dir[0];
            const newY = this.y + dir[1];

            if (MapManager.isWalkable(this.mapId, newX, newY)) {
                // Don't walk on player
                if (!(newX === Player.x && newY === Player.y)) {
                    this.x = newX;
                    this.y = newY;
                    if (dir[0] < 0) this.direction = 'left';
                    else if (dir[0] > 0) this.direction = 'right';
                    else if (dir[1] < 0) this.direction = 'up';
                    else this.direction = 'down';
                }
            }
        }
    }

    feed(foodId) {
        const food = FOOD_ITEMS[foodId];
        if (!food) return false;

        // Check if animal likes this food
        if (!this.typeData.foods.includes(foodId)) {
            this.showEmotion('sad');
            return false;
        }

        this.hunger = Math.min(100, this.hunger + food.effects.hunger);
        this.happiness = Math.min(100, this.happiness + (food.effects.happiness || 0));
        this.showEmotion('happy');
        Engine.addParticle(this.x, this.y, 'heart');
        Engine.playSound('interact');
        return true;
    }

    groom() {
        this.cleanliness = Math.min(100, this.cleanliness + 40);
        this.happiness = Math.min(100, this.happiness + 10);
        this.showEmotion('happy');
        Engine.addParticle(this.x, this.y, 'sparkle');
        Engine.playSound('interact');
    }

    play() {
        this.happiness = Math.min(100, this.happiness + 30);
        this.showEmotion('happy');
        Engine.addParticle(this.x, this.y, 'star');
        Engine.playSound('interact');
    }

    heal() {
        this.health = Math.min(100, this.health + 50);
        this.showEmotion('happy');
        Engine.addParticle(this.x, this.y, 'sparkle');
        Engine.playSound('heal');
    }

    showEmotion(emotion) {
        this.emotionBubble = emotion;
        this.emotionTimer = 2;
    }

    getMood() {
        const avg = (this.hunger + this.happiness + this.cleanliness + this.health) / 4;
        if (avg >= 80) return 'ecstatic';
        if (avg >= 60) return 'happy';
        if (avg >= 40) return 'ok';
        if (avg >= 20) return 'sad';
        return 'miserable';
    }

    getMoodText() {
        const moods = {
            ecstatic: 'Extatique !',
            happy: 'Content',
            ok: 'Bien',
            sad: 'Triste',
            miserable: 'Malheureux'
        };
        return moods[this.getMood()] || 'Bien';
    }

    render(ctx) {
        const sprite = SpriteManager.getAnimalSprite(this.typeData.spriteId, this.animFrame);
        const px = this.px - Math.floor(Engine.camera.x);
        const py = this.py - Math.floor(Engine.camera.y);
        PixelSprite.draw(ctx, sprite, px, py);

        // Emotion bubble
        if (this.emotionBubble) {
            const emotionSprite = SPRITES['emotion_' + this.emotionBubble];
            if (emotionSprite) {
                PixelSprite.draw(ctx, emotionSprite, px + 4, py - 10);
            }
        }
    }

    serialize() {
        return {
            id: this.id, type: this.type, name: this.name, ownerName: this.ownerName,
            x: this.x, y: this.y, mapId: this.mapId,
            hunger: this.hunger, happiness: this.happiness,
            cleanliness: this.cleanliness, health: this.health,
        };
    }
}

// ==================== NPC ENTITY ====================
class NPCEntity {
    constructor(data) {
        this.id = data.id;
        this.spriteType = data.spriteType || 'villager';
        this.x = data.x;
        this.y = data.y;
        this.direction = data.direction || 'down';
        this.dialogueId = data.dialogue;
        this.mapId = data.mapId || '';
        this.animFrame = 0;
        this.animTimer = 0;
        this.hasQuest = false;
    }

    update(dt) {
        this.animTimer += dt;
        if (this.animTimer > 0.5) {
            this.animTimer -= 0.5;
            this.animFrame = (this.animFrame + 1) % 2;
        }
    }

    render(ctx) {
        const sprite = SpriteManager.getNPCSprite(this.spriteType, this.animFrame);
        const px = this.x * 16 - Math.floor(Engine.camera.x);
        const py = this.y * 16 - Math.floor(Engine.camera.y);
        PixelSprite.draw(ctx, sprite, px, py);

        // Quest marker
        if (this.hasQuest) {
            PixelSprite.draw(ctx, SPRITES.quest_marker, px + 5, py - 8);
        }

        // Speech bubble when player is nearby
        const dist = Math.abs(Player.x - this.x) + Math.abs(Player.y - this.y);
        if (dist <= 2) {
            PixelSprite.draw(ctx, SPRITES.speech_bubble, px + 4, py - 8);
        }
    }
}

// ==================== ITEM ENTITY (pickups on ground) ====================
class ItemEntity {
    constructor(data) {
        this.id = data.id;
        this.itemType = data.itemType;
        this.x = data.x;
        this.y = data.y;
        this.collected = false;
        this.respawn = data.respawn || false;
        this.respawnTimer = 0;
        this.bobOffset = Math.random() * Math.PI * 2;
    }

    update(dt) {
        if (this.collected && this.respawn) {
            this.respawnTimer -= dt;
            if (this.respawnTimer <= 0) {
                this.collected = false;
            }
        }
        this.bobOffset += dt * 3;
    }

    collect() {
        if (this.collected) return false;
        this.collected = true;
        this.respawnTimer = 30; // 30 seconds to respawn
        Engine.addParticle(this.x, this.y, 'sparkle');
        Engine.playSound('coin');
        return true;
    }

    render(ctx) {
        if (this.collected) return;
        const sprite = SpriteManager.getItemSprite(this.itemType);
        const px = this.x * 16 - Math.floor(Engine.camera.x) + 4;
        const py = this.y * 16 - Math.floor(Engine.camera.y) + 2 + Math.sin(this.bobOffset) * 2;
        PixelSprite.draw(ctx, sprite, px, py);
    }
}

// ==================== ENTITY MANAGER ====================
const EntityManager = {
    npcs: [],
    animals: [],
    items: [],

    init() {
        this.npcs = [];
        this.animals = [];
        this.items = [];
    },

    loadMapEntities(mapId) {
        // Clear non-persistent entities
        this.npcs = [];
        this.items = [];

        const map = MapManager.getMap(mapId);
        for (const e of map.entities) {
            if (e.type === 'npc') {
                const npc = new NPCEntity({
                    id: e.id,
                    spriteType: e.spriteType,
                    x: e.x,
                    y: e.y,
                    direction: e.direction,
                    dialogue: e.dialogue,
                    mapId: mapId,
                });
                // Check if NPC has active quest
                if (typeof QuestManager !== 'undefined') {
                    npc.hasQuest = QuestManager.npcHasQuest(e.id);
                }
                this.npcs.push(npc);
            } else if (e.type === 'item') {
                const item = new ItemEntity({
                    id: e.id,
                    itemType: e.itemType,
                    x: e.x,
                    y: e.y,
                    respawn: e.respawn,
                });
                this.items.push(item);
            }
        }
    },

    loadAnimalsForMap(mapId, gameAnimals) {
        this.animals = [];
        for (const animalData of gameAnimals) {
            if (animalData.mapId === mapId) {
                const animal = new AnimalEntity(animalData);
                this.animals.push(animal);
            }
        }
    },

    update(dt) {
        for (const npc of this.npcs) npc.update(dt);
        for (const animal of this.animals) animal.update(dt);
        for (const item of this.items) item.update(dt);
    },

    render(ctx) {
        // Collect all entities, sort by Y for depth
        const all = [
            ...this.npcs.map(e => ({ entity: e, y: e.y })),
            ...this.animals.map(e => ({ entity: e, y: e.y })),
            ...this.items.map(e => ({ entity: e, y: e.y })),
            { entity: Player, y: Player.y },
        ];
        all.sort((a, b) => a.y - b.y);

        for (const entry of all) {
            entry.entity.render(ctx);
        }
    },

    getEntityAt(x, y) {
        for (const npc of this.npcs) {
            if (npc.x === x && npc.y === y) return npc;
        }
        for (const animal of this.animals) {
            if (animal.x === x && animal.y === y) return animal;
        }
        for (const item of this.items) {
            if (item.x === x && item.y === y && !item.collected) return item;
        }
        return null;
    },

    hasBlockingEntity(mapId, x, y) {
        for (const npc of this.npcs) {
            if (npc.x === x && npc.y === y) return true;
        }
        for (const animal of this.animals) {
            if (animal.x === x && animal.y === y) return true;
        }
        return false;
    },

    getAnimalById(id) {
        return this.animals.find(a => a.id === id) || null;
    },

    addAnimal(animalData) {
        const animal = new AnimalEntity(animalData);
        this.animals.push(animal);
        return animal;
    },

    removeAnimal(id) {
        this.animals = this.animals.filter(a => a.id !== id);
    },

    serializeAnimals() {
        return this.animals.map(a => a.serialize());
    }
};
