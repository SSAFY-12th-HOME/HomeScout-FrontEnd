<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import QuestionComponent from '@/components/quiz/QuestionComponent.vue';
import { createQuiz } from '@/api/quiz';
import { useErrorStore } from '@/stores/error';
import ErrorModal from '@/components/common/ErrorModal.vue';

const router = useRouter()
const errorStore = useErrorStore()

const quiz = ref({
	title: '',
	desc: '',
	exp: '',
	type: '',
})

const questions = ref([
	{
    question: '',
    options: [
			{ option: '', isAnswer: true },
			{ option: '', isAnswer: false },
		],
  }
])

const questionTypes = [
	{ text: '타입 선택', value: '' },
  { text: 'O/X형', value: 'O/X형' },
  { text: '다지선다형', value: '다지선다형' }
]

const questionExps = [
	{ text: '경험치 선택', value: '' },
	{ text: '10 경험치', value: '10' },
	{ text: '20 경험치', value: '20' },
	{ text: '30 경험치', value: '30' },
	{ text: '40 경험치', value: '40' },
	{ text: '50 경험치', value: '50' },
	{ text: '60 경험치', value: '60' },
	{ text: '70 경험치', value: '70' },
	{ text: '80 경험치', value: '80' },
	{ text: '90 경험치', value: '90' },
	{ text: '100 경험치', value: '100' },
]

const addQuestion = () => {
  questions.value.push({
    question: '',
    options: [
			{ option: '', isAnswer: true },
			{ option: '', isAnswer: false },
		],
  })
}

const updateQuestion = (index, updatedQuestion) => {
  questions.value[index] = updatedQuestion
  console.log(updatedQuestion)
}

const makeQuiz = () => {
	quiz.value.questions = questions
	
	createQuiz(
		quiz.value,
		() => {
			router.push('/quiz')
		},
		(err) => {
			errorStore.showError(err.response.data.message)
		}
	)
}
</script>

<template>
	<ErrorModal />
  <div class="image-container">
    <h1 class="quiz-title">퀴즈 생성</h1>
    <button class="make-quiz-btn" @click="makeQuiz">
      등록
    </button>
  </div>  
  <div class="quiz-creator">
    <!-- Section 1: Quiz Title, Experience Points, and Question Type -->
    <div class="header-section">
      <div class="description-section">
      <label class="required">퀴즈 제목</label>
      <input 
				v-model="quiz.title" 
				placeholder="퀴즈 제목을 입력하세요"
				style="min-width: 720px"
			/>
    </div>
      <div class="description-section">
        <label class="required">지급 경험치</label>
        <div class="select-wrapper">
          <select v-model="quiz.exp" @change="changeSelect" style="min-width: 150px">
            <option 
              v-for="exp in questionExps" 
              :key="exp.value" 
              :value="exp.value"
							:disabled="exp.value === '' ? true : false"
            >
              {{ exp.text }}
            </option>
          </select>
        </div>
      </div>
      <div class="description-section">
        <label class="required">문제 유형</label>
        <div class="select-wrapper">
          <select v-model="quiz.type" style="min-width: 150px">
            <option 
              v-for="type in questionTypes" 
              :key="type.value" 
              :value="type.value"
							:disabled="type.value === '' ? true : false"
            >
              {{ type.text }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <!-- Section 2: Quiz Description -->
    <div class="description-section">
      <label class="required">퀴즈 설명</label>
      <input 
				v-model="quiz.desc" 
				placeholder="퀴즈 설명을 입력하세요"
			/>
    </div>

    <!-- Section 3: Add Question Button -->
    <div class="add-question-section">
      <button class="add-question-btn" @click="addQuestion">
        문제 추가
      </button>
    </div>

    <!-- Section 4: Questions List -->
    <div class="questions-container">
      <div class="questions-scroll">
        <QuestionComponent
          v-for="(question, index) in questions"
          :key="index"
          :questionNumber="index + 1"
          :question="question"
          @update:question="updateQuestion(index, $event)"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 전체 폰트 설정 */
:root {
  font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, Roboto, 'Helvetica Neue', 'Segoe UI', 'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif;
}

.quiz-creator {
  padding: 20px;
	max-width: 1100px;
  margin: 0 auto;
	padding-top: 0px;
}

.header-section {
  display: flex;
  gap: 20px;
}

.input-group {
  display: flex;
  flex-direction: column;
  flex: 1;
	overflow: hidden;
	padding: 2px;
}

input, textarea {
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

textarea {
  min-height: 100px;
  resize: vertical;
}

label {
  font-size: 14px;
  font-weight: 500;
  color: #1a1a1a;
  margin-bottom: 2px;
}

.required::after {
  content: ' *';
  color: #ef4444;
}

.add-question-btn {
  width: 100px;
  height: 35px;
  background-color: #166534;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
  transition: background-color 0.2s ease;
}

.add-question-btn:hover {
  background-color: #14532d;
}

.questions-container {
  margin-top: 20px;
  overflow: hidden;
}

.questions-scroll {
  display: flex;
  gap: 20px;
  overflow-x: auto;
  padding: 5px 5px;
}

.description-section {
  display: flex;
  gap: 5px;
  flex-direction: column;
  margin-bottom: 15px;
}

.image-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 1145px;
  margin: 0 auto;
  padding: 10px 40px;
}

.quiz-title {
  font-size: 22px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
}

.make-quiz-btn {
  padding: 8px 16px;
  background-color: #166534;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: transform 0.3s ease;
  z-index: 1;
}

.make-quiz-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #14532d;
  transform: translateX(-100%);
  transition: transform 0.3s ease;
  z-index: -1;
}

.make-quiz-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.make-quiz-btn:hover::before {
  transform: translateX(0);
}

.make-quiz-btn:active {
  transform: translateY(0);
}

.select-wrapper {
  position: relative;
}

.select-wrapper::after {
  content: '▼';
  font-size: 12px;
  color: #666;
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
}

select {
  width: 100%;
  padding: 10px 15px;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  appearance: none;
  background-color: white;
  font-size: 14px;
  cursor: pointer;
  outline: none;
  transition: border-color 0.2s ease;
}

select:focus {
  border-color: #4ade80;
  box-shadow: 0 0 0 2px rgba(74, 222, 128, 0.1);
}
</style>