<script setup>
import { ref, onMounted } from 'vue';
import VKakaoMap from '@/components/map/VKakaoMap.vue';
import { getAptList, listSido, listGugun, getAptIdByAptName } from '@/api/map';
import AptDetail from '@/components/map/AptDetail.vue';
import VSelect from '@/components/map/VSelect.vue';
import SearchBar from '@/components/map/SearchBar.vue';

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
  console.log(inputAptId);
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
      console.log(err);
    }
  )
}
</script>

<template>
  <div class="tab-container">
    <SearchBar @onSearchButton="onSearchApt"/>
    <AptDetail :apt-id="aptId"/>
  </div>
  <div class="map-container">
    <div class="select-container">
      <VSelect style="float: left; height: 41px; margin: 10px 0" :selectOption="sidoList" @onKeySelect="onChangeSido" />
      <VSelect style="float: right; height: 41px; margin: 10px 0" :selectOption="gugunList" @onKeySelect="onChangeGugun" />
    </div>
    <VKakaoMap :apt-list="aptList" @marker-click-event="onMarkerClickEvent" />
  </div>
</template>

<style scoped>
.tab-container {
  width: 30%;
  float: left;
  background-color: #f5f5f5;
}

.map-container {
  width: 70%;
  float: right;
  background-color: #f5f5f5;
}

.select-container {
  height: 61px;
  width: 600px;
  margin: 0 1rem;
  background-color: #f5f5f5;
}
</style>
