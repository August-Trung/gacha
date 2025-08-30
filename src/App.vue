<template>
  <div class="app-container">
    <header class="topbar">
      <h1 class="title">⚔️ Card PK – Evolved</h1>

      <div class="wallet">
        💎 Gems: <b>{{ gems }}</b>
        <button @click="addGems" class="add-gems-btn">+Gems</button>
      </div>
    </header>

    <div class="main-content">
      <section class="gacha-section">
        <h2 class="section-title">Quay Tướng</h2>
        <Gacha v-model:gems="gems" @hero-pulled="addHeroToInventory" />
      </section>

      <section class="inventory-section">
        <h2 class="section-title">Kho Thẻ</h2>

        <div class="inventory-grid" @drop="handleDropToInventory" @dragover.prevent>
          <HeroCard
            v-for="inst in inventory"
            :key="inst.id"
            :hero="inst"
            class="clickable"
            draggable="true"
            @dragstart="handleDragStart($event, inst, 'inventory')"
          />
        </div>
      </section>
    </div>

    <section class="builder-section">
      <div class="team-builder-section">
        <h2 class="section-title">Đội Của Bạn</h2>

        <TeamBuilder
          :inventory="inventory"
          :team="myTeam"
          @update:team="
            (newTeam) => {
              myTeam.splice(0, myTeam.length, ...newTeam)
            }
          "
          @dragstart="handleDragStart"
        />
      </div>

      <div class="enemy-team-section">
        <h2 class="section-title">Đội Địch</h2>

        <div class="enemy-board">
          <div v-for="i in 9" :key="i" class="slot">
            <template v-if="enemyTeam[i - 1]">
              <HeroCard :hero="enemyTeam[i - 1]" />
            </template>
            <span v-else class="placeholder">Trống</span>
          </div>
        </div>

        <div class="enemy-actions">
          <button @click="generateEnemyTeam">Tạo Đội Địch Ngẫu Nhiên</button>
        </div>
      </div>
    </section>

    <section class="battle-section">
      <h2 class="section-title">Chiến Đấu</h2>

      <div class="battle-controls">
        <button class="primary" :disabled="!canBattle" @click="startBattle">Bắt đầu PK</button>
        <label class="chk"><input type="checkbox" v-model="fast" /> Chế độ nhanh</label>
      </div>
      <BattleLog :log="battleLog" />
    </section>
  </div>
</template>

<script setup>
import { reactive, ref, computed, onMounted } from 'vue'
import { heroPool, rarityWeight, factionBonuses, factionCounters } from './data/heroes'
import Gacha from './components/Gacha.vue'
import HeroCard from './components/HeroCard.vue'
import TeamBuilder from './components/TeamBuilder.vue'
import BattleLog from './components/BattleLog.vue'

// Basic Data
const gems = ref(2000)
const inventory = reactive([])
const myTeam = reactive(Array(9).fill(null))
const enemyTeam = reactive(Array(9).fill(null))
const battleLog = ref([])
const fast = ref(true)

const canBattle = computed(() => {
  const myTeamCount = myTeam.filter((hero) => hero !== null).length
  const enemyTeamCount = enemyTeam.filter((hero) => hero !== null).length
  return myTeamCount >= 1 && enemyTeamCount >= 1
})

onMounted(() => {
  generateEnemyTeam()
})

// Gems
function addGems() {
  gems.value += 100000
}

// Gacha & Hero Logic
function addHeroToInventory(hero) {
  inventory.push(hero)
}

// Drag & Drop
function handleDragStart(event, hero, source, index = -1) {
  event.dataTransfer.setData('hero', JSON.stringify(hero))
  event.dataTransfer.setData('source', source)
  event.dataTransfer.setData('index', index)
}

function handleDropToInventory(event) {
  const draggedHero = JSON.parse(event.dataTransfer.getData('hero'))
  const draggedSource = event.dataTransfer.getData('source')
  const draggedIndex = parseInt(event.dataTransfer.getData('index'))

  if (draggedSource === 'team' && draggedHero) {
    inventory.push(draggedHero)
    myTeam[draggedIndex] = null
  }
}

// Team Builder & Enemy Team
function generateEnemyTeam() {
  for (let i = 0; i < 9; i++) {
    enemyTeam[i] = null
  }
  const poolSize = 5
  const availableSlots = [0, 1, 2, 3, 4, 5, 6, 7, 8]

  for (let i = 0; i < poolSize; i++) {
    const totalWeight = Object.values(rarityWeight).reduce((a, b) => a + b, 0)
    let rand = Math.random() * totalWeight
    let rarity = 'C'
    for (const [r, w] of Object.entries(rarityWeight)) {
      rand -= w
      if (rand < 0) {
        rarity = r
        break
      }
    }
    const candidates = heroPool.filter((h) => h.rarity === rarity)
    const base = candidates[Math.floor(Math.random() * candidates.length)]
    const stars = { SSS: 6, SS: 5, S: 4, A: 3, B: 2, C: 1 }[rarity]

    const randomSlotIndex = Math.floor(Math.random() * availableSlots.length)
    const slot = availableSlots.splice(randomSlotIndex, 1)[0]

    enemyTeam[slot] = {
      ...base,
      id: -i - 1,
      atk: Math.round(base.atk * (0.9 + Math.random() * 0.2)),
      hp: Math.round(base.hp * (0.9 + Math.random() * 0.2)),
      lv: 1,
      stars,
    }
  }
}

// Battle Simulation
async function startBattle() {
  battleLog.value = []
  const myLiveTeam = myTeam.filter(Boolean).map(cloneUnit)
  const enemyLiveTeam = enemyTeam.filter(Boolean).map(cloneUnit)
  if (myLiveTeam.length === 0 || enemyLiveTeam.length === 0) {
    log('Vui lòng xếp đủ đội hình và tạo đội hình địch!')
    return
  }

  const myBonuses = getFactionBonus(myLiveTeam)
  const enemyBonuses = getFactionBonus(enemyLiveTeam)

  myLiveTeam.forEach((hero) => {
    if (myBonuses[hero.faction]) {
      const bonusValue = (myBonuses[hero.faction] - 1) * 100
      hero.atk = Math.round(hero.atk * myBonuses[hero.faction])
      hero.hp = Math.round(hero.hp * myBonuses[hero.faction])
      log(
        `Team Bạn: Tướng ${hero.name} nhận bonus phe ${hero.faction} (+${bonusValue}% ATK và HP)!`,
      )
    }
  })
  enemyLiveTeam.forEach((hero) => {
    if (enemyBonuses[hero.faction]) {
      const bonusValue = (enemyBonuses[hero.faction] - 1) * 100
      hero.atk = Math.round(hero.atk * enemyBonuses[hero.faction])
      hero.hp = Math.round(hero.hp * enemyBonuses[hero.faction])
      log(
        `Team Địch: Tướng ${hero.name} nhận bonus phe ${hero.faction} (+${bonusValue}% ATK và HP)!`,
      )
    }
  })

  log(`\n=== Trận đấu bắt đầu ===`)
  let round = 1
  while (myLiveTeam.some((u) => u.hp > 0) && enemyLiveTeam.some((u) => u.hp > 0) && round <= 20) {
    log(`-- Vòng ${round} --`)
    const order = [
      ...myLiveTeam.map((u) => ({ side: 'Bạn', u })),
      ...enemyLiveTeam.map((u) => ({ side: 'Địch', u })),
    ]
      .filter((x) => x.u.hp > 0)
      .sort((a, b) => b.u.spd - a.u.spd)

    for (const step of order) {
      if (!(myLiveTeam.some((u) => u.hp > 0) && enemyLiveTeam.some((u) => u.hp > 0))) break
      const attacker = step.u
      if (attacker.hp <= 0) continue

      const foes = step.side === 'Bạn' ? enemyLiveTeam : myLiveTeam
      const target = pickTarget(foes, attacker.class)
      if (!target) continue

      const { dmg, crit } = computeDamage(attacker, target)
      const counterMultiplier = getFactionCounter(attacker.faction, target.faction)
      const finalDamage = Math.round(dmg * counterMultiplier)

      target.hp = Math.max(0, target.hp - finalDamage)
      log(
        `${step.side}·${attacker.name} tấn công → ${target.name} (-${finalDamage} HP)${crit ? ' (CRIT)' : ''}${counterMultiplier > 1 ? ' (Khắc chế!)' : ''} [${target.hp} HP còn lại]`,
      )
      if (!fast.value) await sleep(350)
    }
    round++
    if (!fast.value) await sleep(300)
  }
  const result = myLiveTeam.some((u) => u.hp > 0)
    ? 'BẠN THẮNG'
    : enemyLiveTeam.some((u) => u.hp > 0)
      ? 'BẠN THUA'
      : 'HÒA'
  log(`=== Kết quả: ${result} ===`)
}

function getFactionBonus(team) {
  const factionCounts = {}
  team.forEach((hero) => {
    if (hero && hero.faction) {
      factionCounts[hero.faction] = (factionCounts[hero.faction] || 0) + 1
    }
  })

  const bonuses = {}
  for (const faction in factionCounts) {
    const count = factionCounts[faction]
    if (count >= 5) {
      bonuses[faction] = 1.3
    } else if (count >= 4) {
      bonuses[faction] = 1.2
    } else if (count >= 3) {
      bonuses[faction] = 1.1
    } else if (count >= 2) {
      bonuses[faction] = 1.05
    }
  }
  return bonuses
}

function getFactionCounter(attackerFaction, targetFaction) {
  if (factionCounters[attackerFaction] === targetFaction) {
    return 1.2 // Gây thêm 20% sát thương
  }
  return 1
}

function cloneUnit(u) {
  return JSON.parse(JSON.stringify(u))
}

function computeDamage(att, tgt) {
  const mult = { SSS: 2.0, SS: 1.8, S: 1.6, A: 1.35, B: 1.15, C: 1.0 }[att.rarity]
  let dmg = Math.round(att.atk * mult * (0.9 + Math.random() * 0.2))
  const crit = Math.random() < 0.15
  if (crit) dmg = Math.round(dmg * 1.5)
  return { dmg, crit }
}

function pickTarget(arr, attackerClass) {
  const alive = arr.filter((u) => u.hp > 0)
  if (alive.length === 0) return null

  if (attackerClass === 'Hỗ trợ') {
    alive.sort((a, b) => a.hp - b.hp)
    return alive[0]
  }

  const tanks = alive.filter((u) => u.class === 'Đỡ đòn')
  if (tanks.length > 0) {
    return tanks[Math.floor(Math.random() * tanks.length)]
  }

  alive.sort((a, b) => a.hp - b.hp)
  return alive[0]
}

function log(s) {
  battleLog.value.push(s)
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms))
}
</script>

<style>
/* Giữ nguyên CSS cũ, chỉ cập nhật phần enemy-board */
body {
  background-color: #f0f2f5;
  color: #333;
  font-family:
    -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  margin: 0;
  padding: 0;
}
.app-container {
  max-width: 1200px;
  margin: 20px auto;
  padding: 20px;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.05);
}
.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 20px;
  border-bottom: 2px solid #e0e0e0;
  margin-bottom: 20px;
}
.title {
  font-size: 28px;
  font-weight: 800;
  color: #2c3e50;
}
.wallet {
  font-size: 18px;
  font-weight: 700;
  color: #4a4a4a;
  display: flex;
  align-items: center;
}
.add-gems-btn {
  margin-left: 10px;
  padding: 5px 10px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
}
.add-gems-btn:hover {
  background-color: #45a049;
}
.section-title {
  font-size: 22px;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 16px;
}
.main-content {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 20px;
}
.gacha-section,
.inventory-section,
.builder-section,
.battle-section {
  padding: 20px;
  border-radius: 12px;
  background-color: #f8f9fa;
  border: 1px solid #e0e0e0;
  margin-bottom: 20px;
}
.gacha-section {
  grid-column: span 1;
}
.inventory-section {
  grid-column: span 1;
}
.builder-section {
  grid-column: span 2;
  display: flex;
  gap: 20px;
}
.team-builder-section,
.enemy-team-section {
  flex: 1;
}
.enemy-board {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-top: 8px;
}
/* Sửa lỗi bố cục cho các slot trong đội địch */
.enemy-board .slot {
  width: 100px;
  height: 120px;
  margin: 0 auto; /* Căn giữa thẻ */
  border: 2px dashed #d1d5db;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}
.placeholder {
  color: #9ca3af;
  font-size: 14px;
}
.enemy-actions {
  margin-top: 15px;
  text-align: center;
}
.inventory-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 10px;
  max-height: 400px;
  overflow-y: auto;
  padding-right: 10px;
}
.inventory-grid::-webkit-scrollbar {
  width: 8px;
}
.inventory-grid::-webkit-scrollbar-thumb {
  background-color: #ccc;
  border-radius: 4px;
}
.clickable {
  cursor: pointer;
}
/* Battle Section */
.battle-controls {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 10px;
}
.chk {
  display: flex;
  align-items: center;
  gap: 6px;
}
</style>
