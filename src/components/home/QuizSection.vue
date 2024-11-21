<template>
  <div class="container">
    <!-- Top Section -->
    <div class="top-section" data-aos-delay="100">
      <!-- Left Text Content -->
      <div class="text-content" data-aos="fade-right" data-aos-duration="1000" data-aos-delay="100">
        <h2 class="section-title">퀴즈 풀이</h2>
        <h3 class="main-heading">
          부동산,<br />
          기본기를 다져보자!
        </h3>
        <button class="quiz-button">퀴즈 풀이하기</button>
      </div>

      <!-- Right Image Content -->
      <div
        class="image-content"
        data-aos="fade-right"
        data-aos-duration="1000"
        data-aos-delay="100"
      >
        <img src="/src/assets/quiz01.png" alt="Quiz preview" class="quiz-image" />
      </div>
    </div>

    <!-- Bottom Section -->
    <div class="bottom-section" data-aos-delay="600">
      <!-- Left Quiz Card -->
      <div class="bottom-content">
        <div
          class="image-content"
          data-aos="fade-left"
          data-aos-duration="1000"
          data-aos-delay="600"
        >
          <img src="/src/assets/quiz02.png" alt="Quiz card" class="quiz-card-image" />
        </div>

        <!-- Right Badge and Profile Section -->
        <div
          class="badge-section"
          data-aos="fade-left"
          data-aos-duration="1000"
          data-aos-delay="600"
        >
          <h3 class="badge-title">
            공인중개사님! <img src="/src/assets/badge.png" alt="Badge Icon" class="badge-icon" />
          </h3>
          <p class="badge-highlight">퀴즈 등록하고 스카우터 배지를 얻어보세요!</p>
          <div class="profile">
            <img src="/src/assets/profile.png" alt="Profile" class="profile-image" />
            <div class="profile-text">
              <p>
                질 좋은 퀴즈를 등록하고<br />유저들이 퀴즈를 풀 때마다<br />배지를 위한 경험치
                UP!<br />부동산 신뢰도 UP!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import AOS from 'aos'
import 'aos/dist/aos.css'

onMounted(() => {
  AOS.init()
})
</script>

<style scoped>
/* Container for the entire page */
.container {
  background-color: white;
  padding: 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 50px; /* Gap between top and bottom sections */
  margin-top: 50px;
}

/* Top Section */
.top-section {
  display: flex;
  justify-content: center; /* Center the content */
  align-items: center;
  width: 100%;
  max-width: 1200px;
  gap: 30px; /* Space between text and image */
}

/* Text Content in Top Section */
.text-content {
  flex: 1;
  text-align: left;
  max-width: 450px; /* Slightly larger max width */
  text-align: left;
}

.section-title {
  font-size: 3rem;
  font-weight: bold;
  color: #66b56b;
  margin-bottom: 1rem;
}

.main-heading {
  font-size: 2.5rem;
  font-weight: bold;
  line-height: 1.5;
  color: #2c2c2c;
  margin-bottom: 2rem;
}

.quiz-button {
  background-color: #66b56b;
  color: white;
  border: none;
  padding: 12px 24px;
  font-size: 1.2rem;
  font-weight: bold;
  border-radius: 8px;
  cursor: pointer;
  transition:
    background-color 0.3s ease,
    transform 0.3s ease;
}

.quiz-button:hover {
  background-color: #4a9b53;
  transform: scale(1.05);
}

/* Image Content in Top Section */
.image-content {
  flex: 1;
  display: flex;
  justify-content: center; /* Center align the image */
  max-width: 450px;
}

.quiz-image {
  width: 100%;
  max-width: 400px; /* Adjust image size */
  border-radius: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

/* Bottom Section */
.bottom-section {
  display: flex;
  justify-content: center; /* 전체 섹션 가운데 정렬 */
  width: 100%;
  max-width: 1200px;
  margin-left: 200px;
}

/* Bottom Content Wrapper */
.bottom-content {
  display: flex;
  justify-content: space-between; /* 요소를 좌우로 배치 */
  align-items: flex-start;
  width: 100%; /* 전체 영역을 차지하도록 */
  gap: 20px; /* 요소 간 간격 최소화 */
  padding: 0 20px; /* 양옆 패딩 추가 */
}

/* Left Quiz Card */
.image-content {
  flex: 1; /* 왼쪽 카드가 적절히 공간을 차지 */
  display: flex;
  justify-content: flex-start; /* 카드가 왼쪽으로 정렬 */
}

.quiz-card-image {
  width: 100%;
  max-width: 300px;
  border-radius: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  background-color: #66b56b;
}

/* Badge Section */
.badge-section {
  flex: 1; /* 오른쪽 섹션이 적절히 더 넓게 차지 */
  display: flex;
  flex-direction: column;
  align-items: flex-start; /* 왼쪽 정렬 */
  text-align: left;
  gap: 10px; /* 요소 간 간격 조정 */
  margin-top: 50px;
}

/* Title and Badge Icon */
.badge-title {
  font-size: 1.8rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 10px; /* 배지 아이콘과 텍스트 간 간격 최소화 */
}

.badge-icon {
  width: 30px;
  height: 30px;
}

/* Highlight Text */
.badge-highlight {
  font-size: 1.5rem;
  font-weight: bold;
  color: #66b56b;
}

/* Profile Section */
.profile {
  display: flex;
  align-items: center; /* 이미지와 텍스트를 정렬 */
  gap: 15px; /* 이미지와 텍스트 간 간격 최소화 */
}

.profile-image {
  width: 150px;
  height: 150px;
  border-radius: 50%;
}

.profile-text {
  font-size: 1.2rem;
  line-height: 1.6;
  color: #3e3d3d;
  text-align: left; /* 텍스트 왼쪽 정렬 */
  font-weight: bold;
}
</style>
