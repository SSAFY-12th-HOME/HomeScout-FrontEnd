<script setup>
import { ref } from 'vue';
import { Search } from 'lucide-vue-next';

const emit = defineEmits(["onSearchButton"]);
const searchQuery = ref('');

const onSearch = () => {
  emit("onSearchButton", searchQuery.value);
}
</script>

<template>
  <div class="search-bar">
    <div class="search-container">
      <Search class="search-icon" size="14" strokeWidth="2" />
      <input
        v-model="searchQuery"
        @keydown.enter="onSearch()"
        type="text"
        placeholder="아파트 이름 검색"
      />
      <button @click="onSearch()">
        검색
      </button>
    </div>
  </div>
</template>

<style scoped>
.search-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0px 0;
  background-color: transparent;
  padding: 10px 10px;
  background-color: #66b56b;
  box-shadow: 10px 10px 0px #ececec;
}

.search-container {
  position: relative;
  display: flex;
  align-items: center;
  max-width: 600px;
  width: 100%;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  transition: all 0.2s ease;
  border: 2px solid #66b56b;
  max-height: 50px
}

.search-container:focus-within {
  box-shadow: 0 8px 12px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  transform: translateY(-1px);
}

.search-icon {
  position: absolute;
  left: 16px;
  color: #6b7280;
}

input {
  flex: 1;
  padding: 12px;
  padding-left: 48px;
  font-size: 15px;
  border: none;
  border-radius: 12px;
  outline: none;
  color: #1f2937;
}

input::placeholder {
  color: #9ca3af;
}

button {
  margin: 8px;
  padding: 8px 20px;
  font-size: 14px;
  font-weight: 500;
  color: white;
  background-color: #9a9a9a;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

button:hover {
  background-color: #66b56b;
}

button:active {
  background-color: #9a9a9a;
}
</style>
