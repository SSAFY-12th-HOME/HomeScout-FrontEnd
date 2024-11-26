<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user.js'
import { findPassword, login } from '@/api/user'

import ErrorModal from '@/components/common/ErrorModal.vue'
import SuccessModal from '@/components/common/SuccessModal.vue'
import PulseLoader from 'vue-spinner/src/PulseLoader.vue'
import { useErrorStore } from '@/stores/error'
import { useSuccessStore } from '@/stores/success'
import { Lock, Mail } from 'lucide-vue-next';

const errorStore = useErrorStore()
const successStore = useSuccessStore()
const userStore = useUserStore()

const router = useRouter()
const route = useRoute()

// Reactive variables for email and password
const email = ref('')
const password = ref('')
const isLoading = ref(false)

// Handle Login button click event
const handleLogin = async () => {
  // Add login logic here (e.g., validation, API call)
  isLoading.value = true

  login(
    { email: email.value, password: password.value },
    ({ data }) => {
      console.log(data)

      // Pinia store에 유저 정보 저장
      userStore.setUserInfo({
        token: data.token,
        userId: data.userId,
        email: data.email,
        nickname: data.nickname,
        profileImg: data.profileImg,
        role: data.role,
      })

      // console.log(route.query.redirect)
      // 로그인 성공 후 메인 페이지로 이동
      if (route.query.redirect === undefined) {
        router.push('/')
      } else {
        router.push(route.query.redirect)
      }
    },
    (err) => {
      errorStore.showError(err.response.data.message, '로그인 오류')
    },
  )

  isLoading.value = false
}

// 비밀번호 찾기
const isModalOpen = ref(false)
const modalEmail = ref('')
const modalPhone = ref('')

const emailError = ref('')
const phoneError = ref('')

const openModal = () => {
  isModalOpen.value = true
  modalEmail.value = ''
  modalPhone.value = ''
}

const closeModal = () => {
  isModalOpen.value = false
}

const handleSubmit = async () => {
  isLoading.value = true
  closeModal()
  findPassword(
    { email: modalEmail.value, phone: modalPhone.value },
    () => {
      successStore.showSuccess('임시 비밀번호가 이메일로 전송되었습니다.')
      isLoading.value = false
    },
    (err) => {
      errorStore.showError(err.response.data.message)
      isLoading.value = false
    }
  )
}

// 이메일 유효성 검사
const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}

// 전화번호 포맷팅
const formatPhoneNumber = () => {
  let cleaned = modalPhone.value.replace(/\D/g, '')
  if (cleaned.length > 11) cleaned = cleaned.slice(0, 11)

  if (cleaned.length >= 10) {
    modalPhone.value = cleaned.replace(/(\d{3})(\d{3,4})(\d{4})/, '$1-$2-$3')
  }
}

// 전화번호 유효성 검사
const validatePhone = (phone) => {
  const cleaned = phone.replace(/\D/g, '')
  return cleaned.length === 11 || cleaned.length === 10
}

// 폼 유효성 검사
const isValid = computed(() => {
  const isEmailValid = validateEmail(modalEmail.value)
  const isPhoneValid = validatePhone(modalPhone.value)
  return isEmailValid && isPhoneValid
})
</script>

<template>
  <ErrorModal />
  <SuccessModal />
  <div class="loading" v-if="isLoading">
    <PulseLoader aria-label="Loading Spinner"/>
  </div>
  <div class="login-container">
    <!-- Login Title -->
    <h1 class="login-title">Login</h1>

    <!-- Email Input -->
    <div class="input-container">
      <span class="input-icon"><Mail size="18" stroke-width="2.25"/></span>
      <input
        v-model="email"
        type="email"
        placeholder="이메일을 입력하세요."
        class="input-box"
      />
    </div>

    <!-- Password Input -->
    <div class="input-container">
      <span class="input-icon"><Lock size="18" stroke-width="2.25"/></span>
      <input
        v-model="password"
        type="password"
        placeholder="비밀번호를 입력하세요."
        class="input-box"
        @keyup.enter="handleLogin"
      />
    </div>

    <div class="find-password-container">
      <button class="find-password-button" @click="openModal">비밀번호 찾기</button>
    </div>

    <!-- Login Button -->
    <button class="login-button" :disabled="isLoading" @click="handleLogin">
      {{ isLoading ? '로그인 중...' : '로그인' }}
    </button>

    <!-- Password Rest Modal -->
    <div v-if="isModalOpen" class="modal-overlay">
      <div class="modal-content">
        <h2 class="modal-title">비밀번호 찾기</h2>

        <form @submit.prevent="handleSubmit" class="modal-form">
          <!-- 이메일 입력 -->
          <div class="form-group">
            <label>이메일</label>
            <input
              v-model="modalEmail"
              type="email"
              required
              placeholder="이메일을 입력하세요"
            >
            <p v-if="emailError" class="field-error">{{ emailError }}</p>
          </div>

          <!-- 전화번호 입력 -->
          <div class="form-group">
            <label>전화번호</label>
            <input
              v-model="modalPhone"
              type="tel"
              required
              placeholder="전화번호를 입력하세요"
              @input="formatPhoneNumber"
            >
            <p v-if="phoneError" class="field-error">{{ phoneError }}</p>
          </div>

          <!-- 에러 메시지 -->
          <p v-if="error" class="error-message">{{ error }}</p>

          <!-- 버튼 그룹 -->
          <div class="button-group">
            <button
              type="button"
              @click="closeModal"
              class="cancel-btn"
            >
              취소
            </button>
            <button
              type="submit"
              class="submit-btn"
              :disabled="isLoading || !isValid"
            >
              {{ isLoading ? '처리중...' : '확인' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Overall container */
.login-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 80vh;
  background-color: white;
}

/* Logo styling */
.logo {
  position: absolute;
  top: 42px;
  left: 72px;
  width: 100px; /* Adjust size as needed */
}

/* Login title styling */
.login-title {
  font-size: 80px;
  color: #66b56b;
  margin-bottom: 40px;
  text-align: center;
  font-weight: bold;
}

/* Container for inputs and icons */
.input-container {
  position: relative;
  margin-bottom: 15px;
  width: 320px;
}

/* Input field styling */
.input-box {
  width: 100%;
  padding: 12px 40px; /* Space for icons */
  font-size: 16px;
  border: 1px solid #757575;
  border-radius: 4px;
  box-sizing: border-box;
}

/* Input icon styling */
.input-icon {
  position: absolute;
  left: 10px;
  top: 47%;
  transform: translateY(-50%);
}

/* Container to align find-password button to the right */
.find-password-container {
  width: 320px;
  text-align: right; /* Aligns the button to the right */
}

/* Find password button styling */
.find-password-button {
  background: none;
  border: none;
  color: #757575;
  font-size: 14px;
  margin-bottom: 20px;
  cursor: pointer;
  text-decoration: underline;
}

/* Login button styling */
.login-button {
  width: 320px;
  padding: 12px;
  background-color: #66b56b;
  color: white;
  border: 0px solid #757575;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.login-button:hover {
  background-color: #57a260;
}
h1 {
  margin-top: 0;
}

/* 모달 스타일 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 400px;
  max-width: 90vw;
  animation: modal-appear 0.3s ease-out;
}

@keyframes modal-appear {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-title {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 24px;
  color: #1f2937;
}

.modal-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-weight: 500;
  color: #374151;
}

.form-group input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  transition: border-color 0.2s ease;
}

.form-group input:focus {
  outline: none;
  border-color: #61ce68;
  box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.1);
}

.field-error {
  color: #e04b4b;
  font-size: 14px;
  margin-top: 4px;
}

.error-message {
  color: #e04b4b;
  font-size: 14px;
  padding: 8px;
  background-color: #fee2e2;
  border-radius: 4px;
}

.button-group {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 8px;
}

.cancel-btn,
.submit-btn {
  padding: 8px 16px;
  border-radius: 4px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.cancel-btn {
  color: #4b5563;
  border: 1px solid #d1d5db;
  background-color: white;
}

.cancel-btn:hover {
  background-color: #f3f4f6;
}

.submit-btn {
  background-color: #66b56b;
  color: white;
  border: none;
}

.submit-btn:hover:not(:disabled) {
  background-color: #57a260;
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  background-color: #8cb190;
}

.loading {
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
</style>

<style>
body {
  margin: 0;
}
</style>
