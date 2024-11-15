<script setup>
import { ref, computed } from 'vue'
import ChatContainer from '@/components/chat/ChatContainer.vue'

const currentUserId = ref(1) // Set your current user ID

const chatRooms = ref([
  {
    id: 1,
    name: '하나공인중개사',
    lastMessage: '집 보러 가고 싶어요. 언제 가면 되나요?',
    profileImage: '/path/to/image.jpg',
    timestamp: '2일 전',
    messages: [
      {
        text: '안녕하세요',
        profileImage: '/path/to/image.jpg',
        timestamp: '오전 10:00',
        isMyMessage: false,
        userId: 2
      }
      // Add more messages...
    ]
  }
  // Add more rooms...
])

const activeRoom = ref(null)

const getActiveRoom = computed(() => {
  return chatRooms.value.find(room => room.id === activeRoom.value)
})

const toggleRoom = (roomId) => {
  activeRoom.value = roomId
}

const closeRoom = () => {
  activeRoom.value = null
}

const handleSendMessage = (message) => {
  const roomIndex = chatRooms.value.findIndex(room => room.id === activeRoom.value)
  if (roomIndex !== -1) {
    chatRooms.value[roomIndex].messages.push(message)
    chatRooms.value[roomIndex].lastMessage = message.text
    chatRooms.value[roomIndex].timestamp = '방금 전'
  }
}
</script>

<template>
  <div class="chat-rooms">
    <!-- Chat Room List -->
    <div class="chat-room-list" :class="{ 'hidden': activeRoom }">
      <div
        v-for="room in chatRooms"
        :key="room.id"
        class="chat-room-item"
        @click="toggleRoom(room.id)"
      >
        <img :src="room.profileImage" class="profile-image" />
        <div class="room-info">
          <div class="room-name">{{ room.name }}</div>
          <div class="last-message">{{ room.lastMessage }}</div>
        </div>
        <div class="timestamp">{{ room.timestamp }}</div>
      </div>
    </div>

    <!-- Chat Container -->
    <transition name="fade">
      <div v-if="activeRoom" class="chat-container-wrapper">
        <div class="chat-header">
          <button class="back-button" @click="closeRoom">←</button>
          <h3>{{ getActiveRoom.name }}</h3>
        </div>
        <ChatContainer
          :messages="getActiveRoom.messages"
          :current-user-id="currentUserId"
          @send-message="handleSendMessage"
        />
      </div>
    </transition>
  </div>
</template>

<style scoped>
.chat-rooms {
  position: relative;
  max-width: 800px;
  margin: 0 auto;
  background: white;
  height: 100%;
  border-radius: 28px; /* Added */
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); /* Added */
  overflow: hidden; /* Added to prevent content from overflowing rounded corners */
}

.chat-room-list {
  padding: 10px;
}

.chat-room-list.hidden {
  display: none;
}

.chat-room-item {
  display: flex;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
}

.chat-room-item:hover {
  background-color: #f5f5f5;
}

.profile-image {
  width: 50px;
  height: 50px;
  border-radius: 25px;
  margin-right: 15px;
}

.room-info {
  flex: 1;
}

.room-name {
  font-weight: bold;
  margin-bottom: 5px;
}

.last-message {
  color: #666;
  font-size: 0.9em;
}

.timestamp {
  color: #999;
  font-size: 0.8em;
}

.chat-container-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: white;
  z-index: 1;
  display: flex;
  flex-direction: column;
  height: 100%; /* Added */
  overflow: hidden; /* Added */
}

.chat-header {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid #eee;
}

.back-button {
  background: none;
  border: none;
  font-size: 20px;
  margin-right: 15px;
  cursor: pointer;
}

/* Fade transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
