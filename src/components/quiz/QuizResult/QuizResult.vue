<template>
  <section class="quiz-result-section">
    <QuizResultTop></QuizResultTop>
    <div class="quiz-result-buttons">
      <QuizOption text="다시 풀어보기" />
      <QuizOption text="새로운 퀴즈 풀기" />
    </div>
    <!--    <QuizLogo />-->
  </section>
</template>

<script setup>

import QuizOption from '@/components/quiz/QuizOption.vue'
import QuizResultTop from '@/components/quiz/QuizResult/QuizResultTop.vue'

defineProps({
  totalQuestions: {
    type: Number,
    required: true
  },
  correctAnswers: {
    type: Number,
    required: true
  }
})

defineEmits(['restart', 'new-quiz'])

</script>

<style scoped>

.quiz-result-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #B4E4B7;
  min-height: 100%;
  min-height: 100vh;
  max-width: 100%;
}
</style>

