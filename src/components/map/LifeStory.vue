<script setup>
import { ref, watch } from 'vue';
import { useUserStore } from '@/stores/user'

const userStore = useUserStore();

const lifeStoryList = ref({});
const lifeStoryText = ref('');

const props = defineProps({
	lifeStoryProps: {
		type: Array
	}
})

watch(
	() => props.lifeStoryProps,
	(newLifeStoryList) => {
		lifeStoryList.value = newLifeStoryList;
	}
)
</script>

<template>
  <div class="review-container">
    <div class="review-header">
      <h2>살아본 이야기</h2>
      <span class="review-count">50경험치 제공</span>
    </div>

    <div class="review-list">
			<div class="review-item">
      <div class="user-info">
        <img :src="userStore.profileImg" alt="프로필" class="profile-img"/>
        <span class="username">{{ userStore.nickname }}</span>
      </div>
      <div class="review-content editable">
        <textarea 
          class="review-textarea"
          placeholder="이 단지의 장점과 단점을 알려주고 싶은 이야기, 유용한 팁 등을 적어주세요."
          v-model="lifeStoryText"
        ></textarea>
        <button class="edit-button">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3Z"/>
          </svg>
        </button>
      </div>
    </div>
      
			<div style="height: 1px; background-color: lightgray;"></div>
      <template v-for="(lifeStory, index) in lifeStoryList" :key="index">
			
				<!-- 두 번째 리뷰 -->
				<div class="review-item">
					<div class="user-info">
						<img src="@/assets/default-profile-img.png" alt="프로필" class="profile-img"/>
						<span class="username">{{ lifeStory.writer.nickname }}</span>
					</div>
					<div class="review-content">
						<p>{{ lifeStory.content }}</p>
						<span class="timestamp">{{ lifeStory.created }}</span>
					</div>
				</div>
				<div style="height: 1px; background-color: lightgray;"></div>
			</template>
    </div>
  </div>
</template>

<style scoped>
.review-container {
  padding: 1rem;
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.review-header h2 {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
}

.review-count {
  color: #666;
  font-size: 0.875rem;
}

.review-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.review-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.profile-img {
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 50%;
}

.username {
  font-weight: 500;
}

.review-content {
  position: relative;
  font-size: 0.875rem;
  line-height: 1.5;
  color: #333;
}

.review-textarea {
  width: 100%;
  min-height: 60px;
  border: none;
  background: transparent;
  resize: none;
  font-size: 0.875rem;
  line-height: 1.5;
  color: #333;
  padding: 0;
  font-family: inherit;
}

.review-textarea::placeholder {
  color: #666;
}

.review-textarea:focus {
  outline: none;
}

.timestamp {
  display: block;
  color: #666;
  font-size: 0.75rem;
  margin-top: 0.25rem;
}

.editable {
  background-color: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 0.5rem;
  padding: 1rem;
}

.edit-button {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  background: none;
  border: none;
  padding: 0.25rem;
  cursor: pointer;
  color: #666;
}

.edit-button:hover {
  color: #333;
}
</style>