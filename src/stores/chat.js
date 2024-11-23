// src/stores/chat.js

import { defineStore } from 'pinia'
import { ref } from 'vue'
import { localAxios } from '@/util/http-commons' // localAxios 임포트
import { useUserStore } from '@/stores/user' // Pinia 사용자 스토어 임포트
import { sendMessage as sendMessageWebSocket } from '@/services/websocket'

export const useChatStore = defineStore(
  'chat',
  () => {
    const userStore = useUserStore()
    const local = localAxios() // Axios 인스턴스 생성

    // 상태 (state)
    const chatRooms = ref([]) // 사용자가 참여한 채팅방 목록
    const messages = ref({}) // 각 채팅방별 메시지 목록, { chatRoomId: [messages] }
    const activeRoom = ref(null) // 현재 활성화된 채팅방 ID

    // 추가할 상태
    const isLoading = ref(false) // 채팅방 생성/로딩 상태

    // 채팅방 생성 및 입장
    const createAndEnterChatRoom = async (receiverId) => {
      try {
        isLoading.value = true
        const response = await local.post(
          '/chat/rooms',
          {
            receiverId: receiverId,
          },
          {
            headers: {
              Authorization: getTokenHeader(),
            },
          },
        )

        const newChatRoom = response.data
        await fetchChatRooms()
        activeRoom.value = newChatRoom.chatRoomId

        return newChatRoom.chatRoomId
      } catch (error) {
        console.error('채팅방 생성 실패:', error)
        return null
      } finally {
        isLoading.value = false
      }
    }

    //채팅방 생성 액션
    const createChatRoom = async (userId) => {
      try {
        isLoading.value = true
        const chatRoomId = await createAndEnterChatRoom(userId)

        // 첫 메시지 전송으로 채팅방 생성
        if (chatRoomId) {
          const message = {
            senderId: userStore.userId,
            receiverId: userId,
            content: '안녕하세요. 매물 문의드립니다.',
            messageType: 'CHAT',
            fileUrl: null,
          }

          // WebSocket을 통해 메시지 전송
          sendMessageWebSocket(chatRoomId, messageContent)
          await fetchChatRooms()
          return chatRoomId

          sendMessageWebSocket(chatRoomId, message.content)
          await fetchChatRooms()
          return chatRoomId
        }
      } catch (err) {
        throw new Error('채팅방 생성에 실패했습니다.')
      } finally {
        isLoading.value = false
      }
    }

    // 토큰을 가져오는 함수 (mypage.js와 동일하게 유지)
    function getTokenHeader() {
      const user = JSON.parse(sessionStorage.getItem('user'))
      return user && user.token ? `Bearer ${user.token}` : ''
    }

    // 상태를 변경하는 함수 (mutations 대체)
    const setChatRooms = (newChatRooms) => {
      chatRooms.value = newChatRooms
    }

    // 메시지 추가 및 채팅방 목록 업데이트
    const addMessage = (chatRoomId, message) => {
      console.log('???!!!' + chatRoomId)
      console.log('???!!!' + JSON.stringify(message))

      //메시지 배열이 없는 경우 초기화
      if (!messages.value[chatRoomId]) {
        messages.value[chatRoomId] = []
      }

      // 반응성 보장을 위해 새 배열 생성하여 메시지 추가
      messages.value[chatRoomId] = [...messages.value[chatRoomId], message]

      // 채팅방 목록에서 해당 방의 마지막 메시지 정보 업데이트
      const roomIndex = chatRooms.value.findIndex((room) => room.chatRoomId === chatRoomId)
      if (roomIndex !== -1) {
        // 채팅방 정보 업데이트
        chatRooms.value[roomIndex] = {
          ...chatRooms.value[roomIndex],
          lastMessageContent: message.text,
          lastMessageDate: message.timestamp,
        }

        // 최신 메시지가 있는 채팅방을 최상단으로 이동
        const updatedRoom = chatRooms.value.splice(roomIndex, 1)[0]
        chatRooms.value.unshift(updatedRoom)
      }
      //fetchMessages(chatRoomId)
    }

    // 비동기 작업을 처리하는 함수 (actions 대체)
    const fetchChatRooms = async () => {
      try {
        const response = await local.get('/chat/rooms', {
          headers: {
            Authorization: getTokenHeader(),
          },
        }) // REST API 호출 시 Authorization 헤더 포함
        const { chatRooms: fetchedChatRooms } = response.data

        // API 응답을 프론트엔드에서 사용하기 적합한 형태로 매핑
        const mappedChatRooms = fetchedChatRooms.map((room) => ({
          chatRoomId: room.chatRoomId,
          otherUserId: room.otherUserId,
          otherUserNickname: room.otherUserNickname,
          otherUserProfileImg: room.otherUserProfileImg,
          lastMessageDate: room.lastMessageDate,
          lastMessageContent: room.lastMessageContent,
        }))

        // 최신 메시지 순으로 정렬
        mappedChatRooms.sort((a, b) => new Date(b.lastMessageDate) - new Date(a.lastMessageDate))

        setChatRooms(mappedChatRooms) // 채팅방 목록 상태 업데이트
      } catch (error) {
        console.error('채팅방 목록 조회 실패:', error)
      }
    }

    const fetchMessages = async (chatRoomId) => {
      try {
        const response = await local.get(`/chat/messages/${chatRoomId}`, {
          headers: {
            Authorization: getTokenHeader(),
          },
        }) // REST API 호출 시 Authorization 헤더 포함
        const { messages: fetchedMessages } = response.data

        // API 응답을 프론트엔드에서 사용하기 적합한 형태로 매핑
        const userStore = useUserStore()
        const mappedMessages = fetchedMessages.map((msg) => ({
          messageId: msg.messageId,
          chatRoomId: msg.chatRoomId,
          userId: msg.userId,
          nickname: msg.nickname, // nickname 추가
          profileImg: msg.profileImg || '/src/assets/default-profile-img.png',
          text: msg.content,
          timestamp: msg.createdAt, // 서버에서 받은 timestamp 사용
          isMyMessage: msg.userId == userStore.userId, // 현재 사용자가 보낸 메시지인지 여부
        }))

        messages.value[chatRoomId] = mappedMessages // 메시지 상태 업데이트
      } catch (error) {
        console.error('메시지 조회 실패ㅠ:', error)
      }
    }

    return {
      chatRooms,
      messages,
      activeRoom,
      setChatRooms,
      addMessage,
      fetchChatRooms,
      fetchMessages,
      isLoading,
      createChatRoom,
    }
  },
  {
    persist: true, // Pinia의 상태를 sessionStorage에 저장
  },
)
