import { localAxios } from '@/util/http-commons';

const local = localAxios();

function getTokenHeader() {
	return 'Bearer ' + JSON.parse(sessionStorage.getItem("user")).token
}

// 모든 아파트 위치 정보 불러오기
async function getAptList(param, success, fail) {
	local.defaults.headers["Authorization"] = getTokenHeader()
	await local.get('/apt', { params: param }).then(success).catch(fail)
}

// 시도 리스트 불러오기
async function listSido(success, fail) {
	local.defaults.headers["Authorization"] = getTokenHeader()
  await local.get(`/apt/region/sido`).then(success).catch(fail);
}

// 시군구 리스트 불러오기
async function listGugun(param, success, fail) {
	local.defaults.headers["Authorization"] = getTokenHeader()
  await local.get(`/apt/region/gu`, { params: param }).then(success).catch(fail);
}

// 아파트 정보 불러오기
async function getAptInfo(aptId, success, fail) {
	local.defaults.headers["Authorization"] = getTokenHeader()
	await local.get(`/apt/${aptId}`).then(success).catch(fail);
}

// 아파트 이름 검색
async function getAptIdByAptName(name, success, fail) {
	local.defaults.headers["Authorization"] = getTokenHeader()
	await local.get(`/apt/name/${name}`).then(success).catch(fail);
}

// 관심 매물 등록
async function registerWishSale(saleId, success, fail) {
	local.defaults.headers["Authorization"] = getTokenHeader()
	await local.post(`/sale/${saleId}/wish`).then(success).catch(fail);
}

// 관심 매물 삭제
async function removeWishSale(saleId, success, fail) {
	local.defaults.headers["Authorization"] = getTokenHeader()
	await local.delete(`/sale/${saleId}/wish`).then(success).catch(fail);
}

export { 
	getAptList, listSido, listGugun, getAptInfo, getAptIdByAptName, registerWishSale,
	removeWishSale
 };