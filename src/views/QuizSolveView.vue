<script setup>
import { onMounted, ref } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { Navigation, Pagination } from 'swiper/modules'

import QuizPage from '@/components/quiz/QuizPage.vue'
import QuizResult from '@/components/quiz/QuizResult/QuizResult.vue'

import { getQuiz, solveQuiz } from '@/api/quiz'

import { useRoute, useRouter } from 'vue-router'

// Reference to the Swiper instance
const route = useRoute()
const router = useRouter()
const mySwiper = ref(null)
const quizData = ref({})
const solveData = ref([])
const totalCount = ref(0)
const correctCount = ref(0)
const exp = ref(0)

onMounted(() => {
  getQuiz(
    route.params.quizId,
    ({ data }) => {
      quizData.value = data
    },
    () => {
      console.log('퀴즈 불러오기 실패')
    }
  )
})

// Function to navigate to the next slide
const slideNext = (quizQuestionId, option) => {
  if (mySwiper.value && mySwiper.value.slideNext && option.length != 0) {
    solveData.value.push({quizQuestionId, option})
    console.log(mySwiper.value.activeIndex)
    console.log(quizData.value.questions.length)
    if(mySwiper.value.activeIndex === quizData.value.questions.length - 1) {
      solveQuiz(
        route.params.quizId, { solve: solveData.value },
        ({ data }) => {
          totalCount.value = data.totalCount
          correctCount.value = data.correctCount
          exp.value = data.exp
        },
        () => {
          console.log('solve오류')
        }
      )
      console.log(mySwiper.value)
    }
    mySwiper.value.slideNext()
  }
  // console.log(mySwiper.value.activeIndex)
  // console.log(solveData.value)
}

// Event handler when Swiper instance is initialized
const onSwiper = (swiper) => {
  mySwiper.value = swiper
}

// Event handler for slide change
const onSlideChange = () => {
  console.log('Slide changed')
}

const handleRestart = () => {
  solveData.value = []
  mySwiper.value.slideNext()
}

const handleQuizList = () => {
  router.push('/quiz')
}

</script>

<template>
    <div class="quiz-wrapper">
      <Swiper
        :speed="800"
        :modules="[Navigation, Pagination]"
        :spaceBetween="0"
        :slidesPerView="1"
        :rewind="true"
        :allow-touch-move="false"
        @swiper="onSwiper"
        @slideChange="onSlideChange"
        direction="horizontal"
        ref="mySwiper"
      >
        <SwiperSlide
          v-for="(question, index) in quizData.questions"
          :key="index"
        >
          <QuizPage
            :quiz-index="index + 1"
            :quiz-title="quizData.title"
            :question="question.question"
            :quiz-option="question.options"
            :quiz-question-id="question.quizQuestionId"
            @next="slideNext"
          />
        </SwiperSlide>
        <SwiperSlide>
          <QuizResult
            :total-questions="totalCount"
            :correct-answers="correctCount"
            :exp="exp"
            @restart="handleRestart"
            @quizList="handleQuizList"
          />
        </SwiperSlide>
      </Swiper>
    </div>
</template>

<style scoped>
.quiz-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  max-width: 800px;
  padding: 2.5rem;
  background: #B4E4B7;
  border-radius: 24px;
  margin: 0 auto;
  border: 1px solid rgba(255, 255, 255, 0.4);
  /* 첫 번째 그림자: 내부 하이라이트 효과 */
  box-shadow:
    inset 0 2px 4px rgba(255, 255, 255, 0.5),
      /* 안쪽 상단에 밝은 그림자로 돌출 효과 생성 */

      /* 두 번째 그림자: 외부 그림자로 깊이감 추가 */
    0 4px 8px rgba(0, 0, 0, 0.1),

      /* 세 번째 그림자: 더 넓은 영역의 부드러운 그림자 */
    0 8px 16px rgba(0, 0, 0, 0.1);

  /* 배경 그라데이션 추가로 입체감 강화 */
  background: #B4E4B7;

  /* 요소 변화에 대한 부드러운 전환 효과 */
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  margin-top: 70px;
}

/* hover 시 입체감 강화 */
.quiz-wrapper:hover {
  /* 살짝 떠오르는 효과 */
  /* transform: translateY(-5px); */

  /* hover 시 그림자 강화 */
  box-shadow:
    inset 0 2px 4px rgba(255, 255, 255, 0.5),
    0 8px 16px rgba(0, 0, 0, 0.1),
    0 16px 32px rgba(0, 0, 0, 0.1);
}
.swiper-slide {
  height: 63vh
}

</style>
