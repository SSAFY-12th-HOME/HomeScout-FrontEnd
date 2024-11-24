<template>
  <div class="quiz-question">
    <p>{{ question }}</p>
  </div>
</template>

<script setup>
defineProps({
  question: {
    type: String,
    default: "부동산을 팔고 얻은 시세차익에 부과하는 조세를 무엇이라고 할까요?"
  }
})
</script>

<style scoped>
.quiz-question {
  text-align: center;
  margin: 20px;
  padding: 0 20px;
  font-size: 18px;
  line-height: 1.5;
  font-weight: 500;
}
</style>
