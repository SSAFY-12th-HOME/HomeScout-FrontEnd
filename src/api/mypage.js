import { localAxios } from '@/util/http-commons';
import { imageAxios } from '@/util/http-commons';

const local = localAxios();
const image = imageAxios()

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

// 프로필 이미지 업로드
async function uploadImage(body, success, fail) {
  image.defaults.headers['Authorization'] = getTokenHeader()
	await image.post(`/user/image`, body).then(success).catch(fail)
}

// 나의 매물 불러오기
async function getMySaleList(success, fail) {
	local.defaults.headers["Authorization"] = getTokenHeader()
	await local.get('/sale').then(success).catch(fail)
}

// 매물 삭제
async function deleteMySale(saleId, success, fail) {
	local.defaults.headers["Authorization"] = getTokenHeader()
	await local.delete(`/sale/${saleId}`).then(success).catch(fail)
}

// 비밀번호 확인
async function confirmPassword(body, success, fail) {
	local.defaults.headers["Authorization"] = getTokenHeader()
	await local.post(`/user/check-password`, body).then(success).catch(fail)
}

// 회원 정보 수정 조회
async function getUserInfo(success, fail) {
	local.defaults.headers["Authorization"] = getTokenHeader()
	await local.get(`/user`).then(success).catch(fail)
}

// 내가 만든 퀴즈 조회
async function getMyQuizList(success, fail) {
	local.defaults.headers["Authorization"] = getTokenHeader()
	await local.get(`/quiz/my`).then(success).catch(fail)
}

// 내가 만든 퀴즈 삭제
async function deleteMyQuiz(quizId, success, fail) {
	local.defaults.headers["Authorization"] = getTokenHeader()
	await local.delete(`/quiz/${quizId}`).then(success).catch(fail)
}


export { 
	getMypage, getMyWishList, uploadImage, getMySaleList,
	deleteMySale, confirmPassword, getUserInfo, getMyQuizList,
	deleteMyQuiz
};