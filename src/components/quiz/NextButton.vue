<template>
  <div class="next-button-container">
    <button class="next-button" @click="$emit('next')">
      다음 >
    </button>
  </div>
</template>

<script setup>
import { defineEmits } from 'vue'
defineEmits(['next'])
</script>

<style scoped>
.next-button-container {
  display: flex;
  justify-content: center;
  margin: 20px;
}

.next-button {
  padding: 10px 20px;
  border-radius: 20px;
  border: 1px solid #020202;
  background-color: white;
  font-size: 16px;
  cursor: pointer;
  box-shadow: 0 5px 5px -5px;
  font-weight: 600;
}

.next-button:hover {
  background-color: #f5f5f5;
}
</style>
