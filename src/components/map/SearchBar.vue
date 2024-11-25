<script setup>
import { getAptIdByAptName } from '@/api/map';
import { useErrorStore } from '@/stores/error';
import { Search } from 'lucide-vue-next';
import { ref } from 'vue'
import ErrorModal from '../common/ErrorModal.vue';

const errorStore = useErrorStore()

const emit = defineEmits(["onSearchButton"]);

const searchQuery = ref('')
const suggestions = ref([])
const isLoading = ref(false)
const showDropdown = ref(false)

// 디바운스 함수 구현
function debounce(fn, delay) {
  let timeoutId
  return function (...args) {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn.apply(this, args), delay)
  }
}

// API 호출 함수
async function fetchSuggestions(query) {
  if (!query.trim()) {
    suggestions.value = []
    return
  }

  isLoading.value = true
  getAptIdByAptName(
    searchQuery.value,
    ({ data }) => {
      suggestions.value = data
    },
    (err) => {
      errorStore.showError(err.response.data.message)
    }
  )
  isLoading.value = false
}

// 디바운스된 API 호출 (300ms)
const debouncedFetch = debounce(fetchSuggestions, 300)

// 입력값 변경 핸들러
function handleInput() {
  showDropdown.value = true
  debouncedFetch(searchQuery.value)
}

// 검색어 선택 핸들러
function handleSuggestionClick(suggestion) {
  searchQuery.value = suggestion.aptNm
  showDropdown.value = false
}

// 검색 실행 핸들러
function handleSearch() {
  showDropdown.value = false
  emit("onSearchButton", searchQuery.value);
}
</script>

<template>
  <ErrorModal/>
  <div class="search-wrapper">
    <div class="search-container">
      <div class="search-input-wrapper">
        <Search class="search-icon" size="14" strokeWidth="2" />
        <input
          v-model="searchQuery"
          @input="handleInput"
          @keydown.enter="handleSearch"
          type="text"
          placeholder="아파트 이름 검색"
        />
        <button @click="handleSearch">검색</button>
      </div>

      <!-- 자동완성 드롭다운 -->
      <div v-if="showDropdown && searchQuery.trim()" class="dropdown-container">
        <div v-if="isLoading" class="dropdown-message">
          검색 중...
        </div>
        <template v-else>
          <ul v-if="suggestions.length > 0" class="suggestion-list">
            <li
              v-for="(suggestion, index) in suggestions"
              :key="index"
              @click="handleSuggestionClick(suggestion)"
              class="suggestion-item"
            >
              {{ suggestion.aptNm }}
            </li>
          </ul>
          <div v-else class="dropdown-message">
            검색 결과가 없습니다
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.search-wrapper {
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
  position: relative;
}

.search-container {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0px 0;
  background-color: transparent;
  padding: 10px 10px;
  background-color: #66b56b;
  box-shadow: 10px 10px 0px #ececec;
}

.search-input-wrapper {
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

.search-icon {
  margin-left: 12px;
  color: #666;
}

input {
  flex: 1;
  padding: 12px;
  border: none;
  outline: none;
  font-size: 14px;
  margin-left: 4px;
}

input::placeholder {
  color: #999;
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

.dropdown-container {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 4px;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  max-height: 300px;
  max-width: 350px;
  overflow-y: auto;
  margin: 0 auto;
}

.suggestion-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.suggestion-item {
  padding: 10px 16px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;
}

.suggestion-item:hover {
  background-color: #f3f4f6;
}

.dropdown-message {
  padding: 12px;
  text-align: center;
  color: #666;
  font-size: 14px;
}

/* 스크롤바 스타일링 */
.dropdown-container::-webkit-scrollbar {
  width: 8px;
}

.dropdown-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.dropdown-container::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 4px;
}

.dropdown-container::-webkit-scrollbar-thumb:hover {
  background: #999;
}
</style>