<template>
  <div class="log-container">
    <div class="log-header">
      <h3>Nhật ký trận đấu</h3>
      <button @click="clearLog" class="clear-log-btn">Xóa log</button>
    </div>
    <div class="log" ref="logEl">
      <div v-for="(l, i) in log" :key="i" class="log-entry" :class="l.type">
        <div
          v-if="l.type === 'round-start' || l.type === 'battle-start' || l.type === 'battle-end'"
          class="log-message"
          :class="l.type"
        >
          {{ l.content }}
        </div>
        <div v-else-if="l.type === 'team-bonus'" class="log-message team-bonus">
          {{ l.isAlly ? 'Team Bạn: ' : 'Team Địch: ' }}{{ l.content }}
        </div>
        <div v-else-if="l.type === 'action'" class="log-message action-entry">
          <span class="actor" :class="{ ally: l.isAlly, enemy: !l.isAlly }">{{ l.actor }}</span>
          <span class="skill-info">
            sử dụng Kỹ năng {{ l.skillType }}: **"{{ l.skillName }}"**
          </span>
          <span v-if="l.target" class="target">
            tấn công → {{ l.target }} (-{{ l.damage }} HP)
          </span>
          <span v-if="l.remainingHp !== null" class="hp-info">
            [{{ l.remainingHp }} HP còn lại]</span
          >
          <span v-if="l.isCrit" class="crit-info">(CRIT)</span>
          <span v-if="l.isCounter" class="counter-info">(Khắc chế!)</span>
        </div>
        <div v-else class="log-message">{{ l.content }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'

const props = defineProps({
  log: Array,
})

const emit = defineEmits(['clear-log'])

const logEl = ref(null)

function clearLog() {
  emit('clear-log')
}

watch(
  () => props.log,
  () => {
    nextTick(() => {
      if (logEl.value) {
        logEl.value.scrollTop = logEl.value.scrollHeight
      }
    })
  },
  { deep: true },
)
</script>

<style scoped>
/* Giữ lại các style đã có */
.log-container {
  display: flex;
  flex-direction: column;
}

.log-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.clear-log-btn {
  padding: 5px 10px;
  background-color: #e74c3c;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.log {
  background-color: #2c3e50;
  color: #ecf0f1;
  padding: 15px;
  border-radius: 8px;
  font-family: 'Courier New', Courier, monospace;
  max-height: 400px;
  overflow-y: auto;
  line-height: 1.6;
}

.log-message {
  margin-bottom: 8px;
}

.round-start {
  color: #f1c40f;
  font-weight: bold;
  text-transform: uppercase;
}

.battle-start,
.battle-end {
  color: #2ecc71;
  font-weight: bold;
  text-align: center;
  margin: 10px 0;
}

.team-bonus {
  color: #3498db;
  font-style: italic;
  font-size: 0.9em;
  margin-bottom: 5px;
}

.action-entry {
  color: #ecf0f1;
  display: block;
}

.actor {
  font-weight: bold;
}

.actor.ally {
  color: #3498db;
}

.actor.enemy {
  color: #e74c3c;
}

.skill-info {
  color: #bdc3c7;
}

.hp-info {
  color: #95a5a6;
}

.crit-info {
  color: #e67e22;
  font-weight: bold;
  font-style: italic;
}

.counter-info {
  color: #f39c12;
  font-weight: bold;
  font-style: italic;
}

.log-entry:hover {
  background-color: rgba(255, 255, 255, 0.05);
}
</style>
