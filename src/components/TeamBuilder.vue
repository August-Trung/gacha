<template>
  <div class="team-board">
    <div
      v-for="(hero, index) in team"
      :key="index"
      class="slot"
      :class="{ filled: hero !== null }"
      @drop="handleDrop($event, index)"
      @dragover.prevent
      @click="handleSlotClick(index, hero)"
    >
      <template v-if="hero">
        <HeroCard
          :hero="hero"
          class="clickable"
          draggable="true"
          @dragstart="$emit('dragstart', $event, hero, 'team', index)"
          @show-details="$emit('show-details', hero)"
        />
        <button class="remove-btn" @click.stop="removeHero(index)">×</button>
      </template>
      <span v-else class="placeholder">Trống</span>
    </div>
  </div>

  <HeroSelectionModal
    v-if="showModal"
    :inventory="filteredInventory"
    @select-hero="selectHeroFromModal"
    @close="showModal = false"
  />
</template>

<script setup>
import { computed, defineProps, defineEmits, ref } from 'vue'
import HeroCard from './HeroCard.vue'
import HeroSelectionModal from './HeroSelectionModal.vue'

const props = defineProps({
  team: {
    type: Array,
    required: true,
  },
  inventory: {
    type: Array,
    required: true,
  },
})

const emits = defineEmits([
  'update:team',
  'dragstart',
  'show-details',
  'hero-dropped',
  'hero-selected-from-modal',
])

const showModal = ref(false)
const selectedSlotIndex = ref(null)

const filteredInventory = computed(() => {
  const teamHeroIds = new Set(props.team.filter((h) => h).map((h) => h.id))
  return props.inventory.filter((h) => !teamHeroIds.has(h.id))
})

const myTeamCount = computed(() => props.team.filter((h) => h).length)

function handleSlotClick(index, hero) {
  // Chỉ mở modal nếu slot trống và đội hình chưa đủ 5 tướng
  if (hero === null && myTeamCount.value < 5) {
    selectedSlotIndex.value = index
    showModal.value = true
  }
}

function selectHeroFromModal(hero) {
  const newTeam = [...props.team]
  newTeam[selectedSlotIndex.value] = hero
  emits('update:team', newTeam)
  emits('hero-selected-from-modal', hero.id) // Phát ra sự kiện mới với ID của hero
  showModal.value = false
  selectedSlotIndex.value = null
}

function removeHero(index) {
  const newTeam = [...props.team]
  const heroToRemove = newTeam[index]

  if (heroToRemove) {
    // Add the hero back to the inventory
    props.inventory.push(heroToRemove)
    newTeam[index] = null
    emits('update:team', newTeam)
  }
}

function handleDrop(event, index) {
  const draggedHero = JSON.parse(event.dataTransfer.getData('hero'))
  const draggedSource = event.dataTransfer.getData('source')
  const draggedIndex = parseInt(event.dataTransfer.getData('index'))

  const newTeam = [...props.team]

  if (draggedSource === 'inventory') {
    // Chỉ cho phép thả nếu đội hình chưa đủ 5 tướng
    if (myTeamCount.value < 5 && props.team[index] === null) {
      const draggedHero = JSON.parse(event.dataTransfer.getData('hero'))
      const newTeam = [...props.team]
      newTeam[index] = draggedHero
      emits('update:team', newTeam)
      emits('hero-dropped', draggedHero.id)
    }
  } else if (draggedSource === 'team') {
    if (draggedIndex !== index) {
      const existingHero = newTeam[index]
      newTeam[index] = draggedHero
      newTeam[draggedIndex] = existingHero
      emits('update:team', newTeam)
    }
  }
}
</script>

<style scoped>
.team-board {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-top: 8px;
}
.slot {
  position: relative;
  width: 100px;
  height: 120px;
  margin: 0 auto;
  border: 2px dashed #d1d5db;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  cursor: pointer; /* Add cursor pointer to indicate it's clickable */
}
.slot.filled {
  border: 2px solid transparent;
}
.placeholder {
  color: #9ca3af;
  font-size: 14px;
}
.remove-btn {
  position: absolute;
  top: 5px;
  right: 5px;
  background-color: #ff4d4d;
  color: white;
  border: none;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  cursor: pointer;
  z-index: 10;
}
.remove-btn:hover {
  background-color: #ff1a1a;
}
</style>
