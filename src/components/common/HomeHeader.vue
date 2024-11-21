<script setup>
import { RouterLink } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useRoute } from 'vue-router' // 추가

const userStore = useUserStore()
const router = useRouter()
const route = useRoute() // 현재 라우트 정보를 가져옴

const isLoggedIn = computed(() => !!userStore.token)

const userProfile = computed(() => ({
  nickname: userStore.nickname,
  profileImg: userStore.profileImg,
}))

const handleLogout = () => {
  userStore.clearUserInfo()
  router.push('/')
}

// 현재 라우트가 홈 페이지('/')인지 확인
const isHomePage = computed(() => route.path === '/')
</script>

<template>
  <header class="header">
    <div class="header-container">
      <!-- Logo Section -->
      <RouterLink to="/" class="logo">
        <img src="@/assets/home-scout-logo.png" alt="Home Scout" width="140" />
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
        <!-- 로그인하지 않은 경우 -->
        <template v-if="!isLoggedIn">
          <RouterLink to="/login" class="btn-login">로그인</RouterLink>
          <RouterLink to="/signup" class="btn-signup">회원가입</RouterLink>
        </template>

        <!-- 로그인한 경우 -->
        <template v-else>
          <div class="user-profile">
            <img :src="userProfile.profileImg" :alt="userProfile.nickname" class="profile-img" />
            <span class="nickname">{{ userProfile.nickname }}</span>
          </div>
          <button @click="handleLogout" class="btn-logout">로그아웃</button>
        </template>
      </div>
    </div>
  </header>
</template>

<style scoped>
.header {
  background-color: #66b56b;
  padding: 0.5rem 0;
  width: 100%;
  color: white;
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
  color: white;
  text-decoration: none;
}

.nav-menu ul {
  display: flex;
  list-style: none;
  gap: 2rem;
  margin: 0;
  padding: 0;
  font-weight: bold;
}

.nav-menu a {
  color: white;
  text-decoration: none;
  font-size: 1rem;
}

.auth-buttons {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.auth-buttons a {
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  font-weight: bold;
}

.btn-signup {
  border: 1px solid white;
  border-radius: 4px;
}

.btn-signup:hover {
  background-color: white;
  color: #66b56b;
  transition: all 0.3s ease;
}

/* 로그인 상태일 때의 스타일 */
.user-profile {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.profile-img {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}

.nickname {
  font-weight: bold;
  color: white;
}

.btn-logout {
  background: none;
  border: 1px solid white;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

.btn-logout:hover {
  background-color: white;
  color: #66b56b;
  transition: all 0.3s ease;
}
</style>
