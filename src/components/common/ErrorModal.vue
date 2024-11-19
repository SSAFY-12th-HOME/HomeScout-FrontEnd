<script setup>
import { useErrorStore } from '@/stores/error'
import { storeToRefs } from 'pinia'

const errorStore = useErrorStore()
const { isVisible, message, title } = storeToRefs(errorStore)
const { hideError } = errorStore

const handleOverlayClick = () => {
  hideError()
}
</script>

<template>
  <Transition name="modal">
    <div v-if="isVisible" class="modal-overlay" @click="handleOverlayClick">
      <div class="modal-container" @click.stop>
        <div class="error-content">
          <div class="error-icon" :class="{ 'shake-animation': isVisible }">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </div>
          
          <h2 class="error-title">{{ title }}</h2>
          <p class="error-message">{{ message }}</p>
          
          <button class="ok-button" @click="hideError">
            확인
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-container {
  background-color: white;
  border-radius: 8px;
  width: 90%;
  max-width: 320px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.error-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.error-icon {
  width: 48px;
  height: 48px;
  background-color: #fee2e2;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #de3b3b;
  margin-bottom: 16px;
}

/* 흔들림 애니메이션 */
@keyframes shake {
  0%, 100% {
    transform: translateX(0);
  }
  10%, 30%, 50%, 70%, 90% {
    transform: translateX(-4px);
  }
  20%, 40%, 60%, 80% {
    transform: translateX(4px);
  }
}

.shake-animation {
  animation: shake 0.8s cubic-bezier(.36,.07,.19,.97) both;
}

.error-title {
  font-size: 20px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 8px 0;
}

.error-message {
  font-size: 14px;
  color: #6b7280;
  margin: 0 0 24px 0;
  line-height: 1.5;
}

.ok-button {
  background-color: #dd4b4b;
  color: white;
  border: none;
  padding: 12px 0;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  width: 100%;
  font-size: 16px;
  transition: background-color 0.2s;
}

.ok-button:hover {
  background-color: #b91c1c;
}

/* 모달 진입 및 퇴장 애니메이션 */
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

/* 오버레이 페이드 효과 */
.modal-enter-from {
  opacity: 0;
}

.modal-leave-to {
  opacity: 0;
}

/* 모달 슬라이드 업 효과 */
.modal-enter-from .modal-container {
  opacity: 0;
  transform: translateY(100px);
}

.modal-enter-to .modal-container {
  opacity: 1;
  transform: translateY(0);
}

.modal-leave-to .modal-container {
  opacity: 0;
  transform: translateY(100px);
}

/* 모달 컨테이너 트랜지션 */
.modal-container {
  transition: all 0.3s ease;
  transition-delay: 0.1s; /* 오버레이보다 살짝 늦게 시작 */
}
</style>