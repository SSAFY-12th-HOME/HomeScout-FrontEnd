<template>
  <div class="container">
    <div class="content-wrapper">
      <!-- Left text content -->
      <div class="text-content" data-aos="fade-right" data-aos-duration="1000" data-aos-delay="200">
        <h3 class="section-title">AI 팟캐스트</h3>
        <h2 class="main-heading">
          <p>나만의 맞춤형 AI 팟캐스트로</p>
          <p>풍부한 인사이트를</p>
          <p>제공받아 보세요.</p>
        </h2>
        <button
          class="podcast-button"
          data-aos="zoom-in"
          data-aos-duration="1000"
          data-aos-delay="400"
        >
          AI 팟캐스트
        </button>
      </div>

      <!-- Right content -->
      <div class="podcast-content" data-aos="zoom-in" data-aos-duration="1000" data-aos-delay="200">
        <!-- First Quote -->
        <div class="quote-box" data-aos="fade-right" data-aos-duration="1000" data-aos-delay="800">
          <p class="quote-text align-right">
            "최근 몇 년 동안 가격이 <br />
            급등하면서, 특히 서울<br />
            지역에서는 많은 변화가 <br />있었죠."
          </p>
          <img
            src="/src/assets/podcast01.png"
            alt="Speaker 1"
            class="speaker-image"
            data-aos="zoom-in"
            data-aos-duration="1000"
            data-aos-delay="500"
          />
        </div>

        <!-- Second Quote -->
        <div class="quote-box" data-aos="fade-left" data-aos-duration="1000" data-aos-delay="800">
          <img src="/src/assets/podcast02.png" alt="Speaker 2" class="speaker-image" />
          <p class="quote-text align-left" style="width: 300px">
            "네, 맞아요.<br />
            최근 통계를 보면, 서울과 <br />수도권은 여전히 높은<br />
            가격대를 유지하고 있지만..."
          </p>
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
  AOS.init() // Initialize AOS animations
})
</script>

<style scoped>
/* Container for the entire section */
.container {
  background-color: #66b56b;
  padding: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh; /* Full screen height */
}

/* Wrapper for content layout */
.content-wrapper {
  display: flex;
  justify-content: space-between; /* Spread the content evenly */
  align-items: flex-start; /* Align content at the top */
  max-width: 1200px;
  width: 100%;
  gap: 50px; /* Space between left and right content */
  justify-content: center;
}

/* Text content on the left */
.text-content {
  flex: 0 1 500px; /* Adjust flex-grow and width */
  color: #2c2c2c;
  text-align: left;
  line-height: 1.6; /* 텍스트 줄 간격 조정 */
}

.section-title {
  font-size: 4rem;
  font-weight: bold;
  margin-bottom: 1rem;
  color: white;
  margin-bottom: 3rem; /* 아래 여백 */
}

.main-heading {
  font-size: 2.5rem;
  font-weight: bold;
  line-height: 1.5;
  margin-bottom: 3rem;
  color: #2c2c2c;
}

.podcast-button {
  background-color: white;
  border: none;
  padding: 14px 28px;
  border-radius: 8px;
  font-size: 1.4rem;
  color: #66b56b;
  cursor: pointer;
  font-weight: bold;
  transition:
    background-color 0.3s ease,
    color 0.3s ease;
}

.podcast-button:hover {
  background-color: #e6e6e6;
  color: #66b56b;
  transform: scale(1.05);
}

/* Podcast content on the right */
.podcast-content {
  flex: 0 1 600px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  background-color: #beedc1;
  border-radius: 20px;
  padding: 20px;
}

/* Quote box */
.quote-box {
  border-radius: 16px;
  padding: 20px;
  justify-content: space-between;
  display: flex;
  align-items: flex-start;
  /* box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); */
  gap: 10px;
}

.quote-text {
  font-size: 1.6rem;
  font-weight: 400;
  line-height: 1.6;
  max-width: 600px;
  color: #3e3d3d;
  flex: 1;
  font-weight: bold;
  margin-top: 50px;
  margin-left: 10px;
  margin-right: 20px;
}

.speaker-image {
  width: 230px;
  height: 230px;
  object-fit: cover;
}

/* Text alignment classes */
.align-right {
  text-align: right; /* Right-align the text */
}

.align-left {
  text-align: left; /* Left-align the text */
}
</style>
