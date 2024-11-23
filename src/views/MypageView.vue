<script setup>
import { ref, onMounted } from 'vue'
import FavoriteProperties from '@/components/mypage/FavoriteProperties.vue'
import MyProperties from '@/components/mypage/MyProperties.vue'
import QuizHistory from '@/components/mypage/QuizHistory.vue'
import ProfileEdit from '@/components/mypage/ProfileEdit.vue'
import { getMypage } from '@/api/mypage'
import { useErrorStore } from '@/stores/error'
import ErrorModal from '@/components/common/ErrorModal.vue'
import PulseLoader from 'vue-spinner/src/PulseLoader.vue'
import { uploadImage } from '@/api/mypage'
import { useUserStore } from '@/stores/user'

const errorStore = useErrorStore()
const userStore = useUserStore()

const activeTab = ref('favorite')
const userProfile = ref({})
const fileInput = ref(null) // 파일 input 요소 참조
const isUploading = ref(false) // 업로드 상태 관리

const tabs = ref([
  ])

const fetchUserProfile = async () => {
  if(userStore.role === '공인중개사') {
    tabs.value = [
      { id: 'favorite', name: '관심 매물' },
      { id: 'my-properties', name: '나의 매물' },
      { id: 'quiz', name: '내가 만든 퀴즈' },
      { id: 'edit', name: '정보 수정' },
    ]
  } else {
    tabs.value = [
      { id: 'favorite', name: '관심 매물' },
      { id: 'edit', name: '정보 수정' },
    ]
  }


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

// 파일 선택 시 실행되는 함수
const handleFileChange = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  // 파일 유효성 검사
  if (!file.type.includes('image/')) {
    console.log('이미지 파일만 업로드할 수 있습니다.')
    errorStore.showError('이미지 파일만 업로드할 수 있습니다.')
    return
  }

  // 파일 크기 제한 (예: 5MB)
  if (file.size > 5 * 1024 * 1024) {
    console.log('파일 크기는 5MB 이하여야 합니다.')
    errorStore.showError('파일 크기는 5MB 이하여야 합니다.')
    return
  }

  isUploading.value = true
  const formData = new FormData()
  formData.append('file', file)

  uploadImage(
    formData,
    ({ data }) => {
      // 스토어와 로컬 상태 업데이트
      userProfile.value.profileImg = data.imgUrl
      userStore.profileImg = data.imgUrl
      isUploading.value = false
      // 파일 input 초기화
      if (fileInput.value) {
        fileInput.value.value = ''
      }
    },
    (error) => {
      console.log(error)
      errorStore.showError('이미지 업로드에 실패했습니다.')
      isUploading.value = false
      // 파일 input 초기화
      if (fileInput.value) {
        fileInput.value.value = ''
      }
    }
  )
}
</script>

<template>
	<ErrorModal />
        
  <div class="mypage">
    <div class="loading" v-if="isUploading">
      <PulseLoader/>
    </div>
    <!-- 프로필 헤더 -->
    <div class="profile-header">
      <!-- 숨겨진 파일 input -->
      <input
        ref="fileInput"
        type="file"
        accept="image/*"
        class="hidden"
        @change="handleFileChange"
      />
        
      <div class="profile-section">
        <span v-if="userProfile.isBadge" class="badge">
          <img src="/src/assets/badge.png" width="45">
        </span>
        <div 
          class="profile-image-container"
          @click="fileInput.click()"
          :class="{ 'uploading': isUploading }"
        >
        <img 
          :src="userProfile.profileImg" 
          :alt="userProfile.nickname" 
          class="profile-image"
        />
        <div class="image-overlay">
          <span class="upload-text">이미지 변경</span>
        </div>
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
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

/* 새로 추가된 profile-section */
.profile-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 1rem; /* exp-container와의 간격 확보 */
}

.profile-image-container {
  width: 120px;
  height: 120px;
  position: relative;
  cursor: pointer;
  border-radius: 50%;
  overflow: hidden;
}

.profile-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.badge {
  position: absolute;
  top: 17%;
  left: 44.5%;
  font-size: 1.5rem;
  z-index: 5;
}

/* 이미지 오버레이 관련 스타일 */
.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.profile-image-container:hover .image-overlay {
  opacity: 1;
}

.upload-text {
  color: white;
  font-size: 0.85rem;
  font-weight: 500;
}

/* 유저 정보 스타일 */
.user-info {
  text-align: center;
  margin-top: 1rem;
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
  margin: 0.25rem 0 0 0;
}

/* 경험치 바 관련 스타일 */
.exp-container {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  position: relative;
  padding: 2rem 0 1rem;
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

/* 탭 관련 스타일 */
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
  padding: 2rem;
}

.hidden {
  display: none;
}

.profile-info {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
}

.profile-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.profile-image-container {
  width: 120px;  /* 크기 고정 */
  height: 120px; /* 크기 고정 */
  position: relative;
  cursor: pointer;
  border-radius: 50%;
  overflow: hidden;
  margin: 0 auto; /* 중앙 정렬을 위해 추가 */
}

.profile-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-info {
  text-align: center;
  margin-top: 0.5rem;
}

.nickname {
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0;
}

.email {
  color: #666;
  font-size: 0.9rem;
  margin: 0.25rem 0 0 0;
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.profile-image-container:hover .image-overlay {
  opacity: 1;
}

.upload-text {
  color: white;
  font-size: 0.85rem;
  font-weight: 500;
}

.uploading {
  pointer-events: none;
  opacity: 0.7;
}
</style>