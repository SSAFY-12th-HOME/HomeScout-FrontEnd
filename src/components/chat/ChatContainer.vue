<script setup>
import { ref, nextTick, onMounted, watch } from 'vue'
import ChatBubble from '@/components/chat/ChatBubble.vue'

// Define props
const props = defineProps({
  messages: {
    type: Array,
    default: () => []
  },
  currentUserId: {  // Added new prop for current user ID
    type: [String, Number],
    required: true
  }
})

// Define emits
const emit = defineEmits(['send-message'])

// Create a local copy of messages
const messageList = ref([...props.messages])

// Watch for changes in props.messages
watch(() => props.messages, (newMessages) => {
  messageList.value = [...newMessages]
  nextTick(() => {
    scrollToBottom()
  })
}, { deep: true })

const newMessage = ref('')
const messageContainer = ref(null)

const getCurrentTime = () => {
  const now = new Date()
  const hours = now.getHours()
  const minutes = now.getMinutes()
  const ampm = hours >= 12 ? '오후' : '오전'
  const formattedHours = hours % 12 || 12
  const formattedMinutes = minutes.toString().padStart(2, '0')
  return `${ampm} ${formattedHours}:${formattedMinutes}`
}

const scrollToBottom = () => {
  messageContainer.value.scrollTop = messageContainer.value.scrollHeight
}

const sendMessage = () => {
  if (newMessage.value.trim()) {
    const message = {
      text: newMessage.value,
      profileImage: '/path/to/user-image.jpg',
      timestamp: getCurrentTime(),
      isMyMessage: true,
      userId: props.currentUserId  // Added user ID to the message object
    }
    // Emit the message to parent
    emit('send-message', message)
    newMessage.value = ''
  }
}
const shouldShowProfile = (index) => {
  if (index === 0) return true

  const currentMessage = messageList.value[index]
  const previousMessage = messageList.value[index - 1]

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
        <ChatBubble
          v-for="(message, index) in messageList"
          :key="index"
          :message="message.text"
          :profile-image="message.profileImage"
          :timestamp="message.timestamp"
          :is-my-message="message.isMyMessage"
          :user-id="message.userId"
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
      >
      <button @click="sendMessage">전송</button>
    </div>
  </div>
</template>

<style scoped>
.chat-container {
  display: flex;
  flex-direction: column;
  height: 100%;  /* Changed from 100vh */
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
  background-color: #4CAF50;
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
