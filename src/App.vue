<script setup>
import { RouterView } from 'vue-router'
import AppHeader from '@/components/common/AppHeader.vue';
import ChatView from '@/views/ChatView.vue';
</script>

<template>
  <div class="app-container">
    <AppHeader/>
    <div class="content-container">
      <RouterView />
    </div>
    <ChatView/>
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
