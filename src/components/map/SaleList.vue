<script setup>
import { ref, watch, computed } from 'vue'
import { useUserStore } from '@/stores/user'
import { useErrorStore } from '@/stores/error'
import { registerWishSale, removeWishSale } from '@/api/map'
import SaleRegisterModal from '@/components/map/SaleRegisterModal.vue'
import { sendMessage as sendMessageWebSocket } from '@/services/websocket'
import { useRouter } from 'vue-router'
import {useChatStore} from "@/stores/chat.js";
import {useSuccessStore} from "@/stores/success.js";


const successStore = useSuccessStore();
const chatStore = useChatStore();
const userStore = useUserStore()
const errorStore = useErrorStore()
const properties = ref([])

const showRegisterModal = ref(false)
const router = useRouter()

// 모달 관련 상태
const showConfirmModal = ref(false)
const showSuccessModal = ref(false)
const selectedSaleId = ref(null)

const successModalText = ref(null)

const props = defineProps({
  saleListProps: {
    type: Array,
  },
  aptIdProps: {
    type: String,
  },
  aptName:{
    type: String
  }
})

const emit = defineEmits(['refresh'])

watch(
  () => props.saleListProps,
  (newSaleList) => {
    properties.value = newSaleList
  },
)

const isEmpty = computed(() => properties.value.length === 0)
const emptyStateMessage = computed(() => {
  if (userStore.role === '공인중개사') {
    return '첫 매물을 등록하세요!'
  }
  return '아직 매물이 없어요!'
})

// 위시리스트 토글 처리
const handleWishToggle = async (saleId, currentWishState) => {
  if (!userStore.token) {
    errorStore.showError('로그인이 필요한 서비스입니다.', '로그인 필요')
    return
  }

  if (currentWishState) {
    // 삭제 시 모달 표시
    selectedSaleId.value = saleId
    showConfirmModal.value = true
  } else {
    // 추가는 바로 진행
    await addToWishlist(saleId)
  }
}

// 위시리스트 추가
const addToWishlist = async (saleId) => {
  console.log(props.aptIdProps)
  registerWishSale(
    saleId,
    () => {
      updateLocalWishState(saleId, true)
      showSuccessModal.value = true // 성공 모달 표시
      successModalText.value = '관심 목록에 추가되었습니다.'
    },
    (err) => {
      errorStore.showError(err.response.data.message || '위시리스트 추가 중 오류가 발생했습니다.')
    },
  )
}

// 위시리스트 삭제
const removeFromWishlist = async () => {
  removeWishSale(
    selectedSaleId.value,
    () => {
      updateLocalWishState(selectedSaleId.value, false)
      closeConfirmModal()
    },
    (err) => {
      errorStore.showError(err.response.data.message || '위시리스트 삭제 중 오류가 발생했습니다.')
    },
  )
}

// 로컬 상태 업데이트
const updateLocalWishState = (saleId, newState) => {
  const property = properties.value.find((p) => p.saleId === saleId)
  if (property) {
    property.isWish = newState
  }
}

// 모달 닫기
const closeConfirmModal = () => {
  showConfirmModal.value = false
  selectedSaleId.value = null
}

const contactAgent = async (userId) => {
  console.log(`문의 할 공인중개사 id: ${userId}`)
  console.log(props)
  try {
    // 채팅방 생성 및 입장
    //const chatRoomId = await chatStore.createAndEnterChatRoom(userId)

    // WebSocket을 통해 첫 메시지 전송
    const message = {
      receiverId: userId,
      content: '안녕하세요. '+ props.aptName+' 매물 문의드립니다.',
    }

    // WebSocket 메시지 전송
    sendMessageWebSocket(null, message,null,true)

    successStore.showSuccess('문의가 완료되었습니다.')


  } catch (error) {
    console.error('채팅 연결 오류:', error)
    errorStore.showError('채팅 연결에 실패했습니다.')
  }
}

const getPrice = (type, price, deposit, rentalFee) => {
  if (type === '매매') {
    return type + ' ' + price
  } else {
    if (rentalFee === '') {
      return '전세 ' + deposit
    } else {
      return '월세 ' + deposit + ' / ' + rentalFee
    }
  }
}

const closeSuccessModal = () => {
  showSuccessModal.value = false
  if (successModalText.value === '매물이 등록되었습니다.') {
    emit('refresh')
  }
}

// 매물 등록 성공 시 처리
const handleRegisterSuccess = () => {
  // 부모 컴포넌트에 이벤트 emit하여 매물 목록 새로고침 등의 처리
  showSuccessModal.value = true // 성공 모달 표시
  successModalText.value = '매물이 등록되었습니다.'
}
</script>

<template>
  <!-- 매물 등록 모달 -->
  <SaleRegisterModal
    v-if="showRegisterModal"
    :show-modal="showRegisterModal"
    :apt-id-props="aptIdProps"
    @close="showRegisterModal = false"
    @register-success="handleRegisterSuccess"
  />

  <!-- Success Modal -->
  <Transition name="modal">
    <div v-if="showSuccessModal" class="modal-overlay" @click="closeSuccessModal">
      <div class="modal-container success-modal" @click.stop>
        <div class="modal-content">
          <div class="success-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path
                d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z"
              ></path>
            </svg>
          </div>
          <p class="success-message">{{ successModalText }}</p>
          <button class="modal-button confirm-button" @click="closeSuccessModal">확인</button>
        </div>
      </div>
    </div>
  </Transition>

  <!-- Confirm Modal -->
  <Transition name="modal">
    <div v-if="showConfirmModal" class="modal-overlay" @click="closeConfirmModal">
      <div class="modal-container" @click.stop>
        <div class="modal-content">
          <h3 class="modal-title">관심 목록에서 삭제</h3>
          <p class="modal-message">관심 목록에서 삭제하시겠습니까?</p>
          <div class="modal-buttons">
            <button class="modal-button cancel-button" @click="closeConfirmModal">취소</button>
            <button class="modal-button confirm-button" @click="removeFromWishlist">확인</button>
          </div>
        </div>
      </div>
    </div>
  </Transition>

  <div class="property-container">
    <div class="sale-header">
      <h2>이 단지 매물</h2>
      <button
        v-if="userStore.role === '공인중개사'"
        class="register-button"
        @click="showRegisterModal = true"
      >
        매물 등록
      </button>
    </div>
    <div class="property-list">
      <!-- Empty State -->
      <div v-if="isEmpty" class="empty-state">
        <div class="empty-state-icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M3 21h18" />
            <path d="M5 21V7l8-4v18" />
            <path d="M19 21V11l-6-4" />
            <path d="M9 9h1v1H9z" />
            <path d="M9 12h1v1H9z" />
            <path d="M9 15h1v1H9z" />
            <path d="M9 18h1v1H9z" />
            <path d="M14 14h1v1h-1z" />
            <path d="M14 17h1v1h-1z" />
          </svg>
        </div>
        <p class="empty-state-text">{{ emptyStateMessage }}</p>
        <button
          v-if="userStore.role === '공인중개사'"
          class="empty-state-button"
          @click="showRegisterModal = true"
        >
          매물 등록하기
        </button>
      </div>

      <!-- Property List -->
      <div v-else v-for="property in properties" :key="property.saleId" class="property-card">
        <div class="property-header">
          <h3 class="price">
            {{ getPrice(property.type, property.price, property.deposit, property.rentalFee) }}
          </h3>
          <button
            class="heart-btn"
            @click="handleWishToggle(property.saleId, property.isWish)"
            :class="{ 'heart-active': property.isWish }"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              :fill="property.isWish ? 'currentColor' : 'none'"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path
                d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z"
              ></path>
            </svg>
          </button>
        </div>

        <div class="property-info">
          <p>{{ property.dong }}동 {{ property.floor }}층 {{ property.area }}㎡</p>
          <div class="tags">
            <span class="tag" v-if="property.tag1.length !== 0">#{{ property.tag1 }}</span>
            <span class="tag" v-if="property.tag2.length !== 0">#{{ property.tag2 }}</span>
            <span class="tag" v-if="property.tag3.length !== 0">#{{ property.tag3 }}</span>
          </div>
        </div>

        <div class="agent-info">
          <div class="agent">
            <img
              :src="property.realtor.profileImg === null ? '/src/assets/default-profile-img.png' : property.realtor.profileImg"
              :alt="property.realtor.nickname"
              class="agent-image"
            />
            <span class="agent-name">{{ property.realtor.nickname }}</span>
          </div>
          <span class="agent-phone">{{ property.realtor.phone }}</span>
        </div>

        <button class="contact-btn" @click="contactAgent(property.realtor.userId)">문의</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 기존 스타일 유지 */
.property-container {
  border-radius: 12px;
  background-color: white;
  margin: 0 7px;
}

.sale-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-top: 1rem;
  padding-left: 1rem;
  padding-right: 1rem;
  margin: 0;
}

.sale-header h2 {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
}

.register-button {
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 6px 16px;
  border-radius: 4px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  height: 32px;
  display: flex;
  align-items: center;
  box-shadow: 0 3px 1px rgba(0, 0, 0, 0.05);
}

.register-button:hover {
  background-color: #45a049;
}

.register-button:active {
  transform: translateY(1px);
}

.sale-header h2 {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
}

.property-list {
  max-width: 600px;
  margin: 0 auto;
  padding: 16px;
}

.property-card {
  background: white;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
  padding-top: 8px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
}

.property-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0px;
}

.price {
  font-size: 18px;
  font-weight: bold;
  margin: 0;
}

.heart-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
}

.property-info {
  margin-bottom: 6px;
}

.property-info p {
  margin-bottom: 8px;
}

.tags {
  display: flex;
  gap: 8px;
  margin-top: 0px;
}

.tag {
  background: rgb(224, 224, 224);
  padding: 4px 8px;
  border-radius: 16px;
  font-size: 14px;
}

.agent-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.agent {
  display: flex;
  align-items: center;
  gap: 8px;
}

.agent-image {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}

.agent-name {
  font-weight: 500;
}

.agent-phone {
  color: #666;
}

.contact-btn {
  width: 100%;
  background: #4caf50;
  color: white;
  border: none;
  padding: 8px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
}

.contact-btn:hover {
  background: #45a049;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.empty-state-icon {
  color: #9ca3af;
  margin-bottom: 16px;
}

.empty-state-text {
  color: #4b5563;
  font-size: 1.1rem;
  margin: 0 0 24px 0;
}

.empty-state-button {
  background: #4caf50;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.empty-state-button:hover {
  background: #45a049;
}

.heart-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  color: #e04b4b; /* 기본 색상 */
  transition: all 0.2s ease;
}

.heart-btn:hover {
  transform: scale(1.1);
}

.heart-btn.heart-active {
  color: #e04b4b; /* 활성화됐을 때의 색상 */
}

/* 모달 스타일 */
.modal-overlay {
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

.modal-container {
  background-color: white;
  border-radius: 12px;
  padding: 24px;
  width: 90%;
  max-width: 320px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.modal-title {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 16px 0;
  color: #111827;
}

.modal-message {
  font-size: 16px;
  color: #4b5563;
  margin: 0 0 24px 0;
}

.modal-buttons {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

.modal-button {
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.cancel-button {
  background-color: #f3f4f6;
  border: 1px solid #e5e7eb;
  color: #4b5563;
}

.cancel-button:hover {
  background-color: #e5e7eb;
}

.confirm-button {
  background-color: #e04b4b;
  border: none;
  color: white;
}

.confirm-button:hover {
  background-color: #b91c1c;
}

/* 기존 스타일 유지하고 success 모달 관련 스타일 추가 */

.success-modal .modal-content {
  text-align: center;
}

.success-icon {
  color: #e04b4b;
  margin-bottom: 16px;
  animation: pop 0.3s ease-out;
}

@keyframes pop {
  0% {
    transform: scale(0.8);
    opacity: 0;
  }
  90% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.success-message {
  font-size: 16px;
  color: #111827;
  margin: 0 0 24px 0;
  font-weight: 500;
}

.success-modal .confirm-button {
  width: 100%;
  justify-content: center;
  padding: 12px;
  font-size: 16px;
}

/* 모달 트랜지션 개선 */
.modal-enter-active {
  transition: all 0.2s ease-out;
}

.modal-leave-active {
  transition: all 0.2s ease-in;
}

.modal-enter-from {
  opacity: 0;
  transform: translateY(10px) scale(0.99);
}

.modal-leave-to {
  opacity: 0;
  transform: translateY(10px) scale(0.99);
}
</style>
