<template>
  <section class="end-section">
    <div v-if="isLoaded" class="content-wrapper">
      <!-- Background Elements -->
      <div class="background-elements">
        <div class="circle circle-1"></div>
        <div class="circle circle-2"></div>
        <div class="floating-shape shape-1"></div>
        <div class="floating-shape shape-2"></div>
      </div>

      <!-- Main Content -->
      <div class="text-container">
        <!-- Subtitle -->
        <p
          class="subtitle"
          data-aos="fade-up"
          data-aos-duration="800"
          data-aos-delay="200"
        >
          Find your perfect space
        </p>

        <!-- Main Message -->
        <div
          class="message-container"
          data-aos="fade-up"
          data-aos-duration="1000"
          data-aos-delay="400"
        >
          <h2 class="main-heading">
            <span class="text-line">당신의 삶에</span>
            <span class="text-line">꼭 맞는 공간</span>
            <span class="text-highlight">지금 바로 찾아보세요</span>
          </h2>
        </div>

        <!-- Action Section -->
        <div
          class="action-section"
          data-aos="fade-up"
          data-aos-duration="1000"
          data-aos-delay="600"
        >

          <RouterLink to="/login">
          <button class="start-button" @click="handleStart">
            <span class="button-text">시작하기</span>
            <span class="button-icon">→</span>
          </button>
          </RouterLink>

        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import AOS from 'aos'
import 'aos/dist/aos.css'
import { RouterLink } from 'vue-router'

const isLoaded = ref(false)

const handleStart = () => {
  console.log('Start button clicked')
}

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
.end-section {
  background-color: #66b56b;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
}

.content-wrapper {
  max-width: 1400px;
  width: 100%;
  padding: 2rem;
  position: relative;
  z-index: 2;
}

/* Background Elements Styling */
.background-elements {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.circle {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
}

.circle-1 {
  width: 400px;
  height: 400px;
  top: -100px;
  right: -100px;
  animation: float 8s infinite ease-in-out;
}

.circle-2 {
  width: 300px;
  height: 300px;
  bottom: -50px;
  left: -50px;
  animation: float 6s infinite ease-in-out reverse;
}

.floating-shape {
  position: absolute;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 30px;
}

.shape-1 {
  width: 200px;
  height: 200px;
  top: 20%;
  left: 10%;
  transform: rotate(45deg);
  animation: float 7s infinite ease-in-out;
}

.shape-2 {
  width: 150px;
  height: 150px;
  bottom: 20%;
  right: 15%;
  transform: rotate(30deg);
  animation: float 9s infinite ease-in-out reverse;
}

/* Text Container Styling */
.text-container {
  text-align: center;
  color: white;
  position: relative;
  z-index: 2;
}

.subtitle {
  font-size: 1.5rem;
  font-weight: 500;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  opacity: 0.9;
  margin-bottom: 2rem;
}

.message-container {
  margin: 3rem 0;
}

.main-heading {
  font-size: 5.5rem;
  font-weight: 700;
  line-height: 1.2;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.text-line {
  display: block;
  margin-bottom: 0.5rem;
  transform: translateY(20px);
  opacity: 0;
  animation: slideUp 0.8s forwards;
  animation-delay: calc(var(--index) * 0.2s);
}

.text-highlight {
  display: block;
  font-size: 7rem;
  background: linear-gradient(to right, #ffffff, #e0e0e0);
  -webkit-background-clip: text;
  color: transparent;
  margin-top: 2rem;
  transform: translateY(20px);
  opacity: 0;
  animation: slideUp 0.8s forwards;
  animation-delay: 0.4s;
}

/* Button Styling */
.action-section {
  margin-top: 4rem;
}

.start-button {
  background: rgba(255, 255, 255, 0.9);
  color: #66b56b;
  font-size: 2rem;
  font-weight: 600;
  padding: 1.5rem 4rem;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.start-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.1);
  transform: translateX(-100%);
  transition: transform 0.6s ease;
}

.start-button:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.start-button:hover::before {
  transform: translateX(0);
}

.button-text {
  position: relative;
  z-index: 2;
}

.button-icon {
  position: relative;
  z-index: 2;
  transition: transform 0.3s ease;
}

.start-button:hover .button-icon {
  transform: translateX(5px);
}

/* Animations */
@keyframes float {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-100px) rotate(10deg);
  }
}

@keyframes slideUp {
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .main-heading {
    font-size: 3.5rem;
  }

  .text-highlight {
    font-size: 4rem;
  }

  .subtitle {
    font-size: 1.2rem;
  }

  .start-button {
    font-size: 1.6rem;
    padding: 1.2rem 3rem;
  }

  .circle-1 {
    width: 200px;
    height: 200px;
  }

  .circle-2 {
    width: 150px;
    height: 150px;
  }

  .floating-shape {
    display: none;
  }
}
</style>
