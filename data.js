
const PRODUCTS = {
  clothes: [
    {
      id:       "tshirt-dryfit",
      category: "men",
      name:     "Футболка DryFit Pro",
      desc:     "Ткань отводит влагу в секунды — майка остаётся сухой даже в самые интенсивные тренировки.",
      price:    2490,
      image:    "images/tshirt.jpg",
      badge:    "Хит",
      inStock:  true
    },
    {
      id:       "leggings-motion",
      category: "women",
      name:     "Лосины Motion Flex",
      desc:     "Четырёхстороннее растяжение ткани не стесняет движений ни в выпаде, ни в приседе.",
      price:    3190,
      image:    "images/leggings.jpg",
      badge:    null,
      inStock:  true
    },
    {
      id:       "hoodie-powermove",
      category: "men",
      name:     "Худи PowerMove",
      desc:     "Плотный флис внутри, гладкий снаружи. Подходит для улицы, зала и любого промежуточного состояния.",
      price:    4990,
      image:    "images/hoodie.jpg",
      badge:    "Новинка",
      inStock:  true
    }
  ],
  equipment: [
    {
      id:       "dumbbells-set",
      category: "home",
      name:     "Набор разборных гантелей",
      desc:     "12 дисков, два грифа, удобный хват с накаткой. Вес от 2 до 20 кг на гантель.",
      price:    6990,
      image:    "images/dumbbells.jpg",
      badge:    "Хит",
      inStock:  true
    },
    {
      id:       "yoga-mat-pro",
      category: "home",
      name:     "Коврик для йоги Pro 6 мм",
      desc:     "Нескользящее покрытие с обеих сторон, плотность 6 мм — подходит для жёстких полов.",
      price:    1990,
      image:    "images/yoga-mat.jpg",
      badge:    null,
      inStock:  true
    },
    {
      id:       "skipping-rope-speed",
      category: "gym",
      name:     "Скакалка Speed Pro",
      desc:     "Алюминиевые ручки с подшипниками, трос 3 мм — идеально для кроссфита и двойных прыжков.",
      price:    990,
      image:    "images/skipping-rope.jpg",
      badge:    null,
      inStock:  true
    }
  ],

  /* ─────────────────────────────────
     ПИТАНИЕ  (nutrition.html)
  ───────────────────────────────── */
  nutrition: [
    {
      id:       "whey-protein-vanilla",
      category: "protein",
      name:     "Whey Protein Vanilla",
      desc:     "25 г белка на порцию, без аспартама. Растворяется без комков, вкус не приедается.",
      price:    3790,
      image:    "images/whey.jpg",
      badge:    "Хит",
      inStock:  true
    },
    {
      id:       "protein-bar-choco",
      category: "protein",
      name:     "Protein Bar Chocolate",
      desc:     "20 г белка, 5 г углеводов, без сахарного спирта. Удобно взять в дорогу или съесть после тренировки.",
      price:    190,
      image:    "images/bar.jpg",
      badge:    null,
      inStock:  true
    },
    {
      id:       "bcaa-complex",
      category: "recovery",
      name:     "BCAA Recovery Complex",
      desc:     "Соотношение 2:1:1, дополнительный витамин B6. Уменьшает крепатуру и ускоряет восстановление.",
      price:    2490,
      image:    "images/bcaa.jpg",
      badge:    null,
      inStock:  true
    }
  ]
};
