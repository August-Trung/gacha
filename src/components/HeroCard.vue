<template>
  <div class="hero-card" :class="[factionClass, rarityClass]" @click="$emit('show-details', hero)">
    <div class="card-bg"></div>
    <div class="card-rarity">{{ hero.rarity }}</div>
    <div class="card-faction">{{ hero.faction }}</div>
    <div class="card-icon" :class="classIcon"></div>
    <div class="card-content">
      <div class="card-stars">
        <span v-for="s in hero.stars" :key="s">⭐</span>
      </div>
      <div class="card-name">{{ hero.name }}</div>
      <div class="card-stats">
        <span>HP: {{ hero.hp }}</span>
        <span>ATK: {{ hero.atk }}</span>
        <span>SPD: {{ hero.spd }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps({
  hero: Object,
})
const emit = defineEmits(['show-details'])
const factionClass = computed(
  () => `faction-${props.hero.faction.toLowerCase().replace(/\s/g, '')}`,
)
const rarityClass = computed(() => `rarity-${props.hero.rarity.toLowerCase()}`)
const classIcon = computed(() => `icon-${props.hero.class.toLowerCase().replace(/\s/g, '')}`)
</script>

<style scoped>
.hero-card {
  position: relative;
  width: 100px;
  height: 120px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  overflow: hidden;
  color: #2c3e50;
  font-family: sans-serif;
  transition: all 0.2s;
  cursor: pointer;
}
.faction-ngụy {
  border: 2px solid #3b82f6;
}
.faction-thục {
  border: 2px solid #10b981;
}
.faction-ngô {
  border: 2px solid #dc2626;
}
.faction-ánhsáng {
  border: 2px solid #ffeb3b;
}
.faction-bóngtối {
  border: 2px solid #8b5cf6;
}
.card-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0.8;
  z-index: 0;
}
.faction-ngụy .card-bg {
  background-image: linear-gradient(135deg, #dbeafe, #3b82f650);
}
.faction-thục .card-bg {
  background-image: linear-gradient(135deg, #d1fae5, #10b98150);
}
.faction-ngô .card-bg {
  background-image: linear-gradient(135deg, #fee2e2, #dc262650);
}
.faction-ánhsáng .card-bg {
  background-image: linear-gradient(135deg, #fffde7, #ffeb3b50);
}
.faction-bóngtối .card-bg {
  background-image: linear-gradient(135deg, #ede9fe, #8b5cf650);
}
.hero-card::after {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  border-radius: 12px;
  z-index: 1;
  pointer-events: none;
}
.rarity-ss::after {
  box-shadow:
    0 0 5px #ff9800,
    0 0 10px #ff5722;
  animation: ss-pulse 1.5s infinite;
}
@keyframes ss-pulse {
  0% {
    box-shadow:
      0 0 5px #ff9800,
      0 0 10px #ff5722;
  }
  50% {
    box-shadow:
      0 0 15px #ff9800,
      0 0 25px #ff5722;
  }
  100% {
    box-shadow:
      0 0 5px #ff9800,
      0 0 10px #ff5722;
  }
}
.rarity-s::after {
  box-shadow:
    0 0 2px #f97316,
    inset 0 0 2px #f97316;
  animation: s-sparkle 2s infinite ease-in-out;
}
@keyframes s-sparkle {
  0%,
  100% {
    box-shadow:
      0 0 2px #f97316,
      inset 0 0 2px #f97316;
  }
  50% {
    box-shadow:
      0 0 5px #f97316,
      inset 0 0 5px #f97316;
  }
}
.rarity-sss {
  position: relative;
  animation: sss-lightning 1.5s infinite alternate;
}
.rarity-sss::before {
  content: '';
  position: absolute;
  top: -5px;
  left: -5px;
  right: -5px;
  bottom: -5px;
  border-radius: 12px;
  z-index: 0;
  animation: sss-lightning-effect 1.5s infinite alternate;
  pointer-events: none;
}
@keyframes sss-lightning {
  from {
    box-shadow:
      0 0 5px #ffeb3b,
      0 0 10px #ffeb3b;
  }
  to {
    box-shadow:
      0 0 10px #ffeb3b,
      0 0 20px #ffeb3b,
      0 0 30px #fff700;
  }
}
@keyframes sss-lightning-effect {
  0% {
    box-shadow:
      0 0 0px #ffeb3b00,
      0 0 0px #ffeb3b00,
      0 0 0px #ffeb3b00,
      0 0 0px #ffeb3b00;
  }
  25% {
    box-shadow:
      5px 0 10px #ffeb3b,
      -5px 0 10px #ffeb3b,
      0 0 0px #ffeb3b00,
      0 0 0px #ffeb3b00;
  }
  50% {
    box-shadow:
      0 5px 10px #ffeb3b,
      0 -5px 10px #ffeb3b,
      5px 0 15px #fff700,
      -5px 0 15px #fff700;
  }
  75% {
    box-shadow:
      0 0 0px #ffeb3b00,
      0 0 0px #ffeb3b00,
      0 -5px 10px #ffeb3b,
      0 5px 10px #ffeb3b;
  }
  100% {
    box-shadow:
      0 0 5px #ffeb3b,
      0 0 10px #fff700,
      0 0 15px #fffbe0;
  }
}
.card-rarity {
  position: absolute;
  top: 5px;
  right: 5px;
  background-color: rgba(0, 0, 0, 0.2);
  padding: 2px 6px;
  border-radius: 5px;
  font-size: 10px;
  font-weight: bold;
  color: #fff;
  z-index: 2;
}
.card-faction {
  position: absolute;
  top: 5px;
  left: 5px;
  background-color: rgba(0, 0, 0, 0.2);
  padding: 2px 6px;
  border-radius: 5px;
  font-size: 10px;
  font-weight: bold;
  color: #fff;
  z-index: 2;
  text-transform: uppercase;
}
.card-icon {
  position: absolute;
  top: 8px;
  left: 8px;
  width: 20px;
  height: 20px;
  background-size: contain;
  background-repeat: no-repeat;
  z-index: 2;
}
.icon-đấusĩ {
  background-image: url('http://googleusercontent.com/file_content/1');
}
.icon-phápsư {
  background-image: url('http://googleusercontent.com/file_content/2');
}
.icon-đỡđòn {
  background-image: url('http://googleusercontent.com/file_content/3');
}
.icon-hỗtrợ {
  background-image: url('http://googleusercontent.com/file_content/4');
}
.icon-thíchkhách {
  background-image: url('http://googleusercontent.com/file_content/5');
}
.card-content {
  position: relative;
  z-index: 1;
  padding-bottom: 8px;
  width: 100%;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  height: 100%;
  box-sizing: border-box;
}
.card-stars {
  font-size: 10px;
  margin-bottom: 2px;
}
.card-name {
  font-size: 14px;
  font-weight: bold;
}
.card-stats {
  font-size: 10px;
  opacity: 0.8;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 4px;
  line-height: 1.2;
}
</style>
