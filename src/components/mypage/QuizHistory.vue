<script setup>
import { ref, onMounted } from 'vue'

const quizHistory = ref([])

const fetchQuizHistory = async () => {
  try {
    const response = await fetch('/api/user/quiz-history')
    quizHistory.value = await response.json()
  } catch (error) {
    console.error('퀴즈 내역 로딩 실패:', error)
  }
}

onMounted(() => {
  fetchQuizHistory()
})
</script>

<template>
  <div class="quiz-history">
    <div class="quiz-list">
      <div v-for="quiz in quizHistory" :key="quiz.id" class="quiz-item">
        <div class="quiz-date">{{ quiz.date }}</div>
        <div class="quiz-score">점수: {{ quiz.score }}</div>
        <div class="quiz-exp">획득 EXP: {{ quiz.exp }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.quiz-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.quiz-item {
  padding: 1rem;
  border: 1px solid #eee;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.quiz-score {
  font-weight: bold;
  color: #66b56b;
}
</style>