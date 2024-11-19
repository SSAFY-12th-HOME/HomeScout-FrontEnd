import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  const token =  ref(null);
  const userId = ref(null);
  const email = ref(null);
  const nickname = ref(null);
	const profileImg = ref(null);
  const role = ref(null);

  function setUserInfo(userInfo) {
		token.value = userInfo.token
		userId.value = userInfo.userId
		email.value = userInfo.email
		nickname.value = userInfo.nickname
		profileImg.value = userInfo.profileImg == null ? '/src/assets/default-profile-img.png' : userInfo.profileImg
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
	
	return {
		token, userId, email, nickname, profileImg, role,
		setUserInfo, clearUserInfo
	}
}, { persist: { storage: sessionStorage } })