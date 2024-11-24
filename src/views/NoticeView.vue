<template>
  <div>
    <!-- 헤더 영역 -->
    <div class="header">
      <div class="header-content">
        <div class="header-text">
          <h1 class="title">공지사항</h1>
          <p class="subtitle">최신 소식을 공유드립니다.</p>
        </div>
      </div>
    </div>

    <!-- 공지사항 테이블 -->
    <div class="notice-container">
      <table class="notice-table">
        <thead>
        <tr>
          <th>번호</th>
          <th>제목</th>
          <th>등록일</th>
        </tr>
        </thead>
        <tbody>
        <!-- 검색 결과가 없을 때 메시지 표시 -->
        <tr v-if="filteredNotices.length === 0">
          <td colspan="3" class="center">검색 결과가 없습니다.</td>
        </tr>
        <!-- 검색 결과를 기반으로 공지사항 목록 표시 -->
        <tr v-else v-for="(notice, index) in filteredNotices" :key="notice.noticeId">
          <td class="center">
            <span class="notice-tag">공지</span>
          </td>
          <td>
            <!-- 공지 제목을 클릭하면 상세 페이지로 이동 -->
            <router-link :to="`/notice/${notice.noticeId}`" class="notice-link">
              {{ notice.title }}
            </router-link>
          </td>
          <td class="center">{{ notice.createdAt }}</td>
        </tr>
        </tbody>
      </table>

      <!-- 검색 영역 -->
      <div class="search-bar">
        <input
          v-model="searchQuery"
          type="text"
          class="search-input"
          placeholder="제목, 내용"
        />
        <button
          @click="searchNotices"
          class="search-button"

        >
          검색
        </button>
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
import { fetchNoticeList } from '@/api/notice'; // 공지사항 목록을 가져오는 API 호출

export default {
  name: 'NoticeView',
  data() {
    return {
      notices: [], // 전체 공지사항 목록
      filteredNotices: [], // 검색된 공지사항 목록
      searchQuery: '', // 검색어 입력
      currentPage: 1, // 현재 페이지
      totalPages: 1, // 총 페이지 수
    };
  },
  methods: {
    // 공지사항 목록 불러오기
    async loadNotices() {
      try {
        const success = (response) => {
          this.notices = response.data; // API에서 받은 데이터를 notices에 저장
          this.filteredNotices = [...this.notices]; // 초기 상태: 전체 목록 표시
          this.totalPages = Math.ceil(this.filteredNotices.length / 10); // 페이지 계산 (10개씩 표시)
        };
        const fail = (error) => {
          console.error('공지사항 불러오기 실패:', error);
        };
        await fetchNoticeList(success, fail);
      } catch (error) {
        console.error('공지사항 API 호출 실패:', error);
      }
    },
    // 검색 버튼 클릭 시 실행
    searchNotices() {
      if (this.searchQuery.trim() === '') {
        // 검색어가 없으면 전체 공지사항 표시
        this.filteredNotices = [...this.notices];
      } else {
        // 검색어를 포함하는 공지사항 필터링
        this.filteredNotices = this.notices.filter((notice) =>
          notice.title.includes(this.searchQuery.trim())
        );
      }
      this.currentPage = 1; // 검색 후 페이지를 첫 페이지로 초기화
      this.totalPages = Math.ceil(this.filteredNotices.length / 10); // 총 페이지 수 계산
    },
    // 이전 페이지로 이동
    goToPrevPage() {
      if (this.currentPage > 1) this.currentPage--;
    },
    // 다음 페이지로 이동
    goToNextPage() {
      if (this.currentPage < this.totalPages) this.currentPage++;
    },
  },
  async created() {
    // 컴포넌트 생성 시 공지사항 목록 불러오기
    await this.loadNotices();
  },
};
</script>

<style scoped>
/* 헤더 스타일 */
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
  margin-bottom: 0px;
}

/* 공지사항 테이블 스타일 */
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
  border-top: 1px solid #000; /* 상단 실선 */
}

.notice-table td.center {
  text-align: center;
}

.notice-tag {
  display: inline-block;
  background-color: #66b56b;
  color: #fff;
  font-size: 14px;
  font-weight: bold;
  padding: 4px 12px;
  border-radius: 4px;
  text-align: center;
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
  background-color: #237c29;
}

/* 페이지네이션 스타일 */
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



.current-page {
  font-size: 16px;
  font-weight: bold;
  margin: 0 8px;
}

.notice-link {
  color: #66b56b;
  text-decoration: none;
}

.notice-link:hover {
  text-decoration: underline;
}
</style>
