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

export { 
	getQuizList
};