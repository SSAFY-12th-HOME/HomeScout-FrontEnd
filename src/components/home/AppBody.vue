<template>
  <main class="body-container">
    <div v-if="isLoaded">
      <!-- 배경 요소들 -->
      <div class="background-elements">
        <div class="gradient-orb orb-1"></div>
        <div class="gradient-orb orb-2"></div>
        <div class="floating-line line-1"></div>
        <div class="floating-line line-2"></div>
      </div>

      <div class="content-wrapper">
        <!-- 텍스트 섹션 -->
        <div class="text-content">
          <!-- 서브타이틀 -->


          <!-- 메인 텍스트 -->
          <h1
            class="main-text"
            data-aos="fade-up"
            data-aos-duration="1000"
            data-aos-delay="150"
          >
            <div class="text-line">내가</div>
            <div class="text-line emphasis">살게 될 집이</div>
            <div class="text-line gradient-text">궁금할 때는?</div>
          </h1>

          <!-- 브랜드명 -->
          <div
            class="brand-container"
            data-aos="fade-up"
            data-aos-duration="1000"
            data-aos-delay="150"
          >
            <div class="brand-line"></div>
            <div class="brand-name">HOME SCOUT</div>
          </div>
        </div>

        <!-- 이미지 섹션 -->
        <div
          class="visual-content"
          data-aos="fade-left"
          data-aos-duration="1200"
          data-aos-delay="150"
        >
          <div class="image-container">
            <img src="@/assets/main01.png" alt="Location Pin Icon" class="main-image" />
            <div class="image-backdrop"></div>
          </div>
          <!-- 부가 시각 요소 -->
          <div class="decorative-elements">
            <div class="dot-pattern"></div>
            <div class="curve-line"></div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import AOS from 'aos'
import 'aos/dist/aos.css'

const isLoaded = ref(false)

onMounted(() => {
  setTimeout(() => {
    isLoaded.value = true
    AOS.init({
      duration: 1000,
      delay: 0,
      once: true,
      mirror: false,
    })
  }, 1000)
})
</script>

<style scoped>
.body-container {
  background-color: #66b56b;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  position: relative;
  overflow: hidden;
}

/* 배경 요소 스타일링 */
.background-elements {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.gradient-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
}


.floating-line {
  position: absolute;
  background: rgba(255,255,255,0.1);
  height: 2px;
  width: 150px;
  border-radius: 2px;
}

.line-1 {
  transform: rotate(-45deg);
  top: 20%;
  left: 10%;
  animation: float 8s infinite ease-in-out;
}

.line-2 {
  transform: rotate(45deg);
  bottom: 25%;
  right: 15%;
  animation: float 10s infinite ease-in-out reverse;
}

/* 컨텐츠 레이아웃 */
.content-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 6rem;
  width: 100%;
  max-width: 1400px;
  padding: 2rem;
  position: relative;
  z-index: 2;
}

/* 텍스트 스타일링 */
.text-content {
  flex: 1;
  color: white;
  text-align: left;
}

.subtitle {
  font-size: 1.2rem;
  font-weight: 500;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  opacity: 0.9;
  margin-bottom: 2rem;
}

.main-text {
  font-size: 5.5rem;
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: 3rem;
}

.text-line {
  margin-bottom: 0.5rem;
  transform: translateX(-50px);
  opacity: 0;
  animation: slideIn 0.8s forwards;
  animation-delay: calc(var(--index) * 0.2s);
}

.emphasis {
  font-size: 6rem;
  white-space: nowrap;
}

.gradient-text {
  font-size: 5.0rem;
  background: linear-gradient(to right, #ffffff, #e0e0e0);
  -webkit-background-clip: text;
  color: transparent;
  white-space: nowrap;
}

/* 브랜드 섹션 스타일링 */
.brand-container {
  margin-top: 4rem;
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.brand-line {
  width: 60px;
  height: 2px;
  background-color: white;
  opacity: 0.8;
}

.brand-name {
  font-size: 2.5rem;
  font-weight: 600;
  letter-spacing: 0.1em;
}

/* 이미지 섹션 스타일링 */
.visual-content {
  flex: 1;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.image-container {
  position: relative;
  width: 400px;
  height: 400px;
}

.main-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  position: relative;
  z-index: 2;
  filter: drop-shadow(0 20px 40px rgba(0,0,0,0.1));
}

.image-backdrop {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90%;
  height: 90%;
  background: rgba(255,255,255,0.1);
  border-radius: 50%;
  filter: blur(40px);
  z-index: 1;
}

/* 장식 요소 스타일링 */
.decorative-elements {
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.dot-pattern {
  position: absolute;
  top: 10%;
  right: 10%;
  width: 100px;
  height: 100px;
  background-image: radial-gradient(circle, white 2px, transparent 2px);
  background-size: 15px 15px;
  opacity: 0.2;
}

.curve-line {
  position: absolute;
  bottom: 15%;
  left: 5%;
  width: 120px;
  height: 2px;
  background: rgba(255,255,255,0.2);
  transform: rotate(-30deg);
}

/* 애니메이션 */
@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
}

@keyframes slideIn {
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

/* 반응형 디자인 */
@media (max-width: 1200px) {
  .main-text {
    font-size: 4.5rem;
  }

  .emphasis, .gradient-text {
    font-size: 5rem;
  }

  .image-container {
    width: 350px;
    height: 350px;
  }
}

@media (max-width: 768px) {
  .content-wrapper {
    flex-direction: column;
    text-align: center;
    gap: 3rem;
  }

  .main-text {
    font-size: 3.5rem;
  }

  .emphasis, .gradient-text {
    font-size: 4rem;
  }

  .brand-container {
    justify-content: center;
  }

  .image-container {
    width: 280px;
    height: 280px;
  }

  .text-line {
    transform: translateY(20px);
  }

  .brand-name {
    font-size: 4rem;
  }

  .dot-pattern, .curve-line {
    display: none;
  }
}
</style>
