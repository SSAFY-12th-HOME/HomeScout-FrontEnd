<template>
  <div class="custom-box">
    <span class="bold-text">총 {{ number }}문제 중</span>
  </div>
</template>

<script setup>
defineProps({
  number: {
    type: Number,
    required: true
  }
});
</script>

<style scoped>
.custom-box {
  width: 222px;
  height: 47px;
  border-radius: 1000px;
  border: 1px solid #000000; /* Black stroke */
  background-color: #ffffff; /* White background */
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px; /* Adjust font size as needed */
  text-align: center;
}

.bold-text {
  font-weight: bold;
}
</style>
