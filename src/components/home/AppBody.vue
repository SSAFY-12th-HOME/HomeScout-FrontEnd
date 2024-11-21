<!-- AppBody.vue -->
<template>
  <main class="body-container">
    <div class="content-wrapper">
      <!-- AOS 애니메이션이 적용된 텍스트 섹션 -->
      <div class="text-content" data-aos="fade-right" data-aos-duration="1000" data-aos-delay="700">
        <h1 class="main-text">
          <div>내가</div>
          <div>살게 될 집이</div>
          <div>궁금할 때는?</div>
        </h1>
        <div class="brand-name">HOME SCOUT</div>
      </div>

      <!-- AOS 애니메이션이 적용된 이미지 섹션 -->
      <div class="location-icon" data-aos="zoom-in" data-aos-duration="1000" data-aos-delay="700">
        <img src="@/assets/main01.png" alt="Location Pin Icon" />
      </div>
    </div>
  </main>
</template>

<script setup>
import { onMounted } from 'vue'
import AOS from 'aos'
import 'aos/dist/aos.css'

onMounted(() => {
  AOS.init({
    // AOS 초기화 옵션
    duration: 1000, // 애니메이션 지속 시간 (ms)
    delay: 0, // 애니메이션 시작 전 지연 시간 (ms)
    once: true, // 애니메이션을 한 번만 실행
    mirror: false, // 요소가 스크롤 방향에 따라 애니메이션을 다시 실행하지 않음
  })
})
</script>

<style scoped>
.body-container {
  background-color: #66b56b;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  padding: 2rem;
}

.content-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  width: 100%;
  max-width: 1400px;
}

.text-content {
  color: white;
  text-align: left;
}

.main-text {
  font-size: 5rem;
  font-weight: bold;
  line-height: 1.2;
  margin-bottom: 1.5rem;
}

.brand-name {
  font-size: 3rem;
  font-weight: bold;
}

.location-icon {
  width: 300px;
  height: 300px;
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
    font-size: 3rem;
  }

  .brand-name {
    font-size: 2.5rem;
  }

  .location-icon {
    margin-top: 1.5rem;
    width: 180px;
    height: 180px;
  }
}
</style>
