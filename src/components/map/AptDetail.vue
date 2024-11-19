<script setup>
import { ref, watch } from 'vue';
import { getAptInfo } from '@/api/map';
import AptInfo from '@/components/map/AptInfo.vue';
import DealHistory from '@/components/map/DealHistory.vue';
import SubwayInfo from '@/components/map/SubwayInfo.vue';
import LifeStory from '@/components/map/LifeStory.vue';
import SaleList from '@/components/map/SaleList.vue';

const props = defineProps({
    aptId: {
        type: String,
    }
});

const apt = ref('');
const aptInfo = ref({});

watch(
    () => props.aptId,
    (newApt) => {
        apt.value = newApt;
        getAptInfo(
            apt.value,
            ({ data }) => {
                aptInfo.value = data;
            },
            (err) => {
                console.log(err);
            }
        )
    },
)
</script>

<template>
    <div class="container">
        <h2 v-if="apt.length === 0" class="empty-message">아파트를 선택해 주세요!</h2>
        <div v-else class="apt-container">
            <div class="divider"></div>
            <AptInfo :apt-info="aptInfo.aptInfo"/>
            <div class="divider"></div>
            <DealHistory :deal-history-props="aptInfo.dealHistory" />
            <div class="divider"></div>
            <SubwayInfo :subway-list-props="aptInfo.subway"/>
            <div class="divider"></div>
            <SaleList :sale-list-props="aptInfo.sale"/>
            <div class="divider"></div>
            <LifeStory :life-story-props="aptInfo.lifeStory"/>
        </div>
    </div>
</template>

<style scoped>
.container {
    /* 컨테이너의 높이를 뷰포트 높이로 설정 */
    height: 81.9vh;
    /* 또는 특정 높이로 설정할 수 있습니다 */
    /* height: 800px; */
    padding: 0 0;
}

.apt-container {
    /* 컨테이너 내부 스크롤을 위한 설정 */
    height: 100%;
    overflow-y: auto;
    
    /* 스크롤바 스타일링 */
    scrollbar-width: thin; /* Firefox */
    scrollbar-color: #bbbbbb #f1f1f1; /* Firefox */
}

/* Webkit 브라우저(Chrome, Safari 등)를 위한 스크롤바 스타일링 */
.apt-container::-webkit-scrollbar {
    width: 6px;
}

.apt-container::-webkit-scrollbar-track {
    background: #f1f1f1;
}

.apt-container::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 3px;
}

.apt-container::-webkit-scrollbar-thumb:hover {
    background: #555;
}

.divider {
    height: 10px;
    background-color: rgb(236, 236, 236);
}

.empty-message {
    text-align: center;
    padding: 20px;
    font-size: 30px;
}
</style>