import { localAxios } from '@/util/http-commons';

const local = localAxios();

// 로그인
async function login(body, success, fail) {
	await local.post(`/user/login`, body).then(success).catch(fail);
}

// 인증코드 전송
async function sendVerifyCode(param, success, fail) {
	await local.get(`/auth/email`, { params: param }).then(success).catch(fail);
}

// 인증코드 전송
async function checkVerifyCode(body, success, fail) {
	await local.post(`/auth/email-code`, body).then(success).catch(fail);
}

// 이메일 중복 확인
async function checkDuplicationEmail(param, success, fail) {
	await local.get(`/auth/email-duplication`, { params: param }).then(success).catch(fail);
}

// 닉네임 중복 확인
async function checkDuplicationNickname(param, success, fail) {
	await local.get(`/auth/nickname-duplication`, { params: param }).then(success).catch(fail);
}

// 회원가입
async function signUp(body, success, fail) {
	await local.post(`/user`, body).then(success).catch(fail);
}

// 비밀번호 찾기
async function findPassword(body, success, fail) {
	await local.put(`/user/password`, body).then(success).catch(fail);
}

export { 
	login, sendVerifyCode, checkVerifyCode, checkDuplicationEmail, checkDuplicationNickname, signUp,
	findPassword
 }