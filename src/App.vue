<script setup>
import { RouterLink, RouterView } from 'vue-router'
import AppHeader from '@/components/common/AppHeader.vue';
import ChatView from '@/views/ChatView.vue';
</script>

<template>
  <AppHeader/>
  <RouterView />
  <ChatView/>
</template>

<style scoped>
</style>
