<template>
  <div class="app-container" @drop="handleDropAnywhere" @dragover.prevent>
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

        <div class="inventory-info">
          <span class="total-heroes">Tổng số tướng: {{ inventory.length }}</span>
          <button class="sell-btn" @click="sellHeroes">
            Bán tướng B, C (+{{ calculateSellGems() }} 💎)
          </button>
        </div>

        <div class="inventory-filters">
          <div class="filter-group">
            <label>Phe phái:</label>
            <button
              v-for="faction in uniqueFactions"
              :key="faction"
              @click="selectFilter('faction', faction)"
              :class="{ active: filters.faction === faction }"
            >
              {{ faction }}
            </button>
            <button @click="clearFilter('faction')" :class="{ active: filters.faction === null }">
              Tất cả
            </button>
          </div>

          <div class="filter-group">
            <label>Hạng:</label>
            <button
              v-for="rarity in uniqueRarities"
              :key="rarity"
              @click="selectFilter('rarity', rarity)"
              :class="{ active: filters.rarity === rarity }"
            >
              {{ rarity }}
            </button>
            <button @click="clearFilter('rarity')" :class="{ active: filters.rarity === null }">
              Tất cả
            </button>
          </div>

          <div class="filter-group">
            <label>Hệ:</label>
            <button
              v-for="heroClass in uniqueClasses"
              :key="heroClass"
              @click="selectFilter('class', heroClass)"
              :class="{ active: filters.class === heroClass }"
            >
              {{ heroClass }}
            </button>
            <button @click="clearFilter('class')" :class="{ active: filters.class === null }">
              Tất cả
            </button>
          </div>

          <div class="search-group">
            <label>Tìm kiếm:</label>
            <input type="text" v-model="filters.search" placeholder="Nhập tên tướng..." />
          </div>
        </div>

        <div class="inventory-grid" @drop="handleDropToInventory" @dragover.prevent>
          <HeroCard
            v-for="inst in filteredInventory"
            :key="inst.id"
            :hero="inst"
            class="clickable"
            draggable="true"
            @dragstart="handleDragStart($event, inst, 'inventory')"
            @show-details="showHeroDetails"
          />
        </div>
      </section>
    </div>

    <section class="builder-section">
      <div class="team-builder-section">
        <h2 class="section-title">Đội Của Bạn</h2>

        <div class="team-actions">
          <button @click="clearTeam">Xóa toàn bộ</button>
          <button @click="setFormation('cross')">Chữ Thập</button>
          <button @click="setFormation('cross-x')">Chữ X</button>
          <button @click="setFormation('double-t-left')">T ngang 2 đầu (trái)</button>
          <button @click="setFormation('double-t-right')">T ngang 2 đầu (phải)</button>
        </div>

        <TeamBuilder
          :inventory="inventory"
          :team="myTeam"
          @update:team="
            (newTeam) => {
              myTeam.splice(0, myTeam.length, ...newTeam)
            }
          "
          @dragstart="handleDragStart"
          @show-details="showHeroDetails"
          @hero-dropped="removeHeroFromInventory"
          @hero-selected-from-modal="removeHeroFromInventory"
        />
      </div>

      <div class="enemy-team-section">
        <h2 class="section-title">Đội Địch</h2>

        <div class="enemy-board">
          <div v-for="i in 9" :key="i" class="slot">
            <template v-if="enemyTeam[i - 1]">
              <HeroCard :hero="enemyTeam[i - 1]" @show-details="showHeroDetails" />
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
      <BattleLog :log="battleLog" @clear-log="clearBattleLog" />
    </section>

    <HeroSelectionModal
      v-if="showInventoryModal"
      :inventory="filteredInventory"
      @select-hero="selectHeroFromModal"
      @close="showInventoryModal = false"
    />

    <HeroDetailsModal v-if="selectedHero" :hero="selectedHero" @close="selectedHero = null" />
  </div>
</template>

<script setup>
import { reactive, ref, computed, onMounted } from 'vue'
import { heroPool, rarityWeight, factionBonuses, factionCounters } from './data/heroes'
import Gacha from './components/Gacha.vue'
import HeroCard from './components/HeroCard.vue'
import TeamBuilder from './components/TeamBuilder.vue'
import BattleLog from './components/BattleLog.vue'
import HeroDetailsModal from './components/HeroDetailsModal.vue'
import HeroSelectionModal from './components/HeroSelectionModal.vue'

const gems = ref(2000)
const inventory = reactive([])
const myTeam = reactive(Array(9).fill(null))
const enemyTeam = reactive(Array(9).fill(null))
const battleLog = ref([])
const isBattleRunning = ref(false)
const fast = ref(true)
const selectedHero = ref(null)

const filters = reactive({
  faction: null,
  rarity: null,
  class: null,
  search: '',
})

const uniqueFactions = computed(() => [...new Set(heroPool.map((h) => h.faction))])
const uniqueRarities = computed(() => [...new Set(heroPool.map((h) => h.rarity))])
const uniqueClasses = computed(() => [...new Set(heroPool.map((h) => h.class))])

const showInventoryModal = ref(false)
const selectedSlotIndex = ref(null)

function openModalForSlot(index) {
  selectedSlotIndex.value = index
  showInventoryModal.value = true
}

function selectHeroFromModal(hero) {
  if (selectedSlotIndex.value !== null) {
    // Logic để loại bỏ tướng khỏi vị trí cũ nếu nó đã ở trong đội hình
    const existingIndex = myTeam.findIndex((h) => h && h.id === hero.id)
    if (existingIndex !== -1) {
      myTeam[existingIndex] = null
    }

    myTeam[selectedSlotIndex.value] = hero
  }
  showInventoryModal.value = false
  selectedSlotIndex.value = null

  // THÊM LOGIC NÀY: Xóa tướng đã chọn khỏi kho
  const inventoryIndex = inventory.findIndex((h) => h.id === hero.id)
  if (inventoryIndex !== -1) {
    inventory.splice(inventoryIndex, 1)
  }
}

function showHeroDetails(hero) {
  selectedHero.value = hero
}

function removeHeroFromInventory(heroId) {
  const index = inventory.findIndex((h) => h.id === heroId)
  if (index !== -1) {
    inventory.splice(index, 1)
  }
}

function selectFilter(type, value) {
  filters[type] = filters[type] === value ? null : value
}

function clearFilter(type) {
  filters[type] = null
}

const filteredInventory = computed(() => {
  return inventory.filter((hero) => {
    const byFaction = filters.faction ? hero.faction === filters.faction : true
    const byRarity = filters.rarity ? hero.rarity === filters.rarity : true
    const byClass = filters.class ? hero.class === filters.class : true
    const bySearch = filters.search
      ? hero.name.toLowerCase().includes(filters.search.toLowerCase())
      : true
    return byFaction && byRarity && byClass && bySearch
  })
})

const canBattle = computed(() => {
  const myTeamCount = myTeam.filter((hero) => hero !== null).length
  const enemyTeamCount = enemyTeam.filter((hero) => hero !== null).length
  return myTeamCount >= 1 && enemyTeamCount >= 1
})

onMounted(() => {
  generateEnemyTeam()
})

function addGems() {
  gems.value += 100000
}

function addHeroToInventory(hero) {
  inventory.push(hero)
}

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
      atk: base.atk,
      hp: base.hp,
      spd: base.spd,
      lv: 1,
      stars,
      currentFury: 50, // Thêm dòng này để tướng địch bắt đầu với 50 nộ
    }
  }
}

async function startBattle() {
  if (isBattleRunning.value) return
  isBattleRunning.value = true
  battleLog.value = []
  const myLiveTeam = myTeam.filter(Boolean).map(cloneUnit)
  const enemyLiveTeam = enemyTeam.filter(Boolean).map(cloneUnit)

  if (myLiveTeam.length === 0 || enemyLiveTeam.length === 0) {
    log({
      type: 'info',
      content: 'Vui lòng xếp đủ đội hình và tạo đội hình địch!',
    })
    isBattleRunning.value = false
    return
  }

  const myBonuses = getFactionBonus(myLiveTeam)
  const enemyBonuses = getFactionBonus(enemyLiveTeam)

  myLiveTeam.forEach((hero) => {
    if (myBonuses[hero.faction]) {
      const bonusValue = myBonuses[hero.faction] * 100 - 100
      hero.atk = Math.round(hero.atk * myBonuses[hero.faction])
      hero.hp = Math.round(hero.hp * myBonuses[hero.faction])
      log({
        type: 'team-bonus',
        isAlly: true,
        content: `Tướng ${hero.name} nhận bonus phe ${hero.faction} (+${bonusValue.toFixed(0)}% ATK và HP)!`,
      })
    }
    if (hero.skills.passive?.teamSpdBuff) {
      log({
        type: 'info',
        content: `Team Bạn: ${hero.name} áp dụng kỹ năng nội tại "${hero.skills.passive.name}" cho toàn đội, tăng tốc độ ${hero.skills.passive.teamSpdBuff * 100}%.`,
      })
      myLiveTeam.forEach((ally) => {
        ally.spd += Math.round(ally.spd * hero.skills.passive.teamSpdBuff)
      })
    }
  })

  enemyLiveTeam.forEach((hero) => {
    if (enemyBonuses[hero.faction]) {
      const bonusValue = enemyBonuses[hero.faction] * 100 - 100
      hero.atk = Math.round(hero.atk * enemyBonuses[hero.faction])
      hero.hp = Math.round(hero.hp * enemyBonuses[hero.faction])
      log({
        type: 'team-bonus',
        isAlly: false,
        content: `Tướng ${hero.name} nhận bonus phe ${hero.faction} (+${bonusValue.toFixed(0)}% ATK và HP)!`,
      })
    }
    if (hero.skills.passive?.teamSpdBuff) {
      log({
        type: 'info',
        content: `Team Địch: ${hero.name} áp dụng kỹ năng nội tại "${hero.skills.passive.name}" cho toàn đội, tăng tốc độ ${hero.skills.passive.teamSpdBuff * 100}%.`,
      })
      enemyLiveTeam.forEach((ally) => {
        ally.spd += Math.round(ally.spd * hero.skills.passive.teamSpdBuff)
      })
    }
  })

  log({ type: 'battle-start', content: `=== Trận đấu bắt đầu ===` })

  let round = 1
  while (myLiveTeam.some((u) => u.hp > 0) && enemyLiveTeam.some((u) => u.hp > 0) && round <= 20) {
    log({ type: 'round-start', content: `-- Vòng ${round} --` })
    const order = [
      ...myLiveTeam.map((u) => ({ side: 'Bạn', u, isAlly: true })),
      ...enemyLiveTeam.map((u) => ({ side: 'Địch', u, isAlly: false })),
    ]
      .filter((x) => x.u.hp > 0)
      .sort((a, b) => b.u.spd - a.u.spd)

    for (const step of order) {
      if (!(myLiveTeam.some((u) => u.hp > 0) && enemyLiveTeam.some((u) => u.hp > 0))) break
      const attacker = step.u
      if (attacker.hp <= 0) continue

      const foes = step.isAlly ? enemyLiveTeam : myLiveTeam
      const target = pickTarget(foes, attacker.class)
      if (!target) continue

      let skillName = ''
      let skillType = 'đánh thường'
      let damage = 0
      let furyChange = 0

      if (attacker.currentFury >= attacker.skills.ultimate.furyCost) {
        skillName = attacker.skills.ultimate.name
        skillType = 'nộ'
        damage = attacker.atk * attacker.skills.ultimate.damageRatio
        furyChange = -attacker.skills.ultimate.furyCost
      } else {
        skillName = attacker.skills.basic.name
        skillType = 'đánh thường'
        damage = attacker.atk * attacker.skills.basic.damageRatio
        furyChange = attacker.skills.basic.furyGain
      }
      attacker.currentFury = Math.max(0, attacker.currentFury + furyChange)

      const isCrit = Math.random() < 0.15
      if (isCrit) {
        damage *= 1.5
      }

      const counterMultiplier = getFactionCounter(attacker.faction, target.faction)
      const isCounter = counterMultiplier > 1
      if (isCounter) {
        damage *= counterMultiplier
      }

      const finalDamage = Math.round(damage)
      target.hp = Math.max(0, target.hp - finalDamage)

      // Xử lý kỹ năng nội tại (Lifesteal)
      if (attacker.skills.passive?.lifesteal && finalDamage > 0) {
        const lifestealAmount = Math.round(finalDamage * attacker.skills.passive.lifesteal)
        attacker.hp += lifestealAmount
        log({
          type: 'special-effect',
          isAlly: step.isAlly,
          actor: attacker.name,
          effectName: 'Hút máu',
          value: lifestealAmount,
          target: attacker.name,
        })
      }

      // Xử lý kỹ năng Phản đòn (Counter-attack)
      if (target.skills.activePassive?.trigger === 'onDamaged' && finalDamage > 0) {
        const counterDamage = Math.round(attacker.atk * target.skills.activePassive.counterDamage)
        attacker.hp = Math.max(0, attacker.hp - counterDamage)
        log({
          type: 'special-effect',
          isAlly: !step.isAlly,
          actor: target.name,
          effectName: 'Phản đòn',
          value: counterDamage,
          target: attacker.name,
        })
      }

      log({
        type: 'action',
        isAlly: step.isAlly,
        actor: attacker.name,
        skillType: skillType,
        skillName: skillName,
        target: target.name,
        damage: finalDamage,
        remainingHp: target.hp,
        isCrit: isCrit,
        isCounter: isCounter,
      })

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
  log({
    type: 'battle-end',
    content: `=== Kết quả: ${result} ===`,
  })

  isBattleRunning.value = false
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
    return 1.2
  }
  return 1
}

function cloneUnit(u) {
  const cloned = JSON.parse(JSON.stringify(u))
  cloned.currentFury = 50 // Thêm dòng này để tướng bạn bắt đầu với 50 nộ
  return cloned
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

function clearBattleLog() {
  battleLog.value.length = 0
}

function handleDropAnywhere(event) {
  const draggedSource = event.dataTransfer.getData('source')
  if (draggedSource === 'team') {
    const draggedHero = JSON.parse(event.dataTransfer.getData('hero'))
    const draggedIndex = parseInt(event.dataTransfer.getData('index'))

    // Thêm tướng vào inventory
    inventory.push(draggedHero)

    // Xóa tướng khỏi đội hình
    myTeam[draggedIndex] = null
  }
}

// === CÁC HÀM MỚI ĐÃ CẬP NHẬT ===

// Hàm xóa toàn bộ tướng khỏi đội hình và trả về kho
function clearTeam() {
  myTeam.forEach((hero) => {
    if (hero) {
      inventory.push(hero)
    }
  })
  myTeam.splice(0, myTeam.length, ...Array(9).fill(null))
}

// Hàm thiết lập đội hình theo các mẫu
function setFormation(type) {
  clearTeam() // Xóa đội hình cũ trước

  let slotsToFill = []
  const heroesToPlace = []

  switch (type) {
    case 'cross':
      slotsToFill = [1, 3, 4, 5, 7]
      break
    case 'cross-x':
      slotsToFill = [0, 2, 4, 6, 8]
      break
    case 'double-t-left':
      slotsToFill = [0, 3, 4, 5, 6]
      break
    case 'double-t-right':
      slotsToFill = [2, 3, 4, 5, 8]
      break
    default:
      return
  }

  if (inventory.length < slotsToFill.length) {
    log({ type: 'info', content: 'Kho của bạn không đủ tướng để xếp đội hình này!' })
    return
  }

  // Lấy các tướng đầu tiên trong kho để xếp đội hình
  for (let i = 0; i < slotsToFill.length; i++) {
    heroesToPlace.push(inventory.shift())
  }

  // Cập nhật đội hình
  slotsToFill.forEach((slot, index) => {
    myTeam[slot] = heroesToPlace[index]
  })
}

function sellHeroes() {
  const heroesToKeep = []
  let totalGemsGained = 0
  inventory.forEach((hero) => {
    if (hero.rarity === 'B') {
      totalGemsGained += 500
    } else if (hero.rarity === 'C') {
      totalGemsGained += 100
    } else {
      heroesToKeep.push(hero)
    }
  })
  gems.value += totalGemsGained
  // Thay thế toàn bộ nội dung của inventory bằng mảng mới
  inventory.splice(0, inventory.length, ...heroesToKeep)
}

const calculateSellGems = () => {
  let totalGems = 0
  inventory.forEach((hero) => {
    if (hero.rarity === 'B') {
      totalGems += 500
    } else if (hero.rarity === 'C') {
      totalGems += 100
    }
  })
  return totalGems
}
</script>

<style>
/* Giữ nguyên CSS cũ */
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
.enemy-board .slot {
  width: 100px;
  height: 120px;
  margin: 0 auto;
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
.inventory-filters {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 15px;
  padding: 10px;
  border-radius: 8px;
  background-color: #eef1f4;
}
.filter-group {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}
.filter-group label,
.search-group label {
  font-weight: bold;
  color: #555;
  white-space: nowrap;
}
.inventory-filters button {
  padding: 6px 12px;
  border: 1px solid #ccc;
  border-radius: 6px;
  background-color: #fff;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 14px;
}
.inventory-filters button:hover {
  background-color: #f0f0f0;
  border-color: #888;
}
.inventory-filters button.active {
  background-color: #4c87e4;
  color: #fff;
  border-color: #4c87e4;
  font-weight: bold;
}
.search-group {
  display: flex;
  align-items: center;
  gap: 8px;
}
.search-group input {
  flex-grow: 1;
  padding: 6px 10px;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 14px;
  min-width: 150px;
}

/* Add a media query to handle mobile devices */
@media (max-width: 768px) {
  /* Main layout changes */
  .app-container {
    padding: 10px;
  }
  .main-content {
    grid-template-columns: 1fr; /* Stack columns vertically */
  }
  .builder-section {
    flex-direction: column; /* Stack builder and enemy teams vertically */
  }

  /* Filter and search bar improvements */
  .inventory-filters {
    flex-direction: column; /* Stack filter groups vertically */
  }
  .filter-group {
    /* You could also make this horizontally scrollable on mobile */
    overflow-x: auto;
    white-space: nowrap;
    -webkit-overflow-scrolling: touch;
  }
  .filter-group label {
    flex-shrink: 0; /* Prevents the label from shrinking */
  }

  /* Make inventory grid flexible */
  .inventory-grid {
    grid-template-columns: repeat(auto-fill, minmax(80px, 1fr)); /* Smaller cards on mobile */
  }

  /* Center the title and wallet on mobile for better balance */
  .topbar {
    flex-direction: column;
    text-align: center;
    gap: 10px;
  }
  .title {
    font-size: 24px;
  }
}

/* General improvements */
body {
  background-color: #f7f9fc;
}

.app-container {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.section-title {
  position: relative;
  padding-bottom: 5px;
  margin-bottom: 20px;
}

/* Add a line under section titles for a cleaner look */
.section-title::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0;
  width: 50px;
  height: 3px;
  background-color: #4c87e4;
  border-radius: 2px;
}

.inventory-filters button {
  transition:
    transform 0.2s,
    box-shadow 0.2s;
}

.inventory-filters button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.inventory-filters button.active {
  background-color: #4c87e4;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.primary {
  background-color: #4caf50;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: bold;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s;
}

.primary:hover:not(:disabled) {
  background-color: #45a049;
}

.primary:disabled {
  background-color: #ccc;
  cursor: not-allowed;
  box-shadow: none;
}
.team-actions {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
  flex-wrap: wrap;
}
.team-actions button {
  padding: 8px 16px;
  background-color: #4c87e4;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.2s;
}
.team-actions button:hover {
  background-color: #3b6ab7;
}

.inventory-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.total-heroes {
  font-size: 1rem;
  font-weight: bold;
  color: #555;
}

.sell-btn {
  background-color: #e74c3c;
  color: #fff;
  border: none;
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
}

.sell-btn:hover {
  background-color: #c0392b;
}
</style>
