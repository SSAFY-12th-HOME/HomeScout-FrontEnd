<template>
  <main class="body-container">
    <div class="content-wrapper">
      <div class="text-content">
        <h1 class="main-text">
          <div>내가</div>
          <div>살게 될 집이</div>
          <div>궁금할 때는?</div>
        </h1>
        <div class="brand-name">HOME SCOUT</div>
      </div>
      <div class="location-icon">
        <!-- <img src="@/assets/location-pin.svg" alt="Location Pin Icon" /> -->
        img
      </div>
    </div>
  </main>
</template>

<script setup>
import { onMounted } from 'vue'
import AOS from 'aos'

onMounted(() => {
  AOS.init({
    duration: 800,
    once: false,
    offset: 120,
  })
})
</script>

<style scoped>
.container {
  padding: 20px;
}

.card {
  margin: 200px auto;
  padding: 20px;
  width: 300px;
  border: 1px solid #ccc;
  border-radius: 8px;
  text-align: center;
}

.body-container {
  background-color: #66b56b;
  /* min-height: calc(100vh - 60px); */
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.content-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 1200px;
  padding: 0 2rem;
}

.text-content {
  color: white;
}

.main-text {
  font-size: 3.5rem;
  font-weight: bold;
  line-height: 1.3;
  margin-bottom: 1.5rem;
}

.brand-name {
  font-size: 2.5rem;
  font-weight: bold;
  margin-top: 2rem;
}

.location-icon {
  width: 200px;
  height: 200px;
}

.location-icon img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

@media (max-width: 768px) {
  .content-wrapper {
    flex-direction: column;
    text-align: center;
  }

  .main-text {
    font-size: 2.5rem;
  }

  .brand-name {
    font-size: 2rem;
  }

  .location-icon {
    margin-top: 2rem;
    width: 150px;
    height: 150px;
  }
}
</style>
