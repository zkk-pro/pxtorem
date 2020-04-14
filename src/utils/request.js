import axios from 'axios'
import toast from '../components/Toast'

let request = axios.create()

request.defaults.timeout = 1000 * 30

// 响应拦截
request.interceptors.response.use((res) => {
  let { data } = res
  if (data.code === 0) {
    return data.data
  } else {
    // toast.show({ content: data.message })
    Promise.reject(data)
  }
}, err => {
  toast.show({ content: 'error：Network errror'})
  return Promise.reject(err)
})

export default request