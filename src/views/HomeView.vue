<script setup>
// FullPage.js는 전체 페이지 스크롤 효과를 제공하는 라이브러리
import 'fullpage.js/dist/fullpage.min.css'

import HomeHeader from '@/components/common/HomeHeader.vue'
import AppBody from '@/components/home/AppBody.vue'
import MapSection from '@/components/home/MapSection.vue'
import PodcastSection from '@/components/home/PodcastSection.vue'
import QuizSection from '@/components/home/QuizSection.vue'
import CheckSection from '@/components/home/CheckSection.vue'

// AOS 라이브러리를 가져옵니다.
// AOS는 스크롤 시 애니메이션을 적용해주는 라이브러리입니다.
import AOS from 'aos'

import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const fullPageRef = ref(null) // FullPage.js 참조 추가

// 애니메이션의 지속 시간, 한 번만 실행할지 여부, 애니메이션 시작 위치 등을 설정합니다.
onMounted(() => {
  AOS.init({
    duration: 800, // 애니메이션의 지속 시간 (밀리초)
    once: false, // 스크롤 시마다 애니메이션을 반복할지 여부
    offset: 120, // 요소가 화면에 나타나기 시작할 위치 (픽셀)
  })

  /// 로드 시 강제로 첫 번째 섹션으로 이동
  if (route.path === '/') {
    setTimeout(() => {
      fullPageRef.value.moveTo('firstPage') // FullPage.js의 첫 섹션으로 이동
    }, 100)
  }
})

// 라우터 경로 변경 시 FullPage.js 제어
watch(
  () => route.path,
  () => {
    if (route.path === '/') {
      setTimeout(() => {
        fullPageRef.value.moveTo('firstPage') // '/' 경로에서도 첫 섹션으로 이동
        AOS.refresh()
      }, 100)
    }
  },
)

// FullPage.js의 옵션을 설정합니다.
const options = {
  menu: '#menu', // 메뉴의 ID를 지정합니다.
  anchors: ['firstPage', 'secondPage', 'thirdPage', 'fourthPage'], // 각 섹션의 앵커 이름
  navigation: true, // 오른쪽에 네비게이션 점 표시 여부
  navigationPosition: 'right', // 네비게이션 위치 (오른쪽)
  slidesNavigation: true, // 슬라이드 네비게이션 표시 여부
  slidesNavPosition: 'bottom', // 슬라이드 네비게이션 위치 (하단)

  // 섹션을 벗어날 때 실행되는 콜백 함수
  onLeave: (origin, destination, direction) => {
    const currentSection = origin.item // 현재 섹션의 DOM 요소
    const animations = currentSection.querySelectorAll('[data-aos]') // 현재 섹션 내 AOS 애니메이션 요소들
    animations.forEach((element) => {
      element.classList.remove('aos-animate') // AOS 애니메이션 클래스 제거
    })
  },

  // 섹션이 로드된 후에 실행되는 콜백 함수
  afterLoad: (origin, destination, direction) => {
    setTimeout(() => {
      AOS.refresh() // AOS 애니메이션을 새로고침
      const currentSection = destination.item // 도착한 섹션의 DOM 요소
      const animations = currentSection.querySelectorAll('[data-aos]') // 도착한 섹션 내 AOS 애니메이션 요소들
      animations.forEach((element) => {
        element.classList.add('aos-animate') // AOS 애니메이션 클래스 추가
      })
    }, 300) // 300밀리초 후에 실행
  },
}

// 라우터 경로 변경 시 AOS 트리거
watch(
  () => route.path,
  () => {
    if (route.path === '/') {
      setTimeout(() => {
        AOS.refresh()
        triggerAOS() // 수정: 라우터 경로가 '/'로 변경될 때 애니메이션 실행
      }, 100)
    }
  },
)

// 수정: 애니메이션 강제 트리거 함수
function triggerAOS() {
  const firstSection = document.querySelector('.section:first-of-type') // 첫 번째 섹션 선택
  if (firstSection) {
    const animations = firstSection.querySelectorAll('[data-aos]')
    animations.forEach((element) => {
      element.classList.add('aos-animate') // AOS 애니메이션 클래스 추가
    })
  }
}
</script>

<template>
  <HomeHeader class="fixed-header" />

  <full-page ref="fullpage" :options="options" id="fullpage">
    <!-- First section -->
    <div class="section">
      <AppBody />
    </div>

    <!-- Second section -->
    <div class="section" style="background-color: white">
      <MapSection />
    </div>

    <!-- Third section with slides -->
    <div class="section">
      <PodcastSection />
    </div>

    <!-- Fourth section -->
    <div class="section" style="background-color: white">
      <QuizSection />
    </div>

    <div class="section">
      <CheckSection />
    </div>
  </full-page>
</template>

<style scoped>
/* 헤더를 고정시키기 위한 스타일 */
.fixed-header {
  position: fixed; /* 고정 위치 */
  top: 0; /* 화면 상단에 위치 */
  left: 0; /* 화면 왼쪽에 위치 */
  width: 100%; /* 전체 너비 */
  z-index: 1000; /* 다른 요소들보다 위에 표시 */
}

/* FullPage.js 컨테이너에 상단 여백 추가 */
.fullpage-container {
  padding-top: 60px; /* 헤더의 높이에 맞게 조정 (예: 60px) */
}

/* Add some basic styling */
.section {
  text-align: center;
  font-family: Arial, sans-serif;
  background-color: #66b56b;
}

h1 {
  font-size: 4em;
  color: white;
  margin: 0;
  padding: 0;
}

p {
  color: white;
  font-size: 1.5em;
  margin-top: 20px;
}

/* Optional: Add some animations */
.fp-section.active {
  animation: fadeIn 1s;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
