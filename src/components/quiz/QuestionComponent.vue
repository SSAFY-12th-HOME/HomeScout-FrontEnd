<!-- QuestionComponent.vue -->
<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  questionNumber: {
    type: Number,
    required: true
  },
  question: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['update:question'])

const localQuestion = ref({
  question: props.question.question,
  options: [...props.question.options]
})

const addOption = () => {
  localQuestion.value.options.push({ option: '', isAnswer: true })
}

const setCorrectAnswer = (index) => {
  localQuestion.value.options.forEach((option, i) => {
    option.isAnswer = i === index
  })
}

watch(localQuestion, (newVal) => {
  emit('update:question', newVal)
}, { deep: true })
</script>

<template>
  <div class="question-card">
    <div class="question-input">
      <label>문제 {{ questionNumber }}</label>
      <input type="text"
        v-model="localQuestion.question"
        placeholder="문제를 입력하세요"
      />
    </div>

    <div class="options-container">
      <div
        v-for="(option, index) in localQuestion.options"
        :key="index"
        class="option-input"
      >
        <label>답변 {{ questionNumber }} - {{ String.fromCharCode(65 + index) }}</label>
        <div class="option-row">
          <input
            v-model="option.option"
            type="text"
            placeholder="답변을 입력하세요"
						style="min-width: 275px"
          >
          <input
            type="radio"
            :name="'question-' + questionNumber"
            :checked="option.isAnswer"
            @change="setCorrectAnswer(index)"
          >
        </div>
      </div>
    </div>

    <button class="add-option-btn" @click="addOption">
      답변 추가
    </button>
  </div>
</template>

<style scoped>

input {
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 10px 15px;
  outline: none;
  font-size: 14px;
  transition: border-color 0.2s ease;
}

input:focus, textarea:focus {
  border-color: #24c66a;
  box-shadow: 0 0 0 2px rgba(74, 222, 128, 0.1);
}


.question-card {
  min-width: 336px;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 0 5px rgba(0,0,0,0.1);
}

.question-input {
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
}

.question-input label {
  margin-bottom: 5px;
}

.options-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.option-input {
  display: flex;
  flex-direction: column;
}

.option-row {
  display: flex;
  gap: 10px;
  align-items: center;
	margin-top: 5px;
}

.add-option-btn {
	width: 100px;
  height: 35px;
  margin-top: 10px;
  padding: 8px 16px;
  background-color: #166534;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
	font-size: 14px;
  font-weight: bold;
  transition: background-color 0.2s ease;
}

.add-option-btn:hover {
  background-color: #14532d;
}
</style>
