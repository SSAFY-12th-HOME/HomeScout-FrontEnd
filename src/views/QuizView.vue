<script setup>
import { onMounted, ref } from 'vue'
import { useUserStore } from '@/stores/user';
import { getQuizList } from '@/api/quiz';
import ErrorModal from '@/components/common/ErrorModal.vue';
import { useErrorStore } from '@/stores/error';

const userStore = useUserStore()
const errorStore = useErrorStore()

// userStore import 및 초기화

const sortOption = ref('latest')
const quizzes = ref([])

onMounted(() => {
	fetchQuizzes()
})

const fetchQuizzes = () => {
	getQuizList(
		{ order: sortOption.value },
		({ data }) => {
			quizzes.value = data
		},
		(err) => {
			errorStore.showError(err.response.data.message)
		}
	)
}

const startQuiz = (quizId) => {
  const quiz = quizzes.value.find(q => q.id === quizId)
  if (quiz) {
    quiz.isCompleted = true
  }
}

const sortQuizzes = (option) => {
  sortOption.value = option
}

const createQuiz = () => {
  // 퀴즈 생성 로직 구현
  console.log('퀴즈 생성 페이지로 이동')
}
</script>

<template>
	<ErrorModal />
  <div class="quiz-container">
    <div class="header">
      <div class="header-content">
        <div class="header-text">
          <h1 class="title">퀴즈 풀기</h1>
          <p class="subtitle">퀴즈를 풀고 경험치를 획득해 보세요</p>
        </div>
        <button 
          v-if="userStore.role === '공인중개사'"
          @click="createQuiz"
          class="create-quiz-button"
        >
          퀴즈 생성
        </button>
      </div>
    </div>
    
    <div class="quiz-content">
      <div class="sort-options">
        <button 
          :class="['sort-button', { active: sortOption === 'latest' }]"
          @click="sortQuizzes('latest')"
        >
          등록순
        </button>
        <button 
          :class="['sort-button', { active: sortOption === 'participation' }]"
          @click="sortQuizzes('participation')"
        >
          참여순
        </button>
      </div>

      <div class="quiz-grid">
        <div v-for="quiz in quizzes" 
             :key="quiz.id" 
             class="quiz-card">
          <h2 class="quiz-title">{{ quiz.title }}</h2>
          <p class="quiz-description">{{ quiz.desc }}</p>
          
          <div class="quiz-tags">
            <span class="tag">{{ quiz.tag1 }}</span>
            <span class="tag">{{ quiz.tag2 }}</span>
            <span class="tag">{{ quiz.tag3 }}</span>
          </div>
          
          <div class="quiz-footer">
            <div class="author-info">
              <img 
								:src="quiz.writer.profileImg === null ? '/src/assets/default-profile-img.png' : quiz.writer.profileImg"
								class="author-image" 
							/>
              <span class="author-name">{{ quiz.writer.nickname }}</span>
            </div>
            <button 
              @click="startQuiz(quiz.id)"
              :class="['quiz-button', { 'completed': quiz.isSolve }]"
              :disabled="quiz.isSolve"
            >
              {{ quiz.isSolve ? '풀이 완료' : '퀴즈 풀기' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.quiz-container {
  margin: 0 auto;
}

.header {
  background-color: #f8f9fa;
  padding: 24px 210px;
  margin-bottom: 24px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.header-text {
  flex-grow: 1;
}

.title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 8px;
}

.subtitle {
  color: #666;
}

.create-quiz-button {
  padding: 8px 16px;
  background-color: #166534;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: transform 0.3s ease;
  z-index: 1;
}

.create-quiz-button::before {
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

.create-quiz-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.create-quiz-button:hover::before {
  transform: translateX(0);
}

.create-quiz-button:active {
  transform: translateY(0);
}

.quiz-button {
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  border: none;
  background-color: #166534;
  color: white;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  z-index: 1;
}

.quiz-button::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  background-color: #14532d;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition: width 0.5s ease, height 0.5s ease;
  z-index: -1;
}

.quiz-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.quiz-button:hover::before {
  width: 300px;
  height: 300px;
}

.quiz-button:active {
  transform: translateY(0);
}

.quiz-button.completed {
  background-color: #e0e0e0;
  color: #666;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.quiz-button.completed:hover {
  transform: none;
  box-shadow: none;
}

.quiz-button.completed::before {
  display: none;
}

/* 버튼 클릭 시 ripple 효과를 위한 키프레임 */
@keyframes ripple {
  from {
    width: 0;
    height: 0;
    opacity: 0.8;
  }
  to {
    width: 300px;
    height: 300px;
    opacity: 0;
  }
}

/* 버튼 클릭 시 scale 효과를 위한 키프레임 */
@keyframes buttonClick {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(0.95);
  }
  100% {
    transform: scale(1);
  }
}

/* hover 시 살짝 떠오르는 효과를 위한 키프레임 */
@keyframes float {
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-2px);
  }
  100% {
    transform: translateY(0);
  }
}

/* 버튼이 disabled 될 때의 효과를 위한 키프레임 */
@keyframes fadeToGray {
  from {
    background-color: #166534;
    color: white;
  }
  to {
    background-color: #e0e0e0;
    color: #666;
  }
}

.quiz-content {
  padding: 0 24px;
	margin: 0 auto;
	max-width: 1200px;
}

.sort-options {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-bottom: 16px;
}

.sort-options {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-bottom: 16px;
}

.sort-button {
  padding: 6px 12px;
  border: none;
  background: none;
  color: #666;
  cursor: pointer;
  position: relative;
  transition: color 0.3s ease;
}

.sort-button::after {
  content: '';
  position: absolute;
  width: 0;
  height: 2px;
  bottom: 0;
  left: 50%;
  background-color: #166534;
  transition: all 0.3s ease;
  transform: translateX(-50%);
}

.sort-button:hover {
  color: #166534;
}

.sort-button:hover::after {
  width: calc(100% - 24px); /* padding을 고려한 너비 */
}

.sort-button.active {
  color: #166534;
  font-weight: bold;
  animation: scaleText 0.3s ease;
}

.sort-button.active::after {
  width: calc(100% - 24px);
}

@keyframes scaleText {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

.quiz-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}

@media (min-width: 768px) {
  .quiz-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.quiz-card {
  height: 200px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 20px;
  background-color: white;
  display: flex;
  flex-direction: column;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
}

.quiz-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 12px;
}

.quiz-description {
  font-size: 14px;
  color: #666;
  margin-bottom: 16px;
  line-height: 1.5;
  flex-grow: 1;
}

.quiz-tags {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

.tag {
  background-color: #f1f3f5;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  color: #495057;
}

.quiz-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.author-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.author-image {
  width: 32px;
  height: 32px;
  border-radius: 50%;
}

.author-name {
  font-size: 14px;
  color: #495057;
}

:global(body) {
  background-color: #f5f5f5;
}
</style>