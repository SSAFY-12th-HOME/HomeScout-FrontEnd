<template>
  <div class="button-wrapper">
    <button
      class="custom-button"
      :class="{ 'custom-button-active': isActive }"
      @click="onClick"
    >
      <slot>{{ text }}</slot>
    </button>
  </div>
</template>

<script setup>
const props = defineProps({
  text: {
    type: String,
    default: ''
  },
  onClick: Function,
  isActive: Boolean
})

defineEmits(['click'])
</script>

<style scoped>
.custom-button {
  width: 361px;
  height: 60px;
  border-radius: 16px;
  border: 1px solid #020202;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background-color: white;
  font-size: 16px;
  margin: 10px;
  box-shadow: 0 5px 5px -5px
}

.custom-button-active {
  border: 7px solid #426B1F;
}

.button-wrapper {
  display: flex;
  justify-content: center;
}

.custom-button:hover {
  opacity: 0.9;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  transform: translateY(-2px);
}
</style>
