import { localAxios } from '@/util/http-commons';

const local = localAxios();

// 로그인
async function login(body, success, fail) {
	await local.post(`/user/login`, body).then(success).catch(fail);
}

export { login }