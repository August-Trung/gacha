<template>
  <div class="log" ref="logEl">
    <div v-for="(l, i) in log" :key="i" class="log-entry">{{ l }}</div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'

const props = defineProps({
  log: Array,
})

const logEl = ref(null)

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
