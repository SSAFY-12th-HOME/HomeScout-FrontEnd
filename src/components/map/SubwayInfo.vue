<script setup>
import { ref, watch } from 'vue';

const subwayList = ref({});

const props = defineProps({
  subwayListProps: {
    type: Object
  }
});

watch(
  () => props.subwayListProps,
  (newSubwayList) => {
    subwayList.value = newSubwayList;
  }
);
</script>

<template>
  <div class="subway-container">
    <div class="header">
      <h2 class="title">주변 대중교통</h2>
      <div class="location-wrapper">
        <svg xmlns="http://www.w3.org/2000/svg" class="location-icon" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"/>
        </svg>
        <span>지하철 1km 이내</span>
      </div>
    </div>

    <div class="section-divider">
      <div class="subway-header">
        <img src="@/assets/subway-icon.png" alt="지하철 아이콘" class="subway-icon"/>
        <h4>지하철</h4>
      </div>
    </div>

    <div class="routes-list">
      <template v-for="(subway, index) in subwayList" :key="index">
        <div class="route-item" :class="{ 'route-item-hover': true }">
          <div class="route-left">
            <div class="route-circle" :style="{ 'background-color': subway.color }">
              {{ subway.lineNm }}
            </div>
            <span class="station-name">{{ subway.station }}</span>
          </div>
          <div class="distance">
            <span>{{ subway.dist }}m</span>
            <span class="walk-time">도보 {{ subway.walk }}분</span>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.subway-container {
  padding: 1.5rem;
  border-radius: 1rem;
  background: white;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  max-width: 600px;
  margin: 0 auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
}

.location-wrapper {
  display: flex;
  align-items: center;
  font-size: 0.875rem;
  color: #6b7280;
  background: #f3f4f6;
  padding: 0.5rem 0.75rem;
  border-radius: 1rem;
  transition: all 0.2s ease;
}

.location-wrapper:hover {
  background: #e5e7eb;
}

.location-icon {
  width: 1rem;
  height: 1rem;
  margin-right: 0.5rem;
  color: #6b7280;
}

.section-divider {
  border-bottom: 1px solid #e5e7eb;
  margin-bottom: 0.5rem;
}

.subway-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}

.subway-header h4 {
  margin: 0;
  color: #4b5563;
  font-weight: 600;
  font-size: 1rem;
}

.subway-icon {
  height: 1.25rem;
  width: auto;
}

.routes-list {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.route-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.2rem;
  border-radius: 0.75rem;
  transition: all 0.2s ease;
}

.route-item-hover:hover {
  background-color: #f8fafc;
}

.route-left {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.route-circle {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.875rem;
  font-weight: 600;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.station-name {
  font-size: 1rem;
  color: #1f2937;
  font-weight: 500;
}

.distance {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.25rem;
  font-size: 0.875rem;
  color: #6b7280;
}

.walk-time {
  color: #9ca3af;
  font-size: 0.75rem;
}

@media (max-width: 640px) {
  .subway-container {
    padding: 1rem;
    border-radius: 0.75rem;
  }

  .title {
    font-size: 1.25rem;
  }

  .route-circle {
    width: 1.75rem;
    height: 1.75rem;
  }
}
</style>