<template>
  <div>
    <div class="header">
      <div class="header-content">
        <div class="header-text">
          <h1 class="title">공지사항</h1>
          <p class="subtitle">최신 소식을 공유드립니다.</p>
        </div>
      </div>
    </div>

    <div class="notice-container">
      <!-- 공지사항 테이블 -->
      <table class="notice-table">
        <thead>
          <tr>
            <th>번호</th>
            <th>제목</th>
            <th>등록일</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(notice, index) in filteredNotices" :key="notice.noticeId">
            <td class="center">
              {{ index + 1 }}
              <span class="notice-tag">[공지]</span>
            </td>
            <td>{{ notice.title }}</td>
            <td class="center">{{ notice.createdAt }}</td>
          </tr>
        </tbody>
      </table>

      <!-- 검색 영역 -->
      <div class="search-bar">
        <input v-model="searchQuery" type="text" class="search-input" placeholder="제목, 내용" />
        <button @click="searchNotices" class="search-button">검색</button>
      </div>

      <!-- 페이지네이션 -->
      <div class="pagination">
        <button class="pagination-btn" :disabled="currentPage === 1" @click="goToPrevPage">
          «
        </button>
        <span class="current-page">{{ currentPage }}</span>
        <button class="pagination-btn" :disabled="currentPage === totalPages" @click="goToNextPage">
          »
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NoticeView',
  data() {
    return {
      notices: [
        { noticeId: 1, title: '시스템 긴급 점검 안내', createdAt: '2024.10.18' },
        { noticeId: 2, title: '출결관리 기준 안내', createdAt: '2024.09.26' },
        { noticeId: 3, title: '개인정보 이용안내', createdAt: '2024.07.26' },
        { noticeId: 4, title: '출결 소명 작성 가이드', createdAt: '2024.07.02' },
        { noticeId: 5, title: '12기 SW 스타트캠프 안내', createdAt: '2024.07.02' },
      ],
      searchQuery: '',
      currentPage: 1,
      totalPages: 17,
    }
  },
  computed: {
    filteredNotices() {
      if (this.searchQuery.trim() === '') {
        return this.notices
      }
      return this.notices.filter((notice) => notice.title.includes(this.searchQuery.trim()))
    },
  },
  methods: {
    searchNotices() {
      console.log('검색 실행:', this.searchQuery)
    },
    goToPrevPage() {
      if (this.currentPage > 1) this.currentPage--
    },
    goToNextPage() {
      if (this.currentPage < this.totalPages) this.currentPage++
    },
  },
}
</script>

<style scoped>
/* Header 스타일 */
.header {
  background-color: #f8f9fa;
  padding: 24px 210px;
  margin-bottom: 24px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.header-text {
  flex-grow: 1;
}

.title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 8px;
}

.subtitle {
  font-size: 16px;
  color: #6c757d;
}

/* Notice Table 스타일 */
.notice-container {
  padding: 0 210px;
}

.notice-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 24px;
}

.notice-table th,
.notice-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #dee2e6;
}

.notice-table th {
  background-color: #f1f3f5;
  font-weight: bold;
  text-align: center; /* 헤더 가운데 정렬 */
  border-top: 2px solid #b7b7b7; /* 상단 실선 */
}

.notice-table td.center {
  text-align: center;
}

.notice-tag {
  color: #66b56b;
  font-weight: bold;
  margin-left: 4px;
}

/* 검색 영역 스타일 */
.search-bar {
  display: flex;
  justify-content: center;
  margin-top: 16px;
}

.search-input {
  width: 300px;
  padding: 8px;
  border: 1px solid #dee2e6;
  border-radius: 4px 0 0 4px;
  font-size: 14px;
}

.search-button {
  background-color: #66b56b;
  color: #fff;
  border: none;
  padding: 8px 16px;
  border-radius: 0 4px 4px 0;
  font-size: 14px;
  cursor: pointer;
}

.search-button:hover {
  background-color: #0056b3;
}

/* Pagination 스타일 */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 16px;
}

.pagination-btn {
  background-color: #66b56b;
  color: #fff;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  margin: 0 4px;
  font-size: 14px;
  cursor: pointer;
}

.pagination-btn:disabled {
  background-color: #dee2e6;
  color: #6c757d;
  cursor: not-allowed;
}

.current-page {
  font-size: 16px;
  font-weight: bold;
  margin: 0 8px;
}
</style>
