<script setup>
import { ref, onMounted } from 'vue'

const favorites = ref([])

const fetchFavorites = async () => {
  try {
    const response = await fetch('/api/user/favorites')
    favorites.value = await response.json()
  } catch (error) {
    console.error('관심 매물 로딩 실패:', error)
  }
}

onMounted(() => {
  fetchFavorites()
})
</script>

<template>
  <div class="favorites">
    <div class="properties-grid">
      <div v-for="property in favorites" :key="property.id" class="property-card">
        <img :src="property.image" :alt="property.title" class="property-image">
        <div class="property-info">
          <h3>{{ property.title }}</h3>
          <p>{{ property.price }}만원</p>
          <div class="agent-info">
            <img :src="property.agentImage" :alt="property.agentName" class="agent-image">
            <span>{{ property.agentName }}</span>
            <span>{{ property.agentPhone }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.properties-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}

.property-card {
  border: 1px solid #eee;
  border-radius: 8px;
  overflow: hidden;
}

.property-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.property-info {
  padding: 1rem;
}

.agent-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;
}

.agent-image {
  width: 24px;
  height: 24px;
  border-radius: 50%;
}
</style>