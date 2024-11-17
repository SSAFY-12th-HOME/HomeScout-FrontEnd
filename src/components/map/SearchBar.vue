<script setup>
import { ref } from 'vue';

const emit = defineEmits(["onSearchButton"]);

const searchQuery = ref('');

const onSearch = () => {
	emit("onSearchButton", searchQuery.value);
}
</script>

<template>
  <div class="search-bar">
    <input
      v-model="searchQuery"
      @keydown.enter="onSearch()"
      type="text"
      placeholder="Search..."
    />
    <button @click="onSearch()">Search</button>
  </div>
</template>

<style scoped>
.search-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 10px 0;
}

input {
  padding: 8px;
  font-size: 16px;
  width: 300px;
  border: 1px solid #ccc;
  border-radius: 4px;
  outline: none;
}

button {
  padding: 8px 12px;
  margin-left: 8px;
  font-size: 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}
</style>