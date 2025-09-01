<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <button class="close-btn" @click="$emit('close')">X</button>
      <div class="hero-details">
        <h2 class="hero-name">{{ hero.name }}</h2>
        <div class="hero-meta">
          <span :class="['rarity', `rarity-${hero.rarity.toLowerCase()}`]">{{ hero.rarity }}</span>
          <span :class="['faction', `faction-${hero.faction.toLowerCase().replace(/\s/g, '')}`]">{{
            hero.faction
          }}</span>
        </div>
        <div class="hero-stats-container">
          <div class="stat-card">
            <div class="stat-icon">⚔️</div>
            <div class="stat-info">
              <span class="stat-label">Tấn công</span>
              <span class="stat-value">{{ hero.atk }}</span>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">❤️</div>
            <div class="stat-info">
              <span class="stat-label">HP</span>
              <span class="stat-value">{{ hero.hp }}</span>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">🏃</div>
            <div class="stat-info">
              <span class="stat-label">Tốc độ</span>
              <span class="stat-value">{{ hero.spd }}</span>
            </div>
          </div>
        </div>

        <div class="hero-skills">
          <h3>Kỹ năng</h3>
          <div v-for="(skill, key) in hero.skills" :key="key" class="skill-card">
            <div class="skill-name">{{ skill.name }}</div>
            <div class="skill-type">{{ getSkillTypeName(skill.type) }}</div>
            <p class="skill-description">{{ skill.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps({
  hero: Object,
})
const emit = defineEmits(['close'])

function getSkillTypeName(type) {
  switch (type) {
    case 'basic':
      return 'Kỹ năng đánh thường'
    case 'ultimate':
      return 'Kỹ năng nộ'
    case 'passive':
      return 'Kỹ năng nội tại'
    case 'active-passive':
      return 'Kỹ năng bị động'
    default:
      return 'Kỹ năng'
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease-out;
}
.modal-content {
  background: #fff;
  border-radius: 15px;
  padding: 30px;
  width: 90%;
  max-width: 450px;
  position: relative;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  transform: scale(0.9);
  animation: scaleIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.close-btn {
  position: absolute;
  top: 15px;
  right: 15px;
  background: none;
  border: none;
  font-size: 1.5rem;
  font-weight: bold;
  cursor: pointer;
  color: #555;
  transition: color 0.2s;
}
.close-btn:hover {
  color: #333;
}
.hero-details {
  text-align: center;
}
.hero-name {
  font-size: 2.5rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
}
.hero-meta {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-bottom: 20px;
}
.rarity,
.faction {
  padding: 5px 15px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: bold;
  color: #fff;
}
.rarity-sss {
  background-color: #ffeb3b;
  color: #333;
}
.rarity-ss {
  background-color: #ff9800;
}
.rarity-s {
  background-color: #f97316;
}
.rarity-a {
  background-color: #10b981;
}
.rarity-b {
  background-color: #3b82f6;
}
.rarity-c {
  background-color: #718096;
}
.faction-ngụy {
  background-color: #3b82f6;
}
.faction-thục {
  background-color: #10b981;
}
.faction-ngô {
  background-color: #dc2626;
}
.faction-ánhsáng {
  background-color: #ffeb3b;
  color: #333;
}
.faction-bóngtối {
  background-color: #8b5cf6;
}
.hero-stats-container {
  display: flex;
  justify-content: space-around;
  background: #f0f4f8;
  padding: 15px;
  border-radius: 10px;
  margin-bottom: 20px;
}
.stat-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  font-size: 1rem;
}
.stat-icon {
  font-size: 1.5rem;
}
.stat-info {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.stat-label {
  font-size: 0.8rem;
  color: #666;
}
.stat-value {
  font-weight: bold;
  font-size: 1.2rem;
}
.hero-skills {
  margin-top: 20px;
  text-align: left;
}
.hero-skills h3 {
  font-size: 1.25rem;
  margin-bottom: 15px;
  color: #333;
}
.skill-card {
  background: #f0f4f8;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 10px;
}
.skill-name {
  font-weight: bold;
  font-size: 1rem;
}
.skill-type {
  font-size: 0.8rem;
  color: #666;
  font-style: italic;
  margin-bottom: 8px;
}
.skill-description {
  margin-top: 0;
  line-height: 1.4;
  color: #444;
}
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
@keyframes scaleIn {
  from {
    transform: scale(0.8);
  }
  to {
    transform: scale(1);
  }
}
</style>
