// ============================================================
// QUESTS.JS — Quest System for Animal Hotel V2
// ============================================================

const QUEST_DATA = {
    // CHAPTER 1 quests
    tutorial_care: {
        id: 'tutorial_care',
        name: 'Premiers Soins',
        description: 'Nourris et brosse ton premier animal.',
        type: 'CARE',
        chapter: 1,
        npcId: 'receptionist',
        objectives: [
            { id: 'feed_animal', text: 'Nourrir un animal', type: 'action', action: 'feed', count: 1, progress: 0 },
            { id: 'groom_animal', text: 'Brosser un animal', type: 'action', action: 'groom', count: 1, progress: 0 },
        ],
        rewards: { coins: 20, stars: 1, items: [] },
        dialogueStart: 'quest_tutorial_start',
        dialogueComplete: 'quest_tutorial_complete',
    },
    first_animal: {
        id: 'first_animal',
        name: 'Premier Client',
        description: 'Accueille ton premier animal a l\'hotel.',
        type: 'STORY',
        chapter: 1,
        npcId: 'receptionist',
        objectives: [
            { id: 'welcome_animal', text: 'Accueillir un animal', type: 'flag', flag: 'first_animal_welcomed', count: 1, progress: 0 },
        ],
        rewards: { coins: 30, stars: 1, items: ['apple'] },
        dialogueStart: 'quest_first_animal_start',
        dialogueComplete: 'quest_first_animal_complete',
    },

    // CHAPTER 2 quests
    village_explore: {
        id: 'village_explore',
        name: 'Decouverte du Village',
        description: 'Explore le village et parle aux habitants.',
        type: 'EXPLORE',
        chapter: 2,
        npcId: 'questgiver',
        objectives: [
            { id: 'visit_shop', text: 'Visiter la boutique', type: 'visit_map', map: 'shop', count: 1, progress: 0 },
            { id: 'talk_villager', text: 'Parler a un villageois', type: 'talk', npcId: 'villager1', count: 1, progress: 0 },
        ],
        rewards: { coins: 40, stars: 2, items: ['potion'] },
        dialogueStart: 'quest_village_start',
        dialogueComplete: 'quest_village_complete',
    },
    shopping_trip: {
        id: 'shopping_trip',
        name: 'Courses au Village',
        description: 'Achete de la nourriture pour tes animaux.',
        type: 'FETCH',
        chapter: 2,
        npcId: 'shopkeeper',
        objectives: [
            { id: 'buy_food', text: 'Acheter 3 aliments', type: 'action', action: 'buy', count: 3, progress: 0 },
        ],
        rewards: { coins: 25, stars: 1, items: [] },
        dialogueStart: 'quest_shopping_start',
        dialogueComplete: 'quest_shopping_complete',
    },

    // CHAPTER 3 quests
    forest_explore: {
        id: 'forest_explore',
        name: 'La Foret Mystérieuse',
        description: 'Explore la foret enchantee et trouve des baies.',
        type: 'EXPLORE',
        chapter: 3,
        npcId: 'questgiver',
        objectives: [
            { id: 'visit_forest', text: 'Explorer la foret', type: 'visit_map', map: 'forest', count: 1, progress: 0 },
            { id: 'find_berries', text: 'Trouver 2 baies de lune', type: 'collect', itemId: 'moonberry', count: 2, progress: 0 },
        ],
        rewards: { coins: 50, stars: 3, items: ['moonberry', 'moonberry'] },
        dialogueStart: 'quest_forest_start',
        dialogueComplete: 'quest_forest_complete',
    },
    lost_pet: {
        id: 'lost_pet',
        name: 'Animal Perdu !',
        description: 'Un animal s\'est echappe ! Retrouve-le dans la foret.',
        type: 'RESCUE',
        chapter: 3,
        npcId: 'gardener',
        objectives: [
            { id: 'find_pet', text: 'Trouver l\'animal perdu', type: 'flag', flag: 'lost_pet_found', count: 1, progress: 0 },
            { id: 'return_pet', text: 'Ramener l\'animal', type: 'flag', flag: 'lost_pet_returned', count: 1, progress: 0 },
        ],
        rewards: { coins: 60, stars: 3, items: ['potion'] },
        dialogueStart: 'quest_lost_pet_start',
        dialogueComplete: 'quest_lost_pet_complete',
    },

    // CHAPTER 4 quests
    vip_arrival: {
        id: 'vip_arrival',
        name: 'Un Visiteur Special',
        description: 'Un animal magique arrive a l\'hotel !',
        type: 'STORY',
        chapter: 4,
        npcId: 'questgiver',
        objectives: [
            { id: 'welcome_vip', text: 'Accueillir l\'animal VIP', type: 'flag', flag: 'vip_welcomed', count: 1, progress: 0 },
            { id: 'care_vip', text: 'Prendre soin de l\'animal VIP', type: 'action', action: 'feed', count: 3, progress: 0 },
        ],
        rewards: { coins: 100, stars: 5, items: ['rainbow_flower'] },
        dialogueStart: 'quest_vip_start',
        dialogueComplete: 'quest_vip_complete',
    },
    unicorn_quest: {
        id: 'unicorn_quest',
        name: 'La Quete de la Licorne',
        description: 'Trouve des fleurs arc-en-ciel pour la licorne.',
        type: 'FETCH',
        chapter: 4,
        npcId: 'questgiver',
        objectives: [
            { id: 'find_flowers', text: 'Trouver 3 fleurs arc-en-ciel', type: 'collect', itemId: 'rainbow_flower', count: 3, progress: 0 },
        ],
        rewards: { coins: 150, stars: 10, items: [] },
        dialogueStart: 'quest_unicorn_start',
        dialogueComplete: 'quest_unicorn_complete',
    },
};

// Quest-specific dialogues
Object.assign(DIALOGUES, {
    quest_tutorial_start: {
        pages: [
            { speaker: 'Lucie', text: "Ton premier animal est arrive ! Il faut s'en occuper." },
            { speaker: 'Lucie', text: "Approche-toi de lui et appuie sur Espace pour interagir." },
            { speaker: 'Lucie', text: "Nourris-le et brosse-le pour qu'il soit content !" },
        ]
    },
    quest_tutorial_complete: {
        pages: [
            { speaker: 'Lucie', text: "Bravo ! Tu as bien pris soin de ton premier animal !" },
            { speaker: 'Lucie', text: "Continue comme ca et tu deviendras le meilleur hotelier !" },
        ]
    },
    quest_first_animal_start: {
        pages: [
            { speaker: 'Lucie', text: "Un nouveau client arrive ! Va l'accueillir dans le hall." },
        ]
    },
    quest_first_animal_complete: {
        pages: [
            { speaker: 'Lucie', text: "Super ! L'animal a l'air de bien s'installer." },
            { speaker: 'Lucie', text: "Tu peux maintenant explorer le village au sud du jardin !" },
        ]
    },
    quest_village_start: {
        pages: [
            { speaker: 'Merlin', text: "Jeune hotelier, il est temps de decouvrir le village !" },
            { speaker: 'Merlin', text: "Visite la boutique et parle aux habitants." },
        ]
    },
    quest_village_complete: {
        pages: [
            { speaker: 'Merlin', text: "Tu connais maintenant le village ! Bien joue !" },
            { speaker: 'Merlin', text: "Bientot, tu pourras explorer la foret enchantee..." },
        ]
    },
    quest_shopping_start: {
        pages: [
            { speaker: 'Felix', text: "Tu veux acheter de la nourriture ? Bonne idee !" },
            { speaker: 'Felix', text: "Achete au moins 3 aliments pour tes pensionnaires." },
        ]
    },
    quest_shopping_complete: {
        pages: [
            { speaker: 'Felix', text: "Merci pour tes achats ! Tes animaux vont etre contents !" },
        ]
    },
    quest_forest_start: {
        pages: [
            { speaker: 'Merlin', text: "La foret enchantee se trouve a l'ouest du jardin." },
            { speaker: 'Merlin', text: "Trouve 2 baies de lune, elles brillent dans l'obscurite !" },
        ]
    },
    quest_forest_complete: {
        pages: [
            { speaker: 'Merlin', text: "Magnifique ! Ces baies de lune sont tres precieuses !" },
            { speaker: 'Merlin', text: "Les animaux magiques adorent ces baies..." },
        ]
    },
    quest_lost_pet_start: {
        pages: [
            { speaker: 'Marcel', text: "Oh non ! Un animal s'est echappe du jardin !" },
            { speaker: 'Marcel', text: "Il a du s'enfuir dans la foret. Peux-tu le retrouver ?" },
        ]
    },
    quest_lost_pet_complete: {
        pages: [
            { speaker: 'Marcel', text: "Tu l'as retrouve ! Merci beaucoup !" },
            { speaker: 'Marcel', text: "L'animal est sain et sauf grace a toi." },
        ]
    },
    quest_vip_start: {
        pages: [
            { speaker: 'Merlin', text: "Un animal magique tres special veut sejourner a ton hotel !" },
            { speaker: 'Merlin', text: "Accueille-le et prends-en bien soin !" },
        ]
    },
    quest_vip_complete: {
        pages: [
            { speaker: 'Merlin', text: "Incroyable ! L'animal magique est ravi de son sejour !" },
            { speaker: 'Merlin', text: "Ta reputation grandit dans tout le royaume !" },
        ]
    },
    quest_unicorn_start: {
        pages: [
            { speaker: 'Merlin', text: "La licorne a besoin de 3 fleurs arc-en-ciel." },
            { speaker: 'Merlin', text: "Elles poussent dans des endroits secrets de la foret et du jardin." },
        ]
    },
    quest_unicorn_complete: {
        pages: [
            { speaker: 'Merlin', text: "Tu as trouve toutes les fleurs ! La licorne est enchantee !" },
            { speaker: 'Merlin', text: "Tu es desormais un veritable maitre des animaux magiques !" },
        ]
    },
});

// ============================================================
// QUEST MANAGER
// ============================================================
const QuestManager = {
    activeQuests: [],
    completedQuests: [],
    availableQuests: [],

    init(state) {
        this.completedQuests = state.completedQuests || [];
        this.activeQuests = [];

        // Restore active quests from state
        for (const qState of (state.activeQuests || [])) {
            const questDef = QUEST_DATA[qState.id];
            if (questDef) {
                const quest = JSON.parse(JSON.stringify(questDef));
                // Restore progress
                for (const obj of quest.objectives) {
                    const savedObj = qState.objectives.find(o => o.id === obj.id);
                    if (savedObj) obj.progress = savedObj.progress;
                }
                this.activeQuests.push(quest);
            }
        }

        this._updateAvailable();
    },

    _updateAvailable() {
        this.availableQuests = [];
        const currentChapter = (typeof Game !== 'undefined' && Game.state) ? Game.state.chapter : 1;

        for (const [id, quest] of Object.entries(QUEST_DATA)) {
            if (quest.chapter > currentChapter) continue;
            if (this.completedQuests.includes(id)) continue;
            if (this.activeQuests.find(q => q.id === id)) continue;

            // Check if chapter prerequisites met
            const chapterData = CHAPTER_DATA.find(c => c.id === quest.chapter);
            if (chapterData) {
                const preReqs = chapterData.requiredQuests || [];
                if (preReqs.every(r => this.completedQuests.includes(r))) {
                    this.availableQuests.push(quest);
                }
            } else {
                this.availableQuests.push(quest);
            }
        }
    },

    startQuest(questId) {
        const questDef = QUEST_DATA[questId];
        if (!questDef) return false;
        if (this.activeQuests.find(q => q.id === questId)) return false;
        if (this.completedQuests.includes(questId)) return false;

        const quest = JSON.parse(JSON.stringify(questDef));
        this.activeQuests.push(quest);
        this._updateAvailable();

        // Show start dialogue
        if (quest.dialogueStart && DIALOGUES[quest.dialogueStart]) {
            DialogueSystem.start(quest.dialogueStart);
        }

        Engine.playSound('quest');
        return true;
    },

    // Called when an action happens that might progress a quest
    reportAction(actionType, data = {}) {
        for (const quest of this.activeQuests) {
            for (const obj of quest.objectives) {
                if (obj.progress >= obj.count) continue;

                let matched = false;
                switch (obj.type) {
                    case 'action':
                        if (obj.action === actionType) matched = true;
                        break;
                    case 'visit_map':
                        if (actionType === 'visit_map' && data.map === obj.map) matched = true;
                        break;
                    case 'talk':
                        if (actionType === 'talk' && data.npcId === obj.npcId) matched = true;
                        break;
                    case 'collect':
                        if (actionType === 'collect' && data.itemId === obj.itemId) matched = true;
                        break;
                    case 'flag':
                        if (actionType === 'flag' && data.flag === obj.flag) matched = true;
                        break;
                }

                if (matched) {
                    obj.progress = Math.min(obj.progress + 1, obj.count);
                }
            }
        }

        this._checkCompletions();
    },

    _checkCompletions() {
        for (let i = this.activeQuests.length - 1; i >= 0; i--) {
            const quest = this.activeQuests[i];
            const allDone = quest.objectives.every(o => o.progress >= o.count);

            if (allDone) {
                this.completeQuest(quest.id);
            }
        }
    },

    completeQuest(questId) {
        const idx = this.activeQuests.findIndex(q => q.id === questId);
        if (idx === -1) return;

        const quest = this.activeQuests[idx];
        this.activeQuests.splice(idx, 1);
        this.completedQuests.push(questId);

        // Give rewards
        if (typeof Game !== 'undefined' && Game.state) {
            Game.state.coins += quest.rewards.coins;
            Game.state.stars += quest.rewards.stars;
            for (const itemId of quest.rewards.items) {
                Game.addItemToInventory(itemId, 1);
            }
        }

        // Show completion dialogue
        if (quest.dialogueComplete && DIALOGUES[quest.dialogueComplete]) {
            DialogueSystem.start(quest.dialogueComplete);
        }

        Engine.playSound('quest');
        Engine.addParticle(Player.x, Player.y, 'star');

        // Check chapter progression
        this._checkChapterProgression();
        this._updateAvailable();

        // Auto-start newly available quests
        this._autoStartQuests();
    },

    _checkChapterProgression() {
        if (typeof Game === 'undefined' || !Game.state) return;

        for (const chapter of CHAPTER_DATA) {
            if (chapter.id <= Game.state.chapter) continue;
            const prevChapter = CHAPTER_DATA.find(c => c.id === chapter.id - 1);
            if (!prevChapter) continue;

            // Check if all required quests from prev chapter are done
            const required = chapter.requiredQuests || [];
            if (required.every(q => this.completedQuests.includes(q))) {
                Game.state.chapter = chapter.id;
                // Unlock areas
                for (const area of chapter.unlocksAreas) {
                    if (!Game.state.unlockedAreas.includes(area)) {
                        Game.state.unlockedAreas.push(area);
                    }
                }
            }
        }
    },

    _autoStartQuests() {
        // Start quests that become available for the current chapter
        if (typeof Game === 'undefined' || !Game.state) return;
        const currentChapter = Game.state.chapter;
        const chapterData = CHAPTER_DATA.find(c => c.id === currentChapter);
        if (!chapterData) return;

        for (const questId of chapterData.startsQuests) {
            if (!this.completedQuests.includes(questId) && !this.activeQuests.find(q => q.id === questId)) {
                if (this.availableQuests.find(q => q.id === questId)) {
                    // Auto-start the quest silently
                    const questDef = QUEST_DATA[questId];
                    if (questDef) {
                        const quest = JSON.parse(JSON.stringify(questDef));
                        this.activeQuests.push(quest);
                    }
                }
            }
        }
        this._updateAvailable();
    },

    npcHasQuest(npcId) {
        // Check if this NPC has an available quest to give
        return this.availableQuests.some(q => q.npcId === npcId) ||
               this.activeQuests.some(q => q.npcId === npcId && q.objectives.every(o => o.progress >= o.count));
    },

    getActiveQuestByNPC(npcId) {
        return this.activeQuests.find(q => q.npcId === npcId) || null;
    },

    getAvailableQuestByNPC(npcId) {
        return this.availableQuests.find(q => q.npcId === npcId) || null;
    },

    serialize() {
        return {
            activeQuests: this.activeQuests.map(q => ({
                id: q.id,
                objectives: q.objectives.map(o => ({ id: o.id, progress: o.progress })),
            })),
            completedQuests: [...this.completedQuests],
        };
    }
};
