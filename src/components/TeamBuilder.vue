<template>
  <div class="team-builder">
    <div class="board">
      <div
        v-for="i in 9"
        :key="i"
        class="slot"
        @drop="handleDrop($event, i - 1)"
        @dragover.prevent
        :class="{ selectable: team[i - 1] === null && team.filter(Boolean).length < 5 }"
      >
        <template v-if="team[i - 1]">
          <HeroCard
            :hero="team[i - 1]"
            @dragstart="handleDragStart($event, team[i - 1], 'team', i - 1)"
            draggable="true"
            class="draggable"
          />
        </template>
        <span v-else class="placeholder">Slot {{ i }}</span>
      </div>
    </div>
    <div class="controls">
      <button @click="clearTeam">Xóa toàn bộ</button>
      <button v-for="(f, i) in formations" :key="i" @click="loadFormation(f)">
        Bố trận {{ i + 1 }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import HeroCard from './HeroCard.vue'

const props = defineProps({
  inventory: Array,
  team: Array,
})
const emit = defineEmits(['update:team', 'dragstart'])

const formations = [
  [0, 1, 3, 4, 5],
  [1, 2, 4, 6, 7],
  [0, 2, 4, 6, 8],
  [3, 4, 5, 7, 8],
  [0, 1, 2, 3, 4],
]

function handleDragStart(event, hero, source, index) {
  emit('dragstart', event, hero, source, index)
}

function handleDrop(event, targetIndex) {
  const draggedHero = JSON.parse(event.dataTransfer.getData('hero'))
  const draggedSource = event.dataTransfer.getData('source')
  const draggedIndex = parseInt(event.dataTransfer.getData('index'))

  if (!draggedHero) return

  const newTeam = [...props.team]
  if (draggedSource === 'inventory') {
    if (newTeam[targetIndex] === null && newTeam.filter(Boolean).length < 5) {
      const idx = props.inventory.findIndex((h) => h.id === draggedHero.id)
      if (idx !== -1) {
        newTeam[targetIndex] = props.inventory.splice(idx, 1)[0]
        emit('update:team', newTeam)
      }
    }
  } else if (draggedSource === 'team') {
    const temp = newTeam[targetIndex]
    newTeam[targetIndex] = draggedHero
    newTeam[draggedIndex] = temp
    emit('update:team', newTeam)
  }
}

function clearTeam() {
  props.team.filter(Boolean).forEach((hero) => props.inventory.push(hero))
  emit('update:team', Array(9).fill(null))
}

function loadFormation(formation) {
  clearTeam()
  const newTeam = Array(9).fill(null)
  formation.forEach((idx) => {
    if (props.inventory.length > 0) {
      newTeam[idx] = props.inventory.shift()
    }
  })
  emit('update:team', newTeam)
}
</script>

<style scoped>
/* Sửa lỗi bố cục cho các slot trong đội của bạn */
.team-builder {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.board {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}
.slot {
  position: relative;
  width: 100px; /* Giới hạn kích thước slot */
  height: 120px; /* Giới hạn kích thước slot */
  margin: 0 auto; /* Căn giữa thẻ */
  border: 2px dashed #d1d5db;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}
.slot.selectable:hover {
  background-color: #e3f2fd;
  border-color: #4c87e4;
}
.slot.active {
  border-style: solid;
}
.slot .hero-card {
  width: 100%;
  height: 100%;
}
.placeholder {
  color: #9ca3af;
  font-size: 14px;
}
.controls {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
}
</style>
