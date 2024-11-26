<template>
  <h1 class="quiz-title">{{ title }}</h1>
</template>

<script setup>
import { defineProps } from 'vue'

defineProps({
  title: {
    type: String,
  }
})

</script>

<style scoped>
/* .quiz-title {
  font-size: 24px;
  font-weight: bold;
  margin: 20px 0;
  text-align: center;
} */

.quiz-title {
  /* 기본 타이포그래피 설정 */
  font-size: 38px;
  font-weight: 800; /* 더 강한 굵기로 중요성 강조 */
  text-align: center;
  color: #4d4d4d; /* 브랜드 컬러와 어울리는 녹색 계열 */

  /* 여백 및 정렬 */
  padding: 0 20px;
  line-height: 1.4;
  letter-spacing: -0.5px;
  margin-bottom: 40px;

  /* 포지셔닝 */
  position: relative;

  /* 부드러운 전환 효과 */
  transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);

  /* 입체감을 위한 텍스트 그림자 */
  text-shadow:
    2px 2px 2px rgba(0, 0, 0, 0.1),  /* 우하단 그림자 */
    0 4px 4px rgba(0, 0, 0, 0.05);   /* 아래쪽 부드러운 그림자 */
}

/* 제목 위의 장식 요소 */
.quiz-title::before {
  position: absolute;
  top: -40px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 24px;
  opacity: 0.8;
  animation: float 3s ease-in-out infinite;
}

/* 제목 아래 밑줄 효과 */
.quiz-title::after {
  content: '';
  position: absolute;
  bottom: -15px;
  left: 50%;
  width: 200px;
  height: 4px; /* 높이 증가 */

  /* 그라데이션 효과 개선 */
  background: linear-gradient(
    to right,
    rgba(44, 95, 45, 0.2),  /* 연한 녹색 시작 */
    rgba(44, 95, 45, 0.8) 50%,  /* 진한 녹색 중간 */
    rgba(44, 95, 45, 0.2)   /* 연한 녹색 끝 */
  );

  /* 위치 및 스타일링 */
  transform: translateX(-50%);
  border-radius: 4px;

  /* 그림자 효과로 입체감 추가 */
  box-shadow:
    0 2px 4px rgba(0, 0, 0, 0.1),
    0 1px 2px rgba(0, 0, 0, 0.05);
}
</style>
