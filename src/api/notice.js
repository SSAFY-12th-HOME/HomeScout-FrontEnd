import { localAxios } from '@/util/http-commons';

const local = localAxios();

function getTokenHeader() {
  return 'Bearer ' + JSON.parse(sessionStorage.getItem('user')).token;
}

// 공지사항 리스트 조회
async function fetchNoticeList(success, fail) {
  local.defaults.headers['Authorization'] = getTokenHeader();
  await local.get('/notice').then(success).catch(fail);
}

// 공지사항 상세 조회
async function fetchNoticeDetail(noticeId, success, fail) {
  local.defaults.headers['Authorization'] = getTokenHeader();
  await local.get(`/notice/${noticeId}`).then(success).catch(fail);
}

// 공지사항 등록
async function createNotice(body, success, fail) {
  local.defaults.headers['Authorization'] = getTokenHeader();
  await local.post('/notice', body).then(success).catch(fail);
}

// 공지사항 삭제
async function deleteNotice(noticeId, success, fail) {
  local.defaults.headers['Authorization'] = getTokenHeader();
  await local.delete(`/notice/${noticeId}`).then(success).catch(fail);
}

export { fetchNoticeList, fetchNoticeDetail, createNotice, deleteNotice };
