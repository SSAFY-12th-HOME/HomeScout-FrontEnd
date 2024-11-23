// src/services/websocket.js

import Stomp from 'stompjs'
import { useChatStore } from '@/stores/chat' // Pinia 채팅 스토어 임포트
import { useUserStore } from '@/stores/user' // Pinia 사용자 스토어 임포트
import { getActivePinia } from 'pinia' // 활성 Pinia 인스턴스 가져오기

let stompClient = null // STOMP 클라이언트 인스턴스 변수

/**
 * 특정 채팅방에서 상대방 ID를 가져오는 함수
 * @param {Number} chatRoomId - 채팅방 ID
 * @param {Number} userId - 현재 사용자 ID
 * @returns {Number|null} - 상대방 ID 또는 null
 */
const getReceiverId = (chatRoomId, userId) => {
  const pinia = getActivePinia() // 활성 Pinia 인스턴스 가져오기
  const chatStore = useChatStore(pinia)
  const chatRoom = chatStore.chatRooms.find((room) => room.chatRoomId === chatRoomId)
  if (chatRoom) {
    return chatRoom.otherUserId !== userId ? chatRoom.otherUserId : null
  }
  return null
}

/**
 * WebSocket 연결을 설정하는 함수
 */
export const connect = () => {
  const pinia = getActivePinia() // 활성 Pinia 인스턴스 가져오기
  const chatStore = useChatStore(pinia) // Pinia 채팅 스토어 사용
  const userStore = useUserStore(pinia) // Pinia 사용자 스토어 사용

  if (!userStore.isAuthenticated) {
    console.warn('사용자가 인증되지 않았습니다. WebSocket 연결을 시도하지 않습니다.')
    return
  }

  // STOMP 클라이언트를 사용하여 WebSocket 연결
  const socket = new WebSocket('ws://localhost:8080/chat') // 백엔드 WebSocket 엔드포인트

  stompClient = Stomp.over(socket)

  // STOMP 클라이언트 연결 설정
  stompClient.connect(
    {},
    (frame) => {
      console.log('Connected: ' + frame) // 연결 성공 시 콘솔에 로그 출력

      const userId = userStore.userId // 현재 사용자의 ID

      // 특정 사용자에게 메시지를 받을 수 있는 경로를 구독 (수신용)
      stompClient.subscribe(`/queue/messages/${userId}`, (message) => {
        const chatMessage = JSON.parse(message.body) // 메시지 데이터 파싱

        console.log('수신 메시지:', chatMessage) // 전체 메시지 객체 로그 출력
        console.log('채팅방 번호:', chatMessage.chatRoomId) // chatRoomId

        chatStore.addMessage(chatMessage.chatRoomId, {
          text: chatMessage.content,
          profileImage: chatMessage.profileImg,
          timestamp: chatMessage.createdAt,
          isMyMessage: chatMessage.userId == userStore.userId,
          userId: chatMessage.userId,
          nickname: chatMessage.nickname, // nickname 추가
        }) // Pinia 스토어에 메시지 추가
      })

      // 사용자 참여 상태를 받을 수 있는 경로를 구독 (예: 온라인 상태 업데이트)
      stompClient.subscribe(`/queue/users/${userId}`, (message) => {
        const userStatus = JSON.parse(message.body)
        console.log('User status update:', userStatus)
        // 여기서 필요한 로직을 구현할 수 있습니다.
      })

      // 사용자 추가 이벤트 전송 (채팅 참여 알림)
      addUser(userId)
    },
    (error) => {
      console.error('STOMP error: ', error) // 연결 실패 시 에러 로그 출력
    },
  )
}

/**
 * WebSocket 연결을 종료하는 함수
 */
export const disconnect = () => {
  if (stompClient !== null) {
    stompClient.disconnect(() => {
      console.log('Disconnected')
    })
  }
}

/**
 * 메시지를 전송하는 함수
 * @param {Number} chatRoomId - 메시지를 보낼 채팅방의 ID
 * @param {String} messageContent - 메시지 내용
 * @param {String} [fileUrl=null] - 파일 URL (옵션)
 */
//sendMessage: 실시간 채팅 메시지를 전송하는 함수
export const sendMessage = (chatRoomId, messageContent, fileUrl = null) => {
  const pinia = getActivePinia() // 활성 Pinia 인스턴스 가져오기
  const userStore = useUserStore(pinia) // Pinia 사용자 스토어 사용

  if (!stompClient || !userStore.isAuthenticated) {
    console.warn('WebSocket 연결이 되어있지 않거나, 사용자가 인증되지 않았습니다.')
    return
  }

  const userId = userStore.userId // 현재 사용자의 ID
  let receiverId

  if (messageContent.content == '안녕하세요. 매물 문의드립니다.') {
    receiverId = messageContent.receiverId
    messageContent = messageContent.content
  } else {
    receiverId = getReceiverId(chatRoomId, userId) // 수신자 ID
  }

  if (!receiverId) {
    console.error('수신자 ID를 찾을 수 없습니다.')
    return
  }

  const message = {
    chatRoomId: chatRoomId, // 채팅방 ID
    senderId: userId, // 발신자 ID
    receiverId: receiverId, // 수신자 ID
    content: messageContent,
    fileUrl: fileUrl,
  }

  // STOMP 클라이언트를 통해 메시지를 전송
  stompClient.send(`/app/chat.sendMessage/${receiverId}`, {}, JSON.stringify(message))
}

/**
 * 사용자를 추가하는 함수 (채팅 참여 알림)
 * @param {Number} userId - 참여할 사용자의 ID
 */
export const addUser = (userId) => {
  if (!stompClient || !userId) {
    console.warn('WebSocket 연결이 되어있지 않거나, userId가 유효하지 않습니다.')
    return
  }

  const message = {
    userId: userId,
  }

  // STOMP 클라이언트를 통해 사용자 추가 메시지 전송
  stompClient.send('/app/chat.addUser', {}, JSON.stringify(message))
}
