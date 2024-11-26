<script setup>
import { ref, watch } from 'vue';
import { useUserStore } from '@/stores/user'
import { useErrorStore } from '@/stores/error';
import ErrorModal from '../common/ErrorModal.vue';
import { registerLifeStory, deleteLifeStory } from '@/api/map'

const userStore = useUserStore();
const errorStore = useErrorStore();

const lifeStoryList = ref({});
const lifeStoryText = ref('');
const isSubmitting = ref(false);
const showDeleteModal = ref(false);
const selectedStoryId = ref(null);

const emit = defineEmits(["refresh"])

const props = defineProps({
  lifeStoryProps: {
    type: Array
  },
  aptIdProps: {
    type: String
  }
})

// API 호출 함수
const submitLifeStory = async () => {
  if (!lifeStoryText.value.trim()) {
    alert('내용을 입력해주세요.');
    return;
  }

  if (isSubmitting.value) return;

  isSubmitting.value = true;

  registerLifeStory(
    props.aptIdProps,
    { content: lifeStoryText.value },
    () => {
      lifeStoryText.value = '';
      emit('refresh');
      isSubmitting.value = false;
    },
    (err) => {
      errorStore.showError(err.response.data.message, '오류')
      isSubmitting.value = false;
    }
  )
};

// Enter 키 이벤트 핸들러
const handleKeyPress = (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    submitLifeStory();
  }
};

// 삭제 모달 표시
const showDeleteConfirmation = (storyId) => {
  selectedStoryId.value = storyId;
  showDeleteModal.value = true;
};

// 삭제 취소
const cancelDelete = () => {
  showDeleteModal.value = false;
  selectedStoryId.value = null;
};

// 삭제 확인
const confirmDelete = async () => {
  if (!selectedStoryId.value) {
    showDeleteModal.value = false;
    selectedStoryId.value = null;
    errorStore.showError('살아본 이야기 삭제 오류', '오류');
    return;
  }

  deleteLifeStory(
    props.aptIdProps,
    selectedStoryId.value,
    () => {
      emit('refresh');
      showDeleteModal.value = false;
      selectedStoryId.value = null;
    },
    (err) => {
      showDeleteModal.value = false;
      selectedStoryId.value = null;
      errorStore.showError(err.response.data.message, '오류');
    }
  );
};

watch(
  () => props.lifeStoryProps,
  (newLifeStoryList) => {
    lifeStoryList.value = newLifeStoryList;
  }
)
</script>

<template>
  <ErrorModal />
  <!-- Confirm Modal -->
  <Transition name="modal">
    <div v-if="showDeleteModal" class="modal-overlay" @click="cancelDelete">
      <div class="modal-container" @click.stop>
        <div class="modal-content">
          <h3 class="modal-title">살아본 이야기 삭제</h3>
          <p class="modal-message">살아본 이야기를 삭제하시겠습니까?</p>
          <div class="modal-buttons">
            <button 
              class="modal-button cancel-button" 
              @click="cancelDelete"
            >
              취소
            </button>
            <button 
              class="modal-button confirm-button" 
              @click="confirmDelete"
            >
              확인
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>

  <div class="review-container">
    <div class="review-header">
      <div class="header-left">
        <h2>살아본 이야기</h2>
        <div class="exp-badge">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="exp-icon">
            <path d="M12 2L15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2z"/>
          </svg>
          <span>50 경험치</span>
        </div>
      </div>
    </div>

    <div class="review-list">
      <!-- 작성 폼 -->
      <div class="review-item write-form">
        <div class="user-info">
          <img :src="userStore.profileImg" alt="프로필" class="profile-img"/>
          <span class="username">{{ userStore.nickname }}</span>
        </div>
        <div class="review-content editable">
          <textarea 
            class="review-textarea"
            placeholder="이 단지의 장점과 단점, 알려주고 싶은 이야기, 유용한 팁 등을 적어주세요."
            v-model="lifeStoryText"
            @keypress="handleKeyPress"
          ></textarea>
          <button 
            class="submit-button"
            @click="submitLifeStory"
            :disabled="isSubmitting"
          >
            {{ isSubmitting ? '등록 중...' : '등록하기' }}
          </button>
        </div>
      </div>
      
      <!-- 리뷰 목록 -->
      <template v-for="(lifeStory, index) in lifeStoryList" :key="index">
        <div class="review-item review-card" :class="{ 'first-review': index === 0 }">
          <div class="user-info">
            <img :src="lifeStory.writer.profileImg === null ? '/src/assets/default-profile-img.png' : lifeStory.writer.profileImg" alt="프로필" class="profile-img"/>
            <div class="user-details">
              <span class="username">{{ lifeStory.writer.nickname }}</span>
              <span class="timestamp">{{ lifeStory.created }}</span>
            </div>
            <!-- 삭제 버튼 추가 -->
            <button 
              v-if="userStore.userId === lifeStory.writer.userId"
              @click="showDeleteConfirmation(lifeStory.lifeStoryId)"
              class="delete-button"
            >
              삭제
            </button>
          </div>
          <div class="review-content">
            <p>{{ lifeStory.content }}</p>
          </div>
        </div>
        <div class="divider" v-if="index !== lifeStoryList.length - 1"></div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.review-container {
  padding: 1rem;
  background-color: white;
  border-radius: 12px;
  margin: 0 7px;
}

.review-header {
  margin-bottom: 0.8rem;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 10.5rem;
}

.header-left h2 {
  font-size: 1.2rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
}

.exp-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #f3f4f6;
  padding: 0.5rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.875rem;
  color: #4b5563;
}

.exp-icon {
  color: #fbbf24;
}

.review-list {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.review-item {
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
}

.write-form {
  background-color: #f9fafb;
  border-radius: 1rem;
  padding: 0.8rem;
  margin-bottom: 1rem;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.profile-img {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #e5e7eb;
}

.user-details {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.username {
  font-weight: 600;
  color: #1f2937;
}

.timestamp {
  font-size: 0.75rem;
  color: #6b7280;
}

.review-content {
  position: relative;
  font-size: 0.9375rem;
  line-height: 1.6;
  color: #374151;
}

.review-content p {
  margin-bottom: 0;
}

.review-textarea {
  width: 100%;
  min-height: 120px;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  background: white;
  resize: none;
  padding: 1rem;
  font-size: 0.9375rem;
  line-height: 1.6;
  color: #374151;
  transition: border-color 0.2s ease;
}

.review-textarea::placeholder {
  color: #9ca3af;
}

.review-textarea:focus {
  outline: none;
  border-color: #60a5fa;
  box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.1);
}

.submit-button {
  position: absolute;
  bottom: 0.9rem;
  right: 0.5rem;
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 0.5rem 0.9rem;
  border-radius: 0.5rem;
  font-weight: 500;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.submit-button:hover {
  background-color: #338535;
}

.submit-button:disabled {
  background-color: #9ca3af;
  cursor: not-allowed;
}

.review-card {
  background-color: white;
  padding: 0.5rem;
  border-radius: 1rem;
  transition: transform 0.2s ease;
}

.review-card:hover {
  transform: translateY(-2px);
}

.divider {
  height: 1px;
  background-color: #e5e7eb;
  margin: 0.5rem 0;
}

.first-review {
  position: relative;
}

.first-review::before {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background-color: #7fbb81;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 500;
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

.delete-button {
  margin-left: auto;
  padding: 0.25rem 0.75rem;
  background-color: #EF4444;
  color: white;
  border: none;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.delete-button:hover {
  background-color: #DC2626;
}

/* 모달 애니메이션 */
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

.user-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
}
</style>