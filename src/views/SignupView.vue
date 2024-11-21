<script setup>
import {
  sendVerifyCode,
  checkVerifyCode,
  checkDuplicationEmail,
  checkDuplicationNickname,
  signUp,
} from '@/api/user'
import ErrorModal from '@/components/common/ErrorModal.vue'
import { ref, computed } from 'vue'
import { useErrorStore } from '@/stores/error'
import { useSuccessStore } from '@/stores/success'
import PulseLoader from 'vue-spinner/src/PulseLoader.vue'
import SuccessModal from '@/components/common/SuccessModal.vue';
import { KeyRound, Lock, Mail, Phone, ScrollText, User } from 'lucide-vue-next';

const errorStore = useErrorStore()
const successStore = useSuccessStore()

// Form fields
const email = ref('')
const verificationCode = ref('')
const password = ref('')
const confirmPassword = ref('')
const nickname = ref('')
const phoneNumber = ref('')

// 이메일 관련 상태 추가
const isEmailValid = ref(false)
const isEmailAvailable = ref(false)
const emailMessage = ref('')

const userType = ref('일반') // 새로 추가: 회원 유형 선택
const brokerLicense = ref('') // 새로 추가: 공인중개사 자격증 번호

// 자격증 번호 유효성 검사
const isBrokerLicenseValid = ref(false)
const brokerLicenseMessage = ref('')

// UI state
const showModal = ref(false)
const modalMessage = ref('')
const showVerificationField = ref(false)
const isVerificationSent = ref(false)
const isVerified = ref(false)
const verificationMessage = ref('')
const isNicknameAvailable = ref(false)
const nicknameMessage = ref('')
const isPasswordValid = ref(false)
const isValidPhoneNumber = ref(false)
const isLoading = ref(false)

// Debounce function
const debounce = (fn, delay) => {
  let timeoutId
  return (...args) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn(...args), delay)
  }
}

// 이메일 유효성 검사 및 중복 확인
const validateEmail = debounce(async () => {
  // 기본 이메일 형식 검사
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  isEmailValid.value = emailRegex.test(email.value)

  if (!email.value) {
    isEmailValid.value = false
    isEmailAvailable.value = false
    emailMessage.value = ''
    return
  }

  if (!isEmailValid.value) {
    emailMessage.value = '올바른 이메일 형식이 아닙니다.'
    isEmailAvailable.value = false
    return
  }

  await new Promise((resolve) => setTimeout(resolve, 300))

  // 이메일 중복 확인 API 호출 시뮬레이션
  checkDuplicationEmail(
    { email: email.value },
    () => {
      isEmailAvailable.value = true
      emailMessage.value = '사용 가능한 이메일입니다.'
    },
    () => {
      isEmailAvailable.value = false
      emailMessage.value = '이미 사용 중인 이메일입니다.'
    },
  )
}, 300)

const isFormValid = computed(() => {
  const baseValidation =
    email.value &&
    isEmailValid.value &&
    isEmailAvailable.value &&
    isVerified.value &&
    password.value &&
    isPasswordValid.value &&
    confirmPassword.value &&
    passwordsMatch.value &&
    nickname.value &&
    isNicknameAvailable.value &&
    phoneNumber.value &&
    isValidPhoneNumber.value

  // 공인중개사인 경우 추가 검증
  if (userType.value === '공인중개사') {
    return baseValidation && brokerLicense.value && isBrokerLicenseValid.value
  }

  return baseValidation
})

// Password validation function
const validatePassword = debounce(async () => {
  if (!password.value) {
    isPasswordValid.value = false
    return
  }

  // 비밀번호 유효성 검사 정규식
  const hasUpperCase = /[A-Z]/.test(password.value)
  const hasLowerCase = /[a-z]/.test(password.value)
  const hasNumbers = /\d/.test(password.value)
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password.value)

  // 조합 조건 체크 (2가지 이상)
  const conditions = [hasUpperCase || hasLowerCase, hasNumbers, hasSpecialChar]
  const validCombination = conditions.filter((condition) => condition).length >= 2

  try {
    // 비동기 검증 시뮬레이션
    isPasswordValid.value = password.value.length >= 8 && validCombination
  } catch (error) {
    isPasswordValid.value = false
  }
}, 0)

// Send verification code
const sendVerificationCode = async () => {
  isLoading.value = true

  sendVerifyCode(
    { email: email.value },
    () => {
      showVerificationField.value = true
      isVerificationSent.value = true
      modalMessage.value = '인증 코드가 이메일로 전송되었습니다.'
      successStore.showSuccess(modalMessage.value)
      isLoading.value = false
    },
    (err) => {
      modalMessage.value = '인증 코드 전송에 실패했습니다.'
      errorStore.showError(err.response.data.message)
      isLoading.value = false
    },
  )
}

// Verify code
const verifyCode = debounce(async () => {
  checkVerifyCode(
    { email: email.value, emailCode: verificationCode.value },
    () => {
      isVerified.value = true
      verificationMessage.value = '인증이 완료되었습니다.'
    },
    () => {
      isVerified.value = false
      verificationMessage.value = '잘못된 인증 코드입니다.'
    },
  )
}, 300)

// Check nickname availability
const checkNickname = debounce(async () => {
  if (nickname.value.length >= 2) {
    checkDuplicationNickname(
      { nickname: nickname.value },
      () => {
        isNicknameAvailable.value = true
        nicknameMessage.value = '사용 가능한 닉네임입니다.'
      },
      () => {
        isNicknameAvailable.value = false
        nicknameMessage.value = '이미 사용 중인 닉네임입니다.'
      },
    )
  } else {
    isNicknameAvailable.value = false
    nicknameMessage.value = '닉네임은 2글자 이상이어야 합니다.'
  }
}, 300)

// 닉네임 실시간 업데이트 (v-model 대신)
const updateNickname = ({ target: { value } }) => {
  nickname.value = value
  checkNickname()
}

// Password matching
const passwordsMatch = computed(() => {
  return password.value && confirmPassword.value && password.value === confirmPassword.value
})

// Form submission 수정
const handleSubmit = async () => {
  if (!isFormValid.value) {
    modalMessage.value = '모든 항목을 입력해주세요.'
    showModal.value = true
    return
  }

  isLoading.value = true

  let payload = {
    email: email.value,
    emailCode: verificationCode.value,
    password: password.value,
    passwordConfirm: confirmPassword.value,
    nickname: nickname.value,
    phone: phoneNumber.value,
    role: userType.value,
  }

  await new Promise((resolve) => setTimeout(resolve, 500))
  signUp(
    payload,
    () => {
      isLoading.value = false
      modalMessage.value = '회원가입이 완료되었습니다.'
      successStore.showSuccess(modalMessage.value, '/')
    },
    () => {
      isLoading.value = false
      modalMessage.value = '회원가입에 실패했습니다.'
      errorStore.showError(modalMessage.value)
    },
  )
}

// 전화번호 포맷팅 함수
const formatPhoneNumber = (event) => {
  // 입력된 값에서 숫자만 추출
  let cleaned = event.target.value.replace(/\D/g, '')

  // 숫자만 입력되도록 제한
  if (cleaned.length > 11) {
    cleaned = cleaned.slice(0, 11)
  }

  // 전화번호 형식에 맞게 포맷팅
  let formatted = ''
  if (cleaned.length >= 3) {
    formatted += cleaned.slice(0, 3)
    if (cleaned.length >= 7) {
      formatted += '-' + cleaned.slice(3, 7) + '-' + cleaned.slice(7)
    } else if (cleaned.length >= 4) {
      formatted += '-' + cleaned.slice(3)
    }
  } else {
    formatted = cleaned
  }

  // 전화번호 유효성 검사
  // 010으로 시작하고 총 11자리인지 확인
  const phoneRegex = /^010\d{8}$/
  isValidPhoneNumber.value = phoneRegex.test(cleaned)

  // v-model 값 업데이트
  phoneNumber.value = formatted
}

// 자격증 번호 포맷팅 함수
const formatBrokerLicense = (event) => {
  // 입력된 값에서 숫자만 추출
  let cleaned = event.target.value.replace(/\D/g, '')

  // 11자리로 제한
  if (cleaned.length > 11) {
    cleaned = cleaned.slice(0, 11)
  }

  // 포맷팅된 값 생성 (XX-XXXX-XXXXX)
  let formatted = ''
  if (cleaned.length >= 2) {
    formatted += cleaned.slice(0, 2)
    if (cleaned.length >= 6) {
      formatted += '-' + cleaned.slice(2, 6)
      if (cleaned.length >= 7) {
        formatted += '-' + cleaned.slice(6)
      }
    } else if (cleaned.length >= 2) {
      formatted += '-' + cleaned.slice(2)
    }
  } else {
    formatted = cleaned
  }

  // 자격증 번호 유효성 검사 (11자리)
  const licenseRegex = /^\d{11}$/
  isBrokerLicenseValid.value = licenseRegex.test(cleaned)

  if (isBrokerLicenseValid.value) {
    brokerLicenseMessage.value = '유효한 자격증 번호 형식입니다.'
  } else {
    brokerLicenseMessage.value =
      cleaned.length === 11
        ? '유효하지 않은 자격증 번호입니다.'
        : '자격증 번호 11자리를 입력해주세요.'
  }

  // v-model 값 업데이트
  brokerLicense.value = formatted
}
</script>

<template>
  <div class="signup-container">
    <div class="loading" v-if="isLoading">
      <PulseLoader />
    </div>

    <!-- Main Title -->
    <h1 class="main-title">Register With Us</h1>

    <SuccessModal />
    <ErrorModal />

    <!-- Form Section -->
    <form class="signup-form" @submit.prevent="handleSubmit">
      <!-- User Type Selection Tabs -->
      <div class="user-type-tabs">
        <button
          type="button"
          :class="['tab-button', { active: userType === '일반' }]"
          @click="userType = '일반'"
        >
          일반 회원
        </button>
        <button
          type="button"
          :class="['tab-button', { active: userType === '공인중개사' }]"
          @click="userType = '공인중개사'"
        >
          공인중개사
        </button>
      </div>
      <!-- Broker License Input -->
      <template v-if="userType === '공인중개사'">
        <div class="form-group">
          <div class="input-wrapper">
            <span class="input-icon"><ScrollText size="18" stroke-width="2.25"/></span>
            <input
              type="text"
              v-model="brokerLicense"
              placeholder="공인중개사 자격증 번호를 입력하세요"
              class="input-field"
              :class="{
                'input-success': isBrokerLicenseValid && brokerLicense,
                'input-error': !isBrokerLicenseValid && brokerLicense,
              }"
              :disabled="isBrokerLicenseValid && brokerLicense"
              @input="formatBrokerLicense"
              maxlength="13"
            />
          </div>
          <p
            class="license-status"
            v-if="brokerLicense"
            :class="{ success: isBrokerLicenseValid, error: !isBrokerLicenseValid }"
          >
            {{ brokerLicenseMessage }}
          </p>
        </div>
      </template>
      <!-- Email Field -->
      <div class="form-group">
        <div class="input-wrapper">
          <span class="input-icon"><Mail size="18" stroke-width="2.25"/></span>
          <input
            type="email"
            v-model="email"
            placeholder="이메일을 입력하세요"
            class="input-field"
            :class="{
              'input-success': isEmailValid && isEmailAvailable && email,
              'input-error': (!isEmailValid || !isEmailAvailable) && email,
            }"
            @input="validateEmail"
            :disabled="isVerificationSent"
          />
          <button
            type="button"
            class="verify-button"
            @click="sendVerificationCode"
            :disabled="isVerificationSent || !isEmailValid || !isEmailAvailable"
          >
            {{ isVerificationSent ? '전송됨' : '인증하기' }}
          </button>
        </div>
        <p
          class="email-status"
          v-if="email"
          :class="{
            error: (!isEmailValid || !isEmailAvailable) && email,
            success: isEmailValid && isEmailAvailable && email,
          }"
        >
          {{ emailMessage }}
        </p>
      </div>

      <!-- Verification Code Field -->
      <div class="form-group" v-if="showVerificationField">
        <div class="input-wrapper">
          <span class="input-icon"><KeyRound size="18" stroke-width="2.25"/></span>
          <input
            type="text"
            v-model="verificationCode"
            placeholder="인증번호를 입력하세요"
            class="input-field"
            :class="{
              'input-success': isVerified && verificationCode,
              'input-error': !isVerified && verificationCode,
            }"
            :disabled="isVerified"
            @input="verifyCode"
          />
        </div>
        <p
          class="verification-status"
          v-if="verificationCode"
          :class="{ success: isVerified, error: !isVerified && verificationCode }"
        >
          {{ verificationMessage }}
        </p>
      </div>

      <!-- Password Field -->
      <div class="form-group">
        <div class="input-wrapper">
          <span class="input-icon"><Lock size="18" stroke-width="2.25"/></span>
          <input
            type="password"
            v-model="password"
            placeholder="비밀번호를 입력하세요"
            class="input-field"
            :class="{
              'input-success': isPasswordValid && password,
              'input-error': !isPasswordValid && password,
            }"
            @input="validatePassword"
          />
        </div>
        <p
          class="password-hint"
          :class="{ success: isPasswordValid, error: !isPasswordValid && password }"
        >
          영문, 숫자, 특수문자 중 2종류 이상을 조합하여 최소 8자리 이상
        </p>
      </div>

      <!-- Confirm Password Field -->
      <div class="form-group">
        <div class="input-wrapper">
          <span class="input-icon"><Lock size="18" stroke-width="2.25"/></span>
          <input
            type="password"
            v-model="confirmPassword"
            placeholder="비밀번호를 다시 한번 입력해주세요"
            class="input-field"
            :class="{
              'input-success': passwordsMatch && confirmPassword,
              'input-error': !passwordsMatch && confirmPassword,
            }"
          />
        </div>
        <p
          class="password-match"
          v-if="confirmPassword"
          :class="{ success: passwordsMatch, error: !passwordsMatch }"
        >
          {{ passwordsMatch ? '비밀번호가 일치합니다.' : '비밀번호가 일치하지 않습니다.' }}
        </p>
      </div>

      <!-- Nickname Field -->
      <div class="form-group">
        <div class="input-wrapper">
          <span class="input-icon"><User size="20" stroke-width="2.25"/></span>
          <input
            type="text"
            v-model="nickname"
            placeholder="닉네임을 입력해주세요"
            class="input-field"
            :class="{
              'input-success': isNicknameAvailable && nickname,
              'input-error': !isNicknameAvailable && nickname,
            }"
            @input="updateNickname"
          />
        </div>
        <p
          class="nickname-status"
          v-if="nickname"
          :class="{ success: isNicknameAvailable, error: !isNicknameAvailable }"
        >
          {{ nicknameMessage }}
        </p>
      </div>

      <!-- Phone Number Field -->
      <div class="form-group">
        <div class="input-wrapper">
          <span class="input-icon"><Phone size="18" stroke-width="2.25"/></span>
          <input
            type="tel"
            v-model="phoneNumber"
            placeholder="휴대폰 번호를 입력해주세요"
            class="input-field"
            :class="{
              'input-success': phoneNumber && isValidPhoneNumber,
              'input-error': phoneNumber && !isValidPhoneNumber,
            }"
            @input="formatPhoneNumber"
            maxlength="13"
          />
        </div>
        <p
          class="phone-status"
          v-if="phoneNumber && !isValidPhoneNumber"
          :class="{ error: !isValidPhoneNumber }"
        >
          올바른 휴대폰 번호를 입력해주세요.
        </p>
      </div>

      <!-- Sign Up Button -->
      <button type="submit" class="signup-button" :disabled="!isFormValid">회원가입</button>
    </form>

    <!-- Modal -->
    <div class="modal" v-if="showModal">
      <div class="modal-content">
        <p>{{ modalMessage }}</p>
        <button @click="showModal = false">확인</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* General Layout */
.signup-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  padding: 20px;
  font-family: Arial, sans-serif;
  overflow-y: auto;
}

/* Logo Section */
.logo {
  top: 42px;
  left: 72px;
  position: absolute;
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.logo img {
  width: 187px;
  height: 110px;
  margin-left: 5px;
}

/* Main Title */
.main-title {
  text-align: center;
  color: #66b56b;
  font-size: 60px;
  font-weight: bold;
  margin-bottom: 30px;
}

.signup-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 400px;
}

/* Form Fields */
.form-group {
  margin-bottom: 15px;
  width: 100%;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
}

.input-field {
  width: 100%;
  height: 58px;
  padding: 10px 40px;
  border: 1px solid #757575;
  border-radius: 4px;
  font-size: 14px;
}

input::placeholder {
  color: #aaa;
}

/* Verify Button */
.verify-button {
  position: absolute;
  right: -160px;
  height: 58px;
  width: 140px;
  font-size: 22px;
  background-color: #66b56b;
  color: white;
  border: 0px solid #757575;
  cursor: pointer;
  border-radius: 4px;
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
}

.verify-button:hover {
  background-color: #5aa75f;
}

/* Sign-Up Button */
.signup-button {
  width: 100%;
  height: 60px;
  background-color: #66b56b;
  color: white;
  border: 0px solid #757575;
  padding: 10px;
  font-size: 28px;
  cursor: pointer;
  border-radius: 4px;
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
  margin-top: 10px;
}

.signup-button:hover {
  background-color: #5aa75f;
}

/* Password Hint */
.password-hint {
  text-align: center;
  margin-top: 10px;
  margin-bottom: 0px;
  font-size: 14px;
  color: #757575;
  width: 100%;
}

.input-success {
  border-color: #66b56b !important;
  border-width: 2px;
}

.input-error {
  border-color: #ff4444 !important;
  border-width: 2px;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 4px;
  text-align: center;
}

.modal-content button {
  background-color: #66b56b;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
}

.verification-status,
.password-match,
.nickname-status {
  margin-top: 5px;
  font-size: 14px;
}

.success {
  color: #66b56b;
  margin-bottom: 0;
}

.error {
  color: #ff4444;
  margin-bottom: 0;
}

.verify-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.signup-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.email-status {
  margin-top: 5px;
  font-size: 14px;
}
</style>

<style>
body {
  margin: 0;
  min-height: 100vh;
}

#app {
  min-height: 100vh;
}

input:focus {
  outline: none;
}

.phone-status {
  margin-top: 5px;
  font-size: 14px;
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

.user-type-tabs {
  display: flex;
  width: 100%;
  max-width: 400px;
  margin-bottom: 20px;
  border-radius: 4px;
  overflow: hidden;
}

.tab-button {
  flex: 1;
  padding: 15px 0;
  border: none;
  background-color: #f5f5f5;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  color: #757575;
  transition: all 0.3s ease;
}

.tab-button.active {
  background-color: #66b56b;
  color: white;
}

.tab-button:hover:not(.active) {
  background-color: #e0e0e0;
}

/* Input icon styling */
.input-icon {
  position: absolute;
  left: 13px;
  top: 47%;
  transform: translateY(-50%);
}
</style>
