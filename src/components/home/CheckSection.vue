<template>
  <div class="container">
    <div class="content-wrapper">
      <!-- Left Text Content -->
      <div class="text-content" data-aos="fade-right" data-aos-duration="1000" data-aos-delay="100">
        <h3 class="section-title">전세 진단</h3>
        <h2 class="main-heading">
          <p>전세 계약 전,</p>
          <p>다시 한 번 확인해보세요.</p>
        </h2>
        <!-- AOS 애니메이션을 버튼의 부모에 적용 -->
        <div data-aos="zoom-in" data-aos-duration="1000" data-aos-delay="400">
          <button class="diagnosis-button">전세 진단하기</button>
        </div>
      </div>

      <!-- Right Quiz Card -->
      <div class="quiz-card" data-aos="fade-left" data-aos-duration="1000" data-aos-delay="100">
        <img src="/src/assets/check01.png" alt="Illustration" class="quiz-card-image" />
      </div>
    </div>

    <!-- Bottom Illustration -->
    <div class="illustration" data-aos="zoom-in" data-aos-duration="1000" data-aos-delay="700">
      <img src="/src/assets/check02.png" alt="Illustration" class="illustration-image" />
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import AOS from 'aos'
import 'aos/dist/aos.css'

onMounted(() => {
  AOS.init({
    duration: 1000,
    easing: 'ease-in-out',
    once: true,
  })
})
</script>

<style scoped>
/* Container */
.container {
  background-color: #66b56b;
  padding: 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  gap: 50px;
  height: 100vh; /* Full screen height */
  overflow: hidden; /* Prevent content from overflowing */
}

/* Content Wrapper */
.content-wrapper {
  display: flex;
  justify-content: center; /* 중앙 정렬 */
  align-items: center; /* 세로 정렬 */
  max-width: 1200px;
  width: 100%;
}

/* Text Content */
.text-content {
  flex: 1;
  text-align: left;
  color: white;
  max-width: 400px;
}

.section-title {
  font-size: 4rem;
  font-weight: bold;
  margin-bottom: 1rem;
}

.main-heading {
  font-size: 2.5rem;
  font-weight: bold;
  line-height: 1.5;
  margin-bottom: 2rem;
  color: #2c2c2c;
}

.diagnosis-button {
  background-color: white;
  color: #66b56b;
  border: none;
  padding: 12px 24px;
  font-size: 1.2rem;
  font-weight: bold;
  border-radius: 8px;
  cursor: pointer;
  transition:
    transform 0.3s ease,
    background-color 0.3s ease;
}

.diagnosis-button:hover {
  background-color: #e6e6e6;
  transform: scale(1.05);
}

/* Quiz Card */
.quiz-card {
  flex: 1;
  display: flex;
  justify-content: center; /* 중앙 정렬 */
  align-items: center; /* 세로 정렬 */
  max-width: 320px; /* 크기를 줄이기 */
  margin: 0; /* 불필요한 여백 제거 */
  padding: 0; /* 내부 여백 제거 */
  margin-top: 40px;
  margin-left: 100px;
}

.quiz-card-image {
  max-width: 350px; /* Limit the size of the image */
  width: 100%;
  height: auto;
  border-radius: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  background-color: white;
}

/* Bottom Illustration */
.illustration {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 30%;
  margin-top: 20px;
  margin-bottom: 20px;
}

.illustration-image {
  max-width: 800px; /* Larger size but within bounds */
  width: 100%;
  height: auto;
}
</style>
