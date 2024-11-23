<template>
  <div class="quiz-container">
    <quiz-title :title="quizTitle" />
    <quiz-index :index="quizIndex" />
    <quiz-question :question="question" />
    <QuizOption
      v-for="(option, idx) in quizOption"
      :key="idx"
      :text="option"
      :onClick="() => handleSelection(idx, option)"
      :isActive="selectedOptionIdx === idx"
    />
    <next-button @next="emit('next', quizQuestionId, selectedOption)" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import QuizTitle from '@/components/quiz/QuizTitle.vue'
import QuizIndex from '@/components/quiz/QuizIndex.vue'
import QuizQuestion from '@/components/quiz/QuizQuestion.vue'
import NextButton from '@/components/quiz/NextButton.vue'
import QuizOption from '@/components/quiz/QuizOption.vue'

const emit = defineEmits(['next'])

const props = defineProps({
  quizTitle: String,
  quizIndex: Number,
  question: String,
  isActive: Boolean,
  quizOption: Array,
  quizQuestionId: Number
})

const selectedOptionIdx = ref(-1)
const selectedOption = ref('')

const handleSelection = (idx, option) => {
  selectedOptionIdx.value = idx
  selectedOption.value = option
  // console.log('quizQuestionId: ' + props.quizQuestionId + selectedOption.value + ' ' + selectedOptionIdx.value)
}

</script>

<style scoped>
.quiz-container {
  max-width: 100%;
  margin: 0 auto;
  padding: 20px;
  background-color: #B4E4B7;
  min-height: 100%;
}
</style>
