<script setup>
import { ref, onMounted } from 'vue';
import VKakaoMap from '@/components/map/VKakaoMap.vue';
import { getAptList, listSido, listGugun, getAptIdByAptName } from '@/api/map';
import AptDetail from '@/components/map/AptDetail.vue';
import VSelect from '@/components/map/VSelect.vue';
import SearchBar from '@/components/map/SearchBar.vue';
import ErrorModal from '@/components/common/ErrorModal.vue';
import { useErrorStore } from '@/stores/error';

const errorStore = useErrorStore()

const aptList = ref([]);
const aptId = ref('');
const sidoList = ref([])
const gugunList = ref([{ text: "구군선택", value: "" }])

onMounted(() => {
  // init();
  getSidoList();
})

const getSidoList = () => {
  listSido(
    ({ data }) => {
      let options = []
      options.push({ text: "시도선택", value: "" })
      data.forEach((sido) => {
        options.push({ text: sido.sidoName, value: sido.sidoCode })
      })
      sidoList.value = options
    },
    (err) => {
      console.log(err)
    }
  )
}

const onChangeSido = (val) => {
  listGugun(
    { sido: val },
    ({ data }) => {
      let options = []
      options.push({ text: "구군선택", value: "" })
      data.forEach((gugun) => {
        options.push({ text: gugun.guName, value: gugun.guCode })
      })
      gugunList.value = options
    },
    (err) => {
      console.log(err)
    }
  )
}

const onChangeGugun = (val) => {
  getAptList(
    { sgg: val },
    ({ data }) => {
      aptList.value = data;
      console.log(data);
    },
    (err) => {
      console.log(err);
    }
  )
}

const onMarkerClickEvent = (inputAptId) => {
  aptId.value = inputAptId;
}

const onSearchApt = (searchQuery) => {
  getAptIdByAptName(
    searchQuery,
    ({ data }) => {
      aptId.value = data.aptId;
      aptList.value = [data];
    },
    (err) => {
      errorStore.showError(err.response.data.message)
    }
  )
}
</script>

<template>
  <ErrorModal />
  <div class="main-container">
    <div class="tab-container">
      <SearchBar @onSearchButton="onSearchApt"/>
      <AptDetail :apt-id="aptId"/>
    </div>
    <div class="map-container">
      <div class="select-container">
        <VSelect style="float: left; height: 36px; margin: 0 10px" :selectOption="sidoList" @onKeySelect="onChangeSido" />
        <VSelect style="float: right; height: 36px; margin: 0 10px" :selectOption="gugunList" @onKeySelect="onChangeGugun" />
      </div>
      <VKakaoMap :apt-list="aptList" @marker-click-event="onMarkerClickEvent" />
    </div>
  </div>
</template>

<style scoped>
.main-container {
  display: flex;
  width: 100%;
  height: 90vh;
  position: relative;
}

.tab-container {
  flex: 0 0 25%; /* flex-grow: 0, flex-shrink: 0, flex-basis: 25% */
  background-color: rgb(234, 234, 234);
  box-shadow: 6px 0 8px rgba(0, 0, 0, 0.1);
  height: 100%;
  overflow-y: auto;
  position: relative;
  z-index: 2;
}

.map-container {
  flex: 1; /* flex-grow: 1, flex-shrink: 1, flex-basis: 0% */
  background-color: white;
  position: relative;
  z-index: 1;
  height: 100%;
}

.select-container {
  display: flex;
  position: absolute;
  z-index: 5;
  margin: 0.7rem 0.7rem;
}
</style>
