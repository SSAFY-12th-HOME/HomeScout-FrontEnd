<script setup>
import { confirmPassword, getUserInfo } from '@/api/mypage';
import { onMounted, ref } from 'vue'
import { useErrorStore } from '@/stores/error';
import ErrorModal from '@/components/common/ErrorModal.vue';
import { Lock, Mail, Phone, User } from 'lucide-vue-next';

const errorStore = useErrorStore()

const isVerified = ref(false)
const verificationPassword = ref('')

const formData = ref({
  email: 'testid939@naver.com',
  password: '',
  confirmPassword: '',
  nickname: '닉네임123',
  phone: '010-1234-5678'
})

onMounted(() => {
  getUserInfo(
    ({ data }) => {
      formData.value = data
    },
    (err) => {
      errorStore.showError(err.response.data.message)
    }
  )
})

const handleSubmit = () => {
  console.log('제출된 데이터:', formData.value)
  // 여기에 제출 로직 구현
}

const verifyPassword = () => {
  // 실제 구현시에는 API를 통해 비밀번호 확인
  confirmPassword(
    { password: verificationPassword.value },
    () => {
      isVerified.value = true
    },
    (err) => {
      errorStore.showError(err.response.data.message)
    }
  )
}
</script>

<template>
  <ErrorModal />
  <div class="form-container">
    <!-- 비밀번호 확인 단계 -->
    <div v-if="!isVerified" class="verify-password-container">
      <h1 class="verify-title">비밀번호 확인</h1>
      <p class="verify-subtitle">안전한 사이트 이용을 위해 비밀번호를 입력해주세요.</p>
      
      <form @submit.prevent="verifyPassword" class="verify-form">
        <div class="input-wrapper">
          <input
            type="password"
            v-model="verificationPassword"
            placeholder="비밀번호 입력"
            class="verify-input"
            required
          />
        </div>
        <button type="submit" class="verify-button">
          확인
        </button>
      </form>
    </div>

    <!-- 회원정보 수정 폼 -->
    <div v-else>
      <div class="form-header">
        <h1 class="form-title">회원 정보 수정</h1>
        <p class="form-subtitle">회원님의 정보를 안전하게 수정하실 수 있습니다.</p>
      </div>

      <form @submit.prevent="handleSubmit" class="edit-form">
        <div class="form-group">
          <label>이메일 주소 <span class="required">*</span></label>
          <div class="input-wrapper">
            <span class="input-icon"><Mail size="18" stroke-width="2.25"/></span>
            <input
              type="email"
              v-model="formData.email"
              readonly
              class="form-input with-icon"
            />
          </div>
        </div>

        <div class="form-group">
          <label>비밀번호</label>
          <div class="input-wrapper">
            <span class="input-icon"><Lock size="18" stroke-width="2.25"/></span>
            <input
              type="password"
              v-model="formData.password"
              class="form-input with-icon"
              placeholder="새 비밀번호를 입력하세요"
            />
          </div>
        </div>

        <div class="form-group">
          <label>비밀번호 확인</label>
          <div class="input-wrapper">
            <span class="input-icon"><Lock size="18" stroke-width="2.25"/></span>
            <input
              type="password"
              v-model="formData.confirmPassword"
              class="form-input with-icon"
              placeholder="비밀번호를 한번 더 입력하세요"
            />
          </div>
        </div>

        <div class="form-group">
          <label>닉네임 <span class="required">*</span></label>
          <div class="input-wrapper">
            <span class="input-icon"><User size="20" stroke-width="2.25"/></span>
            <input
              type="text"
              v-model="formData.nickname"
              required
              class="form-input with-icon"
            />
          </div>
        </div>

        <div class="form-group">
          <label>휴대전화 번호 <span class="required">*</span></label>
          <div class="input-wrapper">
            <span class="input-icon"><Phone size="18" stroke-width="2.25"/></span>
            <input
              type="tel"
              v-model="formData.phone"
              required
              class="form-input with-icon"
            />
          </div>
        </div>

        <div class="button-group">
          <button type="submit" class="submit-button">
            정보 수정
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.form-container {
  max-width: 480px;
  margin: 0 auto;
  padding: 24px;
  background-color: #ffffff;
  border-radius: 12px;
}

.verify-password-container {
  text-align: center;
}

.verify-title {
  font-size: 24px;
  color: #333;
  margin-bottom: 12px;
  font-weight: 600;
}

.verify-subtitle {
  color: #666;
  font-size: 14px;
  margin-bottom: 24px;
}

.verify-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.verify-input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 15px;
  box-sizing: border-box;
  transition: all 0.3s ease;
}

.verify-input:focus {
  outline: none;
  border-color: #4CAF50;
  box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.1);
}

.verify-button {
  background-color: #4CAF50;
  color: white;
  padding: 14px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
  width: 100%;
}

.verify-button:hover {
  background-color: #45a049;
  transform: translateY(-1px);
}

.form-header {
  text-align: center;
  margin-bottom: 32px;
}

.form-title {
  font-size: 24px;
  color: #333;
  margin-bottom: 8px;
  font-weight: 600;
}

.form-subtitle {
  color: #666;
  font-size: 14px;
  margin: 0;
}

.edit-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-size: 14px;
  color: #333;
  font-weight: 500;
}

.required {
  color: #ff4444;
  margin-left: 2px;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 12px;
  top: 21px;
  font-size: 16px;
  color: #666;
}

.form-input {
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 15px;
  width: 100%;
  box-sizing: border-box;
  transition: all 0.3s ease;
}

.form-input.with-icon {
  padding-left: 40px;
}

.form-input:focus {
  outline: none;
  border-color: #4CAF50;
  box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.1);
}

.form-input::placeholder {
  color: #aaa;
}

.form-input[readonly] {
  background-color: #f8f8f8;
  cursor: not-allowed;
  border-color: #eee;
}

.button-group {
  display: flex;
  gap: 12px;
  margin-top: 8px;
}

.submit-button, .cancel-button {
  flex: 1;
  padding: 14px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
}

.submit-button {
  background-color: #4CAF50;
  color: white;
}

.submit-button:hover {
  background-color: #45a049;
  transform: translateY(-1px);
}

.cancel-button {
  background-color: #f5f5f5;
  color: #666;
}

.cancel-button:hover {
  background-color: #ebebeb;
  transform: translateY(-1px);
}

@media (max-width: 480px) {
  .form-container {
    padding: 20px;
    margin: 16px;
    border-radius: 8px;
  }
  
  .form-title {
    font-size: 20px;
  }
  
  .form-input {
    padding: 10px;
    padding-left: 36px;
  }
  
  .submit-button, .cancel-button {
    padding: 12px;
  }

  .verify-title {
    font-size: 20px;
  }
  
  .verify-input,
  .verify-button {
    padding: 12px;
  }
}
</style>