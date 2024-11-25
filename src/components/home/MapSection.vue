<template>
  <div class="container">
    <div class="content-wrapper">
      <!-- Left text content -->
      <div class="text-content" data-aos="fade-right" data-aos-duration="1000" data-aos-delay="150">
        <h2 class="section-title">지도 보기</h2>
        <div class="text-block">
          <p>나의 보금자리 선택,</p>
          <p>명확한 시각적 정보로</p>
          <p>더욱 쉽고 똑똑하게</p>
        </div>
        <button class="map-button">지도보러 가기</button>
      </div>

      <!-- Right map images -->
      <div class="map-content" data-aos="fade-left" data-aos-duration="1000" data-aos-delay="150">
        <div class="map-box map-vertical">
          <img src="/src/assets/map01.png" alt="Map view 1" />
        </div>
        <div class="map-box map-horizontal">
          <img src="/src/assets/map02.png" alt="Map view 2" />
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
/* Container for the entire section */
.container {
  background-color: white;
  padding: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh; /* Make it full screen */
}

/* Wrapper for content layout */
.content-wrapper {
  display: flex;
  justify-content: center; /* Centralize content */
  align-items: center;
  max-width: 1200px;
  width: 100%;
  gap: 50px; /* Slight gap to ensure content spacing */
}

/* Text content on the left */
.text-content {
  flex: 0 1 500px; /* Adjust flex-grow and width to center content */
  max-width: 300px; /* Limit the width to match the text */
  color: #66b56b; /* Set text color */
  text-align: left;
}

.text-content h2 {
  font-size: 4rem; /* Larger heading size */
  font-weight: 800; /* Bold font */
  margin-bottom: 1.5rem;
}

.text-block p {
  font-size: 2.2rem; /* Slightly larger paragraph text */
  font-weight: bold; /* Bold weight for better emphasis */
  line-height: 2.2;
  color: #2c2c2c;
}

/* Button for navigation */
.map-button {
  background-color: #66b56b;
  border: none;
  padding: 14px 28px;
  border-radius: 20px;
  font-size: 1.4rem; /* Larger button text */
  color: white;
  cursor: pointer;
  margin-top: 20px;
  font-weight: bold;
  transition:
    background-color 0.3s ease,
    color 0.3s ease;
}

.map-button:hover {
  background-color: #4a9b53;
  color: white;
  transform: scale(1.05);
}

/* Map content on the right */
.map-content {
  flex: 0 1 45%; /* Occupy 45% of the width */
  display: flex;
  flex-direction: column;
  gap: 20px; /* Space between the two maps */
  align-items: flex-end; /* Align maps to the right */
  max-width: 400px;
}

/* White background and shadow for each map */
.map-box {
  background: #66b56b;
  border-radius: 16px;
  padding: 7px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden; /* Ensure the image doesn't overflow the box */

  /* 추가된 호버 효과 */
  transition: transform 0.3s ease; /* 부드러운 전환 효과 */
}

.map-box:hover {
  transform: scale(1.05); /* 호버 시 전체 박스 크기 5% 증가 */
}

/* Specific dimensions for the vertical map */
.map-vertical {
  width: 300px; /* Fixed width */
  height: 400px; /* Taller height for vertical orientation */
}

/* Specific dimensions for the horizontal map */
.map-horizontal {
  width: 400px; /* Wider width */
  height: 300px; /* Shorter height for horizontal orientation */
}

/* Image styling for both maps */
.map-box img {
  width: 100%;
  height: 100%;
  object-fit: cover; /* Maintain aspect ratio */
  border-radius: 8px;

  /* 기존 이미지 호버 효과 제거 */
  /* transition: transform 0.3s ease; */
}

/* 기존 이미지 호버 효과 제거 */
/* .map-box img:hover {
    transform: scale(1.05);
  } */

.section-title {
  font-size: 4rem;
  font-weight: bold;
  margin-bottom: 1rem;
  margin-bottom: 3rem; /* 아래 여백 */
}
</style>
