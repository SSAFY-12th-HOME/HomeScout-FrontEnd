import { localAxios } from '@/util/http-commons';

const local = localAxios();

// 모든 아파트 위치 정보 불러오기
function getAptList(param, success, fail) {
	console.log(param);
	local.get('/apt', { params: param }).then(success).catch(fail)
}

// 시도 리스트 불러오기
function listSido(success, fail) {
  local.get(`/apt/region/sido`).then(success).catch(fail);
}

// 시군구 리스트 불러오기
function listGugun(param, success, fail) {
  local.get(`/apt/region/gu`, { params: param }).then(success).catch(fail);
}

// 아파트 정보 불러오기
function getAptInfo(aptId, success, fail) {
	local.get(`/apt/${aptId}`).then(success).catch(fail);
}

// 아파트 이름 검색
function getAptIdByAptName(name, success, fail) {
	local.get(`/apt/name/${name}`).then(success).catch(fail);
}

export { getAptList, listSido, listGugun, getAptInfo, getAptIdByAptName };