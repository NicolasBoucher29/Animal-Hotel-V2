// ============================================================
// DIALOGUE.JS — Dialogue and Story System for Animal Hotel V2
// ============================================================

const DialogueSystem = {
    active: false,
    currentDialogue: null,
    currentPage: 0,
    displayedText: '',
    targetText: '',
    charIndex: 0,
    typewriterSpeed: 30, // chars per second
    typewriterTimer: 0,
    finished: false,
    speaker: '',
    choices: null,
    selectedChoice: 0,
    callback: null,

    // DOM elements
    box: null,
    speakerEl: null,
    textEl: null,
    choicesEl: null,
    continueEl: null,

    init() {
        this.box = document.getElementById('dialogue-box');
        this.speakerEl = document.getElementById('dialogue-speaker');
        this.textEl = document.getElementById('dialogue-text');
        this.choicesEl = document.getElementById('dialogue-choices');
        this.continueEl = document.getElementById('dialogue-continue');
    },

    start(dialogueId, callback) {
        const dialogue = DIALOGUES[dialogueId];
        if (!dialogue) {
            console.warn('Dialogue not found:', dialogueId);
            return;
        }
        this.currentDialogue = dialogue;
        this.currentPage = 0;
        this.callback = callback || null;
        this.active = true;
        this._showPage(0);
        this.box.style.display = 'block';
        Engine.playSound('interact');
    },

    startDirect(pages, callback) {
        // Start dialogue from direct page array
        this.currentDialogue = { pages };
        this.currentPage = 0;
        this.callback = callback || null;
        this.active = true;
        this._showPage(0);
        this.box.style.display = 'block';
        Engine.playSound('interact');
    },

    _showPage(index) {
        if (!this.currentDialogue || index >= this.currentDialogue.pages.length) {
            this.close();
            return;
        }

        const page = this.currentDialogue.pages[index];
        this.speaker = page.speaker || '';
        this.targetText = page.text || '';
        this.displayedText = '';
        this.charIndex = 0;
        this.finished = false;
        this.choices = page.choices || null;
        this.selectedChoice = 0;

        this.speakerEl.textContent = this.speaker;
        this.textEl.textContent = '';
        this.continueEl.style.display = 'none';
        this.choicesEl.style.display = 'none';
        this.choicesEl.innerHTML = '';
    },

    update(dt) {
        if (!this.active) return;

        // Typewriter effect
        if (!this.finished) {
            this.typewriterTimer += dt;
            const charsToAdd = Math.floor(this.typewriterTimer * this.typewriterSpeed);
            if (charsToAdd > 0) {
                this.typewriterTimer -= charsToAdd / this.typewriterSpeed;
                this.charIndex = Math.min(this.charIndex + charsToAdd, this.targetText.length);
                this.displayedText = this.targetText.substring(0, this.charIndex);
                this.textEl.textContent = this.displayedText;

                if (this.charIndex >= this.targetText.length) {
                    this.finished = true;
                    if (this.choices) {
                        this._showChoices();
                    } else {
                        this.continueEl.style.display = 'block';
                    }
                }
            }
        }

        // Handle input
        if (Engine.isActionPressed()) {
            if (!this.finished) {
                // Skip typewriter
                this.charIndex = this.targetText.length;
                this.displayedText = this.targetText;
                this.textEl.textContent = this.displayedText;
                this.finished = true;
                if (this.choices) {
                    this._showChoices();
                } else {
                    this.continueEl.style.display = 'block';
                }
            } else if (this.choices) {
                // Select choice
                this._selectChoice();
            } else {
                // Next page
                this.currentPage++;
                if (this.currentPage >= this.currentDialogue.pages.length) {
                    this.close();
                } else {
                    this._showPage(this.currentPage);
                }
            }
        }

        // Choice navigation
        if (this.choices && this.finished) {
            if (Engine.isKeyJustPressed('ArrowUp') || Engine.isKeyJustPressed('w') || Engine.isKeyJustPressed('z')) {
                this.selectedChoice = Math.max(0, this.selectedChoice - 1);
                this._highlightChoice();
                Engine.playSound('menu');
            }
            if (Engine.isKeyJustPressed('ArrowDown') || Engine.isKeyJustPressed('s')) {
                this.selectedChoice = Math.min(this.choices.length - 1, this.selectedChoice + 1);
                this._highlightChoice();
                Engine.playSound('menu');
            }
        }

        if (Engine.isCancelPressed()) {
            this.close();
        }
    },

    _showChoices() {
        this.choicesEl.style.display = 'block';
        this.choicesEl.innerHTML = '';
        this.choices.forEach((choice, i) => {
            const div = document.createElement('div');
            div.className = 'dialogue-choice' + (i === 0 ? ' selected' : '');
            div.textContent = '> ' + choice.text;
            div.addEventListener('click', () => {
                this.selectedChoice = i;
                this._selectChoice();
            });
            this.choicesEl.appendChild(div);
        });
    },

    _highlightChoice() {
        const items = this.choicesEl.querySelectorAll('.dialogue-choice');
        items.forEach((el, i) => {
            el.className = 'dialogue-choice' + (i === this.selectedChoice ? ' selected' : '');
        });
    },

    _selectChoice() {
        if (!this.choices) return;
        const choice = this.choices[this.selectedChoice];
        Engine.playSound('interact');

        if (choice.action) {
            choice.action();
        }
        if (choice.nextDialogue) {
            this.close();
            this.start(choice.nextDialogue);
            return;
        }
        // Advance
        this.currentPage++;
        if (this.currentPage >= this.currentDialogue.pages.length) {
            this.close();
        } else {
            this._showPage(this.currentPage);
        }
    },

    close() {
        this.active = false;
        this.box.style.display = 'none';
        this.currentDialogue = null;
        if (this.callback) {
            const cb = this.callback;
            this.callback = null;
            cb();
        }
    },

    isActive() {
        return this.active;
    }
};

// ============================================================
// DIALOGUE DATA (French)
// ============================================================
const DIALOGUES = {
    // Tutorial
    tutorial_welcome: {
        pages: [
            { speaker: 'Lucie', text: "Bienvenue a l'Hotel des Animaux ! Je suis Lucie, la receptionniste." },
            { speaker: 'Lucie', text: "Tu es le nouveau gerant de cet hotel magique pour animaux !" },
            { speaker: 'Lucie', text: "Les gens du village nous confient leurs animaux de compagnie." },
            { speaker: 'Lucie', text: "Tu dois en prendre soin : les nourrir, les laver et jouer avec eux !" },
            { speaker: 'Lucie', text: "Utilise les fleches pour te deplacer et Espace pour interagir." },
            { speaker: 'Lucie', text: "Appuie sur M pour ouvrir le menu. Bonne chance !" },
        ]
    },

    // Receptionist
    receptionist_greeting: {
        pages: [
            { speaker: 'Lucie', text: "Bonjour ! Comment se passe ta journee ?",
              choices: [
                { text: "Tres bien !", action: () => {} },
                { text: "Voir les animaux", action: () => { if (typeof Game !== 'undefined') Game.openMenu('animals'); } },
                { text: "Sauvegarder", action: () => { if (typeof Game !== 'undefined') Game.saveCurrentGame(); } },
              ]
            },
        ]
    },

    // Gardener
    gardener_greeting: {
        pages: [
            { speaker: 'Marcel', text: "Ah, bonjour ! Le jardin est magnifique aujourd'hui, non ?" },
            { speaker: 'Marcel', text: "Les animaux adorent jouer dehors. N'hesite pas a les amener ici !" },
            { speaker: 'Marcel', text: "Il parait qu'on trouve des baies speciales dans la foret..." },
        ]
    },

    // Chef
    chef_greeting: {
        pages: [
            { speaker: 'Rosa', text: "Bienvenue dans ma cuisine ! Je prepare les repas pour tous nos pensionnaires." },
            { speaker: 'Rosa', text: "Si tu as besoin de cuisiner quelque chose de special, parle-moi !",
              choices: [
                { text: "Cuisiner", action: () => { if (typeof MinigameManager !== 'undefined') MinigameManager.startMinigame('cooking'); } },
                { text: "Non merci", action: () => {} },
              ]
            },
        ]
    },

    // Shop
    shop_welcome: {
        pages: [
            { speaker: 'Felix', text: "Bienvenue dans ma boutique ! J'ai tout ce qu'il faut pour tes animaux !",
              choices: [
                { text: "Acheter", action: () => { if (typeof Game !== 'undefined') Game.openShop(); } },
                { text: "Juste regarder", action: () => {} },
              ]
            },
        ]
    },

    // Villager
    villager_chat: {
        pages: [
            { speaker: 'Thomas', text: "Salut ! J'ai entendu dire que ton hotel est super !" },
            { speaker: 'Thomas', text: "Mes enfants adoreraient y emmener notre chat un jour." },
        ]
    },

    // Quest giver
    questgiver_intro: {
        pages: [
            { speaker: 'Merlin', text: "Ah, jeune hotelier ! Je suis Merlin, le sage du village." },
            { speaker: 'Merlin', text: "La foret enchantee regorge de mysteres et de creatures magiques." },
            { speaker: 'Merlin', text: "Si tu gagnes assez d'etoiles, les animaux magiques viendront te voir !",
              choices: [
                { text: "Comment gagner des etoiles ?", action: () => {
                    DialogueSystem.close();
                    DialogueSystem.start('questgiver_stars');
                }},
                { text: "Au revoir !", action: () => {} },
              ]
            },
        ]
    },

    questgiver_stars: {
        pages: [
            { speaker: 'Merlin', text: "Les etoiles se gagnent en prenant bien soin des animaux !" },
            { speaker: 'Merlin', text: "Chaque animal heureux qui repart te donne des etoiles." },
            { speaker: 'Merlin', text: "Complete aussi des quetes pour en gagner encore plus !" },
        ]
    },

    // Animal interactions
    animal_interact: {
        pages: [
            { speaker: '', text: "Que veux-tu faire ?",
              choices: [
                { text: "Nourrir", action: () => { if (typeof Game !== 'undefined') Game.feedAnimal(); } },
                { text: "Caresser", action: () => { if (typeof Game !== 'undefined') Game.petAnimal(); } },
                { text: "Brosser", action: () => { if (typeof Game !== 'undefined') Game.groomAnimal(); } },
                { text: "Jouer", action: () => { if (typeof Game !== 'undefined') Game.playWithAnimal(); } },
              ]
            },
        ]
    },

    // New animal arrival
    new_animal_arrival: {
        pages: [
            { speaker: '???', text: "Bonjour ! Je cherche un endroit sur pour mon animal." },
            { speaker: '???', text: "On m'a dit que votre hotel etait le meilleur de la region !" },
            { speaker: '???', text: "Pouvez-vous vous en occuper pendant quelques jours ?" },
        ]
    },

    // Animal leaving happy
    animal_leave_happy: {
        pages: [
            { speaker: '', text: "Le proprietaire est revenu chercher son animal !" },
            { speaker: '', text: "Il est tres content ! Tu recois des pieces et une etoile !" },
        ]
    },

    // Animal leaving sad
    animal_leave_sad: {
        pages: [
            { speaker: '', text: "Le proprietaire est revenu..." },
            { speaker: '', text: "Son animal n'a pas l'air tres heureux. Essaie de faire mieux la prochaine fois !" },
        ]
    },
};

// Helper to create dynamic dialogues
function createAnimalDialogue(animal) {
    const typeData = ANIMAL_TYPES[animal.type];
    const mood = animal.getMood();
    let text = '';

    if (mood === 'ecstatic') text = `${animal.name} le ${typeData.name} sautille de joie !`;
    else if (mood === 'happy') text = `${animal.name} le ${typeData.name} a l'air content !`;
    else if (mood === 'ok') text = `${animal.name} le ${typeData.name} se porte bien.`;
    else if (mood === 'sad') text = `${animal.name} le ${typeData.name} a l'air triste...`;
    else text = `${animal.name} le ${typeData.name} ne va pas bien du tout !`;

    let needsText = '';
    if (animal.hunger < 30) needsText += ' Il a faim !';
    if (animal.cleanliness < 30) needsText += ' Il a besoin d\'un bain !';
    if (animal.health < 50) needsText += ' Il semble malade...';

    return [
        { speaker: animal.name, text: text + needsText },
    ];
}

function createShopDialogue(items, buyCallback) {
    let text = "Voici ce que j'ai en stock :\n";
    items.forEach((item, i) => {
        const data = getItemData(item.id);
        if (data) text += `${i + 1}. ${data.name} - ${data.buyPrice} pieces\n`;
    });
    return [
        { speaker: 'Felix', text: text,
          choices: items.slice(0, 4).map((item, i) => {
              const data = getItemData(item.id);
              return {
                  text: `${data ? data.name : item.id} (${data ? data.buyPrice : '?'} pieces)`,
                  action: () => buyCallback(item.id),
              };
          })
        },
    ];
}
