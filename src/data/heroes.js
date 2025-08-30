// src/data/heroes.js

export const heroPool = [
  // Cấp độ SSS
  {
    rarity: 'SSS',
    name: 'Zelus',
    faction: 'Bóng tối',
    class: 'Pháp sư',
    atk: 220,
    hp: 1200,
    spd: 130,
  },
  {
    rarity: 'SSS',
    name: 'Orion',
    faction: 'Ánh sáng',
    class: 'Đấu sĩ',
    atk: 250,
    hp: 1100,
    spd: 125,
  },
  {
    rarity: 'SSS',
    name: 'Seraphina',
    faction: 'Ánh sáng',
    class: 'Hỗ trợ',
    atk: 180,
    hp: 1050,
    spd: 150,
  },
  { rarity: 'SSS', name: 'Gaius', faction: 'Ngô', class: 'Đỡ đòn', atk: 200, hp: 1500, spd: 90 },
  {
    rarity: 'SSS',
    name: 'Nox',
    faction: 'Bóng tối',
    class: 'Đấu sĩ',
    atk: 260,
    hp: 1000,
    spd: 140,
  },
  {
    rarity: 'SSS',
    name: 'Lyndis',
    faction: 'Ngụy',
    class: 'Pháp sư',
    atk: 230,
    hp: 1050,
    spd: 135,
  },
  {
    rarity: 'SSS',
    name: 'Vayne',
    faction: 'Bóng tối',
    class: 'Thích khách',
    atk: 280,
    hp: 950,
    spd: 160,
  }, // Cấp độ SS

  { rarity: 'SS', name: 'Nyx', faction: 'Thục', class: 'Hỗ trợ', atk: 150, hp: 1000, spd: 140 },
  { rarity: 'SS', name: 'Atlas', faction: 'Ngụy', class: 'Đỡ đòn', atk: 180, hp: 1350, spd: 80 },
  { rarity: 'SS', name: 'Ignis', faction: 'Ngô', class: 'Pháp sư', atk: 190, hp: 900, spd: 110 },
  {
    rarity: 'SS',
    name: 'Kaelus',
    faction: 'Ánh sáng',
    class: 'Đấu sĩ',
    atk: 210,
    hp: 1150,
    spd: 100,
  },
  { rarity: 'SS', name: 'Ember', faction: 'Ngô', class: 'Pháp sư', atk: 200, hp: 850, spd: 120 },
  { rarity: 'SS', name: 'Riven', faction: 'Thục', class: 'Đấu sĩ', atk: 220, hp: 1100, spd: 105 },
  { rarity: 'SS', name: 'Triton', faction: 'Ngụy', class: 'Hỗ trợ', atk: 160, hp: 950, spd: 130 },
  {
    rarity: 'SS',
    name: 'Borius',
    faction: 'Ánh sáng',
    class: 'Đỡ đòn',
    atk: 190,
    hp: 1400,
    spd: 85,
  },
  {
    rarity: 'SS',
    name: 'Elora',
    faction: 'Bóng tối',
    class: 'Pháp sư',
    atk: 185,
    hp: 920,
    spd: 115,
  },
  { rarity: 'SS', name: 'Garen', faction: 'Thục', class: 'Đấu sĩ', atk: 200, hp: 1200, spd: 95 },
  {
    rarity: 'SS',
    name: 'Akali',
    faction: 'Bóng tối',
    class: 'Thích khách',
    atk: 250,
    hp: 880,
    spd: 155,
  }, // Cấp độ S

  {
    rarity: 'S',
    name: 'Aurelia',
    faction: 'Ánh sáng',
    class: 'Đấu sĩ',
    atk: 160,
    hp: 950,
    spd: 110,
  },
  { rarity: 'S', name: 'Ragnar', faction: 'Ngô', class: 'Đỡ đòn', atk: 180, hp: 900, spd: 95 },
  { rarity: 'S', name: 'Lyra', faction: 'Thục', class: 'Hỗ trợ', atk: 120, hp: 850, spd: 130 },
  { rarity: 'S', name: 'Vex', faction: 'Bóng tối', class: 'Pháp sư', atk: 140, hp: 780, spd: 115 },
  { rarity: 'S', name: 'Drakon', faction: 'Ngụy', class: 'Đấu sĩ', atk: 170, hp: 980, spd: 100 },
  { rarity: 'S', name: 'Sable', faction: 'Ánh sáng', class: 'Hỗ trợ', atk: 130, hp: 800, spd: 125 },
  { rarity: 'S', name: 'Thane', faction: 'Ngụy', class: 'Đỡ đòn', atk: 150, hp: 1100, spd: 85 },
  { rarity: 'S', name: 'Vesper', faction: 'Thục', class: 'Pháp sư', atk: 135, hp: 750, spd: 120 },
  { rarity: 'S', name: 'Kai', faction: 'Ngô', class: 'Đấu sĩ', atk: 165, hp: 900, spd: 105 },
  { rarity: 'S', name: 'Elara', faction: 'Ánh sáng', class: 'Hỗ trợ', atk: 115, hp: 820, spd: 135 },
  {
    rarity: 'S',
    name: 'Katarina',
    faction: 'Bóng tối',
    class: 'Thích khách',
    atk: 190,
    hp: 700,
    spd: 135,
  }, // Cấp độ A

  { rarity: 'A', name: 'Selene', faction: 'Thục', class: 'Pháp sư', atk: 120, hp: 700, spd: 120 },
  { rarity: 'A', name: 'Drake', faction: 'Ngụy', class: 'Đấu sĩ', atk: 130, hp: 680, spd: 105 },
  { rarity: 'A', name: 'Thorn', faction: 'Ánh sáng', class: 'Đỡ đòn', atk: 110, hp: 800, spd: 90 },
  { rarity: 'A', name: 'Milo', faction: 'Ngô', class: 'Hỗ trợ', atk: 100, hp: 650, spd: 125 },
  {
    rarity: 'A',
    name: 'Valeria',
    faction: 'Bóng tối',
    class: 'Đấu sĩ',
    atk: 145,
    hp: 720,
    spd: 95,
  },
  { rarity: 'A', name: 'Jinx', faction: 'Thục', class: 'Pháp sư', atk: 130, hp: 650, spd: 110 },
  { rarity: 'A', name: 'Gideon', faction: 'Ngụy', class: 'Đỡ đòn', atk: 120, hp: 850, spd: 88 },
  {
    rarity: 'A',
    name: 'Caspian',
    faction: 'Ánh sáng',
    class: 'Hỗ trợ',
    atk: 110,
    hp: 700,
    spd: 115,
  },
  { rarity: 'A', name: 'Zephyr', faction: 'Ngô', class: 'Đấu sĩ', atk: 150, hp: 700, spd: 100 },
  { rarity: 'A', name: 'Lia', faction: 'Bóng tối', class: 'Pháp sư', atk: 125, hp: 680, spd: 118 },
  { rarity: 'A', name: 'Odin', faction: 'Thục', class: 'Đỡ đòn', atk: 130, hp: 820, spd: 85 },
  {
    rarity: 'A',
    name: 'Zed',
    faction: 'Bóng tối',
    class: 'Thích khách',
    atk: 160,
    hp: 650,
    spd: 130,
  }, // Cấp độ B

  { rarity: 'B', name: 'Mira', faction: 'Ánh sáng', class: 'Đấu sĩ', atk: 95, hp: 520, spd: 110 },
  { rarity: 'B', name: 'Kane', faction: 'Ngô', class: 'Đỡ đòn', atk: 100, hp: 500, spd: 100 },
  { rarity: 'B', name: 'Luna', faction: 'Thục', class: 'Hỗ trợ', atk: 85, hp: 480, spd: 115 },
  { rarity: 'B', name: 'Grom', faction: 'Ngụy', class: 'Pháp sư', atk: 110, hp: 450, spd: 90 },
  { rarity: 'B', name: 'Finn', faction: 'Ánh sáng', class: 'Đấu sĩ', atk: 105, hp: 550, spd: 105 },
  { rarity: 'B', name: 'Korra', faction: 'Bóng tối', class: 'Hỗ trợ', atk: 90, hp: 500, spd: 120 },
  { rarity: 'B', name: 'Orin', faction: 'Ngụy', class: 'Đỡ đòn', atk: 95, hp: 600, spd: 95 },
  { rarity: 'B', name: 'Lira', faction: 'Thục', class: 'Pháp sư', atk: 105, hp: 480, spd: 105 },
  { rarity: 'B', name: 'Silas', faction: 'Ngô', class: 'Đấu sĩ', atk: 110, hp: 530, spd: 100 },
  { rarity: 'B', name: 'Kael', faction: 'Ánh sáng', class: 'Đỡ đòn', atk: 90, hp: 550, spd: 98 },
  { rarity: 'B', name: 'Maya', faction: 'Ngô', class: 'Hỗ trợ', atk: 88, hp: 460, spd: 112 },
  {
    rarity: 'B',
    name: 'Shaco',
    faction: 'Bóng tối',
    class: 'Thích khách',
    atk: 130,
    hp: 450,
    spd: 130,
  }, // Cấp độ C

  { rarity: 'C', name: 'Bran', faction: 'Thục', class: 'Đấu sĩ', atk: 70, hp: 380, spd: 95 },
  { rarity: 'C', name: 'Lina', faction: 'Ánh sáng', class: 'Hỗ trợ', atk: 75, hp: 360, spd: 105 },
  { rarity: 'C', name: 'Kael', faction: 'Ngụy', class: 'Pháp sư', atk: 80, hp: 350, spd: 100 },
  { rarity: 'C', name: 'Borin', faction: 'Ngô', class: 'Đỡ đòn', atk: 65, hp: 420, spd: 80 },
  { rarity: 'C', name: 'Roric', faction: 'Bóng tối', class: 'Đấu sĩ', atk: 85, hp: 400, spd: 90 },
  { rarity: 'C', name: 'Ella', faction: 'Ngụy', class: 'Hỗ trợ', atk: 60, hp: 320, spd: 110 },
  { rarity: 'C', name: 'Talon', faction: 'Thục', class: 'Đấu sĩ', atk: 90, hp: 410, spd: 95 },
  {
    rarity: 'C',
    name: 'Vesper',
    faction: 'Ánh sáng',
    class: 'Pháp sư',
    atk: 85,
    hp: 380,
    spd: 105,
  },
  { rarity: 'C', name: 'Anya', faction: 'Ngô', class: 'Hỗ trợ', atk: 70, hp: 350, spd: 115 },
  { rarity: 'C', name: 'Gale', faction: 'Bóng tối', class: 'Pháp sư', atk: 90, hp: 360, spd: 105 },
  { rarity: 'C', name: 'Gris', faction: 'Thục', class: 'Đỡ đòn', atk: 75, hp: 450, spd: 85 },
  { rarity: 'C', name: 'Torin', faction: 'Ngụy', class: 'Đấu sĩ', atk: 80, hp: 400, spd: 98 },
  {
    rarity: 'C',
    name: 'Ekko',
    faction: 'Bóng tối',
    class: 'Thích khách',
    atk: 100,
    hp: 350,
    spd: 120,
  },
]

export const rarityWeight = { SSS: 0.8, SS: 1.5, S: 3, A: 8, B: 25, C: 62 }

// Định nghĩa màu theo phe phái
export const factionColor = {
  Ngụy: '#3b82f6', // Xanh dương
  Thục: '#10b981', // Xanh lá
  Ngô: '#dc2626', // Đỏ
  'Ánh sáng': '#ffeb3b', // Vàng
  'Bóng tối': '#8b5cf6', // Tím
}

// Định nghĩa các bonus phe phái
export const factionBonuses = {
  2: '5%',
  3: '10%',
  4: '20%',
  5: '30%',
}

// Định nghĩa hệ thống khắc chế
export const factionCounters = {
  'Ánh sáng': 'Bóng tối',
  'Bóng tối': 'Thục',
  Thục: 'Ngô',
  Ngô: 'Ngụy',
  Ngụy: 'Ánh sáng',
}
