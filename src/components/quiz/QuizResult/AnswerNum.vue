<template>
  <div class="counter-display">
    {{ number }}개
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

// Define the prop for receiving the number from the parent
const props = defineProps({
  number: {
    type: Number, // Expecting a number
    required: true // It is required to pass this prop
  }
});
</script>

<style scoped>
.counter-display {
  width: 120px;
  height: 93px;
  font-family: 'Roboto', sans-serif;
  font-weight: 600; /* SemiBold */
  font-size: 60px;
  line-height: 145px;
  letter-spacing: 0.1px;
  text-align: center;
}
</style>
