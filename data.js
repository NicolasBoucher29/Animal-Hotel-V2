// ============================================================
// DATA.JS — Game Data for Animal Hotel V2 (iPad Edition)
// ============================================================

const ANIMAL_TYPES = {
  dog:     { name:'Chien',      img:'dog',     emoji:'🐶', personality:'joueur',    playType:'ball',
             foodPrefs:{loves:['protein'],likes:['carb'],hates:['green']},
             careNeeds:{hunger:0.5,happiness:0.6,cleanliness:0.4,health:0.3},
             desc:'Un adorable chien qui adore jouer !' },
  cat:     { name:'Chat',       img:'cat',     emoji:'🐱', personality:'calme',     playType:'yarn',
             foodPrefs:{loves:['protein'],likes:['condiment'],hates:['green']},
             careNeeds:{hunger:0.4,happiness:0.3,cleanliness:0.6,health:0.3},
             desc:'Un chat élégant et mystérieux.' },
  owl:     { name:'Hibou',      img:'owl',     emoji:'🦉', personality:'sage',      playType:'ball',
             foodPrefs:{loves:['protein'],likes:['green'],hates:['carb']},
             careNeeds:{hunger:0.4,happiness:0.4,cleanliness:0.3,health:0.2},
             desc:'Un hibou sage aux grands yeux.' },
  bear:    { name:'Ours',       img:'bear',    emoji:'🐻', personality:'gourmand',  playType:'ball',
             foodPrefs:{loves:['protein','carb'],likes:['green'],hates:['condiment']},
             careNeeds:{hunger:0.8,happiness:0.4,cleanliness:0.4,health:0.3},
             desc:'Un ours adorable et gourmand.' },
  monkey:  { name:'Singe',      img:'monkey',  emoji:'🐵', personality:'espiègle',  playType:'ball',
             foodPrefs:{loves:['green'],likes:['carb'],hates:['protein']},
             careNeeds:{hunger:0.6,happiness:0.7,cleanliness:0.3,health:0.2},
             desc:'Un singe espiègle plein d\'énergie !' },
  penguin: { name:'Pingouin',   img:'penguin', emoji:'🐧', personality:'mignon',    playType:'ball',
             foodPrefs:{loves:['protein'],likes:['condiment'],hates:['carb']},
             careNeeds:{hunger:0.5,happiness:0.5,cleanliness:0.5,health:0.3},
             desc:'Un pingouin mignon qui adore nager.' },
  cow:     { name:'Vache',      img:'cow',     emoji:'🐄', personality:'calme',     playType:'ball',
             foodPrefs:{loves:['green'],likes:['carb'],hates:['protein']},
             careNeeds:{hunger:0.6,happiness:0.3,cleanliness:0.4,health:0.3},
             desc:'Une vache douce et tranquille.' },
  sheep:   { name:'Mouton',     img:'sheep',   emoji:'🐑', personality:'timide',    playType:'ball',
             foodPrefs:{loves:['green'],likes:['carb'],hates:['condiment']},
             careNeeds:{hunger:0.5,happiness:0.4,cleanliness:0.5,health:0.3},
             desc:'Un mouton doux et câlin.' },
  elephant:{ name:'Éléphant',   img:'elephant',emoji:'🐘', personality:'sage',      playType:'ball',
             foodPrefs:{loves:['green','carb'],likes:['condiment'],hates:[]},
             careNeeds:{hunger:0.8,happiness:0.4,cleanliness:0.4,health:0.2},
             desc:'Un éléphant majestueux et gentil.' },
  pig:     { name:'Cochon',     img:'pig',     emoji:'🐷', personality:'gourmand',  playType:'ball',
             foodPrefs:{loves:['carb','condiment'],likes:['green'],hates:[]},
             careNeeds:{hunger:0.7,happiness:0.5,cleanliness:0.6,health:0.3},
             desc:'Un petit cochon rose et rigolo.' },
  chicken: { name:'Poule',      img:'chicken', emoji:'🐔', personality:'nerveux',   playType:'ball',
             foodPrefs:{loves:['green','carb'],likes:['condiment'],hates:['protein']},
             careNeeds:{hunger:0.5,happiness:0.4,cleanliness:0.3,health:0.2},
             desc:'Une poule joyeuse et bavarde.' },
  mouse:   { name:'Souris',     img:'mouse',   emoji:'🐭', personality:'curieux',   playType:'yarn',
             foodPrefs:{loves:['carb','condiment'],likes:['green'],hates:['protein']},
             careNeeds:{hunger:0.4,happiness:0.5,cleanliness:0.3,health:0.2},
             desc:'Une petite souris curieuse.' },
  hippo:   { name:'Hippo',      img:'hippo',   emoji:'🦛', personality:'joyeux',    playType:'ball',
             foodPrefs:{loves:['green'],likes:['carb','protein'],hates:[]},
             careNeeds:{hunger:0.8,happiness:0.5,cleanliness:0.5,health:0.3},
             desc:'Un hippopotame joyeux !' },
  giraffe: { name:'Girafe',     img:'giraffe', emoji:'🦒', personality:'élégant',   playType:'ball',
             foodPrefs:{loves:['green'],likes:['carb'],hates:['protein']},
             careNeeds:{hunger:0.5,happiness:0.4,cleanliness:0.3,health:0.2},
             desc:'Une girafe élégante au long cou.' },
  zebra:   { name:'Zèbre',      img:'zebra',   emoji:'🦓', personality:'vif',       playType:'ball',
             foodPrefs:{loves:['green'],likes:['carb'],hates:['protein']},
             careNeeds:{hunger:0.5,happiness:0.6,cleanliness:0.4,health:0.2},
             desc:'Un zèbre rayé plein de vitalité !' },
  squirrel:{ name:'Écureuil',   img:'squirrel',emoji:'🐿️', personality:'vif',       playType:'ball',
             foodPrefs:{loves:['green','carb'],likes:['condiment'],hates:['protein']},
             careNeeds:{hunger:0.4,happiness:0.6,cleanliness:0.3,health:0.2},
             desc:'Un écureuil agile et malin.' },
  goat:    { name:'Chèvre',     img:'goat',    emoji:'🐐', personality:'têtu',      playType:'ball',
             foodPrefs:{loves:['green'],likes:['carb','condiment'],hates:[]},
             careNeeds:{hunger:0.5,happiness:0.5,cleanliness:0.4,health:0.3},
             desc:'Une chèvre espiègle et têtue.' },
  beaver:  { name:'Castor',     img:'beaver',  emoji:'🦫', personality:'travailleur',playType:'ball',
             foodPrefs:{loves:['green','carb'],likes:['condiment'],hates:['protein']},
             careNeeds:{hunger:0.5,happiness:0.4,cleanliness:0.4,health:0.3},
             desc:'Un castor bricoleur et malin.' },
};

// Available animals for the hotel (subset - the ones we have images for)
const HOTEL_ANIMALS = ['dog','cat','owl','bear','monkey','penguin','cow','sheep',
  'elephant','pig','chicken','mouse','hippo','giraffe','zebra','squirrel','goat','beaver'];

// Face expressions
const FACES = {
  happy:'happy', sad:'sad', angry:'angry', love:'love', love2:'love2',
  neutral:'neutral', scared:'scared', crying:'crying', wink:'wink',
  cheeky:'cheeky', suspicious:'suspicious', star_eyes:'star_eyes',
  excited:'excited', sleepy:'sleepy', dizzy:'dizzy', surprised:'surprised',
  furious:'furious', wink2:'wink2'
};

// Food categories with items (numbered files)
const FOOD_CATEGORIES = {
  protein:   { name:'Viandes & Poissons', emoji:'🥩', count:117, price:8 },
  green:     { name:'Légumes & Fruits',   emoji:'🥬', count:140, price:5 },
  carb:      { name:'Féculents',           emoji:'🍞', count:50,  price:6 },
  condiment: { name:'Sauces & Épices',     emoji:'🧂', count:130, price:4 },
};

// Room colors for customization
const ROOM_COLORS = [
  { name:'Rose',    bg:'linear-gradient(180deg, #fce4ec, #f8bbd0)', color:'#fce4ec' },
  { name:'Bleu',    bg:'linear-gradient(180deg, #e3f2fd, #bbdefb)', color:'#e3f2fd' },
  { name:'Vert',    bg:'linear-gradient(180deg, #e8f5e9, #c8e6c9)', color:'#e8f5e9' },
  { name:'Violet',  bg:'linear-gradient(180deg, #f3e5f5, #e1bee7)', color:'#f3e5f5' },
  { name:'Jaune',   bg:'linear-gradient(180deg, #fffde7, #fff9c4)', color:'#fffde7' },
  { name:'Orange',  bg:'linear-gradient(180deg, #fff3e0, #ffe0b2)', color:'#fff3e0' },
];

// Room decorations
const ROOM_BEDS = ['🛏️','🛋️','🧸','🪺','🎀'];
const ROOM_BOWLS = ['🥣','🍽️','🥗','🍲'];
const ROOM_TOYS = ['⚽','🧸','🎾','🪀','🎈'];

// Shop items beyond food
const SHOP_EXTRAS = [
  { id:'toy_ball',  name:'Balle',      emoji:'⚽', price:15, type:'toy' },
  { id:'toy_yarn',  name:'Pelote',     emoji:'🧶', price:12, type:'toy' },
  { id:'toy_bear',  name:'Peluche',    emoji:'🧸', price:20, type:'toy' },
  { id:'soap',      name:'Savon',      emoji:'🧼', price:8,  type:'tool' },
  { id:'shampoo',   name:'Shampoing',  emoji:'🧴', price:10, type:'tool' },
  { id:'towel',     name:'Serviette',  emoji:'🪥', price:8,  type:'tool' },
  { id:'brush',     name:'Brosse',     emoji:'🪮', price:12, type:'tool' },
  { id:'bed_fancy', name:'Lit luxe',   emoji:'🛋️', price:50, type:'furniture' },
  { id:'bowl_gold', name:'Bol doré',   emoji:'🥣', price:30, type:'furniture' },
];

// Pickup times
const PICKUP_TIMES = ['1 jour','2 jours','3 jours','1 semaine'];

// Owner messages
const OWNER_MESSAGES = [
  "Bonjour ! Pouvez-vous garder mon {animal} ?",
  "Mon {animal} a besoin de vacances !",
  "Je voyage et j'ai besoin d'aide pour {animal}.",
  "Prenez bien soin de mon petit {animal} !",
  "Mon {animal} adore les hôtels de luxe !",
];

// Default save state
function getDefaultState() {
  return {
    playerName: '',
    playerChar: 'girl',
    coins: 50,
    stars: 0,
    day: 1,
    animals: [], // { type, name, hunger, happiness, cleanliness, health, room, arrivalDay, stayDuration }
    fridge: { protein:[], green:[], carb:[], condiment:[] },
    inventory: [],
    rooms: {}, // roomIndex -> { color, bed, bowl, toy, pattern }
    highScores: { logJump:0, hiddenAnimals:0 },
    tutorialDone: false,
    totalAnimalsServed: 0,
  };
}

// Helper: get food reaction
function getFoodReaction(animalType, foodCategory) {
  const prefs = ANIMAL_TYPES[animalType].foodPrefs;
  if (prefs.loves.includes(foodCategory)) return 'love';
  if (prefs.likes.includes(foodCategory)) return 'like';
  if (prefs.hates.includes(foodCategory)) return 'hate';
  return 'like';
}

// Helper: generate random animal arrival
function generateRandomAnimal() {
  const types = HOTEL_ANIMALS;
  const type = types[Math.floor(Math.random() * types.length)];
  const data = ANIMAL_TYPES[type];
  const names = {
    dog:['Rex','Luna','Max','Bella','Rocky'],
    cat:['Minou','Felix','Nala','Simba','Choupette'],
    owl:['Hedwig','Bubo','Chouette','Hoot'],
    bear:['Teddy','Bruno','Nounours','Winnie'],
    monkey:['Coco','Banane','George','Kiki'],
    penguin:['Tux','Pingu','Ice','Neige'],
    cow:['Marguerite','Bella','Lola'],
    sheep:['Dolly','Flocon','Moumoute'],
    elephant:['Dumbo','Babar','Ellie'],
    pig:['Babe','Truffe','Peppa'],
    chicken:['Cocotte','Plume','Poulette'],
    mouse:['Jerry','Ratatouille','Grigri'],
    hippo:['Gloria','Hippo','Hugo'],
    giraffe:['Sophie','Melman','Cou-Long'],
    zebra:['Marty','Zébulon','Rayure'],
    squirrel:['Noisette','Scrat','Chipie'],
    goat:['Blanquette','Biquette','Chèvrefeuille'],
    beaver:['Justin','Castor','Barrage'],
  };
  const nameList = names[type] || ['Ami'];
  const name = nameList[Math.floor(Math.random() * nameList.length)];
  const stay = Math.floor(Math.random() * 3) + 1;

  return {
    type, name, stayDuration: stay,
    hunger: 0.3 + Math.random() * 0.4,
    happiness: 0.3 + Math.random() * 0.4,
    cleanliness: 0.3 + Math.random() * 0.4,
    health: 0.5 + Math.random() * 0.3,
    room: -1,
    arrivalDay: 0,
    face: 'neutral',
  };
}
