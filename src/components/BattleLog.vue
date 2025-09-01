<template>
  <div class="log-container">
    <div class="log-header">
      <h3>Nhật ký trận đấu</h3>
      <button @click="clearLog" class="clear-log-btn">Xóa log</button>
    </div>
    <div class="log" ref="logEl">
      <div v-for="(l, i) in log" :key="i" class="log-entry">{{ l }}</div>
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
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
}

.clear-log-btn:hover {
  background-color: #d32f2f;
}

.log {
  height: 250px;
  overflow-y: auto;
  background: #2c3e50;
  color: #ecf0f1;
  padding: 15px;
  border-radius: 8px;
  font-family: monospace;
  font-size: 14px;
  line-height: 1.5;
}
.log::-webkit-scrollbar {
  width: 8px;
}
.log::-webkit-scrollbar-thumb {
  background-color: #666;
  border-radius: 4px;
}
</style>
