<script setup>
import { ref } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { Navigation, Pagination } from 'swiper/modules'
import QuizPage from '@/components/quiz/QuizPage.vue'
import QuizResult from '@/components/quiz/QuizResult/QuizResult.vue'

// Reference to the Swiper instance
const mySwiper = ref(null)

// Function to navigate to the next slide
const slideNext = () => {
  if (mySwiper.value && mySwiper.value.slideNext) {
    mySwiper.value.slideNext()
  }
}

// Function to navigate to the previous slide
const slidePrev = () => {
  if (mySwiper.value && mySwiper.value.slidePrev) {
    mySwiper.value.slidePrev()
  }
}

// Event handler when Swiper instance is initialized
const onSwiper = (swiper) => {
  mySwiper.value = swiper
}

// Event handler for slide change
const onSlideChange = () => {
  console.log('Slide changed')
}


const quizData = {
  'quizId': 1,
  'title': 'JavaScript Fundamentals',
  'desc': 'Test your knowledge of JavaScript basics',
  'questions': [
    {
      'questionId': 101,
      'quizId': 1,
      'content': 'What is the correct way to declare a variable in JavaScript?',
      'answer': 2,
      'options': [
        {
          'optionId': 1001,
          'content': 'variable x = 5'
        },
        {
          'optionId': 1002,
          'content': 'let x = 5'
        },
        {
          'optionId': 1003,
          'content': 'x := 5'
        },
        {
          'optionId': 1004,
          'content': 'x => 5'
        }
      ]
    },
    {
      'questionId': 102,
      'quizId': 1,
      'content': 'Which method is used to add elements to the end of an array?',
      'answer': 1,
      'options': [
        {
          'optionId': 1005,
          'content': 'push()'
        },
        {
          'optionId': 1006,
          'content': 'append()'
        },
        {
          'optionId': 1007,
          'content': 'add()'
        },
        {
          'optionId': 1008,
          'content': 'insert()'
        }
      ]
    }
  ]
}

</script>

<template>
  <div class="swiper-container">
    <Swiper
      :speed="800"
      :modules="[Navigation, Pagination]"
      :spaceBetween="0"
      :slidesPerView="1"
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
          :question="question.content"
          :quiz-option="question.options"
          @next="slideNext"
        />
      </SwiperSlide>
      <SwiperSlide>
        <QuizResult correct-answers="" total-questions=""></QuizResult>
      </SwiperSlide>
    </Swiper>
  </div>
</template>

<style scoped>
.swiper-container {
  width: 100%;
  height: 100vh;
  position: relative;
	top: 140px;
}

</style>
