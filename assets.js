// ============================================================
// ASSETS.JS — Image preloader for Animal Hotel V2
// ============================================================

const Assets = {
  images: {},
  loaded: 0,
  total: 0,
  ready: false,

  // Get all images to preload
  getManifest() {
    const manifest = {};

    // Animals
    HOTEL_ANIMALS.forEach(a => {
      manifest[`animal_${a}`] = `assets/game/animals/${a}.png`;
    });

    // Faces
    Object.values(FACES).forEach(f => {
      manifest[`face_${f}`] = `assets/game/faces/${f}.png`;
    });

    // Food (load a subset for shop display — first 12 of each category)
    Object.keys(FOOD_CATEGORIES).forEach(cat => {
      const count = Math.min(FOOD_CATEGORIES[cat].count, 20);
      for (let i = 1; i <= count; i++) {
        manifest[`food_${cat}_${i}`] = `assets/game/food/${cat}/${cat}_${String(i).padStart(3,'0')}.png`;
      }
    });

    return manifest;
  },

  load(onProgress, onComplete) {
    const manifest = this.getManifest();
    const keys = Object.keys(manifest);
    this.total = keys.length;
    this.loaded = 0;

    if (this.total === 0) { this.ready = true; onComplete(); return; }

    keys.forEach(key => {
      const img = new Image();
      img.onload = () => {
        this.images[key] = img;
        this.loaded++;
        if (onProgress) onProgress(this.loaded / this.total);
        if (this.loaded >= this.total) {
          this.ready = true;
          if (onComplete) onComplete();
        }
      };
      img.onerror = () => {
        console.warn(`Failed to load: ${key} (${manifest[key]})`);
        this.loaded++;
        if (onProgress) onProgress(this.loaded / this.total);
        if (this.loaded >= this.total) {
          this.ready = true;
          if (onComplete) onComplete();
        }
      };
      img.src = manifest[key];
    });
  },

  get(key) {
    return this.images[key] || null;
  },

  getAnimal(type) {
    return this.images[`animal_${type}`] || null;
  },

  getFace(face) {
    return this.images[`face_${face}`] || null;
  },

  getFood(category, index) {
    return this.images[`food_${category}_${index}`] || null;
  },

  // Get a random food image from a category
  getRandomFood(category) {
    const max = Math.min(FOOD_CATEGORIES[category].count, 20);
    const idx = Math.floor(Math.random() * max) + 1;
    return { img: this.getFood(category, idx), index: idx };
  }
};
