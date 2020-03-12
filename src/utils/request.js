import axios from 'axios'
import router from '@/router/router.js'
// import store from '@/store/index.js'
// console.log("--------", process.env)

/* 打包文件要同时改变 .env.production  VUE_APP_DOWNLOAD_API */

const service = axios.create({
  baseURL: "http://120.77.248.38:8099", // 120.77.248.38   101.200.224.248
  // baseURL: "http://101.200.224.248:8099", // 客户环境
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'ziguangapi-validate-signature': '1172fe36b1a8c31c3580922538a91babfcf6f182096811eec5d665a78b49b0f1',
    'ziguangapi-validate-appid': '28647975',
    'ziguangapi-validate-nonce': '44446543',
    'ziguangapi-validate-timestamp': '1234567890'
  }
})

// request interceptor
service.interceptors.request.use(function (config) {
  return config;
}, function (error) {
  return Promise.reject(error);
})

// response interceptor
service.interceptors.response.use(function (response) {
  return response
}, function (error) {
  // service error : 404,400,500 handler
  switch (error.response.status) {
    case 404:
      // router.push('/404');
      break;
    case 401:
      router.push('/login');
      break;
    case 500:
    case 501:
      router.push('/50X');
      break;
    default:
      break;
  }
  return Promise.reject(error);
})

export default service
