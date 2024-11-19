<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user.js'
import { login } from '@/api/user'

import ErrorModal from '@/components/common/ErrorModal.vue'
import { useErrorStore } from '@/stores/error'

const errorStore = useErrorStore();

const router = useRouter();
const userStore = useUserStore();

// Reactive variables for email and password
const email = ref('');
const password = ref('');
const isLoading = ref(false);

// Handle Login button click event
const handleLogin = async () => {
  // Add login logic here (e.g., validation, API call)
  console.log('Login clicked', { email: email.value, password: password.value });
  isLoading.value = true
  
  login(
    { email: email.value, password: password.value },
    ({ data }) => {
      console.log(data);
  
      // Pinia store에 유저 정보 저장
      userStore.setUserInfo({
        token: data.token,
        userId: data.userId,
        email: data.email,
        nickname: data.nickname,
        profileImg: data.profileImg,
        role: data.role
      })
  
      // 로그인 성공 후 메인 페이지로 이동
      router.push('/')
    },
    (err) => {
      errorStore.showError(err.response.data.message, '로그인 오류')
    }
  )

  isLoading.value = false
};
</script>

<template>
  <ErrorModal />
  <div class="login-container">

    <!-- SignUp Title -->
    <h1 class="login-title">Sign Up</h1>

    <!-- Email Input -->
    <div class="input-container">
      <img src="@/assets/EmailIcon.svg" alt="Email Icon" class="input-icon" />
      <input
        v-model="email"
        type="email"
        placeholder="이메일을 입력하세요."
        class="input-box"
      />
    </div>

    <!-- Password Input -->
    <div class="input-container">
      <img src="@/assets/PasswordIcon.svg" alt="Password Icon" class="input-icon" />
      <input
        v-model="password"
        type="password"
        placeholder="비밀번호를 입력하세요."
        class="input-box"
      />
    </div>

    <div class="find-password-container">
      <button class="find-password-button">비밀번호 찾기</button>
    </div>

    <!-- Login Button -->
    <button class="login-button" :disabled="isLoading" @click="handleLogin">
      {{ isLoading ? '로그인 중...' : '로그인' }}
    </button>
  </div>
</template>

<style scoped>
/* Overall container */
.login-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
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
  font-size: 150px;
  color: #66b56b;
  margin-bottom: 20px;
  text-align: center;
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
  top: 50%;
  transform: translateY(-50%);
  width: 20px; /* Adjust icon size */
  height: 20px;
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
  border: 1px solid #757575;
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

</style>

<style>
body {
  margin: 0;
}
</style>
