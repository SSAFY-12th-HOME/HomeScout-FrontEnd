<script setup>
import { ref, watch } from 'vue';

const subwayList = ref({});

const props = defineProps({
	subwayListProps: {
		type: Object
	}
})

watch(
	() => props.subwayListProps,
	(newSubwayList) => {
		subwayList.value = newSubwayList;
	}
)
</script>

<template>
  <div class="subway-container">
    <div class="header">
      <h2 class="title">주변 대중교통</h2>
      <div class="location-wrapper">
        <svg xmlns="http://www.w3.org/2000/svg" class="location-icon" viewBox="0 0 20 20" fill="currentColor">
          <path d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" />
        </svg>
        <span>지하철 2km 이내</span>
      </div>
    </div>
		<div class="header-under">
			<img src="@/assets/subway-icon.png" height="20px"/>
			<h4 style="margin: 0 10px; color: gray;"> 지하철</h4>
		</div>

    <div class="routes-list">

      <template v-for="(subway, index) in subwayList" :key="index">
				<div class="route-item">
					<div class="route-left">
						<div class="route-circle" :style="{ 'background-color': subway.color }">{{ subway.lineNm }}</div>
						<span>{{ subway.station }}</span>
					</div>
					<span class="distance">{{ subway.dist }}m/도보 {{ subway.walk }}분</span>
				</div>
			</template>
    </div>
  </div>
</template>

<style scoped>
.subway-container {
  padding: 1rem;
  border-radius: 0.5rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0rem;
}

.header-under {
	display: flex;
	padding: 0 0;
}

.title {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.station-info {
  margin-bottom: 0.5rem;
}

.location-wrapper {
  display: flex;
  align-items: center;
  font-size: 0.875rem;
  color: #666;
}

.location-icon {
  width: 1.25rem;
  height: 1.25rem;
  margin-right: 0.25rem;
}

.routes-list {
  display: flex;
  flex-direction: column;
  gap: 0rem;
}

.route-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
	padding-top: 1rem;
}

.route-left {
  display: flex;
  align-items: center;
}

.route-circle {
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 0.5rem;
  color: white;
  font-size: 0.875rem;
}

.subway-icon {
  background-color: #e2e8f0;
}

.icon {
  width: 1rem;
  height: 1rem;
}

.line-3 {
  background-color: #ff6b01;
}

.line-9 {
  background-color: #aa6c00;
}

.line-7 {
  background-color: #4b7520;
}

.distance {
  font-size: 0.875rem;
  color: #666;
}
</style>