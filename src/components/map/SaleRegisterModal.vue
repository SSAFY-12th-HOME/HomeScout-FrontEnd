<template>
  <Transition name="modal-fade">
    <div v-if="showModal" class="modal-overlay" @click="closeModal">
      <div class="modal-container" @click.stop>
        <div class="modal-header">
          <h2>매물 등록</h2>
          <button class="close-button" @click="closeModal">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div class="modal-content">
          <!-- Tab Buttons -->
          <div class="tab-buttons">
            <button 
              @click="activeTab = 'sale'"
              :class="['tab-button', { active: activeTab === 'sale' }]"
            >
              매매
            </button>
            <button 
              @click="activeTab = 'rent'"
              :class="['tab-button', { active: activeTab === 'rent' }]"
            >
              전/월세
            </button>
          </div>

          <div class="tab-content">
					<Transition name="tab-fade" mode="out-in">
						<!-- 하나의 div로 감싸서 단일 자식 요소로 만듦 -->
						<div :key="activeTab">
							<!-- 매매 탭 -->
							<div v-if="activeTab === 'sale'" class="tab-pane">
								<div class="price-section">
									<div class="form-group">
										<label>매매가 <span class="required">*</span></label>
										<div class="input-with-unit">
											<input 
												type="text" 
												v-model="saleForm.price" 
												@input="formatNumber($event, 'price')" 
												placeholder="매매가 입력"
												:class="{ 'error': formErrors.salePrice }"
											>
											<span class="unit">만원</span>
										</div>
										<span v-if="formErrors.salePrice" class="error-message">{{ formErrors.salePrice }}</span>
									</div>
								</div>
							</div>

              <!-- 전/월세 탭 -->
							<div v-if="activeTab === 'rent'" class="tab-pane" key="rent">
								<div class="price-section">
									<div class="rent-input-row">
										<!-- 보증금 입력 -->
										<div class="form-group flex-1" style="margin-bottom: 0">
											<label>보증금 <span class="required">*</span></label>
											<div class="input-with-unit">
												<input 
													type="text" 
													v-model="rentForm.deposit" 
													@input="formatNumber($event, 'deposit')" 
													placeholder="보증금 입력"
													:class="{ 'error': formErrors.deposit }"
												>
												<span class="unit">만원</span>
											</div>
											<span v-if="formErrors.deposit" class="error-message">{{ formErrors.deposit }}</span>
										</div>

										<!-- 월세 입력 -->
										<div class="form-group flex-1" style="margin-bottom: 0">
											<label>월세 <span class="required">*</span></label>
											<div class="input-with-unit">
												<input 
													type="text" 
													v-model="rentForm.monthlyRent" 
													@input="formatNumber($event, 'monthlyRent')" 
													placeholder="월세 입력"
													:class="{ 'error': formErrors.monthlyRent }"
												>
												<span class="unit">만원</span>
											</div>
											<span v-if="formErrors.monthlyRent" class="error-message">{{ formErrors.monthlyRent }}</span>
										</div>
									</div>
								</div>
							</div>
						</div>
            </Transition>

            <!-- 공통 입력 필드 -->
            <div class="common-fields">
              <div class="input-row">
                <div class="form-group">
                  <label>동 <span class="required">*</span></label>
									<div class="input-with-unit">
										<input 
											type="text" 
											v-model="commonForm.dong" 
											@input="numberOnly($event, 'dong')"
											placeholder="동 입력"
											:class="{ 'error': formErrors.dong }"
										>
										<span class="unit">동</span>
										<span v-if="formErrors.dong" class="error-message">{{ formErrors.dong }}</span>
									</div>
                </div>

                <div class="form-group">
                  <label>층 <span class="required">*</span></label>
									<div class="input-with-unit">
										<input 
											type="text" 
											v-model="commonForm.floor" 
											@input="numberOnly($event, 'floor')"
											placeholder="층 입력"
											:class="{ 'error': formErrors.floor }"
										>
										<span class="unit">층</span>
										<span v-if="formErrors.floor" class="error-message">{{ formErrors.floor }}</span>
									</div>
                </div>

                <div class="form-group">
                  <label>면적 <span class="required">*</span></label>
									<div class="input-with-unit">
										<input 
											type="text" 
											v-model="commonForm.area" 
											@input="numberOnly($event, 'area')"
											placeholder="면적 입력"
											:class="{ 'error': formErrors.area }"
										>
										<span class="unit">㎡</span>
										<span v-if="formErrors.area" class="error-message">{{ formErrors.area }}</span>
									</div>
                </div>
              </div>

              <div class="form-group">
                <label>태그 선택</label>
                <div class="tag-list">
                  <input type="text" v-model="tag1" placeholder="태그1">
                  <input type="text" v-model="tag2" placeholder="태그2">
                  <input type="text" v-model="tag3" placeholder="태그3">
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button class="submit-button" @click="handleSubmit">매물 등록</button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useErrorStore } from '@/stores/error'
import { registerSale } from '@/api/map'

const props = defineProps({
  showModal: Boolean,
	aptIdProps: String
})

const emit = defineEmits(['close', 'register-success'])

const errorStore = useErrorStore()

const activeTab = ref('sale')
const tag1 = ref('')
const tag2 = ref('')
const tag3 = ref('')

// 폼 데이터
const saleForm = reactive({
  price: ''
})

const rentForm = reactive({
  deposit: '',
  monthlyRent: ''
})

const commonForm = reactive({
  dong: '',
  floor: '',
  area: ''
})

const formErrors = reactive({
  salePrice: '',
  deposit: '',
  monthlyRent: '',
  dong: '',
  floor: '',
  area: ''
})

// 숫자 포맷팅 (3자리 콤마)
const formatNumber = (event, field) => {
  let value = event.target.value.replace(/[^0-9]/g, '')
  if (value) {
    value = Number(value).toLocaleString()
  }
  
  if (activeTab.value === 'sale') {
    saleForm[field] = value
  } else {
    rentForm[field] = value
  }
}

// 숫자만 입력
const numberOnly = (event, field) => {
  commonForm[field] = event.target.value.replace(/[^0-9]/g, '')
}

// 유효성 검사
const validateForm = () => {
  let isValid = true
  formErrors.dong = ''
  formErrors.floor = ''
  formErrors.area = ''

  if (!commonForm.dong) {
    formErrors.dong = '동을 입력해주세요'
    isValid = false
  }
  if (!commonForm.floor) {
    formErrors.floor = '층을 입력해주세요'
    isValid = false
  }
  if (!commonForm.area) {
    formErrors.area = '면적을 입력해주세요'
    isValid = false
  }

  if (activeTab.value === 'sale') {
    formErrors.salePrice = ''
    if (!saleForm.price) {
      formErrors.salePrice = '매매가를 입력해주세요'
      isValid = false
    }
  } else {
    formErrors.deposit = ''
    formErrors.monthlyRent = ''
    if (!rentForm.deposit) {
      formErrors.deposit = '보증금을 입력해주세요'
      isValid = false
    }
    if (!rentForm.monthlyRent) {
      formErrors.monthlyRent = '월세를 입력해주세요'
      isValid = false
    }
  }

  return isValid
}

// 폼 제출
const handleSubmit = async () => {
  if (!validateForm()) return

	const payload = {
		aptId: props.aptIdProps,
		type: activeTab.value === 'sale' ? '매매' : '전/월세',
		price: activeTab.value === 'sale' ? saleForm.price.replace(/,/g, '') : null,
		deposit: activeTab.value === 'rent' ? rentForm.deposit.replace(/,/g, '') : null,
		rentalFee: activeTab.value === 'rent' ? rentForm.monthlyRent.replace(/,/g, '') : null,
		dong: commonForm.dong,
		floor: commonForm.floor,
		area: commonForm.area,
		tag1: tag1.value,
		tag2: tag2.value,
		tag3: tag3.value
	}

	if(payload.price === null) {
		payload.price = 0;
	}

	if(payload.deposit === null) {
		payload.deposit = 0;
	}

	if(payload.rentalFee === null) {
		payload.rentalFee = 0;
	}

	registerSale(
		payload,
		() => {
			emit('register-success')
			closeModal()
		},
		(err) => {
			errorStore.showError(err.response.data.message || '매물 등록 중 오류가 발생했습니다.')
		}
	)
}

const closeModal = () => {
  emit('close')
}
</script>

<style scoped>
/* 모달 기본 스타일 */
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
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

/* 모달 헤더 */
.modal-header {
  padding: 16px 24px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.25rem;
  color: #111827;
}

.close-button {
  background: none;
  border: none;
  cursor: pointer;
  color: #6b7280;
  padding: 4px;
}

/* 탭 스타일 */
.tab-buttons {
  display: flex;
  border-bottom: 1px solid #e5e7eb;
  margin-bottom: 24px;
}

.tab-button {
  flex: 1;
  padding: 12px;
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  color: #6b7280;
  font-weight: 500;
  transition: all 0.2s;
}

.tab-button.active {
  color: #4CAF50;
  border-bottom-color: #4CAF50;
}

/* 폼 스타일 */
.modal-content {
  padding: 24px;
}

.form-group {
  margin-bottom: 16px;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #374151;
}

.required {
  color: #DC2626;
  margin-left: 4px;
}

.input-with-unit {
  position: relative;
  display: flex;
  align-items: center;
}

.unit {
  position: absolute;
  right: 12px;
  color: #6b7280;
}

input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.2s;
}

input.error {
  border-color: #DC2626;
}

.error-message {
  color: #DC2626;
  font-size: 0.875rem;
  margin-top: 4px;
  display: block;
}

/* 태그 입력 */
.tag-list {
  display: flex;
  gap: 8px;
}

.tag-list input {
  flex: 1;
}

/* 모달 푸터 */
.modal-footer {
  padding: 16px 24px;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: flex-end;
}

.submit-button {
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 8px 24px;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.submit-button:hover {
  background-color: #45a049;
}

/* 애니메이션 */
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

.tab-pane {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.input-row {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
}

.input-row .form-group {
  flex: 1;
  margin-bottom: 0;
}

.price-section {
  margin-bottom: 24px;
}

/* 모달 페이드 애니메이션 */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

/* 탭 전환 애니메이션 */
.tab-fade-enter-active,
.tab-fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.tab-fade-enter-from {
  opacity: 0;
  transform: translateX(10px);
}

.tab-fade-leave-to {
  opacity: 0;
  transform: translateX(-10px);
}

/* 입력 필드 스타일 개선 */
.input-with-unit {
  position: relative;
}

.input-with-unit input {
  padding-right: 48px;
}

.unit {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #6b7280;
  font-size: 0.875rem;
}

/* 에러 메시지 위치 조정 */
.error-message {
  position: absolute;
  font-size: 0.75rem;
  margin-top: 4px;
}

/* 탭 스타일 개선 */
.tab-buttons {
  background-color: #f9fafb;
  border-radius: 8px;
  padding: 4px;
  margin-bottom: 24px;
}

.tab-button {
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: 500;
}

.tab-button.active {
  background-color: #4CAF50;
  color: white;
}

/* 모달 페이드 애니메이션 - 클래스 이름이 트랜지션 name과 일치해야 함 */
.modal-fade-enter-active {
  transition: all 1s ease;
}

.modal-fade-leave-active {
  transition: all 1s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
  transform: translateY(20px); /* 아래에서 위로 올라오는 효과 추가 */
}

/* 모달이 완전히 보여질 때의 상태 */
.modal-fade-enter-to,
.modal-fade-leave-from {
  opacity: 1;
  transform: translateY(0);
}

.rent-input-row {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
	padding-bottom: 0;
}

.flex-1 {
  flex: 1;
}

/* input-with-unit 스타일 수정 */
.input-with-unit {
  position: relative;
  width: 100%;
}

.input-with-unit input {
  width: 100%;
  padding-right: 48px; /* 단위(만원) 표시를 위한 여백 */
}

.unit {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #6b7280;
  font-size: 0.875rem;
  pointer-events: none;
}

/* 에러 메시지 위치 조정 */
.form-group {
  position: relative;
}

.error-message {
  position: absolute;
  left: 0;
  top: 100%;
  font-size: 0.75rem;
  color: #DC2626;
  margin-top: 4px;
}
</style>