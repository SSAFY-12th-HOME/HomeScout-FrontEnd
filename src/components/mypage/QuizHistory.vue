<script setup>
import { ref, onMounted } from 'vue'
import { useErrorStore } from '@/stores/error'
import ErrorModal from '@/components/common/ErrorModal.vue'
import { Trash2 } from 'lucide-vue-next'
import { deleteMyQuiz, getMyQuizList } from '@/api/mypage';

const errorStore = useErrorStore()

const quizzes = ref([])
const showConfirmModal = ref(false)
const selectedQuizId = ref(null)

const fetchQuizzes = async () => {
  getMyQuizList(
    ({ data }) => {
      console.log(data)
      quizzes.value = data
    },
    () => {
      errorStore.showError('관심 매물 로딩 실패')
    }
  )
}

onMounted(() => {
  fetchQuizzes()
})

const getDesc = (desc) => {
  if(desc.length > 47) {
    return desc.substr(0, 47) + '...'
  }
  return desc
}


// 위시리스트 토글 처리
const handleWishToggle = async (saleId) => {

// 삭제 시 모달 표시
  selectedQuizId.value = saleId;
  showConfirmModal.value = true;
};

// 모달 닫기
const closeConfirmModal = () => {
  showConfirmModal.value = false;
  selectedQuizId.value = null;
};

const removeFromWishlist = () => {
  deleteMyQuiz(
    selectedQuizId.value,
    () => {
      closeConfirmModal()
      fetchQuizzes()
    },
    (err) => {
      errorStore.showError(err.response.data.message)
      showConfirmModal.value = false
    }
  )
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

<!-- ========================================================= -->

  <div class="quizzes">
    <div v-if="quizzes.length === 0" class="empty-state">
      내가 만든 퀴즈가 없습니다.
    </div>
    <div v-else class="quiz-grid">
      <div v-for="quiz in quizzes" :key="quiz.quizId" class="quiz-card" :class="[{ 'quiz-card-solved': quiz.isSolve }]">
        <div class="quiz-header">
          <h2 class="quiz-title">{{ quiz.title }}</h2>
          <Trash2
            class="heart-btn heart-active"
            @click="handleWishToggle(quiz.quizId)"
            size="25"
            stroke-width="2.25"
          />
        </div>
        <p class="quiz-description">{{ getDesc(quiz.desc) }}</p>

        <div class="quiz-tags">
          <span class="tag">{{ quiz.tag1 }}</span>
          <span class="tag">{{ quiz.tag2 }}</span>
          <span class="tag">{{ quiz.tag3 }}</span>
        </div>

        <div class="quiz-footer">
          <div class="author-info">
            <img
              :src="quiz.writer.profileImg === null ? '/src/assets/default-profile-img.png' : quiz.writer.profileImg"
              class="author-image"
            />
            <span class="author-name">{{ quiz.writer.nickname }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
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

.quiz-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 3rem;
}

@media (min-width: 768px) {
  .quiz-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.quiz-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0px;
}

.quiz-card {
  height: 200px;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  padding: 20px;
  background-color: white;
  display: flex;
  flex-direction: column;
  box-shadow: 0 0 10px rgba(44, 132, 7, 0.316);
  transition: all 0.3s ease;
  cursor: pointer; /* 마우스 오버시 포인터 표시 */
}

.quiz-card:hover {
  transform: translateY(-5px); /* 위로 살짝 떠오르는 효과 */
  box-shadow: 0 3px 7px rgba(44, 132, 7, 0.4); /* 그림자 강화 */
  background-color: #f8fff8; /* 배경색 살짝 변경 */
  border-color: #2c8407; /* 테두리 색상 강조 */
}

.quiz-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 12px;
}

.quiz-description {
  font-size: 14px;
  color: #666;
  margin-bottom: 12px;
  line-height: 1.5;
  flex-grow: 1;
  min-height: 42px
}

.quiz-tags {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

.tag {
  background-color: #f1f3f5;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  color: #495057;
}

.quiz-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.author-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.author-image {
  width: 32px;
  height: 32px;
  border-radius: 50%;
}

.author-name {
  font-size: 14px;
  color: #495057;
}

.heart-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: #d1d5db; /* 기본 색상 */
  transition: all 0.2s ease;

}

.heart-btn:hover {
  transform: scale(1.1);
}

.heart-btn.heart-active {
  color: #e04b4b; /* 활성화됐을 때의 색상 */
}

.quiz-card-solved {
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
}
</style>
