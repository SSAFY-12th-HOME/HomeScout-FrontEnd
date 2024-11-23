<script setup>
import { onMounted, onBeforeUnmount } from 'vue'
import { RouterView } from 'vue-router'
import AppHeader from '@/components/common/AppHeader.vue'
import ChatView from '@/views/ChatView.vue'
import { connect, disconnect } from '@/services/websocket' // WebSocket 서비스 임포트

onMounted(() => {
  connect() // 애플리케이션이 마운트될 때 WebSocket 연결
})

onBeforeUnmount(() => {
  disconnect() // 애플리케이션이 언마운트되기 전에 WebSocket 연결 해제
})
</script>

<template>
  <div class="app-container">
    <AppHeader />
    <div class="content-container">
      <RouterView />
    </div>
    <ChatView />
  </div>
</template>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.content-container {
  flex: 1;
  height: calc(100vh - var(--nav-height) - var(--footer-height));
  overflow: hidden;
}
</style>
