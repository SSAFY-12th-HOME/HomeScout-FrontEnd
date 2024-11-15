<script setup>
// import AppHeader from './components/AppHeader.vue'
// import AppBody from './components/AppBody.vue'

import { ref } from 'vue'
import ChatRoomList from '@/components/chat/ChatRoomList.vue'

const messages = ref([
  {
    text: '안녕하세요. 부동산입니다.',
    profileImage: 'https://picsum.photos/200',
    timestamp: '오전 9:25',
    isMyMessage: false,
    userId: 'user123'
  },
  {
    text: '네, 안녕하세요.',
    profileImage: '/path/to/user-image.jpg',
    timestamp: '오전 9:26',
    isMyMessage: true,
    userId: 'user-1'
  },
  {
    text: '안녕하세요. 부동산입니다.',
    profileImage: 'https://picsum.photos/200',
    timestamp: '오전 9:25',
    isMyMessage: false,
    userId: 'user123'
  },
  {
    text: '네, 안녕하세요.',
    profileImage: '/path/to/user-image.jpg',
    timestamp: '오전 9:26',
    isMyMessage: true,
    userId: 'user-1'
  },
  {
    text: '안녕하세요. 부동산입니다.',
    profileImage: 'https://picsum.photos/200',
    timestamp: '오전 9:25',
    isMyMessage: false,
    userId: 'user123'
  },
  {
    text: '안녕하세요. 부동산입니다.',
    profileImage: 'https://picsum.photos/200',
    timestamp: '오전 9:25',
    isMyMessage: false,
    userId: 'user123'
  },
  {
    text: '안녕하세요. 부동산입니다.',
    profileImage: 'https://picsum.photos/200',
    timestamp: '오전 9:25',
    isMyMessage: false,
    userId: 'user123'
  },
  {
    text: '안녕하세요. 부동산입니다.',
    profileImage: 'https://picsum.photos/200',
    timestamp: '오전 9:25',
    isMyMessage: false,
    userId: 'user123'
  }

])

const showChatList = ref(false);

const toggleChatList = () => {
  showChatList.value = !showChatList.value;
};


</script>

<!-- App.vue -->
<template>
    <!-- <app-header />
    <app-body /> -->
    <!--    <Eg></Eg>-->
    <!--    <div>-->
    <!--      <ChatContainer-->
    <!--        :messages="messages"-->
    <!--        :current-user-id="currentUserId"-->
    <!--        @send-message="handleNewMessage"-->
    <!--      />-->
    <!--    </div>-->
    <!--    <div>-->
    <!--      <ChatRoomList></ChatRoomList>-->
    <!--    </div>-->
    <!-- Floating Chat Button -->
    <!-- Floating button -->
    <button class="floating-button" @click="toggleChatList">
      <span class="icon">💬</span>
    </button>

    <!-- Chat room list component -->
    <transition name="fade">
      <div v-if="showChatList" class="chat-list-container">
        <button class="close-button" @click="toggleChatList">×</button>
        <ChatRoomList />
      </div>
    </transition>
</template>

<style scoped>
.app-container {
  width: 100%;
  min-height: 100vh;
  background-color: #66b56b;
}



.floating-button {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #007bff;
  color: white;
  border: none;
  font-size: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  transition: background-color 0.3s;
}

.floating-button:hover {
  background-color: #0056b3;
}

.icon {
  font-size: 28px;
}

.chat-list-container {
  position: fixed;
  bottom: 90px;
  right: 20px;
  width: 400px;
  height: 800px;
  border-radius: 10px;
  overflow: hidden;
  z-index: 999;
}

.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #333;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;
}
</style>
