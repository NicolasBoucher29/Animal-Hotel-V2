// ============================================================
// DATA.JS — Game Data for Animal Hotel V2 (8 Epics Edition)
// ============================================================

const ANIMAL_TYPES = {
    dog: {
        name: 'Chien', spriteId: 'dog', vip: false,
        personality: 'joueur', playType: 'ball',
        foodPrefs: { loves: ['meat','bone','dog_treat'], likes: ['carrot','apple'], hates: ['fish_raw','salad'] },
        careNeeds: { hunger: 0.5, happiness: 0.6, cleanliness: 0.4, health: 0.3 },
        description: 'Un adorable chien qui adore jouer !'
    },
    cat: {
        name: 'Chat', spriteId: 'cat', vip: false,
        personality: 'calme', playType: 'yarn',
        foodPrefs: { loves: ['fish','tuna','milk'], likes: ['meat'], hates: ['carrot','salad'] },
        careNeeds: { hunger: 0.4, happiness: 0.3, cleanliness: 0.6, health: 0.3 },
        description: 'Un chat elegant et mysterieux.'
    },
    rabbit: {
        name: 'Lapin', spriteId: 'rabbit', vip: false,
        personality: 'timide', playType: 'hop',
        foodPrefs: { loves: ['carrot','salad','apple'], likes: ['seeds'], hates: ['meat','fish'] },
        careNeeds: { hunger: 0.6, happiness: 0.5, cleanliness: 0.3, health: 0.3 },
        description: 'Un lapin doux aux grandes oreilles.'
    },
    hamster: {
        name: 'Hamster', spriteId: 'hamster', vip: false,
        personality: 'energique', playType: 'wheel',
        foodPrefs: { loves: ['seeds','carrot','cheese'], likes: ['apple'], hates: ['fish','meat'] },
        careNeeds: { hunger: 0.7, happiness: 0.5, cleanliness: 0.3, health: 0.2 },
        description: 'Un petit hamster plein d\'energie !'
    },
    parrot: {
        name: 'Perroquet', spriteId: 'parrot', vip: false,
        personality: 'bavard', playType: 'ball',
        foodPrefs: { loves: ['seeds','fruit_mix','apple'], likes: ['carrot'], hates: ['meat','fish'] },
        careNeeds: { hunger: 0.4, happiness: 0.7, cleanliness: 0.3, health: 0.2 },
        description: 'Un perroquet colore qui aime parler.'
    },
    turtle: {
        name: 'Tortue', spriteId: 'turtle', vip: false,
        personality: 'sage', playType: 'ball',
        foodPrefs: { loves: ['salad','carrot','apple'], likes: ['seeds'], hates: ['meat','fish'] },
        careNeeds: { hunger: 0.2, happiness: 0.3, cleanliness: 0.3, health: 0.2 },
        description: 'Une tortue tranquille et sage.'
    },
    owl: {
        name: 'Hibou', spriteId: 'owl', vip: false,
        personality: 'nocturne', playType: 'ball',
        foodPrefs: { loves: ['fish','meat'], likes: ['seeds'], hates: ['carrot','salad'] },
        careNeeds: { hunger: 0.4, happiness: 0.4, cleanliness: 0.3, health: 0.2 },
        description: 'Un hibou sage aux grands yeux.'
    },
    panda: {
        name: 'Panda', spriteId: 'panda', vip: false,
        personality: 'gourmand', playType: 'ball',
        foodPrefs: { loves: ['apple','carrot','fruit_mix'], likes: ['seeds','salad'], hates: ['fish'] },
        careNeeds: { hunger: 0.8, happiness: 0.4, cleanliness: 0.4, health: 0.3 },
        description: 'Un panda adorable et gourmand.'
    },
    hedgehog: {
        name: 'Herisson', spriteId: 'hedgehog', vip: false,
        personality: 'curieux', playType: 'ball',
        foodPrefs: { loves: ['apple','seeds','milk'], likes: ['carrot'], hates: ['fish_raw'] },
        careNeeds: { hunger: 0.4, happiness: 0.5, cleanliness: 0.4, health: 0.2 },
        description: 'Un herisson curieux et mignon.'
    },
    duck: {
        name: 'Canard', spriteId: 'duck', vip: false,
        personality: 'joyeux', playType: 'ball',
        foodPrefs: { loves: ['seeds','salad','fish'], likes: ['apple'], hates: ['meat'] },
        careNeeds: { hunger: 0.5, happiness: 0.6, cleanliness: 0.5, health: 0.2 },
        description: 'Un canard joyeux qui adore l\'eau.'
    },
    frog: {
        name: 'Grenouille', spriteId: 'frog', vip: false,
        personality: 'espiegle', playType: 'hop',
        foodPrefs: { loves: ['fish','seeds'], likes: ['apple'], hates: ['meat','cheese'] },
        careNeeds: { hunger: 0.3, happiness: 0.5, cleanliness: 0.3, health: 0.2 },
        description: 'Une grenouille espiegle et agile.'
    },
    // VIP Animals
    unicorn: {
        name: 'Licorne', spriteId: 'unicorn', vip: true,
        personality: 'magique', playType: 'ball',
        foodPrefs: { loves: ['moonberry','rainbow_flower','fruit_mix'], likes: ['apple'], hates: ['meat','fish'] },
        careNeeds: { hunger: 0.3, happiness: 0.7, cleanliness: 0.5, health: 0.2 },
        description: 'Une licorne magique et majestueuse !',
        starsRequired: 10
    },
    fox: {
        name: 'Renard Magique', spriteId: 'fox', vip: true,
        personality: 'malicieux', playType: 'yarn',
        foodPrefs: { loves: ['meat','fish','moonberry'], likes: ['apple','cheese'], hates: ['salad'] },
        careNeeds: { hunger: 0.5, happiness: 0.6, cleanliness: 0.4, health: 0.3 },
        description: 'Un renard enchante plein de malice.',
        starsRequired: 5
    },
    phoenix: {
        name: 'Phoenix', spriteId: 'phoenix', vip: true,
        personality: 'flamboyant', playType: 'ball',
        foodPrefs: { loves: ['moonberry','rainbow_flower'], likes: ['seeds'], hates: ['fish','meat'] },
        careNeeds: { hunger: 0.2, happiness: 0.8, cleanliness: 0.2, health: 0.1 },
        description: 'Un phoenix legendaire fait de flammes !',
        starsRequired: 20
    },
    dragon: {
        name: 'Bebe Dragon', spriteId: 'dragon', vip: true,
        personality: 'farceur', playType: 'ball',
        foodPrefs: { loves: ['meat','fish','moonberry'], likes: ['apple'], hates: ['salad','seeds'] },
        careNeeds: { hunger: 0.6, happiness: 0.5, cleanliness: 0.3, health: 0.2 },
        description: 'Un adorable bebe dragon espiegle !',
        starsRequired: 15
    },
    pegasus: {
        name: 'Pegase', spriteId: 'pegasus', vip: true,
        personality: 'noble', playType: 'ball',
        foodPrefs: { loves: ['rainbow_flower','moonberry','apple'], likes: ['carrot'], hates: ['meat','fish'] },
        careNeeds: { hunger: 0.3, happiness: 0.6, cleanliness: 0.5, health: 0.2 },
        description: 'Un pegase elegant aux ailes scintillantes.',
        starsRequired: 25
    },
};

// ============================================================
// FOOD & INGREDIENTS (expanded for cooking system)
// ============================================================
const FOOD_ITEMS = {
    // Raw ingredients (from shop/fridge)
    meat: { name: 'Viande', spriteId: 'meat', type: 'ingredient', category: 'meat',
        buyPrice: 3, cookable: true, cookedId: 'cooked_meat',
        effects: { hunger: 20, happiness: 5 }, description: 'De la viande fraiche.' },
    fish: { name: 'Poisson', spriteId: 'fish', type: 'ingredient', category: 'fish',
        buyPrice: 3, cookable: true, cookedId: 'cooked_fish',
        effects: { hunger: 25, happiness: 5 }, description: 'Un poisson frais du lac.' },
    fish_raw: { name: 'Poisson cru', spriteId: 'fish', type: 'ingredient', category: 'fish',
        buyPrice: 2, cookable: true, cookedId: 'cooked_fish',
        effects: { hunger: 15, happiness: -5 }, description: 'Pas tres appetissant cru...' },
    carrot: { name: 'Carotte', spriteId: 'carrot', type: 'ingredient', category: 'vegetable',
        buyPrice: 1, cookable: false,
        effects: { hunger: 20, happiness: 5 }, description: 'Une carotte croquante.' },
    apple: { name: 'Pomme', spriteId: 'apple', type: 'ingredient', category: 'fruit',
        buyPrice: 1, cookable: false,
        effects: { hunger: 15, happiness: 5 }, description: 'Une pomme juteuse.' },
    seeds: { name: 'Graines', spriteId: 'seeds', type: 'ingredient', category: 'grain',
        buyPrice: 1, cookable: false,
        effects: { hunger: 15, happiness: 3 }, description: 'Un sachet de graines.' },
    cheese: { name: 'Fromage', spriteId: 'cheese', type: 'ingredient', category: 'dairy',
        buyPrice: 2, cookable: false,
        effects: { hunger: 20, happiness: 8 }, description: 'Un morceau de fromage.' },
    milk: { name: 'Lait', spriteId: 'milk', type: 'ingredient', category: 'dairy',
        buyPrice: 2, cookable: false,
        effects: { hunger: 15, happiness: 10 }, description: 'Du lait frais.' },
    salad: { name: 'Salade', spriteId: 'salad', type: 'ingredient', category: 'vegetable',
        buyPrice: 1, cookable: false,
        effects: { hunger: 15, happiness: 3 }, description: 'De la salade verte.' },
    yogurt: { name: 'Yaourt', spriteId: 'yogurt', type: 'ingredient', category: 'dairy',
        buyPrice: 2, cookable: false,
        effects: { hunger: 15, happiness: 8 }, description: 'Un yaourt crémeux.' },
    fruit_mix: { name: 'Salade de fruits', spriteId: 'fruit_mix', type: 'food', category: 'fruit',
        buyPrice: 3, cookable: false,
        effects: { hunger: 25, happiness: 15 }, description: 'Un melange de fruits frais.' },
    bone: { name: 'Os a macher', spriteId: 'bone', type: 'food', category: 'treat',
        buyPrice: 2, cookable: false,
        effects: { hunger: 10, happiness: 20 }, description: 'Un os pour les chiens.' },
    dog_treat: { name: 'Friandise chien', spriteId: 'treat', type: 'food', category: 'treat',
        buyPrice: 2, cookable: false,
        effects: { hunger: 10, happiness: 25 }, description: 'Des friandises pour chien.' },
    tuna: { name: 'Thon', spriteId: 'tuna', type: 'ingredient', category: 'fish',
        buyPrice: 3, cookable: true, cookedId: 'cooked_tuna',
        effects: { hunger: 30, happiness: 10 }, description: 'Du thon de qualite.' },
    // Cooked foods (from kitchen)
    cooked_meat: { name: 'Viande cuite', spriteId: 'cooked_meat', type: 'food', category: 'meat',
        buyPrice: 0, cookable: false,
        effects: { hunger: 40, happiness: 15 }, description: 'De la viande bien cuite !' },
    cooked_fish: { name: 'Poisson grille', spriteId: 'cooked_fish', type: 'food', category: 'fish',
        buyPrice: 0, cookable: false,
        effects: { hunger: 45, happiness: 15 }, description: 'Un delicieux poisson grille !' },
    cooked_tuna: { name: 'Thon grille', spriteId: 'cooked_tuna', type: 'food', category: 'fish',
        buyPrice: 0, cookable: false,
        effects: { hunger: 50, happiness: 20 }, description: 'Du thon parfaitement grille !' },
    // VIP foods
    moonberry: { name: 'Baie de Lune', spriteId: 'moonberry', type: 'food', category: 'magic',
        buyPrice: 20, cookable: false,
        effects: { hunger: 50, happiness: 20 }, description: 'Une baie magique de la foret.' },
    rainbow_flower: { name: 'Fleur Arc-en-ciel', spriteId: 'rainbow_flower', type: 'food', category: 'magic',
        buyPrice: 30, cookable: false,
        effects: { hunger: 30, happiness: 40 }, description: 'Une fleur aux couleurs magiques.' },
};

// ============================================================
// NON-FOOD ITEMS
// ============================================================
const ITEMS = {
    potion: { name: 'Potion de Soin', spriteId: 'potion', type: 'medicine',
        buyPrice: 15, effects: { health: 50 }, description: 'Guerit les animaux malades.' },
    ball: { name: 'Balle', spriteId: 'ball', type: 'toy',
        buyPrice: 10, effects: { happiness: 25 }, description: 'Une balle coloree pour jouer.' },
    brush: { name: 'Brosse', spriteId: 'brush', type: 'tool',
        buyPrice: 12, effects: { cleanliness: 40 }, description: 'Une brosse douce.' },
    yarn: { name: 'Pelote de laine', spriteId: 'yarn', type: 'toy',
        buyPrice: 8, effects: { happiness: 25 }, description: 'Une pelote pour les chats.' },
    soap: { name: 'Savon', spriteId: 'soap', type: 'tool',
        buyPrice: 5, effects: { cleanliness: 30 }, description: 'Du savon moussant.' },
    towel: { name: 'Serviette', spriteId: 'towel', type: 'tool',
        buyPrice: 8, effects: {}, description: 'Une serviette moelleuse.' },
    shampoo: { name: 'Shampooing', spriteId: 'shampoo', type: 'tool',
        buyPrice: 7, effects: { cleanliness: 20 }, description: 'Shampooing pour animaux.' },
};

// ============================================================
// SHOP SHELVES (Epic 3: Real shop with aisles)
// ============================================================
const SHOP_SHELVES = [
    { id: 'shelf_dairy', name: 'Produits Laitiers', x: 4, y: 4, width: 4,
      items: ['cheese','milk','yogurt'] },
    { id: 'shelf_veggies', name: 'Legumes', x: 10, y: 4, width: 4,
      items: ['carrot','salad'] },
    { id: 'shelf_fruits', name: 'Fruits & Graines', x: 16, y: 4, width: 4,
      items: ['apple','seeds','fruit_mix'] },
    { id: 'shelf_meat', name: 'Viande & Poisson', x: 22, y: 4, width: 4,
      items: ['meat','fish','tuna'] },
    { id: 'shelf_treats', name: 'Friandises', x: 4, y: 10, width: 4,
      items: ['bone','dog_treat'] },
    { id: 'shelf_tools', name: 'Accessoires', x: 10, y: 10, width: 4,
      items: ['soap','shampoo','brush','ball','yarn'] },
];

// ============================================================
// ROOM CUSTOMIZATION (Epic 1)
// ============================================================
const ROOM_COLORS = [
    { id: 'pink', name: 'Rose', color: '#f8b4b4', price: 0 },
    { id: 'blue', name: 'Bleu', color: '#b4d8f8', price: 0 },
    { id: 'green', name: 'Vert', color: '#b4f8c4', price: 0 },
    { id: 'yellow', name: 'Jaune', color: '#f8e8b4', price: 0 },
    { id: 'purple', name: 'Violet', color: '#d8b4f8', price: 0 },
    { id: 'orange', name: 'Orange', color: '#f8d4b4', price: 5 },
    { id: 'white', name: 'Blanc', color: '#f0f0f0', price: 0 },
    { id: 'gold', name: 'Or', color: '#ffd700', price: 20 },
];

const ROOM_PATTERNS = [
    { id: 'none', name: 'Aucun', price: 0 },
    { id: 'hearts', name: 'Coeurs', price: 5 },
    { id: 'stars', name: 'Etoiles', price: 5 },
    { id: 'circles', name: 'Cercles', price: 5 },
    { id: 'paws', name: 'Pattes', price: 8 },
    { id: 'diamonds', name: 'Diamants', price: 10 },
];

const ROOM_BEDS = [
    { id: 'basic', name: 'Lit simple', price: 0 },
    { id: 'canopy', name: 'Lit a baldaquin', price: 15 },
    { id: 'dog_bed', name: 'Panier chien', price: 10 },
    { id: 'cat_bed', name: 'Coussin chat', price: 10 },
    { id: 'turtle_bed', name: 'Nid tortue', price: 10 },
    { id: 'luxury', name: 'Lit royal', price: 30 },
];

const ROOM_BOWLS = [
    { id: 'basic', name: 'Gamelle simple', price: 0 },
    { id: 'fancy', name: 'Gamelle decoree', price: 8 },
    { id: 'gold', name: 'Gamelle doree', price: 20 },
];

// ============================================================
// OWNER DATA (Epic 5: Phone calls)
// ============================================================
const OWNER_NAMES = [
    'Marie', 'Pierre', 'Sophie', 'Lucas', 'Emma', 'Hugo',
    'Lea', 'Nathan', 'Chloe', 'Louis', 'Jade', 'Gabriel',
    'Alice', 'Arthur', 'Manon', 'Jules', 'Camille', 'Raphael',
];

const PICKUP_TIMES = ['10:00', '11:00', '11:30', '14:00', '16:00', '19:00'];

const STAY_DURATIONS = [
    { label: '2 jours', days: 2 },
    { label: '3 jours', days: 3 },
    { label: '1 semaine', days: 7 },
    { label: '2 semaines', days: 14 },
];

const OWNER_MESSAGES = {
    dropoff_call: [
        "Bonjour ! Je voudrais deposer mon %ANIMAL% %NAME% pour %DURATION%. C'est possible ?",
        "Allo ? Mon %ANIMAL% %NAME% a besoin de vacances ! Vous avez de la place pour %DURATION% ?",
        "Salut ! Est-ce que vous pouvez garder %NAME% mon %ANIMAL% pendant %DURATION% ?",
    ],
    pickup_call: [
        "Bonjour ! Je viens chercher %NAME% aujourd'hui. A quelle heure puis-je passer ?",
        "Allo ? C'est le jour ! Quand est-ce que je peux recuperer mon %ANIMAL% %NAME% ?",
        "Salut ! %NAME% est pret ? A quelle heure je passe le chercher ?",
    ],
    pickup_thanks: [
        "Merci d'avoir pris soin de %NAME% !",
        "%NAME% a l'air tellement heureux ! Merci !",
        "Quel super travail ! Voici une recompense !",
        "Mon %ANIMAL% ne voulait plus partir ! Bravo !",
    ],
};

// ============================================================
// NPC DATA
// ============================================================
const NPC_DATA = {
    receptionist: { name: 'Lucie', role: 'Receptionniste', spriteType: 'villager', map: 'hotel_lobby', x: 7, y: 3 },
    gardener: { name: 'Marcel', role: 'Jardinier', spriteType: 'villager', map: 'garden', x: 20, y: 6 },
    chef: { name: 'Rosa', role: 'Chef Cuisiniere', spriteType: 'shopkeeper', map: 'kitchen', x: 10, y: 5 },
    shopkeeper: { name: 'Felix', role: 'Marchand', spriteType: 'shopkeeper', map: 'shop', x: 15, y: 4 },
    villager1: { name: 'Thomas', role: 'Villageois', spriteType: 'villager', map: 'village', x: 14, y: 10 },
    questgiver: { name: 'Merlin', role: 'Sage du Village', spriteType: 'questgiver', map: 'village', x: 24, y: 9 },
};

// ============================================================
// CHAPTERS & STORY
// ============================================================
const CHAPTER_DATA = [
    {
        id: 1, name: "Chapitre 1: Les Premiers Pas",
        description: "Tu viens d'arriver a l'Hotel des Animaux !",
        requiredQuests: [],
        unlocksAreas: ['hotel_lobby', 'hotel_rooms', 'animal_room', 'garden', 'kitchen'],
        startsQuests: ['tutorial_care', 'first_animal'],
    },
    {
        id: 2, name: "Chapitre 2: Le Village",
        description: "Explore le village et rencontre ses habitants.",
        requiredQuests: ['tutorial_care', 'first_animal'],
        unlocksAreas: ['village', 'shop'],
        startsQuests: ['village_explore', 'shopping_trip'],
    },
    {
        id: 3, name: "Chapitre 3: La Foret Enchantee",
        description: "De mysterieuses creatures se cachent...",
        requiredQuests: ['village_explore'],
        unlocksAreas: ['forest'],
        startsQuests: ['forest_explore', 'lost_pet'],
    },
    {
        id: 4, name: "Chapitre 4: Les Animaux Magiques",
        description: "Des animaux VIP arrivent a l'hotel !",
        requiredQuests: ['forest_explore'],
        unlocksAreas: [],
        startsQuests: ['vip_arrival', 'unicorn_quest'],
    },
];

// ============================================================
// DEFAULT GAME STATE (expanded for all epics)
// ============================================================
const DEFAULT_GAME_STATE = {
    playerName: '',
    playerGender: 'boy',
    currentMap: 'hotel_lobby',
    playerX: 14,
    playerY: 10,
    playerDirection: 'down',
    coins: 50,
    stars: 0,
    chapter: 1,
    dayCount: 1,
    timeOfDay: 0,
    // Inventory (items + food)
    inventory: [
        { id: 'apple', quantity: 3 },
        { id: 'carrot', quantity: 2 },
        { id: 'meat', quantity: 1 },
        { id: 'brush', quantity: 1 },
        { id: 'soap', quantity: 1 },
    ],
    // Fridge contents (separate from inventory for kitchen)
    fridge: [
        { id: 'apple', quantity: 2 },
        { id: 'carrot', quantity: 2 },
        { id: 'meat', quantity: 1 },
        { id: 'milk', quantity: 1 },
    ],
    // Animals currently at the hotel
    animals: [],
    hotelAnimals: [],
    // Room customization per animal slot
    rooms: [
        { color: 'pink', pattern: 'none', bed: 'basic', bowl: 'basic' },
        { color: 'blue', pattern: 'none', bed: 'basic', bowl: 'basic' },
        { color: 'green', pattern: 'none', bed: 'basic', bowl: 'basic' },
        { color: 'yellow', pattern: 'none', bed: 'basic', bowl: 'basic' },
        { color: 'purple', pattern: 'none', bed: 'basic', bowl: 'basic' },
        { color: 'white', pattern: 'none', bed: 'basic', bowl: 'basic' },
    ],
    // Phone / scheduling
    scheduledPickups: [], // { animalId, day, time }
    pendingCalls: [],     // incoming calls queue
    // Quest tracking
    completedQuests: [],
    activeQuests: [],
    unlockedAreas: ['hotel_lobby', 'hotel_rooms', 'animal_room', 'garden', 'kitchen', 'bathroom'],
    flags: {},
    tutorialDone: false,
    // Mini-game high scores
    highScores: { logJump: 0, hiddenAnimals: 0 },
};

// ============================================================
// HIDDEN ANIMALS SCENES (Epic 8: Game B)
// ============================================================
const HIDDEN_SCENES = [
    { id: 'beach', name: 'Plage', bgColor: '#87CEEB',
      hideSpots: [
        {x:30,y:180},{x:120,y:60},{x:200,y:150},{x:350,y:100},{x:280,y:200},
        {x:60,y:120},{x:400,y:180},{x:160,y:40},{x:320,y:60},{x:440,y:120}
      ]},
    { id: 'winter', name: 'Hiver', bgColor: '#B0C4DE',
      hideSpots: [
        {x:50,y:100},{x:150,y:180},{x:250,y:50},{x:350,y:150},{x:420,y:80},
        {x:100,y:40},{x:300,y:200},{x:200,y:120},{x:380,y:200},{x:60,y:200}
      ]},
    { id: 'autumn', name: 'Automne', bgColor: '#DAA520',
      hideSpots: [
        {x:40,y:150},{x:130,y:80},{x:220,y:180},{x:310,y:40},{x:400,y:140},
        {x:80,y:40},{x:180,y:120},{x:360,y:200},{x:450,y:60},{x:270,y:100}
      ]},
    { id: 'spring', name: 'Printemps', bgColor: '#98FB98',
      hideSpots: [
        {x:60,y:140},{x:140,y:60},{x:240,y:170},{x:340,y:90},{x:410,y:160},
        {x:100,y:200},{x:200,y:40},{x:300,y:140},{x:380,y:40},{x:460,y:100}
      ]},
];

// ============================================================
// UTILITY FUNCTIONS
// ============================================================
function getItemData(itemId) {
    return FOOD_ITEMS[itemId] || ITEMS[itemId] || null;
}

function getAnimalType(typeId) {
    return ANIMAL_TYPES[typeId] || null;
}

function getRandomOwnerName() {
    return OWNER_NAMES[Math.floor(Math.random() * OWNER_NAMES.length)];
}

function getRandomAnimalType(includeVIP = false) {
    const types = Object.keys(ANIMAL_TYPES).filter(k => includeVIP || !ANIMAL_TYPES[k].vip);
    return types[Math.floor(Math.random() * types.length)];
}

function getFoodReaction(animalTypeId, foodId) {
    const animal = ANIMAL_TYPES[animalTypeId];
    if (!animal || !animal.foodPrefs) return 'neutral';
    if (animal.foodPrefs.loves.includes(foodId)) return 'loves';
    if (animal.foodPrefs.likes.includes(foodId)) return 'likes';
    if (animal.foodPrefs.hates.includes(foodId)) return 'hates';
    return 'neutral';
}

function getShoppingList(fridge) {
    const essentials = ['meat','fish','carrot','apple','milk','cheese','seeds'];
    const missing = [];
    for (const itemId of essentials) {
        const inFridge = fridge.find(f => f.id === itemId);
        if (!inFridge || inFridge.quantity <= 0) {
            missing.push(itemId);
        }
    }
    return missing;
}
