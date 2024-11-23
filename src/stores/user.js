import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUserStore = defineStore(
  'user',
  () => {
    const token = ref(null)
    const userId = ref(null)
    const email = ref(null)
    const nickname = ref(null)
    const profileImg = ref(null)
    const role = ref(null)

    function setUserInfo(userInfo) {
      token.value = userInfo.token
      userId.value = userInfo.userId
      email.value = userInfo.email
      nickname.value = userInfo.nickname
      profileImg.value =
        userInfo.profileImg == null ? '/src/assets/default-profile-img.png' : userInfo.profileImg
      role.value = userInfo.role
    }

    function clearUserInfo() {
      token.value = null
      userId.value = null
      email.value = null
      nickname.value = null
      profileImg.value = null
      role.value = null
    }

    // 사용자가 인증되었는지 여부를 반환하는 계산 속성, 사용자의 인증 상태를 쉽게 확인 가능
    const isAuthenticated = computed(() => !!token.value) // `isAuthenticated` 추가

    return {
      token,
      userId,
      email,
      nickname,
      profileImg,
      role,
      setUserInfo,
      clearUserInfo,
      isAuthenticated,
    }
  },
  { persist: { storage: sessionStorage } },
)
