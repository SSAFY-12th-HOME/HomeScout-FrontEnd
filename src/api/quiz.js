import { localAxios } from '@/util/http-commons';

const local = localAxios();

function getTokenHeader() {
	return 'Bearer ' + JSON.parse(sessionStorage.getItem("user")).token
}

// 퀴즈 리스트 불러오기
async function getQuizList(param, success, fail) {
	local.defaults.headers["Authorization"] = getTokenHeader()
	await local.get('/quiz', { params: param }).then(success).catch(fail)
}

// 퀴즈 생성
async function createQuiz(body, success, fail) {
	local.defaults.headers["Authorization"] = getTokenHeader()
	await local.post('/quiz', body).then(success).catch(fail)
}

// 퀴즈 정보 불러오기
async function getQuiz(quizId, success, fail) {
	local.defaults.headers["Authorization"] = getTokenHeader()
	await local.get(`/quiz/${quizId}`).then(success).catch(fail)
}

// 퀴즈 풀이 제출
async function solveQuiz(quizId, body, success, fail) {
	local.defaults.headers["Authorization"] = getTokenHeader()
	await local.post(`/quiz/${quizId}/solve`, body).then(success).catch(fail)
}

export { 
	getQuizList, createQuiz, getQuiz, solveQuiz
};