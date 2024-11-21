import axios from 'axios';

function localAxios() {
  const instance = axios.create({
    baseURL: 'http://localhost:8080/',
    headers: {
      // 'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjQsImlhdCI6MTczMTg5Nzc0NSwiZXhwIjoxNzMxOTg0MTQ1fQ.kjjIqopqPDTx2tztDcicE4Qtg3tfggJed3OOFUQvGJQ',
      'Content-Type': 'application/json;charset=utf-8',
    },
  });
  instance.defaults.headers.post['Content-Type'] = 'application/json';
  instance.defaults.headers.put['Content-Type'] = 'application/json';
  instance.defaults.headers.delete['Content-Type'] = 'application/json';
  return instance;
}

function imageAxios() {
  const instance = axios.create({
    baseURL: 'http://localhost:8080/',
    headers: {
      // 'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjQsImlhdCI6MTczMTg5Nzc0NSwiZXhwIjoxNzMxOTg0MTQ1fQ.kjjIqopqPDTx2tztDcicE4Qtg3tfggJed3OOFUQvGJQ',
      'Content-Type': 'multipart/form-data',
    },
  });
  instance.defaults.headers.post['Content-Type'] = 'multipart/form-data';
  return instance;
}

export { localAxios, imageAxios };