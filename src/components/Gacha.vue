<template>
  <div class="gacha-container">
    <div class="gacha-pool">
      <h3>Summon Pool</h3>

      <div class="rates">
        <span
          v-for="(weight, rarity) in rarityWeight"
          :key="rarity"
          class="tag"
          :class="rarity.toLowerCase()"
        >
          {{ rarity }} {{ weight }}%
        </span>
      </div>

      <div class="actions">
        <button @click="roll(1)" :disabled="gems < costSingle">Roll x1 ({{ costSingle }})</button>

        <button @click="roll(10)" :disabled="gems < costTen">Roll x10 ({{ costTen }})</button>
      </div>
    </div>

    <div class="last-roll">
      <HeroCard v-for="(h, i) in lastRoll" :key="i" :hero="h" :show-level="false" />
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { heroPool, rarityWeight } from '../data/heroes'
import HeroCard from './HeroCard.vue'

const props = defineProps({
  gems: Number,
})

const emit = defineEmits(['update:gems', 'hero-pulled'])

const costSingle = 100
const costTen = 900
const lastRoll = ref([])
let uid = 1

function pickFromPool() {
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
  return {
    ...base,
    id: uid++,
    atk: Math.round(base.atk * (0.9 + Math.random() * 0.2)),
    hp: Math.round(base.hp * (0.9 + Math.random() * 0.2)),
    lv: 1,
    stars,
  }
}

function roll(n) {
  if (n === 1 && props.gems < costSingle) return
  if (n === 10 && props.gems < costTen) return
  const newGems = props.gems - (n === 1 ? costSingle : costTen)
  emit('update:gems', newGems)
  lastRoll.value = []
  for (let i = 0; i < n; i++) {
    const inst = pickFromPool()
    lastRoll.value.push(inst)
    emit('hero-pulled', inst)
  }
}
</script>

<style scoped>
.gacha-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.gacha-pool {
  padding: 16px;
  background-color: #f0f4f8;
  border-radius: 12px;
}
.rates {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 8px 0 16px;
}
.tag {
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: bold;
  color: #fff;
  text-transform: uppercase;
}
.tag.sss {
  background: #ffeb3b;
  color: #333;
}
.tag.ss {
  background: #ff9800;
}
.tag.s {
  background: #f97316;
}
.tag.a {
  background: #a855f7;
}
.tag.b {
  background: #3b82f6;
}
.tag.c {
  background: #10b981;
}

.actions button {
  padding: 10px 15px;
  border-radius: 8px;
  border: none;
  background: #3498db;
  color: #fff;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.2s;
}
.actions button:hover {
  background: #2980b9;
}
.last-roll {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 10px;
}
</style>
