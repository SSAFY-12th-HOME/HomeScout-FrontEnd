<script setup>
import { ref, watch } from 'vue'
import { getAptInfo } from '@/api/map'
import AptInfo from '@/components/map/AptInfo.vue'
import DealHistory from '@/components/map/DealHistory.vue'
import SubwayInfo from '@/components/map/SubwayInfo.vue'
import LifeStory from '@/components/map/LifeStory.vue'
import SaleList from '@/components/map/SaleList.vue'
import PulseLoader from 'vue-spinner/src/PulseLoader.vue'
import ErrorModal from '../common/ErrorModal.vue'
import { useErrorStore } from '@/stores/error'
// import { PerfectScrollbar } from 'vue3-perfect-scrollbar';

const errorStore = useErrorStore()

const props = defineProps({
  aptId: {
    type: String,
  },
})

const apt = ref('')
const aptInfo = ref({})
const isLoading = ref(false)
const aptName = ref('')

// getAptInfo를 별도의 함수로 분리
const fetchAptInfo = () => {
  if (!apt.value) return
  isLoading.value = true

  getAptInfo(
    apt.value,
    ({ data }) => {
      aptInfo.value = data
      isLoading.value = false
      aptName.value = aptInfo.value.aptInfo.aptNm;
      console.log(aptInfo.value.aptInfo.aptNm)
    },
    (err) => {
      isLoading.value = false
      errorStore.showError(err.response.data.message)
    },
  )

  document.querySelector('.ps').scrollTo(0, 0)
}

watch(
  () => props.aptId,
  (newApt) => {
    apt.value = newApt
    fetchAptInfo() // 분리된 함수 호출
  },
)

// refresh 핸들러를 fetchAptInfo 함수를 호출하도록 수정
const handleRefresh = () => {
  fetchAptInfo()
}
</script>

<template>
  <ErrorModal />
  <div class="loading" v-if="isLoading">
    <PulseLoader />
  </div>
  <PerfectScrollbar>
    <div v-if="apt.length === 0" class="container" style="background-color: white">
      <div class="empty-state">
        <img src="@/assets/house.png" class="empty-img">
        <h2 class="empty-message">아파트를 선택해 주세요!</h2>
      </div>

    </div>
    <div v-else class="container">
      <div class="apt-container">
        <AptInfo :apt-info="aptInfo.aptInfo" />
        <div class="divider"></div>
        <DealHistory :deal-history-props="aptInfo.dealHistory" />
        <div class="divider"></div>
        <SubwayInfo :subway-list-props="aptInfo.subway" />
        <div class="divider"></div>
        <SaleList
          :sale-list-props="aptInfo.sale"
          :apt-id-props="aptInfo.aptId"
          @refresh="handleRefresh"
          :apt-name="aptName"

        />
        <div class="divider"></div>
        <LifeStory
          :life-story-props="aptInfo.lifeStory"
          :apt-id-props="aptInfo.aptId"
          @refresh="handleRefresh"
        />
        <div class="divider"></div>
      </div>
    </div>
  </PerfectScrollbar>
</template>

<style scoped>
@import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  outline: none;
  word-break: break-all;
  font-family: Pretendard;
}

.container {
  height: 78.9vh;
  padding: 0 0;
}

.apt-container {
  height: 100%;
}

.divider {
  height: 10px;
  background-color: #ececec;
}

/* empty state 컨테이너 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;  /* 이미지와 텍스트 사이 간격 */
  /* 추가: 위쪽으로 살짝 올려서 시각적 중앙 조정 */
  transform: translateY(80%);
}

/* empty-message 수정된 스타일 */
.empty-message {
  /* 기본 텍스트 스타일 */
  font-size: 1.25rem;
  color: #64748b;  /* 부드러운 슬레이트 컬러 */
  font-weight: 500;
  text-align: center;

  /* 위치 조정 */
  position: relative;
  top: 50%;
  transform: translateY(-50%);

  /* 부드러운 애니메이션 */
  opacity: 0;
  animation: gentleFade 0.5s ease-out forwards;
}

/* 이미지 스타일 */
.empty-img {
  width: 180px;  /* 이미지 크기 조절 */
  height: auto;
  animation: fadeIn 0.6s ease-out forwards;
}

/* 심플한 페이드인 애니메이션 */
@keyframes gentleFade {
  from {
    opacity: 0;
    transform: translateY(-45%);
  }
  to {
    opacity: 1;
    transform: translateY(-50%);
  }
}

/* 반응형 대응 */
@media (max-width: 768px) {
  .empty-message {
    font-size: 1.1rem;
  }
}
</style>
