import { localAxios } from '@/util/http-commons'

const local = localAxios()

function getTokenHeader() {
  return 'Bearer ' + JSON.parse(sessionStorage.getItem('user')).token
}

// 모든 아파트 위치 정보 불러오기
async function getAptList(param, success, fail) {
  local.defaults.headers['Authorization'] = getTokenHeader()
  await local.get('/apt', { params: param }).then(success).catch(fail)
}

// 시도 리스트 불러오기
async function listSido(success, fail) {
  local.defaults.headers['Authorization'] = getTokenHeader()
  await local.get(`/apt/region/sido`).then(success).catch(fail)
}

// 시군구 리스트 불러오기
async function listGugun(param, success, fail) {
  local.defaults.headers['Authorization'] = getTokenHeader()
  await local.get(`/apt/region/gu`, { params: param }).then(success).catch(fail)
}

// 아파트 정보 불러오기
async function getAptInfo(aptId, success, fail) {
  local.defaults.headers['Authorization'] = getTokenHeader()
  await local.get(`/apt/${aptId}`).then(success).catch(fail)
}

// 아파트 이름 검색
async function getAptIdByAptName(name, success, fail) {
  local.defaults.headers['Authorization'] = getTokenHeader()
  await local.get(`/apt/name/${name}`).then(success).catch(fail)
}

// 관심 매물 등록
async function registerWishSale(saleId, success, fail) {
  local.defaults.headers['Authorization'] = getTokenHeader()
  await local.post(`/sale/${saleId}/wish`).then(success).catch(fail)
}

// 관심 매물 삭제
async function removeWishSale(saleId, success, fail) {
  local.defaults.headers['Authorization'] = getTokenHeader()
  await local.delete(`/sale/${saleId}/wish`).then(success).catch(fail)
}

// 매물 등록
async function registerSale(payload, success, fail) {
  local.defaults.headers['Authorization'] = getTokenHeader()
  await local.post(`/sale`, payload).then(success).catch(fail)
}

// 살아본 이야기 등록
async function registerLifeStory(aptId, payload, success, fail) {
  local.defaults.headers['Authorization'] = getTokenHeader()
  await local.post(`/apt/${aptId}/story`, payload).then(success).catch(fail)
}

// 살아본 이야기 삭제
async function deleteLifeStory(aptId, storyId, success, fail) {
  local.defaults.headers['Authorization'] = getTokenHeader()
  await local.delete(`/apt/${aptId}/story/${storyId}`).then(success).catch(fail)
}

// 현재 지도 중앙 좌표로 팟캐스트 데이터를 요청하는 함수
async function getPodcastData(latitude, longitude) {
  try {
    // Authorization 헤더에 토큰 설정
    local.defaults.headers['Authorization'] = getTokenHeader()

    // 서버에 좌표를 보내고 응답을 기다립니다.
    const response = await local.get('/podcast/play', {
      params: { latitude, longitude },
    })

    // 응답이 성공적일 때, 서버 응답 데이터 반환
    if (response && response.data && response.data.podcastUrl) {
      return response.data // 서버에서 받은 응답 데이터 반환
    } else {
      throw new Error('No podcastUrl in the response')
    }
  } catch (error) {
    // 에러 발생 시, 에러 메시지 출력
    console.error('Error fetching podcast data:', error)
    throw error // 에러를 다시 던져서 호출한 곳에서 처리하도록 함
  }
}

export {
  getAptList,
  listSido,
  listGugun,
  getAptInfo,
  getAptIdByAptName,
  registerWishSale,
  removeWishSale,
  registerSale,
  registerLifeStory,
  deleteLifeStory,
  getPodcastData,
}
