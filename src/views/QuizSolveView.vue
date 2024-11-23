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
  <div class="swiper-container">
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
.swiper-container {
  width: 100%;
  height: 100%;
  position: relative;
}

.swiper-slide {
  height: 90vh
}

</style>
