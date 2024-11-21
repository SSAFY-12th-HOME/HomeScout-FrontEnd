import { localAxios } from '@/util/http-commons';

const local = localAxios();

function getTokenHeader() {
	return 'Bearer ' + JSON.parse(sessionStorage.getItem("user")).token
}

// 모든 아파트 위치 정보 불러오기
async function getMypage(success, fail) {
	local.defaults.headers["Authorization"] = getTokenHeader()
	await local.get('/user/mypage').then(success).catch(fail)
}

// 나의 관심 매물 불러오기
async function getMyWishList(success, fail) {
	local.defaults.headers["Authorization"] = getTokenHeader()
	await local.get('/sale/wish').then(success).catch(fail)
}

export { 
	getMypage, getMyWishList
};