import axios from 'axios';

function localAxios() {
  const instance = axios.create({
    baseURL: 'http://localhost:8080/',
    headers: {
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjQsImlhdCI6MTczMTc3MTM4NCwiZXhwIjoxNzMxODU3Nzg0fQ.zZynrIWLvBsibrjJ4uHaHiLevUaWM5rl1iF4u4WW040',
      'Content-Type': 'application/json;charset=utf-8',
    },
  });
  instance.defaults.headers.post['Content-Type'] = 'application/json';
  instance.defaults.headers.put['Content-Type'] = 'application/json';
  instance.defaults.headers.delete['Content-Type'] = 'application/json';
  return instance;
}

export { localAxios };