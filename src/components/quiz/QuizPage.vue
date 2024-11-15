<template>
  <div class="quiz-container">
    <quiz-title :title="quizTitle" />
    <quiz-index :index="quizIndex" />
    <quiz-question :question="question" />
    <QuizOption
      v-for="(option, idx) in quizOption"
      :key="idx"
      :text="option.content"
      :onClick="() => handleSelection(idx)"
      :isActive="selectedOptionIdx === idx"
    />
    <next-button @next="$emit('next')" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import QuizTitle from '@/components/quiz/QuizTitle.vue'
import QuizIndex from '@/components/quiz/QuizIndex.vue'
import QuizQuestion from '@/components/quiz/QuizQuestion.vue'
import NextButton from '@/components/quiz/NextButton.vue'
import QuizOption from '@/components/quiz/QuizOption.vue'

const props = defineProps({
  quizTitle: String,
  quizIndex: Number,
  question: String,
  isActive: Boolean,
  quizOption: Array
})

const selectedOptionIdx = ref(-1)

const handleSelection = (option) => {
  selectedOptionIdx.value = option
}

</script>

<style scoped>
.quiz-container {
  max-width: 100%;
  margin: 0 auto;
  padding: 20px;
  background-color: #B4E4B7;
  min-height: 100vh;
}
</style>
