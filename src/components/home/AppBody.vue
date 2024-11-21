<template>
  <main class="body-container">
    <div class="content-wrapper">
      <!-- AOS 애니메이션이 적용된 텍스트 섹션 -->
      <div class="text-content" data-aos="fade-right" data-aos-duration="1000" ref="textContent">
        <h1 class="main-text">
          <div>내가</div>
          <div>살게 될 집이</div>
          <div>궁금할 때는?</div>
        </h1>
        <div class="brand-name">HOME SCOUT</div>
      </div>

      <!-- AOS 애니메이션이 적용된 이미지 섹션 -->
      <div class="location-icon" data-aos="zoom-in" data-aos-duration="1000" ref="locationIcon">
        <img src="@/assets/main01.png" alt="Location Pin Icon" />
      </div>
    </div>
  </main>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import AOS from 'aos'

// 텍스트와 이미지에 대한 참조
const textContent = ref(null)
const locationIcon = ref(null)

onMounted(() => {
  // AOS 초기화
  AOS.init({
    duration: 800,
    once: false, // 애니메이션 반복
    offset: 120,
  })

  // 강제로 AOS 애니메이션 트리거
  triggerAOS()
})

// AOS 애니메이션 강제 실행
function triggerAOS() {
  if (textContent.value) {
    textContent.value.classList.add('aos-animate') // 텍스트 애니메이션
  }
  if (locationIcon.value) {
    locationIcon.value.classList.add('aos-animate') // 이미지 애니메이션
  }
}
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
  width: 220px;
  height: 220px;
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
