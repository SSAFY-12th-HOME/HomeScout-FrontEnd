<template>
  <div class="diagnosis-container">
    <!-- Header with subtle gradient background -->
    <div class="diagnosis-header">
      <div class="header-content">
        <h1 class="header-title">
          <span class="gradient-text">전세 위험도 진단</span>
        </h1>
        <div class="header-subtitle">
          <span class="step-badge">{{ currentStep }}/5 단계</span>
        </div>
      </div>
    </div>

    <!-- Enhanced Progress Indicator -->
    <div class="progress-bar">
      <div 
        class="progress-fill"
        :style="{ width: `${(currentStep / 5) * 100}%` }"
      ></div>
    </div>

    <!-- Question Section with Transition -->
    <transition name="fade-slide" mode="out-in">
      <div v-if="!showResult" class="question-section" :key="currentStep">
        <h2 class="question-title">
          {{ questions[currentStep - 1].question }}
        </h2>
        
        <div class="input-container">
          <div class="input-wrapper" :class="{ 'focused': inputFocused }">
            <input
              v-if="questions[currentStep - 1].type === 'number'"
              type="text"
              v-model="answers[currentStep - 1]"
              :placeholder="questions[currentStep - 1].placeholder"
              @focus="inputFocused = true"
              @blur="inputFocused = false"
            />
            <select
              v-else
              v-model="answers[currentStep - 1]"
              @focus="inputFocused = true"
              @blur="inputFocused = false"
            >
              <option value="" disabled selected>선택해주세요</option>
              <option
                v-for="option in questions[currentStep - 1].options"
                :key="option.value"
                :value="option.value"
              >
                {{ option.label }}
              </option>
            </select>
            <span v-if="questions[currentStep - 1].type === 'number'" class="unit">만원</span>
          </div>
        </div>

        <!-- Enhanced Navigation Buttons -->
        <div class="button-container">
          <button
            @click="previousStep"
            class="nav-button prev"
            :disabled="currentStep === 1"
            :class="{ 'button-disabled': currentStep === 1 }"
          >
            <span class="button-icon">←</span>
            이전
          </button>
          <button
            @click="nextStep"
            class="nav-button next"
            :disabled="!answers[currentStep - 1]"
            :class="{ 'button-disabled': !answers[currentStep - 1] }"
          >
            {{ currentStep === 5 ? '결과 확인하기' : '다음' }}
            <span class="button-icon" v-if="currentStep !== 5">→</span>
          </button>
        </div>
      </div>
    </transition>

    <!-- Enhanced Result Modal -->
    <PerfectScrollbar>
    <transition name="modal">
      <div v-if="showResult" class="modal-overlay" @click.self="handleModalClick">
        <div class="modal-content">
          <div class="result-header">
            <h2>전세 분석 리포트</h2>
            <p class="result-date">{{ getCurrentDate() }}</p>
          </div>
          
          <div class="risk-circle-container">
            <div class="risk-circle" :class="getRiskLevelClass()">
              <div class="circle-background"></div>
              <div class="circle">
                <span class="risk-level">{{ getRiskLevel() }}</span>
                <span class="risk-score">위험도 {{ getRiskScore() }}점</span>
              </div>
            </div>
          </div>

          <div class="risk-factors-container">
            <h3>위험 요소 분석</h3>
            <transition-group name="list" tag="ul" class="risk-factors">
              <li v-for="(factor, index) in getRiskFactors()" 
                  :key="index"
                  class="risk-factor-item">
                <div class="factor-icon">⚠️</div>
                <p>{{ factor }}</p>
              </li>
            </transition-group>
          </div>

          <div class="recommendation-section" v-if="getRecommendations().length">
            <h3>추천 대응 방안</h3>
            <ul class="recommendations">
              <li v-for="(rec, index) in getRecommendations()" 
                  :key="index"
                  class="recommendation-item">
                <span class="check-icon">✓</span>
                {{ rec }}
              </li>
            </ul>
          </div>

          <button @click="resetDiagnosis" class="finish-button">
            <span class="button-text">새로운 진단 시작하기</span>
          </button>
        </div>
      </div>
    </transition>
  </PerfectScrollbar>

  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup() {
    const currentStep = ref(1)
    const showResult = ref(false)
    const answers = ref(['', '', '', '', ''])
    const inputFocused = ref(false)
    const modalContent = ref(null)

    // ... (이전 스크립트 코드는 유지)
    const questions = [
      {
        question: '전세 보증금이 얼마인가요?',
        type: 'number',
        placeholder: '만원 단위로 입력해주세요'
      },
      {
        question: '건물의 시세 대비 전세 보증금 비율이 어떻게 되나요?',
        type: 'select',
        options: [
          { value: 1, label: '60% 미만' },
          { value: 2, label: '60~70%' },
          { value: 3, label: '70~80%' },
          { value: 4, label: '80% 이상' }
        ]
      },
      {
        question: '집주인의 대출 상황은 어떠한가요?',
        type: 'select',
        options: [
          { value: 1, label: '대출 없음' },
          { value: 2, label: '전세금의 50% 미만' },
          { value: 3, label: '전세금의 50~70%' },
          { value: 4, label: '전세금의 70% 이상' }
        ]
      },
      {
        question: '건물의 준공연도는 어떻게 되나요?',
        type: 'select',
        options: [
          { value: 1, label: '5년 이내' },
          { value: 2, label: '5~10년' },
          { value: 3, label: '10~20년' },
          { value: 4, label: '20년 이상' }
        ]
      },
      {
        question: '주변 시세 변동 추이는 어떠한가요?',
        type: 'select',
        options: [
          { value: 1, label: '상승 추세' },
          { value: 2, label: '보합세' },
          { value: 3, label: '소폭 하락' },
          { value: 4, label: '급락세' }
        ]
      }
    ]

    const nextStep = () => {
      if (currentStep.value === 5) {
        showResult.value = true
      } else {
        currentStep.value++
      }
    }

    const previousStep = () => {
      if (currentStep.value > 1) {
        currentStep.value--
      }
    }

    const getRiskScore = () => {
      const values = answers.value.map(a => Number(a))
      const score = values.reduce((sum, value, index) => {
        if (index === 0) return sum // Skip 전세금 금액
        return sum + value
      }, 0)
      return score
    }

    const getRiskLevel = () => {
      const score = getRiskScore()
      if (score <= 6) return '안전'
      if (score <= 10) return '주의'
      if (score <= 14) return '위험'
      return '위험'
    }

    const getRiskFactors = () => {
      const factors = []
      
      if (answers.value[1] >= 3) {
        factors.push('전세가율이 70% 이상으로 매우 높은 편이에요.')
      }
      if (answers.value[2] >= 3) {
        factors.push('채권최고액이 집 시세의 50% 이상이에요.')
      }
      if (answers.value[3] >= 3) {
        factors.push('재건축 대상이 될 가능성이 있어요.')
        factors.push('노후 건물은 담보 가치가 낮아질 가능성이 있어요.')
      }
      
      return factors
    }

    const resetDiagnosis = () => {
      currentStep.value = 1
      showResult.value = false
      answers.value = ['', '', '', '', '']
    }

    const getCurrentDate = () => {
      const now = new Date()
      return now.toLocaleDateString('ko-KR', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
    }

    const getRiskLevelClass = () => {
      const score = getRiskScore()
      if (score <= 6) return 'safe'
      if (score <= 10) return 'caution'
      if (score <= 14) return 'warning'
      return 'danger'
    }

    const getRecommendations = () => {
      const score = getRiskScore()
      const recommendations = []
      
      if (score > 10) {
        recommendations.push('전세보증보험 가입을 적극 검토하세요.')
        recommendations.push('등기부등본 확인이 필수적입니다.')
      }
      if (score > 14) {
        recommendations.push('법률 전문가와 상담을 진행하세요.')
      }
      
      return recommendations
    }

    const handleModalClick = (event) => {
      if (event.target === event.currentTarget) {
        resetDiagnosis()
      }
    }

    return {
      currentStep,
      showResult,
      answers,
      questions,
      nextStep,
      previousStep,
      getRiskLevel,
      getRiskFactors,
      getRiskScore,
      resetDiagnosis,
      // ... (이전 return 객체에 추가)
      inputFocused,
      modalContent,
      getCurrentDate,
      getRiskLevelClass,
      getRecommendations,
      handleModalClick
    }
  }
}
</script>

<style scoped>
/* Base Styles */
.diagnosis-container {
  position: relative;
  max-width: 600px;
  margin: 0 auto;
  padding: 24px;
}

/* Header Styles */
.diagnosis-header {
  text-align: center;
  margin-bottom: 32px;
  background: linear-gradient(135deg, #f6f8fd 0%, #f1f4f9 100%);
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
}

.diagnosis-header h1 {
  font-size: 24px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 8px;
}

.subtitle {
  color: #666;
  font-size: 14px;
  margin-bottom: 0px
}

/* Progress Bar */
.progress-bar {
  height: 4px;
  background-color: #eef2f6;
  border-radius: 2px;
  margin-bottom: 40px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #4CAF50, #45a049);
  transition: width 0.3s ease;
}

/* Question Section */
.question-section {
  background: white;
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.question-title {
  font-size: 18px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 24px;
  line-height: 1.4;
}

/* Input Styles */
.input-wrapper {
  position: relative;
  transition: all 0.3s ease;
}

.input-wrapper.focused {
  transform: translateY(-2px);
}

.input-container input,
.input-container select {
  width: 100%;
  padding: 16px;
  border: 2px solid #eef2f6;
  border-radius: 12px;
  font-size: 16px;
  transition: all 0.3s ease;
  background-color: white;
  color: #1a1a1a;
  appearance: none;
}

.input-container input:focus,
.input-container select:focus {
  border-color: #4CAF50;
  outline: none;
  box-shadow: 0 0 0 4px rgba(76, 175, 80, 0.1);
}

/* Button Styles */
.button-container {
  display: flex;
  justify-content: space-between;
  margin-top: 32px;
  gap: 16px;
}

.nav-button {
  flex: 1;
  padding: 16px 24px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.nav-button.prev {
  background-color: #f8f9fa;
  color: #1a1a1a;
  border: none;
}

.nav-button.next {
  background-color: #4CAF50;
  color: white;
  border: none;
}

.nav-button:not(:disabled):hover {
  transform: translateY(-2px);
}

.button-disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
/* Modal Styles */
.modal-overlay {
  position: fixed;
  inset: 0; /* top, right, bottom, left를 한번에 0으로 설정 */
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  z-index: 9999; /* z-index 값 상향 조정 */
}

.modal-content {
  background: white;
  padding: 32px;
  border-radius: 24px;
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  z-index: 10000; /* modal-overlay보다 높은 z-index */
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}

.modal-content::-webkit-scrollbar {
  display: none;
}

.result-header {
  text-align: center;
  margin-bottom: 32px;
}

.result-header h2 {
  font-size: 24px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 8px;
}

.result-date {
  color: #666;
  font-size: 14px;
}

/* Risk Circle Styles */
.risk-circle-container {
  display: flex;
  justify-content: center;
  margin-bottom: 30px;
}

.risk-circle {
  position: relative;
  width: 200px;
  height: 200px;
}

.circle-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 50%;
  background: radial-gradient(circle at center, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%);
}

.circle {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 4px solid;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.risk-circle.safe .circle { border-color: #4CAF50; color: #4CAF50; }
.risk-circle.caution .circle { border-color: #FFC107; color: #FFC107; }
.risk-circle.warning .circle { border-color: #FF9800; color: #FF9800; }
.risk-circle.danger .circle { border-color: #FF4444; color: #FF4444; }

.risk-level {
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 8px;
}

.risk-score {
  font-size: 14px;
  opacity: 0.8;
}

/* Risk Factors Styles */
.risk-factors {
  padding-left: 0px;
}

.risk-factors-container {
  margin-bottom: 20px;
}

.risk-factors-container h3 {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #1a1a1a;
}

.risk-factor-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  background-color: #fff8f8;
  border-radius: 12px;
  margin-bottom: 12px;
  transition: all 0.3s ease;
  line-height: 1.5rem;
}

.factor-icon {
  flex-shrink: 0;
  font-size: 20px;
}

/* Recommendations Styles */
.recommendation-section {
  margin-bottom: 0px;
}

.recommendation-section h3 {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #1a1a1a;
}

.recommendation-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  color: #1a1a1a;
}

.check-icon {
  color: #4CAF50;
  font-weight: bold;
}

/* Finish Button */
.finish-button {
  width: 100%;
  padding: 16px;
  background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.finish-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.2);
}

.button-text {
  position: relative;
}

/* Animations */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

/* Modal Transitions */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .modal-content,
.modal-leave-active .modal-content {
  transition: transform 0.3s ease;
}

.modal-enter-from .modal-content {
  transform: scale(0.9);
}

.modal-leave-to .modal-content {
  transform: scale(0.9);
}

.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}

.list-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.list-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

/* Responsive Design */
@media (max-width: 768px) {
  .diagnosis-container {
    padding: 16px;
  }

  .modal-content {
    padding: 24px;
  }

  .risk-circle {
    width: 160px;
    height: 160px;
  }

  .risk-level {
    font-size: 28px;
  }

  .nav-button {
    padding: 14px 20px;
    font-size: 15px;
  }
}

/* Accessibility Enhancements */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

.nav-button:focus-visible,
.finish-button:focus-visible {
  outline: 2px solid #4CAF50;
  outline-offset: 2px;
}

/* Dark Mode Support */
@media (prefers-color-scheme: dark) {
  .diagnosis-container {
    color: #e1e1e1;
  }

  .diagnosis-header {
    background: linear-gradient(135deg, #1a1a1a 0%, #252525 100%);
  }

  .question-section {
    background: #1a1a1a;
  }

  .input-container input,
  .input-container select {
    background-color: #252525;
    border-color: #333;
    color: #e1e1e1;
  }

  .nav-button.prev {
    background-color: #252525;
    color: #e1e1e1;
  }

  .modal-content {
    background: #1a1a1a;
  }

  .risk-factor-item {
    background-color: #252525;
  }

  .recommendation-item {
    color: #e1e1e1;
  }
}

/* Loading States */
.loading {
  position: relative;
  overflow: hidden;
}

.loading::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.1),
    transparent
  );
  animation: loading 1.5s infinite;
}

@keyframes loading {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

/* Tooltip Styles */
.tooltip {
  position: relative;
}

.tooltip::before {
  content: attr(data-tooltip);
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  padding: 8px 12px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  border-radius: 6px;
  font-size: 14px;
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
}

.tooltip:hover::before {
  opacity: 1;
  visibility: visible;
  transform: translate(-50%, -8px);
}

.unit {
  position: absolute;
  right: 24px;
  top: 50%;
  transform: translateY(-50%);
  color: #6b7280;
  font-size: 1rem;
  pointer-events: none;
}

p {
  margin-bottom: 0px;
}

/* Enhanced Header Styles */
.diagnosis-header {
  text-align: center;
  margin-bottom: 32px;
  padding: 32px;
  border-radius: 24px;
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  box-shadow: 
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -2px rgba(0, 0, 0, 0.05),
    inset 0 2px 4px rgba(255, 255, 255, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.8);
  position: relative;
  overflow: hidden;
}

.diagnosis-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #4CAF50, #45a049);
}

.header-content {
  position: relative;
  z-index: 1;
}

.header-icon {
  margin-bottom: 16px;
  color: #4CAF50;
  font-size: 32px;
}

.header-title {
  font-size: 24px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.header-subtitle {
  color: #666;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
}

.step-badge {
  margin-top: 10px;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 700;
}

/* Enhanced Title Styles */
.header-title {
  font-size: 28px;
  font-weight: 800;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
}

.gradient-text {
  background: #454545;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  position: relative;
  padding: 0 4px;
  text-shadow: 0px 2px 4px rgba(76, 175, 80, 0.1);
}

.gradient-text::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, transparent, #4CAF50, transparent);
  opacity: 0.5;
  border-radius: 2px;
}

.highlight-badge {
  background: linear-gradient(135deg, #fff 0%, #f8f9fa 100%);
  color: #2ac885;
  padding: 4px 16px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(76, 175, 80, 0.2);
  transform-origin: center;
  animation: badge-pulse 2s infinite;
}

@keyframes badge-pulse {
  0% {
    transform: scale(1);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  }
  50% {
    transform: scale(1.02);
    box-shadow: 0 4px 8px rgba(76, 175, 80, 0.15);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  }
}

/* Modern Header Styles 2024 */
.diagnosis-header {
  position: relative;
  margin: 20px auto 40px;
  padding: 32px;
  border-radius: 32px;
  background: linear-gradient(145deg, #ffffff, #f0f0f0);
  box-shadow: 
    16px 16px 32px rgba(174, 174, 192, 0.2),
    -16px -16px 32px rgba(255, 255, 255, 0.7),
    inset 2px 2px 4px rgba(255, 255, 255, 0.9),
    inset -2px -2px 4px rgba(174, 174, 192, 0.1);
  overflow: hidden;
  isolation: isolate;
}

/* Glassmorphism Overlay */
.diagnosis-header::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.4) 0%,
    rgba(255, 255, 255, 0.1) 100%
  );
  border-radius: inherit;
  z-index: 0;
}

/* Animated Background */
.diagnosis-header::after {
  content: '';
  position: absolute;
  inset: -50%;
  background: linear-gradient(
    45deg,
    #2faa33 0%,
    #2ac885 25%,
    #4CAF50 50%,
    #199f67 75%,
    #299c2d 100%
  );
  opacity: 0.05;
  filter: blur(30px);
  animation: gradient-shift 8s linear infinite;
  z-index: -1;
}

.header-content {
  position: relative;
  z-index: 1;
}

.header-icon {
  width: 64px;
  height: 64px;
  margin: 0 auto 20px;
  background: linear-gradient(145deg, #ffffff, #f0f0f0);
  border-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 
    8px 8px 16px rgba(174, 174, 192, 0.2),
    -8px -8px 16px rgba(255, 255, 255, 0.7);
  color: #2ac885;
  transform: translateY(0);
  transition: all 0.3s ease;
}

.header-icon:hover {
  transform: translateY(-2px);
  box-shadow: 
    12px 12px 20px rgba(174, 174, 192, 0.3),
    -12px -12px 20px rgba(255, 255, 255, 0.8);
}

.header-icon svg {
  width: 32px;
  height: 32px;
  stroke-width: 1.5;
}

.header-title {
  text-align: center;
  margin-bottom: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.gradient-text {
  font-size: 32px;
  font-weight: 800;
  background: linear-gradient(135deg, #20b175 20%, #4CAF50 80%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  position: relative;
  letter-spacing: -0.02em;
}

.highlight-badge {
  padding: 8px 20px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(8px);
  border-radius: 16px;
  font-size: 14px;
  font-weight: 600;
  color: #2ac885;
  box-shadow: 
    4px 4px 8px rgba(174, 174, 192, 0.2),
    -4px -4px 8px rgba(255, 255, 255, 0.7);
  transform: translateY(0);
  transition: all 0.3s ease;
  animation: subtle-float 3s ease-in-out infinite;
}

.header-subtitle {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #666;
  font-size: 14px;
}

.step-badge {
  padding: 6px 12px;

  border-radius: 12px;
  color: rgb(116, 115, 115);
  font-weight: bold;
  font-size: 13px;
  box-shadow: 
    4px 4px 8px rgba(76, 175, 80, 0.2),
    -4px -4px 8px rgba(255, 255, 255, 0.7);
}

/* Animations */
@keyframes gradient-shift {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes subtle-float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-4px);
  }
}

/* Hover Effects */
.header-content:hover .header-icon {
  transform: translateY(-4px);
  box-shadow: 
    12px 12px 20px rgba(174, 174, 192, 0.3),
    -12px -12px 20px rgba(255, 255, 255, 0.8);
}

/* Dark Mode */
@media (prefers-color-scheme: dark) {
  .diagnosis-header {
    background: linear-gradient(145deg, #1a1a1a, #252525);
    box-shadow: 
      16px 16px 32px rgba(0, 0, 0, 0.2),
      -16px -16px 32px rgba(30, 30, 30, 0.7),
      inset 2px 2px 4px rgba(30, 30, 30, 0.9),
      inset -2px -2px 4px rgba(0, 0, 0, 0.1);
  }

  .header-icon {
    background: linear-gradient(145deg, #1a1a1a, #252525);
    box-shadow: 
      8px 8px 16px rgba(0, 0, 0, 0.2),
      -8px -8px 16px rgba(30, 30, 30, 0.7);
  }

  .highlight-badge {
    background: rgba(42, 42, 42, 0.9);
    box-shadow: 
      4px 4px 8px rgba(0, 0, 0, 0.2),
      -4px -4px 8px rgba(30, 30, 30, 0.7);
  }

  .header-subtitle {
    color: #a0a0a0;
  }

  .diagnosis-header::after {
    opacity: 0.1;
  }
}

/* Glass Effect Enhancement */
@supports (backdrop-filter: blur(10px)) {
  .highlight-badge {
    backdrop-filter: blur(10px);
    background: rgba(255, 255, 255, 0.7);
  }

  @media (prefers-color-scheme: dark) {
    .highlight-badge {
      background: rgba(42, 42, 42, 0.7);
    }
  }
}

/* Responsive Adjustments */
@media (max-width: 768px) {
  .diagnosis-header {
    padding: 24px;
    border-radius: 24px;
  }

  .header-icon {
    width: 56px;
    height: 56px;
  }

  .gradient-text {
    font-size: 28px;
  }
}

</style>