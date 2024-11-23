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
      <h2 class="empty-message">아파트를 선택해 주세요!</h2>
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
/* @import 'vue3-perfect-scrollbar/style.css'; */

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  outline: none;
  word-break: break-all;
  font-family: Pretendard;
}
.container {
  /* 컨테이너의 높이를 뷰포트 높이로 설정 */
  height: 78.9vh;
  /* 또는 특정 높이로 설정할 수 있습니다 */
  /* height: 800px; */
  padding: 0 0;
}

.apt-container {
  /* 컨테이너 기본 설정 */
  height: 100%;
}

.divider {
  height: 10px;
  background-color: #ececec;
}

.empty-message {
  text-align: center;
  padding: 20px;
  font-size: 30px;
}
</style>
