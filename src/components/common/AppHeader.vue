<script>
import { RouterLink, RouterView } from 'vue-router'
export default {
  name: 'HeaderComponent',
}
</script>

<template>
  <header class="header">
    <div class="header-container">
      <!-- Logo Section -->
      <RouterLink to="/" class="logo">
        <img src="@/assets/home-scout-logo-green.png" alt="Home Scout" width=150 />
      </RouterLink>
      <!-- Navigation Menu -->
      <nav class="nav-menu">
        <ul>
          <li><RouterLink to="/notice">공지사항</RouterLink></li>
          <li><RouterLink to="/map">지도보기</RouterLink></li>
          <li><RouterLink to="/analysis">전세분석</RouterLink></li>
          <li><RouterLink to="/quiz">퀴즈풀기</RouterLink></li>
        </ul>
      </nav>

      <!-- Auth Buttons -->
      <div class="auth-buttons">
        <RouterLink to="/login" class="btn-login">로그인</RouterLink>
        <RouterLink to="/signup" class="btn-signup">회원가입</RouterLink>
      </div>
    </div>
  </header>
</template>

<style scoped>
.header {
  background-color: #f5f5f5;
  padding: 1rem 0;
  width: 100%;
  color: #66b56b;
}

.header-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 0;
}

.logo {
  color: #66b56b;
  text-decoration: none;
}

.nav-menu ul {
  display: flex;
  list-style: none;
  gap: 2rem;
  margin: 0;
  padding: 0;
}

.nav-menu a {
  color: #66b56b;
  text-decoration: none;
  font-size: 1rem;
}

.auth-buttons {
  display: flex;
  gap: 1rem;
}

.auth-buttons a {
  color: #66b56b;
  text-decoration: none;
  padding: 0.5rem 1rem;
}

.btn-signup {
  border: 1px solid #66b56b;
  border-radius: 4px;
}
</style>
