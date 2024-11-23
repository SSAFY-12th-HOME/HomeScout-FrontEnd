// src/api/chat.js

import { localAxios, imageAxios } from '@/util/http-commons'

// 기존 Axios 인스턴스 사용
const local = localAxios()
const image = imageAxios()

// 토큰을 가져오는 함수
function getTokenHeader() {
  const user = JSON.parse(sessionStorage.getItem('user'))
  return user && user.token ? `Bearer ${user.token}` : ''
}

// 채팅방 목록 가져오기
async function getChatRooms(success, fail) {
  local.defaults.headers['Authorization'] = getTokenHeader()
  await local.get('/chat/rooms').then(success).catch(fail)
}

// 특정 채팅방의 메시지 가져오기
async function getChatMessages(chatRoomId, success, fail) {
  local.defaults.headers['Authorization'] = getTokenHeader()
  await local.get(`/chat/rooms/${chatRoomId}/messages`).then(success).catch(fail)
}

// 메시지 전송
async function sendChatMessage(chatRoomId, message, success, fail) {
  local.defaults.headers['Authorization'] = getTokenHeader()
  await local.post(`/chat/rooms/${chatRoomId}/messages`, { message }).then(success).catch(fail)
}

// 프로필 이미지 업로드 (이미지 업로드가 필요할 경우)
async function uploadChatImage(body, success, fail) {
  image.defaults.headers['Authorization'] = getTokenHeader()
  await image.post(`/chat/upload-image`, body).then(success).catch(fail)
}

export { getChatRooms, getChatMessages, sendChatMessage, uploadChatImage }
