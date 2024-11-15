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
  height: 100px;
  border-radius: 16px;
  border: 1px solid #020202;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background-color: white;
  font-size: 16px;
  margin: 10px;
}

.custom-button-active {
  border: 7px solid #426B1F;
}

.button-wrapper {
  display: flex;
  justify-content: center;
}

.custom-button:hover {
  opacity: 0.8;
}
</style>
