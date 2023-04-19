const isDev = process.env.name === 'development'
export const baseURL = isDev ? 'http://127.0.0.1:4100' : 'https://domain.com'
import { login } from '@/config/login.js' // http://127.0.0.1:4100
console.log(process.env.name)
export const API_PREFIX = isDev ? '/api/v1' : '/api'
uni.$u.http.setConfig((config) => {
  config.baseURL = baseURL + API_PREFIX
  return config
})

uni.$u.http.interceptors.request.use(
  (config) => {
    // 可使用async await 做异步操作
    config.header.authorization = uni.getStorageSync('token')
    // delete config.header["content-type"]
    return config
  },
  (config) => {
    // 可使用async await 做异步操作
    return Promise.reject(config)
  }
)

uni.$u.http.interceptors.response.use(
  (response) => {
    if (response.statusCode !== 200) {
      return Promise.reject(response)
    }
    if (response.data.errorCode === 0) {
      return response.data.data
    } else {
      return Promise.reject(response)
    }
  },
  (response) => {
    // 对响应错误做点什么 （statusCode !== 200）
    console.log(response)
    switch (response.statusCode) {
      case 401:
        login(401)
        break
			case  403:
			  login(403)
			  break
      default:
        break
    }
    return Promise.reject(response.data)
  }
)

export default {
  baseURL,
}
