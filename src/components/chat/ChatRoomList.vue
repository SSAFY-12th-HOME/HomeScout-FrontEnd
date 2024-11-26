<!-- src/components/chat/ChatRoomList.vue -->

<script setup>
// watch와 nextTick import 추가
import { computed, onMounted, ref, watch, nextTick } from 'vue'
import ChatContainer from '@/components/chat/ChatContainer.vue'
import { useChatStore } from '@/stores/chat'
import { useUserStore } from '@/stores/user'
import { sendMessage as sendMessageWebSocket } from '@/services/websocket'

const chatStore = useChatStore()
const userStore = useUserStore()

// 현재 채팅방의 메시지를 실시간으로 감시하는 computed 속성
const currentMessages = computed(() => {
  return chatStore.messages[chatStore.activeRoom] || []
})

// 메시지 스크롤 처리를 위한 watch 추가
// 메시지 상태 감시 추가
watch(
  () => chatStore.messages,
  () => {
    if (chatStore.activeRoom) {
      nextTick(() => {
        const chatContainer = document.querySelector('.chat-messages')
        if (chatContainer) {
          chatContainer.scrollTop = chatContainer.scrollHeight
        }
      })
    }
  },
  { deep: true },
)

const currentUserId = computed(() => userStore.userId)
const chatRooms = computed(() => chatStore.chatRooms)
const activeRoom = computed(() => chatStore.activeRoom)
const getActiveRoom = computed(() => {
  return chatStore.chatRooms.find((room) => room.chatRoomId === chatStore.activeRoom)
})

// 채팅방 선택 시 호출되는 함수 수정
const toggleRoom = async (roomId) => {
  chatStore.activeRoom = roomId
  await chatStore.fetchMessages(roomId)
  // 메시지 로드 후 스크롤 처리 추가
  nextTick(() => {
    const chatContainer = document.querySelector('.chat-messages')
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight
    }
  })
}

// 채팅방 닫기 함수 수정
const closeRoom = () => {
  // 채팅방 목록 새로고침 추가
  chatStore.fetchChatRooms()
  chatStore.activeRoom = null
}

// 메시지 전송 핸들러 수정
const handleSendMessage = async (message) => {
  sendMessageWebSocket(chatStore.activeRoom, message.text)

  await chatStore.addMessage(chatStore.activeRoom, {
    text: message.text,
    profileImage: message.isMyMessage
      ? userStore.profileImg
      : getActiveRoom.value?.otherUserProfileImg,
    timestamp: message.timestamp,
    isMyMessage: true,
    userId: userStore.userId,
    nickname: userStore.nickname,
  })
}

onMounted(() => {
  chatStore.fetchChatRooms()
})
</script>

<template>
  <div class="chat-rooms">
    <!-- Chat Room List -->
    <div class="chat-room-list" :class="{ hidden: chatStore.activeRoom }">
      <div
        v-for="room in chatRooms"
        :key="room.chatRoomId"
        class="chat-room-item"
        @click="toggleRoom(room.chatRoomId)"
      >
        <img
          :src="room.otherUserProfileImg || '/src/assets/default-profile-img.png'"
          class="profile-image"
        />
        <div class="room-info">
          <div class="room-name">{{ room.otherUserNickname }}</div>
          <div class="last-message">{{ room.lastMessageContent }}</div>
        </div>
        <div class="timestamp">{{ room.lastMessageDate }}</div>
      </div>
    </div>

    <!-- Chat Container -->
    <transition name="fade">
      <!-- 채팅방이 선택된 경우에만 표시 -->
      <div v-if="chatStore.activeRoom" class="chat-container-wrapper">
        <div class="chat-header">
          <button class="back-button" @click="closeRoom">←</button>
          <h3>{{ getActiveRoom?.otherUserNickname }}</h3>
        </div>
        <ChatContainer
          :messages="currentMessages"
          :current-user-id="currentUserId"
          :other-user-profile="getActiveRoom?.otherUserProfileImg"
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

  transition: all 0.3s ease;   /* 부드러운 애니메이션 효과 */
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
