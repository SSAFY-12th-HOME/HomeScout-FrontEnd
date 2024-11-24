<template>
  <div class="quiz-index">
    <div class="index-circle">{{ index }}</div>
  </div>
</template>

<script setup>
defineProps({
  index: {
    type: Number,
    default: 1
  }
})
</script>

<style scoped>
.quiz-index {
  display: flex;
  justify-content: center;
  margin: 20px 0;
}

.index-circle {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: white;
  border: 1px solid #3f3f3f;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  box-shadow: 0 5px 5px -5px
}
</style>
