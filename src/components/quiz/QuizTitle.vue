<template>
  <h1 class="quiz-title">{{ title }}</h1>
</template>

<script setup>
import { defineProps } from 'vue'

defineProps({
  title: {
    type: String,
  }
})

</script>

<style scoped>
.quiz-title {
  font-size: 24px;
  font-weight: bold;
  margin: 20px 0;
  text-align: center;
}
</style>
