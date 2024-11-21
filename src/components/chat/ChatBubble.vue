<script setup>
import { computed } from 'vue'

const props = defineProps({
  message: {
    type: String,
    default: '안녕하세요. 부동산입니다.',
  },
  profileImage: {
    type: String,
    required: true,
    validator: (value) => value && value.trim().length > 0,
  },
  timestamp: {
    type: String,
    required: true,
  },
  isMyMessage: Boolean,
  userId: {
    type: [String, Number],
    required: true,
  },
  showProfile: {
    type: Boolean,
    default: true,
  },
})

const containerClass = computed(() => ({
  'chat-bubble-container--mine': props.isMyMessage,
}))

const contentClass = computed(() => ({
  'message-content--reverse': props.isMyMessage,
}))

const bubbleClass = computed(() => ({
  'message-bubble--mine': props.isMyMessage,
}))
</script>

<template>
  <div class="chat-bubble-container" :class="containerClass">
    <div v-if="!isMyMessage" class="profile-image-wrapper">
      <div v-show="showProfile" class="profile-image">
        <img :src="profileImage" :alt="`${userId}'s profile`" loading="lazy" decoding="async" />
      </div>
    </div>
    <div class="message-content" :class="contentClass">
      <div class="message-bubble" :class="bubbleClass">
        <slot>{{ message }}</slot>
      </div>
      <time :datetime="timestamp" class="timestamp">{{ timestamp }}</time>
    </div>
  </div>
</template>

<style scoped>
.chat-bubble-container {
  --profile-size: 40px;
  --bubble-padding: 12px 16px;
  --bubble-radius: 18px;
  --bubble-max-width: min(400px, 80vw);
  --gap-size: 12px;

  display: flex;
  align-items: flex-start;
  gap: var(--gap-size);
  padding: 8px;
  max-width: 100%;
}

.chat-bubble-container--mine {
  flex-direction: row-reverse;
}

.profile-image-wrapper {
  width: var(--profile-size);
  height: var(--profile-size);
  flex-shrink: 0;
}

.profile-image {
  width: 100%;
  height: 100%;
}

.profile-image img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

.message-content {
  display: flex;
  align-items: center;
  gap: 8px;
}

.message-content--reverse {
  flex-direction: row-reverse;
}

.message-bubble {
  background-color: #f1f1f1;
  padding: var(--bubble-padding);
  border-radius: var(--bubble-radius);
  max-width: var(--bubble-max-width);
  font-size: 14px;
  line-height: 1.4;
  word-break: break-word;
}

.message-bubble--mine {
  background-color: #66b56b;
  color: white;
}

.timestamp {
  color: #999;
  font-size: 12px;
  align-self: flex-end;
  margin-bottom: 4px;
  white-space: nowrap;
}

@media (max-width: 480px) {
  .chat-bubble-container {
    --bubble-padding: 8px 12px;
  }

  .message-bubble {
    font-size: 13px;
  }
}
</style>
