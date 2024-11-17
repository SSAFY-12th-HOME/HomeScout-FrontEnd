<script setup>
import { ref } from "vue";
defineProps({ selectOption: Array });
const emit = defineEmits(["onKeySelect"]);

const key = ref("");

const onSelect = () => {
  emit("onKeySelect", key.value);
};
</script>

<template>
  <select v-model="key" class="form-select form-select-sm w-50" @change="onSelect">
    <option
      v-for="option in selectOption"
      :key="option.value"
      :value="option.value"
      :disabled="option.value === '' ? true : false"
    >
      {{ option.text }}
    </option>
  </select>
</template>

<style scoped>
.hidden {
  position: absolute;
  clip: rect(0, 0, 0, 0);
  width: 1px;
  height: 1px;
  margin: -1px;
  overflow: hidden;
}

button {
  cursor: pointer;
  margin: 0;
  padding: 0;
}

body {
  font-family: Roboto, sans-serif;
  font-size: 14px;
}

.select-wrapper {
  width: 200px;
  margin: 100px auto;
}

.selectbox .toggle-btn {
  font-size: 12px;
  width: 200px;
  text-align: left;
  background: #FFFFFF;
  border: 1px solid #C4C4C4;
  box-sizing: border-box;
  border-radius: 10px;
  padding: 13px 14px;
  margin-bottom: 9px;
  background: url(../image/icon-Triangle-down.svg) no-repeat;
  background-position: 175px 50%;
}

.selectbox .toggle-btn.on {
  background: url(../image/icon-Triangle-up.svg) no-repeat;
  background-position: 175px 50%;
}

.selectbox .toggle-btn:hover,
.selectbox .toggle-btn:focus,
.selectbox .toggle-btn:active {
  outline: 3px solid #F8E4FF;
  border: 1px solid #9B51E0;
}

.selectbox-option {
  box-sizing: border-box;
  width: 200px;
  background: #FFFFFF;
  border: 1px solid #C4C4C4;
  box-shadow: 4px 4px 14px rgba(0, 0, 0, 0.15);
  border-radius: 10px;
  padding: 4px 8px;
}

.selectbox-option {
  display: none;
}

.selectbox-option.on {
  display: block;
}

.selectbox-option li {
  width: 100%;
  width: 184px;
  margin-top: 10px;
}

.selectbox-option li:first-child {
  margin-top: 3px;
}

.selectbox-option li:last-child {
  margin-bottom: 5px;
}

.selectbox-option .option-btn {
  width: inherit;
  box-sizing: border-box;
  border: none;
  background-color: transparent;
  padding: 7px 10px;
  text-align: left;
  line-height: 16px;
  display: inline-block;
}

.selectbox-option li:hover,
.selectbox-option li:focus,
.selectbox-option li:active {
  background-color: #F8E4FF;
  border-radius: 8px;
}
</style>
