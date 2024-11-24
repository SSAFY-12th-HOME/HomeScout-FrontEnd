<script setup>
import { ref, watch } from 'vue'
import { KakaoMap, KakaoMapMarker } from 'vue3-kakao-maps'
import { getPodcastData, getSafetyScore } from '@/api/map' // API 요청 함수
import sgg from '@/assets/sgg.json';

const podcastUrl = ref()
const isModalVisible = ref(false) // 모달창을 표시할 변수
const isPlaying = ref(true) // 오디오 재생 상태 변수
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

const selectedSido = ref('')
const categories = ref([
  { text: '사고', value: 'carAccident'},
  { text: '화재', value: 'fire'},
  { text: '범죄', value: 'crime'},
  { text: '생활', value: 'lifeSafety'},
  { text: '자살', value: 'suicide'},
  { text: '전염병', value: 'disease'},
])
const activeCategory = ref('')
const polygonData = ref([])

const props = defineProps({
  aptList: {
    type: Array,
    default: () => [],
  },
  selectedSidoProps: {
    type: String
  }
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

watch(
  () => props.selectedSidoProps,
  (newSido) => {
    selectedSido.value = newSido
    activeCategory.value = ''
    removeArea()

    // 시군구 경계 데이터 초기화
    polygonData.value = sgg.features
      .filter(feature => {
        return feature.properties.SIG_CD.substr(0, 2) === selectedSido.value
      })
      .map(feature => ({
        coordinates: feature.geometry.coordinates[0],
        SIG_CD: feature.properties.SIG_CD
      }))

    // 위도, 경도 -> 카카오 객체로 변경
    polygonData.value.forEach(polygon => {
      polygon.paths = []
      polygon.coordinates.forEach(coordinate => {
        polygon.paths.push(new window.kakao.maps.LatLng(coordinate[1], coordinate[0]))
      })
    })

    // 시도 클릭하면 안전등급 데이터 불러오기 & 폴리곤 데이터에 등급 넣기
    getSafetyScore(
      { sidoCd: selectedSido.value },
      ({ data }) => {
        polygonData.value.forEach(polygon => {
          data.forEach(grade => {
            if(polygon.SIG_CD == grade.sggCd) {
              polygon.carAccident = grade.carAccident
              polygon.fire = grade.fire
              polygon.crime = grade.crime
              polygon.lifeSafety = grade.lifeSafety
              polygon.suicide = grade.suicide
              polygon.disease = grade.disease
            }
          })
        })
      },
      () => {
        console.error('안전등급 불러오기 실패')
      }
    )
  }
)

const onLoadKakaoMap = (mapRef) => {
  map.value = mapRef
}

const onLoadKakaoMapMarkerCluster = (clustererRef) => {
  clusterer.value = clustererRef
}

const onClickKakaoMapMarker = (marker) => {
  emit('markerClickEvent', marker.aptId)
  markerList.value.forEach((m) => {
    m.icon = markerIcon
    m.zindex = 0
  })
  marker.icon = markerSelectIcon
  marker.zindex = 1
  panTo(marker.lat, marker.lng)
}

const panTo = (lat, lng) => {
  if (map.value) {
    map.value.panTo(new window.kakao.maps.LatLng(lat, lng))
  }
}

// 지도 중심좌표 가져오기
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
  isPlaying.value = true // 오디오 재생 상태를 초기화
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

const onCategoryClick = (value) => {
  // 기존 폴리곤 삭제
  removeArea()
  // 시도 선택 안하면 클릭 X
  if(selectedSido.value === '') return
  // 같은 카테고리 클릭시 취소
  if(activeCategory.value === value) {
    activeCategory.value = ''
    return
  }
  activeCategory.value = value

  polygonData.value.forEach(polygon => {
    displayArea(polygon.paths, polygon[activeCategory.value]/5 - 0.1)
  })
}


const polygons = ref([])

const displayArea = (paths, fill) => {
  const polygon = new window.kakao.maps.Polygon({
    path: paths, // 그려질 다각형의 좌표 배열입니다
    strokeWeight: 3, // 선의 두께입니다
    strokeColor: '#f64545', // 선의 색깔입니다
    strokeOpacity: 0.8, // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
    fillColor: '#e25555', // 채우기 색깔입니다
    fillOpacity: fill // 채우기 불투명도 입니다
  })

  // 지도에 다각형을 표시합니다
  if (map.value !== undefined) {
    polygon.setMap(map.value)
    polygons.value.push(polygon)
  }
}

const removeArea = () => {
  polygons.value.forEach(polygon => polygon.setMap(null))
  polygons.value = []
}
</script>

<template>
  <KakaoMap
    :lat="37.563652488"
    :lng="126.977532624"
    width="100%"
    height="89vh"
    level="6"
    @onLoadKakaoMap="onLoadKakaoMap"
    @onLoadKakaoMapMarkerCluster="onLoadKakaoMapMarkerCluster"
  >
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
        <div class="info-window">{{ marker.aptNm }}</div>
      </template>
    </KakaoMapMarker>
  </KakaoMap>

  <div class="category-buttons">
    <template v-for="category in categories" :key="category.value">
      <button
        @click="onCategoryClick(category.value)"
        :class="['category-button', { active: activeCategory === category.value }]"
      >
        {{ category.text }}
      </button>
    </template>
  </div>


  <!-- AI 뉴스 팟캐스트 버튼 -->
  <div class="ai-news-button">
    <button @click="navigateToNews" class="ai-news-btn">
      <span class="button-icon">🎙️</span> AI 뉴스 팟캐스트
    </button>
  </div>

  <!-- 팟캐스트 모달 창 -->
  <transition name="fade">
    <div v-if="isModalVisible" class="modal">
      <div class="modal-content">
        <button class="close" @click="closeModal">&times;</button>

        <!-- 제목 섹션 -->
        <div class="title-section">
          <div class="title-content">
            <div class="title-header">
              <div class="icon-wrapper">
                <span class="podcast-icon">🎙️</span>
              </div>
              <div class="status-badge">
                <span class="status-dot"></span>
                LIVE NOW
              </div>
            </div>
            <h2>
              <template v-if="currentDistrictName">
                <span class="district-name">{{ currentDistrictName }}</span>
                <span class="title-text">AI 뉴스 팟캐스트</span>
              </template>
              <template v-else>
                <span class="title-text">AI 뉴스 팟캐스트</span>
              </template>
            </h2>
            <div class="subtitle">
              <span class="episode">EP.01</span>
              <span class="dot">•</span>
              <span class="date">Today's News</span>
            </div>
          </div>
        </div>

        <!-- 팟캐스트 비디오 -->
        <div class="podcast-video" v-if="podcastVideoUrl">
          <video :src="podcastVideoUrl" autoplay loop muted></video>
        </div>

        <!-- 오디오 플레이어 -->
        <div class="audio-player">
          <audio
            ref="audioElement"
            :src="podcastUrl"
            @timeupdate="onTimeUpdate"
            @ended="closeModal"
            @loadedmetadata="onLoadedMetadata"
            autoplay
          />

          <!-- 커스터마이징한 오디오 컨트롤 -->
          <div class="controls">
            <button @click="playPodcast" class="play-btn">
              <span v-if="isPlaying" class="pause-icon">❚❚</span>
              <span v-else class="play-icon">►</span>
            </button>

            <div class="progress-container">
              <span class="time current">{{ currentTime }}</span>
              <div class="progress-bar-wrapper">
                <input
                  type="range"
                  v-model="progress"
                  min="0"
                  max="100"
                  @input="seekAudio"
                  class="progress-bar"
                />
                <div
                  class="progress-bar-fill"
                  :style="{ width: `${progress}%` }"
                ></div>
              </div>
              <span class="time duration">{{ duration }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<style scoped>


/* 전체 모달과 버튼 영역 스타일 */
.ai-news-button {
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
}

.ai-news-btn {
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, #11cbbb 0%, #66b56b 100%);
  padding: 12px 24px;
  border: none;
  border-radius: 30px;
  color: white;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  transition: transform 0.2s, box-shadow 0.2s;
}

.ai-news-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
}

.ai-news-btn:active {
  transform: translateY(0);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.button-icon {
  margin-right: 8px;
  font-size: 20px;
}

/* 모달 창 스타일 */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(5px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
}

.modal-content {
  background: linear-gradient(145deg, #ffffff, #f8f9fa);
  padding: 32px;
  border-radius: 20px;
  width: 90%;
  max-width: 500px;
  position: relative;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}

/* 새로운 title-section 스타일 */
.title-section {
  margin-bottom: 28px;
  padding: 0 0 20px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}

.title-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.title-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 4px;
}

.icon-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
}

.podcast-icon {
  font-size: 24px;
  background: linear-gradient(135deg, #f0f0f0, #e6e6e6);
  padding: 8px;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}


.status-badge {
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, #11cbbb, #66b56b);
  padding: 6px 12px;
  border-radius: 20px;
  color: white;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.5px;
  gap: 6px;
  box-shadow: 0 2px 8px rgba(102, 181, 107, 0.3);
  animation: float 3s ease-in-out infinite;
  margin-top: 25px;
}

.status-dot {
  width: 6px;
  height: 6px;
  background-color: #fff;
  border-radius: 50%;
  animation: pulse 1.5s infinite;
}

@keyframes slideDown {
  from {
    transform: translateY(-50px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* X 버튼 스타일 */
.close {
  position: absolute;
  top: 10px;
  right: 10px;

  font-size: 28px;
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.close:hover {
  background-color: rgba(0, 0, 0, 0.05);
  color: #333;
}

.title-section {
  margin-bottom: 28px;
  padding: 0 0 20px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}

.title-section h2 {
  font-size: 24px;
  font-weight: 800;
  color: #1a1a1a;
  margin: 0;
  line-height: 1.3;
  letter-spacing: -0.5px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}

.district-name {
  background: linear-gradient(135deg, #11cbbb 0%, #66b56b 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 800;
  font-size: 30px;
}

.title-text {
  background: linear-gradient(135deg, #2c2c2c 0%, #1a1a1a 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

@keyframes districtGlow {
  0% {
    box-shadow: 0 2px 8px rgba(102, 181, 107, 0.2);
  }
  100% {
    box-shadow: 0 4px 12px rgba(102, 181, 107, 0.4);
  }
}

.subtitle {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #666;
  font-size: 13px;
}

.episode {
  font-weight: 600;
  color: #11cbbb;
}

.dot {
  color: #ccc;
}

.date {
  color: #666;
}

@keyframes pulse {
  0% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(1.2); }
  100% { opacity: 1; transform: scale(1); }
}

@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-2px); }
  100% { transform: translateY(0px); }
}


.podcast-badge {
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, #11cbbb, #66b56b);
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  gap: 7px;
  margin-left: 5px;
}

.pulse {
  width: 8px;
  height: 8px;
  background-color: #fff;
  border-radius: 50%;
  animation: pulse 1.5s infinite;

}

/* 팟캐스트 비디오 스타일 */
.podcast-video {
  width: 100%;
  height: 200px;
  margin-bottom: 24px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.podcast-video video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 오디오 플레이어 새로운 스타일 */
.audio-player {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 16px;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.05);
}

.controls {
  display: flex;
  align-items: center;
  gap: 16px;
}

.play-btn {
  width: 44px;
  height: 44px;
  border: none;
  border-radius: 50%;
  background: linear-gradient(135deg, #11cbbb, #66b56b);
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  box-shadow: 0 4px 10px rgba(102, 181, 107, 0.3);
}

.play-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 15px rgba(102, 181, 107, 0.4);
}

.progress-container {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 12px;
}
.progress-bar {

}
.progress-bar-wrapper {
  flex: 1;
  position: relative;
  height: 6px;
  background: #e9ecef;
  border-radius: 3px;
}

.progress-bar-fill {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  background: linear-gradient(to right, #11cbbb, #66b56b);
  border-radius: 3px;
  pointer-events: none;
}

input[type='range'] {
  flex: 1;
  margin: 0 10px;
  -webkit-appearance: none;
  height: 5px;
  border-radius: 5px;
  outline: none;
}
input[type='range']::-webkit-slider-runnable-track {
  width: 100%;
  height: 0;
  background: #e9ecef; /* 트랙의 기본 색상 */
  border-radius: 0px;
}

input[type='range']::-webkit-slider-thumb {
  -webkit-appearance: none; /* 기본 브라우저 스타일 제거 */
  width: 16px;
  height: 16px;
  background: #e9ecef; /* 슬라이더의 손잡이 색상 */
  border-radius: 50%;
  cursor: pointer;
  position: relative;
  z-index: 0; /* 트랙보다 밑에 표시 */
}

.time {
  font-size: 12px;
  color: #666;
  width: 35px;
  text-align: center;
}

/* 정보 창 스타일 */
.info-window {
  padding: 5px;
  text-align: center;
  font-size: 14px;
  color: #333;
}

/* 애니메이션 추가 */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.category-buttons {
  position: absolute;
  bottom: 30%;
  right: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 35px; /* 버튼들의 동일한 너비 설정 */
  z-index:10
}

.category-button {
  padding: 8px 0px;
  background-color: white;
  color: black;
  border: 1px solid #ababab;
  border-radius: 4px;
  cursor: pointer;
  font-size: 10px;
  text-align: center;
  transition: all 0.2s ease;
  box-shadow: 0px 0px 10px rgba(0,0,0,0.1);
  font-weight: bold
}

.category-button:hover {
  background-color: #f5f5f5;
}

.category-button.active {
  background-color: #e6e6e6;
  border-color: #999;
}

.category-button:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1);
}
</style>
