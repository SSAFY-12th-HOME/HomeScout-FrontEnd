<!-- src/components/chat/ChatContainer.vue -->

<script setup>
import { ref, nextTick, onMounted, watch, computed } from 'vue'
import ChatBubble from '@/components/chat/ChatBubble.vue'
import { useChatStore } from '@/stores/chat' // Pinia 채팅 스토어 임포트
import { useUserStore } from '@/stores/user' // Pinia 사용자 스토어 임포트
import { sendMessage as sendMessageWebSocket } from '@/services/websocket' // WebSocket 서비스 임포트

// computed 속성 추가
const currentMessages = computed(() => {
  return props.messages || []
})

const props = defineProps({
  messages: {
    type: Array,
    default: () => [],
  },
  currentUserId: {
    type: [String, Number],
    required: true,
  },
  otherUserProfile: {
    // 변경된 부분
    type: String,
    default: '/src/assets/default-profile-img.png',
  },
})

// Define emits
const emit = defineEmits(['send-message'])

// 사용할 Pinia 스토어
const chatStore = useChatStore()
const userStore = useUserStore()

// 새로운 메시지를 입력하기 위한 상태
const newMessage = ref('')
const messageContainer = ref(null)

// 현재 시간을 '오전/오후 HH:MM' 형식으로 반환하는 함수
const getCurrentTime = () => {
  const now = new Date()
  const hours = now.getHours()
  const minutes = now.getMinutes()
  const ampm = hours >= 12 ? '오후' : '오전'
  const formattedHours = hours % 12 || 12
  const formattedMinutes = minutes.toString().padStart(2, '0')
  return `${ampm} ${formattedHours}:${formattedMinutes}`
}

// 메시지 목록 감시 추가
watch(
  () => props.messages,
  (newMessages) => {
    if (newMessages && newMessages.length > 0) {
      nextTick(() => {
        scrollToBottom()
      })
    }
  },
  { deep: true, immediate: true },
)

// 스크롤 처리 함수 개선
const scrollToBottom = () => {
  nextTick(() => {
    if (messageContainer.value) {
      messageContainer.value.scrollTop = messageContainer.value.scrollHeight
    }
  })
}

// 메시지 목록이 업데이트될 때마다 스크롤을 맨 아래로 이동
watch(
  () => props.messages,
  () => {
    nextTick(() => {
      scrollToBottom()
    })
  },
  { deep: true },
)

// 메시지 전송 함수 수정
const sendMessage = async () => {
  if (newMessage.value.trim()) {
    const message = {
      text: newMessage.value,
      profileImage: userStore.profileImg,
      timestamp: getCurrentTime(),
      isMyMessage: true,
      userId: props.currentUserId,
      nickname: userStore.nickname,
    }
    emit('send-message', message)
    newMessage.value = ''
    await nextTick()
    scrollToBottom()
  }
}

// 사용자 프로필 이미지 표시 여부를 결정하는 함수
const shouldShowProfile = (index) => {
  if (index === 0) return true

  const currentMessage = props.messages[index]
  const previousMessage = props.messages[index - 1]

  return currentMessage.userId !== previousMessage.userId
}

onMounted(() => {
  scrollToBottom()
})
</script>

<template>
  <div class="chat-container">
    <div class="messages-wrapper">
      <div class="chat-messages" ref="messageContainer">
        <!-- 클래스명 수정 -->
        <ChatBubble
          v-for="(message, index) in currentMessages"
          :key="message.messageId || index"
          :message="message.text"
          :profile-image="message.isMyMessage ? userStore.profileImg : otherUserProfile"
          :timestamp="message.timestamp"
          :is-my-message="message.isMyMessage"
          :user-id="message.userId"
          :nickname="message.nickname"
          :show-profile="shouldShowProfile(index)"
        />
      </div>
    </div>
    <div class="chat-input">
      <input
        type="text"
        v-model="newMessage"
        @keyup.enter="sendMessage"
        placeholder="메시지를 입력하세요..."
      />
      <button @click="sendMessage">전송</button>
    </div>
  </div>
</template>

<style scoped>
.chat-container {
  display: flex;
  flex-direction: column;
  height: 100%; /* Changed from 100vh */
  max-width: 800px;
  background-color: #fff;
  border: 1px solid #ddd;
}

.messages-wrapper {
  flex: 1;
  position: relative;
  overflow: hidden;
}

.chat-messages {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow-y: auto;
  padding: 20px;
}

.chat-input {
  flex-shrink: 0; /* Prevents input from shrinking */
  display: flex;
  padding: 16px;
  border-top: 1px solid #ddd;
  background-color: #fff;
}

.chat-input input {
  flex: 1;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-right: 8px;
  font-size: 14px;
}

.chat-input button {
  padding: 12px 24px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.chat-input button:hover {
  background-color: #45a049;
}

/* Custom scrollbar styles */
.chat-messages::-webkit-scrollbar {
  width: 6px;
}

.chat-messages::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.chat-messages::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 3px;
}

.chat-messages::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
