<script setup>
import { ref, onMounted } from 'vue'
import FavoriteProperties from '@/components/mypage/FavoriteProperties.vue'
import MyProperties from '@/components/mypage/MyProperties.vue'
import QuizHistory from '@/components/mypage/QuizHistory.vue'
import ProfileEdit from '@/components/mypage/ProfileEdit.vue'
import { getMypage } from '@/api/mypage'
import { useErrorStore } from '@/stores/error'
import ErrorModal from '@/components/common/ErrorModal.vue'

const errorStore = useErrorStore()

const activeTab = ref('favorite')
const userProfile = ref({})

const fetchUserProfile = async () => {
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
			errorStore.showError('프로필 정보 로딩 실패')
		}
	)
	// const data = await response.json()
	// userProfile.value = data
}

onMounted(() => {
  fetchUserProfile()
})

const tabs = [
  { id: 'favorite', name: '관심 매물' },
  { id: 'my-properties', name: '나의 매물' },
  { id: 'quiz', name: '퀴즈 내역' },
  { id: 'edit', name: '정보 수정' }
]
</script>

<template>
	<ErrorModal />
  <div class="mypage">
    <!-- 프로필 헤더 -->
    <div class="profile-header">
      <div class="profile-info">
        <div class="profile-image-container">
          <img :src="userProfile.profileImg" :alt="userProfile.nickname" class="profile-image">
          <span v-if="userProfile.isBadge" class="badge">🌟</span>
        </div>
        <div class="user-info">
          <h2 class="nickname">{{ userProfile.nickname }}</h2>
          <p class="email">{{ userProfile.email }}</p>
        </div>
      </div>
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
									<span class="exp-value">{{ userProfile.exp }}</span>
									<span class="exp-label">EXP</span>
								</div>
							</div>
						</div>
					</div>
          <div class="total-exp">{{ userProfile.exp }} / {{ userProfile.maxExp }}</div>
        </div>
      </div>
    </div>

    <!-- 탭 메뉴 -->
    <div class="tabs">
      <button 
        v-for="tab in tabs" 
        :key="tab.id"
        :class="['tab-button', { active: activeTab === tab.id }]"
        @click="activeTab = tab.id"
      >
        {{ tab.name }}
      </button>
    </div>

    <!-- 탭 컨텐츠 -->
    <div class="tab-content">
      <FavoriteProperties v-if="activeTab === 'favorite'" />
      <MyProperties v-else-if="activeTab === 'my-properties'" />
      <QuizHistory v-else-if="activeTab === 'quiz'" />
      <ProfileEdit v-else-if="activeTab === 'edit'" />
    </div>
  </div>
</template>

<style scoped>
.mypage {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.profile-header {
  background-color: white;
  padding: 1rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 1rem;
}

.profile-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
  text-align: center;
}

.profile-image-container {
  position: relative;
  margin-bottom: 0.5rem;
}

.profile-image {
  width: 100px;  /* 이미지 크기 약간 키움 */
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
}

.badge {
  position: absolute;
  bottom: 0;
  right: 0;
  font-size: 1.5rem;
}

.user-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.nickname {
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
  margin: 0;
}

.email {
  color: #666;
  font-size: 0.9rem;
  margin: 0;
}

.exp-container {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  position: relative;
  padding: 2rem 0 1rem; /* 말풍선을 위한 상단 여백 추가 */
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
    rgba(255, 255, 255, 0.2),
    transparent
  );
  animation: shimmer 2s infinite;
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

.tabs {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.tab-button {
  padding: 0.75rem 1.5rem;
  border: none;
  background: none;
  color: #666;
  font-weight: bold;
  cursor: pointer;
  border-bottom: 2px solid transparent;
}

.tab-button.active {
  color: #66b56b;
  border-bottom-color: #66b56b;
}

.tab-content {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 1rem;
}
</style>