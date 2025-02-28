<script setup>
import { ref, onMounted } from 'vue'
import { deleteMySale, getMySaleList } from '@/api/mypage'
import { useErrorStore } from '@/stores/error'
import ErrorModal from '@/components/common/ErrorModal.vue'
import { Trash2 } from 'lucide-vue-next'

const errorStore = useErrorStore()

const favorites = ref([])
const showConfirmModal = ref(false);
const selectedSaleId = ref(null);

const fetchFavorites = async () => {
  getMySaleList(
    ({ data }) => {
      favorites.value = data
    },
    () => {
      errorStore.showError('관심 매물 로딩 실패')
    }
  )
}

// 위시리스트 토글 처리
const handleWishToggle = async (saleId) => {

  // 삭제 시 모달 표시
  selectedSaleId.value = saleId;
  showConfirmModal.value = true;
};

// 모달 닫기
const closeConfirmModal = () => {
  showConfirmModal.value = false;
  selectedSaleId.value = null;
};

const removeFromWishlist = () => {
  deleteMySale(
    selectedSaleId.value,
    () => {
      closeConfirmModal()
      fetchFavorites()
    },
    () => {
      errorStore.showError('매물을 삭제하는데 실패했습니다.')
      showConfirmModal.value = false
    }
  )
}

onMounted(() => {
  fetchFavorites()
})

const getPrice = (type, price, deposit, rentalFee) => {
  console.log(price, deposit, rentalFee)
  if(type === '매매') {
    return type + ' ' + price;
  } else {
    if(rentalFee === '' || rentalFee === 0) {
      return '전세 ' + deposit;
    } else {
      return '월세 ' + deposit + ' / ' + rentalFee;
    }
  }
}
</script>

<template>
  <ErrorModal />
  <!-- Confirm Modal -->
  <Transition name="modal">
    <div v-if="showConfirmModal" class="modal-overlay" @click="closeConfirmModal">
      <div class="modal-container" @click.stop>
        <div class="modal-content">
          <h3 class="modal-title">나의 매물에서 삭제</h3>
          <p class="modal-message">내가 등록한 매물을 삭제하시겠습니까?</p>
          <div class="modal-buttons">
            <button
              class="modal-button cancel-button"
              @click="closeConfirmModal"
            >
              취소
            </button>
            <button
              class="modal-button confirm-button"
              @click="removeFromWishlist"
            >
              확인
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
  <div class="favorites">
    <div v-if="favorites.length === 0" class="empty-state">
      내가 등록한 매물이 없습니다.
    </div>
    <div v-else class="properties-grid">
      <!-- Property List -->
      <div v-for="property in favorites" :key="property.saleId" class="property-card">
        <div class="property-header">
          <h4 class="apt-name">{{ property.aptNm }}</h4>
          <Trash2
            class="heart-btn heart-active"
            @click="handleWishToggle(property.saleId)"
            size="40"
            stroke-width="2.25"
          />
        </div>

        <div class="property-info">
          <h3 class="price">
            {{ getPrice(property.type, property.price, property.deposit, property.rentalFee) }}
          </h3>
          <p>{{ property.dong }}동 {{ property.floor }}층 {{ property.area }}㎡</p>
          <div class="tags">
            <span class="tag" v-if="property.tag1.length !== 0">#{{ property.tag1 }}</span>
            <span class="tag" v-if="property.tag2.length !== 0">#{{ property.tag2 }}</span>
            <span class="tag" v-if="property.tag3.length !== 0">#{{ property.tag3 }}</span>
          </div>
        </div>

        <div class="agent-info">
          <div class="agent">
            <img :src="property.realtor.profileImg === null ? '/src/assets/default-profile-img.png' : property.realtor.profileImg" :alt="property.realtor.nickname" class="agent-image">
            <span class="agent-name">{{ property.realtor.nickname }}</span>
          </div>
          <span class="agent-phone">{{ property.realtor.phone }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.properties-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 3rem;
  padding: 0rem;
}

.property-card {
  background: white;
  border-radius: 12px;
  padding: 16px;
  padding-top: 8px;
  box-shadow: 0px 0px 10px rgba(0,0,0,0.1);
}

.property-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0px;
}

.apt-name {
  font-size: 24px;
  color: #000;
  margin: 10px 0;
  font-weight: bold;
}

.price {
  font-size: 18px;
  font-weight: 550;
  margin-bottom: 5px;
  color: #666;
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
  margin-bottom: 3px;
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
  background: #4CAF50;
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

.heart-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  color: #d1d5db; /* 기본 색상 */
  transition: all 0.2s ease;
}

.heart-btn:hover {
  transform: scale(1.1);
}

.heart-btn.heart-active {
  color: #e04b4b; /* 활성화됐을 때의 색상 */
}

.info-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.floor, .area {
  color: #666;
}

.tags {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.tag {
  color: #666;
  font-size: 0.9rem;
}

.agent-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 0.5rem;
}

.agent-profile {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.agent-image {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  object-fit: cover;
}

.agent-name {
  font-weight: 500;
}

.agent-phone {
  color: #666;
  font-size: 0.9rem;
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
  max-width: 340px;
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
  color: #4B5563;
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
  background-color: #F3F4F6;
  border: 1px solid #E5E7EB;
  color: #4B5563;
}

.cancel-button:hover {
  background-color: #E5E7EB;
}

.confirm-button {
  background-color: #DC2626;
  border: none;
  color: white;
}

.confirm-button:hover {
  background-color: #B91C1C;
}

/* 모달 트랜지션 */
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

.empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 250px;
  width: 100%;
  color: #666;
  font-size: 24px;
}
</style>
