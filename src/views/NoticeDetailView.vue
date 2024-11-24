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

    <!-- 상세 내용 -->
    <div class="notice-container">
      <!-- 제목 및 메타 정보 -->
      <div class="notice-detail-header">
        <div class="notice-title">
          <span class="notice-tag">[공지]</span>
          {{ notice.title }}
        </div>
        <div class="notice-meta">
          <span class="notice-author">운영자</span>
          <span class="notice-date">{{ notice.createdAt }}</span>
        </div>
      </div>

      <!-- 이미지 섹션 -->
      <div class="notice-image" v-if="notice.img">
        <img :src="notice.img"/>
      </div>

      <!-- 본문 내용 -->
      <div class="notice-content">
        <p>{{ notice.content }}</p>
      </div>

      <!-- 뒤로가기 버튼 -->
      <div class="notice-footer">
        <button class="back-button" @click="goBack">목록</button>
      </div>
    </div>
  </div>
</template>

<script>
import { fetchNoticeDetail } from "@/api/notice";

export default {
  name: "NoticeDetailView",
  data() {
    return {
      notice: {
        title: "",
        type: "공지", // 예시: 공지사항 타입
        createdAt: "",
        nickname: "운영자",
        img: "",
        content: "",
      },
    };
  },
  methods: {
    async loadNoticeDetail() {
      try {
        const noticeId = this.$route.params.id;
        const success = (response) => {
          this.notice = response.data;
        };
        const fail = (error) => {
          console.error("공지사항 상세 조회 실패:", error);
        };
        await fetchNoticeDetail(noticeId, success, fail);
      } catch (error) {
        console.error("API 호출 실패:", error);
      }
    },
    goBack() {
      this.$router.push("/notice");
    },
  },
  async created() {
    await this.loadNoticeDetail();
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
}

/* 상세 페이지 컨테이너 */
.notice-container {
  padding: 0 210px;
}

/* 제목 및 메타 정보 */
.notice-detail-header {
  border-top: 1px solid #000000;
  border-bottom: 2px solid #e9ecef;
  padding: 16px 0;
  margin-bottom: 24px;
}

.notice-title {
  font-size: 22px;
  font-weight: bold;
  color: #212529;
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.notice-tag {
  color: #66b56b;
  font-weight: bold;
  margin-right: 8px;
}

.notice-meta {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: #6c757d;
}

.notice-author {
  font-weight: bold;
  color: #6c757d;
}

/* 이미지 섹션 */
.notice-image {
  text-align: center;
  margin-bottom: 10px;
}

.notice-image img {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* 본문 내용 */
.notice-content {
  padding: 24px;
  border-radius: 8px;
  margin-bottom: 24px;
  font-size: 16px;
  line-height: 1.5;
  color: #495057;
  border-bottom: 2px solid #e9ecef;
}

/* 뒤로가기 버튼 */
.notice-footer {
  text-align: center;
  margin-top: 16px;
}

.back-button {
  background-color: #66b56b;
  color: #fff;
  border: none;
  padding: 10px 20px;
  font-size: 14px;
  font-weight: bold;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.back-button:hover {
  background-color: #1c8d23;
}
</style>

