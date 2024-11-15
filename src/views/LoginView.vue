<script setup>
import { ref } from 'vue';

// Reactive variables for email and password
const email = ref('');
const password = ref('');

// Handle Login button click event
const handleLogin = () => {
  // Add login logic here (e.g., validation, API call)
  console.log('Login clicked', { email: email.value, password: password.value });
};
</script>

<template>
  <div class="login-container">

    <!-- Login Title -->
    <h1 class="login-title">Login</h1>

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
    <button class="login-button" @click="handleLogin">로그인</button>
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
  background-color: #f5f5f5;
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
