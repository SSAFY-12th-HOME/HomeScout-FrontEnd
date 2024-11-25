<script setup>
import { ref, watch,onBeforeUnmount } from 'vue'
import { KakaoMap, KakaoMapCustomOverlay } from 'vue3-kakao-maps'
import { getPodcastData, getSafetyScore, getSidoCenter } from '@/api/map' // API 요청 함수
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


// 로딩 관련 상태 변수 추가
const isLoading = ref(false) // 로딩 모달 표시 여부
const loadingTexts = ref([
  "뉴스기사를 분석하고 있어요.",
  "목소리를 만들고 있어요.",
  "조금만 더 기다려 주세요."
]) // 로딩 중 표시할 텍스트 배열
const currentLoadingText = ref("") // 현재 표시 중인 로딩 텍스트
const loadingTextIndex = ref(0) // 현재 로딩 텍스트의 인덱스
let loadingTimer = null // 로딩 텍스트 변경 타이머
let loadingTimeout = null // 로딩 완료 타이머



const markerList = ref([])
const map = ref()
const clusterer = ref()
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

const mapLat = ref('37.528045815')
const mapLng = ref('126.982306163')
const mapScale = ref('8')


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
        dealAmount: apt.dealAmount,
        area: apt.area,
        zindex: 0,
        clicked: false
      }
      if (newList.length === 1) {
        marker.icon = markerSelectIcon
        marker.zindex = 5
      }
      return marker
    })
    setCenter(markerList.value[0].lat, markerList.value[0].lng)
    setLevel('6')
  },
)

watch(
  () => props.selectedSidoProps,
  (newSido) => {
    selectedSido.value = newSido
    activeCategory.value = ''
    removeArea()

    // DB에서 slectedSido.value로 중심좌표 및 지도확대 level 가져오기
    getSidoCenter(
      { sido: selectedSido.value + '00000000'},
      ({ data }) => {
        mapLat.value = data.lat
        mapLng.value = data.lng
        mapScale.value = data.scale
      },
      () => {
        console.log('중심좌표 불러오기 실패')
      }
    )

    // 중심좌표 및 scale 변경하기
    panTo(mapLat.value, mapLng.value)
    setLevel(mapScale.value)

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
    m.zindex = 0
    m.clicked = false
  })
  marker.zindex = 10
  marker.clicked = true
  panTo(marker.lat, marker.lng)
}

const panTo = (lat, lng) => {
  if (map.value) {
    map.value.panTo(new window.kakao.maps.LatLng(lat, lng))
  }
}

const setCenter = (lat, lng) => {
  if (map.value) {
    map.value.setCenter(new window.kakao.maps.LatLng(lat, lng));
  }
};

const setLevel = (level) => {
  if (map.value) {
    map.value.setLevel(level)
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

  // 1. 버튼 클릭 시 로딩 모달을 먼저 표시
  isLoading.value = true
  isModalVisible.value = false
  document.querySelector('.tab-container').style.zIndex = 0

  // 2. 초기 로딩 텍스트 설정
  currentLoadingText.value = loadingTexts.value[loadingTextIndex.value]

  // 3. 로딩 텍스트 애니메이션 타이머 시작 (1.5초 간격으로 텍스트 변경)
  loadingTimer = setInterval(() => {
    loadingTextIndex.value = (loadingTextIndex.value + 1) % loadingTexts.value.length
    currentLoadingText.value = loadingTexts.value[loadingTextIndex.value]
  }, 2200) //2초

  // 4. 전체 로딩 시간 설정 (4.5초 후 팟캐스트 모달 표시)
  loadingTimeout = setTimeout(async () => {

  const { lat, lng } = getCenterCoordinates()

  if (lat && lng) {
    try {
      const data = await getPodcastData(lat, lng)
      podcastUrl.value = data.podcastUrl // mp3 URL 저장
      currentDistrictName.value = data.districtName // 시군구 이름 저장

      // 로딩 모달 숨기기 및 팟캐스트 모달 표시
      isLoading.value = false
      loadingTextIndex.value = 0
      isModalVisible.value = true // 모달창 보이게 설정
    } catch (error) {
      console.error('Error loading podcast:', error)
      isLoading.value = false
      loadingTextIndex.value = 0
    }
  }
    // 타이머 정리
    clearInterval(loadingTimer)
  }, 4500) // 4.5초 후 실행
}

onBeforeUnmount(() => {
  // 컴포넌트가 파괴될 때 타이머 정리
  clearInterval(loadingTimer)
  clearTimeout(loadingTimeout)
})

 const closeModal = async () => {
  isModalVisible.value = false // 모달창 닫기
  isPlaying.value = true // 오디오 재생 상태를 초기화
  progress.value = 0 // 진행 상태 바 초기화
  currentTime.value = '0:00' // 현재 시간 초기화
  duration.value = '0:00' // 전체 시간 초기화
  podcastUrl.value = '' // 팟캐스트 URL 초기화
  currentDistrictName.value = '' // 팟캐스트 시군구 이름 초기화
  await new Promise((resolve) => setTimeout(resolve, 1000))
  document.querySelector('.tab-container').style.zIndex = 2

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

// 오디오 진행 상태 업데이트
const onTimeUpdate = () => {
  if (audioElement.value) {
    const current = audioElement.value.currentTime
    const totalDuration = audioElement.value.duration

    // 진행 상태 계산 (0~100 비율로 설정)
    progress.value = totalDuration > 0 ? (current / totalDuration) * 100 : 0

    // 현재 시간을 업데이트
    currentTime.value = formatTime(current)
  }
}

// 시간 포맷 함수 (수정된 부분)
const formatTime = (timeInSeconds) => {
  const minutes = Math.floor(timeInSeconds / 60) // 분 단위로 변환
  const seconds = Math.floor(timeInSeconds % 60) // 초 단위로 변환
  return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}` // 0초 미만일 때 0 추가
}

// 진행 상태 바 조정
const seekAudio = () => {
  if (audioElement.value && audioElement.value.duration) {
    // 슬라이더의 값(progress.value)을 기반으로 currentTime 설정
    audioElement.value.currentTime = (progress.value / 100) * audioElement.value.duration
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

const onMouseOverKakaoMapMarker = (marker) => {
  if(marker.clicked) return  
  marker.zindex = 15
}

const onMouseOutKakaoMapMarker = (marker) => {
  if(marker.clicked) return
  marker.zindex = 0
}
</script>

<template>
  <KakaoMap
    :lat="mapLat"
    :lng="mapLng"
    width="100%"
    height="89vh"
    :level="mapScale"
    @onLoadKakaoMap="onLoadKakaoMap"
    @onLoadKakaoMapMarkerCluster="onLoadKakaoMapMarkerCluster"
  >
    <KakaoMapCustomOverlay 
      v-for="marker in markerList"
      :key="marker.aptId"
      :lat="marker.lat" :lng="marker.lng"
      :clickable="true"
      :z-index="marker.zindex"
    >
    <button 
      @click="onClickKakaoMapMarker(marker)"
      style="
        position: relative;
        background: #1EC800; /* 배경색을 초록색으로 변경 */
        border: none;
        border-radius: 8px; 
        padding: 8px 14px; 
        cursor: pointer; 
        line-height: 1.5;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
        transition: all 0.2s ease;
        min-width: 50px;
        text-align: center;
        padding: 6px 6px;
      "
      onmouseover="this.style.transform='translateY(-1px)'; this.style.boxShadow='0 4px 8px rgba(0, 0, 0, 0.2)'"
      @mouseover="onMouseOverKakaoMapMarker(marker)"
      onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 6px rgba(0, 0, 0, 0.15)'"
      @mouseout="onMouseOutKakaoMapMarker(marker)"
    >
      <span style="display: block; font-size: 11px; font-weight: 500; color: rgba(255, 255, 255, 0.9); margin-bottom: 0px;">{{ marker.area }}</span>
      <span style="display: block; font-size: 13px; font-weight: 700; color: white;">{{ marker.dealAmount }}</span>
      <span style="
        position: absolute;
        bottom: -8px;
        left: 50%;
        transform: translateX(-50%);
        width: 0;
        height: 0;
        border-left: 8px solid transparent;
        border-right: 8px solid transparent;
        border-top: 8px solid #1EC800; /* 화살표 색상도 초록색으로 변경 */
        filter: drop-shadow(0 2px 2px rgba(0, 0, 0, 0.15));
      "></span>
      </button>
    </KakaoMapCustomOverlay>
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

  <!-- 로딩 모달 창 추가 -->
  <transition name="fade">
    <div v-if="isLoading" class="modal">
      <div class="modal-content">
        <!-- 로딩 비디오 -->
        <video src="@/assets/loading7.webm" autoplay loop muted class="loading-video"></video>

        <!-- 로딩 텍스트 컨테이너 -->
        <div class="loading-text-container">
          <!-- 로딩 텍스트 애니메이션: <transition> 추가 및 key 속성 사용 -->
          <transition name="fade-text">
            <div class="loading-text" :key="currentLoadingText">{{ currentLoadingText }}</div>
          </transition>
        </div>
      </div>
    </div>
  </transition>


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
                  step="0.1"
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
}

.modal-content {
  background: linear-gradient(145deg, #ffffff, #f8f9fa);
  padding: 32px;
  border-radius: 20px;
  width: 90%;
  max-width: 500px;
  position: relative;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  z-index: 100;
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

.progress-bar-wrapper {
  position: relative;
  width: 100%;
  height: 6px;
  background: #e9ecef; /* 기본 배경 */
  border-radius: 3px;
}

.progress-bar-fill {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 0%; /* 초기 너비 */
  background: linear-gradient(to right, #11cbbb, #66b56b); /* 색상 그라데이션 */
  border-radius: 3px;
  transition: width 0.1s ease; /* 부드러운 전환 효과 */
  z-index: 5;
}

input[type='range'] {
  -webkit-appearance: none; /* 기본 브라우저 스타일 제거 */
  position: relative;
  width: 100%;
  height: 6px;
  background: transparent; /* 슬라이더 트랙을 투명하게 설정 */
  z-index: 0; /* 슬라이더 손잡이가 재생 바 위에 표시되도록 설정 */
  transition: width 0.1s ease; /* 부드러운 전환 효과 */
}
input[type='range']::-webkit-slider-runnable-track {
  width: 100%;
  height: 0;
  background: transparent; /* 트랙 배경을 투명하게 설정 */
  border-radius: 0px;
  z-index: 0;
}

/* 손잡이 스타일링 (Chrome, Edge, Safari) */
input[type='range']::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 40px; /* 손잡이 너비 */
  height: 40px; /* 손잡이 높이 */
  background: #e9ecef; /* 손잡이 색상 */
  border-radius: 50%; /* 손잡이를 원형으로 설정 */
  cursor: pointer; /* 클릭 시 손 모양 커서 표시 */
  margin-top: -17px; /* 트랙과 손잡이 정렬 */
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
  font-size: 12px;
  text-align: center;
  transition: all 0.2s ease;
  box-shadow: 0px 0px 10px rgba(0,0,0,0.1);
  font-weight: 600
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


/* 로딩 모달 비디오 스타일 */
.loading-video {
  width: 200px;  /* 원하는 크기로 조정 (예: 200px) */
  height: auto;
  border-radius: 16px;
  margin: 50px auto;  /* 수평 중앙 정렬 */
  display: block;  /* 블록 요소로 설정 */
}

/* 로딩 텍스트 스타일 */
.loading-text {
  text-align: center;
  font-size: 1.2em;
  color: #333;
  /*animation: fadeIn 0.5s ease-in-out;*/
}

/* 텍스트 페이드 인 애니메이션 */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* 추가된 로딩 텍스트 애니메이션 */
.fade-text-enter-active, .fade-text-leave-active {
  transition: opacity 0.9s;
}

.fade-text-enter-from, .fade-text-leave-to {
  opacity: 0;
}

/* "fade" 전환 애니메이션 정의 */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}


/* 로딩 텍스트 스타일 */
.loading-text {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 1.25rem;
  font-weight: 600;
  position: absolute; /* 텍스트를 절대 위치로 설정하여 겹치지 않도록 함 */
  top: 0;
  left: 0;
  width: 100%;
  text-align: center;
  font-size: 1.2em;
  color: #2c3e50;
  white-space: nowrap; /* 텍스트 줄바꿈 방지 */
}

/* 로딩 텍스트 하이라이트 효과 */
.loading-text::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: -15px;
  height: 5px;
  width: 100%;
  background: linear-gradient(90deg, #3498db, #2ecc71, #3498db, #32ce6b);
  background-size: 200% 100%;
  animation: gradientSlide 2s linear infinite;
  border-radius: 2px;
  margin-top: 5px;
}


/* 로딩 텍스트 컨테이너 스타일 */
.loading-text-container {
  width: 100%;
  min-height: 3em;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  margin-top: 1rem;
}

/* 그라데이션 슬라이드 애니메이션 */
@keyframes gradientSlide {
  0% {
    background-position: 100% 0;
  }
  100% {
    background-position: -100% 0;
  }
}

/* 점 애니메이션 */
@keyframes dotAnimation {
  0% { content: "."; }
  33% { content: ".."; }
  66% { content: "..."; }
  100% { content: ""; }
}

</style>
