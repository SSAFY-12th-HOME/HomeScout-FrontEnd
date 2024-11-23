<template>
  <section class="quiz-result-section">
    <QuizResultTop 
      :total-questions="totalQuestions"
      :correct-answers="correctAnswers"
    />
    <div class="quiz-result-buttons">
      <QuizOption v-if="totalQuestions !== correctAnswers" text="다시 풀어보기" :on-click="() => $emit('restart')" />
        <div v-else class="quiz-solved">
          <!-- 경험치 바 수정 -->
          <div class="exp-container">
            <div class="exp-bar-wrapper">
              <div class="exp-bar">
                <div 
                  class="exp-progress" 
                  :style="{ width: `${(userProfile.exp / userProfile.maxExp) * 100}%` }"
                >
                  <div class="exp-bubble">
                    <div class="exp-bubble-content">
                      <span class="exp-value">+{{ exp }}</span>
                      <span class="exp-label">EXP</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="total-exp">{{ userProfile.exp }} / {{ userProfile.maxExp }}</div>
            </div>
          </div>
        </div>
      <QuizOption text="새로운 퀴즈 풀기" :on-click="() => $emit('quizList')"/>
    </div>
    <!--    <QuizLogo />-->
  </section>
</template>

<script setup>

import { getMypage } from '@/api/mypage';
import QuizOption from '@/components/quiz/QuizOption.vue'
import QuizResultTop from '@/components/quiz/QuizResult/QuizResultTop.vue'
import { defineEmits, watch, ref } from 'vue'

const props = defineProps({
  totalQuestions: {
    type: Number,
    required: true
  },
  correctAnswers: {
    type: Number,
    required: true
  },
  exp: {
    type: Number,
    required: true
  }
})

defineEmits(['restart', 'quizList'])

const userProfile = ref({})

watch(
  () => props.exp, 
  () => {
  getMypage(
    ({ data }) => {
			userProfile.value = data
			if(userProfile.value.profileImg === null) {
				userProfile.value.profileImg = '/src/assets/default-profile-img.png'
			}
			if(userProfile.value.exp > 1000) {
				userProfile.value.exp = 1000
			}
			userProfile.value.maxExp = 1000
		},
		() => {
			console.log('프로필 정보 로딩 실패')
		}
  )
}, { immediate: true })
</script>

<style scoped>

.quiz-result-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #B4E4B7;
  min-height: 100%;
  max-width: 100%;
}

/* 경험치 바 관련 스타일 */
.exp-container {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  position: relative;
  padding: 2rem 0 1rem;
}

.exp-bar-wrapper {
  position: relative;
}

.exp-bar {
  width: 100%;
  height: 12px;
  background-color: #e0e0e0;
  border-radius: 6px;
  position: relative; /* 변경 */
}

.exp-progress {
  height: 100%;
  background-color: #66b56b;
  transition: width 0.3s ease;
  border-radius: 6px; /* 추가 */
}

/* 말풍선을 exp-bar에 직접 연결 */
.exp-bubble {
  position: absolute;
  top: -38px;
  right: -32px; /* -25px에서 -32px로 수정 */
  z-index: 1;
}

.exp-bubble-content {
  background: linear-gradient(135deg, #ff6b6b, #ff4444);
  color: white;
  padding: 6px 12px;
  border-radius: 8px;
  font-weight: 500;
  box-shadow: 0 4px 12px rgba(255, 107, 107, 0.3);
  display: flex;
  align-items: center;
  gap: 4px;
  /* 세련된 애니메이션 효과 */
  animation: bubblePop 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.exp-value {
  font-size: 0.95rem;
  font-weight: bold;
}

.exp-label {
  font-size: 0.75rem;
  opacity: 0.9;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* 말풍선 꼬리 디자인 개선 */
.exp-bubble-content::after {
  content: '';
  position: absolute;
  bottom: -6px;
  /* left 50%에서 조정 */
  left: 55%;
  transform: translateX(-50%);
  width: 12px;
  height: 12px;
  background: linear-gradient(135deg, #ff6b6b, #ff4444);
  clip-path: polygon(0 0, 100% 0, 50% 100%);
}

/* 말풍선 팝업 애니메이션 */
@keyframes bubblePop {
  0% {
    transform: scale(0.8) translateY(10px);
    opacity: 0;
  }
  100% {
    transform: scale(1) translateY(0);
    opacity: 1;
  }
}

/* 호버 효과 */
.exp-bubble-content:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(255, 107, 107, 0.4);
  transition: all 0.3s ease;
}

/* Progress bar 디자인도 개선 */
.exp-bar {
  width: 100%;
  height: 12px;
  background-color: #f0f0f0;
  border-radius: 8px;
  position: relative;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.05);
}

.exp-progress {
  height: 100%;
  background: linear-gradient(90deg, #66b56b, #88c98d);
  border-radius: 8px;
  transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  box-shadow: 0 2px 4px rgba(102, 181, 107, 0.2);
}

/* 반짝이는 효과 */
.exp-progress::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.112),
    transparent
  );
  animation: shimmer 2s 3;
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.total-exp {
  text-align: right;
  margin-top: 0.5rem;
  color: #666;
  font-size: 0.9rem;
}
</style>

