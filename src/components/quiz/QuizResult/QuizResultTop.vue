<template>
  <div class="container">
    <div class="counter-wrapper">
      <problem-counter-box :number="totalQuestions" />
    </div>
    <div class="answer-wrapper">
      <AnswerNum :number="correctAnswers" />
    </div>
    <div class="correct-wrapper">
      맞혔습니다!
    </div>
  </div>
</template>

<script setup>
import ProblemCounterBox from '@/components/quiz/QuizResult/ProblemCounterBox.vue'
import AnswerNum from '@/components/quiz/QuizResult/AnswerNum.vue'

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
</script>

<style scoped>
.container {
  position: relative;
  width: 450px;
  height: 400px;
  background-image: url('@/assets/QuizResult.png');
  background-size: auto;
  background-position: center;
  background-repeat: no-repeat;
}

.counter-wrapper {
  position: absolute;
  top: 126px;
  left: 50%;
  transform: translateX(-50%); /* This centers the counter horizontally */
}

.answer-wrapper {
  position: absolute;
  bottom: 169px;
  left: 50%;
  transform: translateX(-50%); /* This centers the counter horizontally */
}

.correct-wrapper {
  width: 122px;
  height : 28px;
  text-align: center;
  font-size: 22px;
  position: absolute;
  bottom: 119px;
  left: 50%;
  transform: translateX(-50%); /* This centers the counter horizontally */

  font-family: 'Roboto', sans-serif;
  font-weight: 200; /* SemiBold */
  line-height: 24px;
  letter-spacing: 0.1px;
}
</style>
