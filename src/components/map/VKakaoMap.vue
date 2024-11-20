<script setup>
import { ref, watch } from 'vue'
import { KakaoMap, KakaoMapMarker } from 'vue3-kakao-maps'
import { getPodcastData } from '@/api/map' // API 요청 함수

const podcastUrl = ref()
const isModalVisible = ref(false) // 모달창을 표시할 변수
const isPlaying = ref(false) // 오디오 재생 상태 변수
const currentDistrictName = ref('') // 동적으로 설정할 "시군구" 이름
const podcastVideoUrl = ref('/src/assets/Animation - 1732081428240.webm') // 비디오 파일 경로

const progress = ref(0) // 진행 상태바 (진행 정도)
const currentTime = ref('0:00') // 현재 시간
const duration = ref('0:00') // 전체 시간
const audioElement = ref()

const markerList = ref([])
const map = ref()
const clusterer = ref()
const markerIcon = '/src/assets/house-marker-icon.png'
const markerSelectIcon = '/src/assets/house-marker-select-icon.png'

const props = defineProps({
  aptList: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['markerClickEvent'])

watch(
  () => props.aptList,
  (newList) => {
    markerList.value = newList.map((apt) => {
      let marker = {
        aptId: apt.aptId,
        aptNm: apt.aptNm,
        lat: apt.latitude,
        lng: apt.longitude,
        icon: markerIcon,
        zindex: 0,
      }
      if (newList.length === 1) {
        marker.icon = markerSelectIcon
        marker.zindex = 1
      }
      return marker
    })
    panTo(markerList.value[0].lat, markerList.value[0].lng)
  },
)

const onLoadKakaoMap = (mapRef) => {
  map.value = mapRef
  // console.log(map.value);
  // window.kakao.maps.event.addListener(marker.value, 'click', function() {
  // 	console.log('makrer 클릭!');
  // });
}

const onLoadKakaoMapMarkerCluster = (clustererRef) => {
  clusterer.value = clustererRef
}

const onClickKakaoMapMarker = (marker) => {
  emit('markerClickEvent', marker.aptId)
  markerList.value.forEach((marker) => {
    marker.icon = markerIcon
    marker.zindex = 0
  })
  marker.icon = markerSelectIcon
  marker.zindex = 1
  panTo(marker.lat, marker.lng)
}

const panTo = (lat, lng) => {
  if (map.value) {
    // 지도 중심을 부드럽게 이동시킵니다
    // 만약 이동할 거리가 지도 화면보다 크면 부드러운 효과 없이 이동합니다
    map.value.panTo(new window.kakao.maps.LatLng(lat, lng))
  }
}

//지도 중심좌표 가져오기
const getCenterCoordinates = () => {
  if (map.value) {
    const center = map.value.getCenter() // 지도 중심 좌표
    return { lat: center.getLat(), lng: center.getLng() }
  }
  return { lat: null, lng: null }
}

// 팟캐스트 URL을 요청하고 받아오는 함수
const navigateToNews = async () => {
  const { lat, lng } = getCenterCoordinates()

  if (lat && lng) {
    try {
      const data = await getPodcastData(lat, lng)
      podcastUrl.value = data.podcastUrl // mp3 URL 저장
      currentDistrictName.value = data.districtName // 시군구 이름 저장

      isModalVisible.value = true // 모달창 보이게 설정
    } catch (error) {
      console.error('Error loading podcast:', error)
    }
  }
}

const closeModal = () => {
  isModalVisible.value = false // 모달창 닫기
  isPlaying.value = false // 오디오 재생 상태를 초기화
  progress.value = 0 // 진행 상태 바 초기화
  currentTime.value = '0:00' // 현재 시간 초기화
  duration.value = '0:00' // 전체 시간 초기화
  podcastUrl.value = '' // 팟캐스트 URL 초기화
  currentDistrictName.value = '' // 팟캐스트 시군구 이름 초기화
}

const playPodcast = () => {
  if (audioElement.value) {
    if (isPlaying.value) {
      audioElement.value.pause() // 일시 정지
    } else {
      audioElement.value.play() // 재생
    }
  }
  isPlaying.value = !isPlaying.value // 재생/일시정지 토글
}

// 오디오 진행 상태 업데이트 (수정된 부분)
const onTimeUpdate = () => {
  if (audioElement.value) {
    const current = audioElement.value.currentTime // 현재 시간
    const totalDuration = audioElement.value.duration // 전체 시간
    progress.value = (current / totalDuration) * 100 // 진행 상태 비율
    currentTime.value = formatTime(current) // 현재 시간 포맷
    duration.value = formatTime(totalDuration) // 전체 시간 포맷
  }
}

// 시간 포맷 함수 (수정된 부분)
const formatTime = (timeInSeconds) => {
  const minutes = Math.floor(timeInSeconds / 60) // 분 단위로 변환
  const seconds = Math.floor(timeInSeconds % 60) // 초 단위로 변환
  return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}` // 0초 미만일 때 0 추가
}

// 진행 상태 바 조정 (수정된 부분)
const seekAudio = () => {
  if (audioElement.value) {
    audioElement.value.currentTime = (progress.value / 100) * audioElement.value.duration // 사용자가 슬라이드를 조정하여 위치 이동
  }
}

const onLoadedMetadata = () => {
  if (audioElement.value) {
    duration.value = formatTime(audioElement.value.duration) // duration 값 설정
  }
}
</script>

<template>
  <KakaoMap
    :lat="37.563652488"
    :lng="126.977532624"
    width="100%"
    height="90vh"
    level="6"
    @onLoadKakaoMap="onLoadKakaoMap"
    @onLoadKakaoMapMarkerCluster="onLoadKakaoMapMarkerCluster"
  >
    <!-- :markerCluster="{ markers: markerList }" -->
    <KakaoMapMarker
      v-for="marker in markerList"
      :key="marker.aptId"
      :lat="marker.lat"
      :lng="marker.lng"
      :clickable="true"
      :image="{
        imageSrc: marker.icon,
        imageWidth: 27,
        imageHeight: 32,
        imageOption: {},
      }"
      :z-index="marker.zindex"
      @onClickKakaoMapMarker="onClickKakaoMapMarker(marker)"
    >
      <template v-if="marker.zindex === 1" v-slot:infoWindow>
        <div style="padding: 5px; text-align: center">{{ marker.aptNm }}</div>
      </template>
    </KakaoMapMarker>
  </KakaoMap>
  <!-- AI 뉴스 팟캐스트 버튼 -->
  <div class="ai-news-button">
    <button @click="navigateToNews" class="ai-news-btn">AI 뉴스 팟캐스트</button>
  </div>

  <!-- 팟캐스트 모달 창 -->
  <div v-if="isModalVisible" class="modal">
    <div class="modal-content">
      <button class="close" @click="closeModal">X</button>
      <h2>
        {{ currentDistrictName ? currentDistrictName + ' AI 뉴스 팟캐스트' : 'AI 뉴스 팟캐스트' }}
      </h2>

      <!-- 팟캐스트 비디오 -->
      <div class="podcast-video" v-if="podcastVideoUrl">
        <video :src="podcastVideoUrl" autoplay loop />
      </div>

      <!-- 오디오 플레이어 -->
      <div class="audio-player">
        <audio
          ref="audioElement"
          :src="podcastUrl"
          @timeupdate="onTimeUpdate"
          @ended="closeModal"
          @loadedmetadata="onLoadedMetadata"
          controls
        />
      </div>

      <!-- 커스터마이징한 오디오 컨트롤 -->
      <!-- 오디오 진행 상태바 -->
      <div class="progress-container">
        <div class="time left">{{ currentTime }}</div>
        <!-- 현재 시간 표시 -->
        <input type="range" v-model="progress" min="0" max="100" @input="seekAudio" />
        <div class="time right">{{ duration }}</div>
        <!-- 전체 시간 표시 -->
      </div>

      <!-- 재생/일시정지 버튼 -->
      <button @click="playPodcast" class="play-btn">
        {{ isPlaying ? '일시 정지' : '재생' }}
      </button>
    </div>
  </div>
</template>
<style scoped>
/* 전체 모달과 버튼 영역 스타일 */
.ai-news-button {
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #4caf50;
  padding: 10px 20px;
  border-radius: 30px;
  color: white;
  font-weight: bold;
  cursor: pointer;
  z-index: 10;
}

.ai-news-btn {
  border: none;
  background-color: inherit;
  font-size: inherit;
  cursor: pointer;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
}

.ai-news-button:hover {
  background-color: #45a049;
}

.ai-news-button:active {
  background-color: #6ac26e;
}

/* 모달 창 스타일 */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: #fff;
  padding: 25px;
  border-radius: 20px;
  width: 380px;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  display: flex; /* 자식 요소들을 세로로 배치 */
  flex-direction: column; /* 세로로 배치 */
  align-items: center; /* 수평 가운데 정렬 */
  justify-content: center; /* 수직 가운데 정렬 */
}

/* X 버튼 스타일 */
.close {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 18px;
  cursor: pointer;
  background: none;
  border: none;
}

h2 {
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 15px;
}

.podcast-video {
  width: 100%;
  height: 180px;
  margin-bottom: 10px; /* 비디오와 진행바 사이의 불필요한 공백을 줄임 */
}

.podcast-video video {
  width: 70%;
  height: 70%;
  object-fit: cover;
  border-radius: 10px;
}

.audio-player {
  display: flex;
  flex-direction: column;
  align-items: center;
  display: none;
}

.progress-container {
  position: relative;
  width: 90%;
  margin-top: 10px; /* 비디오와 진행바 사이의 공백을 최소화 */
}

input[type='range'] {
  width: 100%;
}

button.play-btn {
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 12px 25px;
  font-size: 16px;
  border-radius: 25px;
  cursor: pointer;
  width: 90%;
  transition: background-color 0.3s ease;
}

button.play-btn:hover {
  background-color: #45a049;
}

button.play-btn:active {
  background-color: #6ac26e;
}

audio::-webkit-media-controls {
  display: none;
}

/* 시간 표시 스타일 */
.time {
  position: absolute;
  font-size: 12px;
  color: #838080;
  top: -20px; /* 시간 표시가 상태바의 바로 위에 위치하도록 설정 */
}

.left {
  left: 0;
}

.right {
  right: 0;
}
</style>
