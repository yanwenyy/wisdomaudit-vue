import axios from 'axios'
import Vue from "vue";
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
var ifDown = false;

let loading;
let needLoadingRequestCount = 0; // 声明一个对象用于存储请求个数
function startLoading () {
  loading = Vue.prototype.$loading({
    lock: true,
    // text: "努力加载中...",
    // background: 'rgba(0,0,0,0.3)',
    background: 'transparent',
    customClass: 'loadingIcon',
    target: document.querySelector(".loading-area") // 设置加载动画区域
  });
}
function endLoading () {
  loading.close();
}
function showFullScreenLoading () {
  if (needLoadingRequestCount === 0) {
    startLoading();
  }
  needLoadingRequestCount++;
}
function hideFullScreenLoading () {
  if (needLoadingRequestCount <= 0) return;
  needLoadingRequestCount--;
  if (needLoadingRequestCount === 0) {
    endLoading();
  }
}
// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 180000 // request timeout

})
// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    // if (store.getters.token) {
    // let each request carry token
    // ['X-Token'] is a custom headers key
    // please modify it according to the actual situation

    // config.headers['X-Token'] = getToken()
    if (config.ifDownFile) {
      ifDown = true;
    }
    // if(config.timeout){
    //   config.headers.timeout=config.timeout;
    // }
    if (config.isLoading !== false) {
      // 如果配置了isLoading: false，则不显示loading
      showFullScreenLoading();
    }
    if (config.method == "get") {
      if (!!window.ActiveXObject || "ActiveXObject" in window) {
        config.url=config.url+(config.url.indexOf("?")!=-1?'&&':'?')+"ywtime="+new Date().getTime();
      }
    }
    config.headers.TOKEN = sessionStorage.getItem('TOKEN');
    // }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    hideFullScreenLoading();
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    hideFullScreenLoading();
    const res = response.data

    // if the custom code is not 20000, it is judged as an error.
    if (res.code !== 0 && res.status !== 0 && !ifDown) {
      Message({
        message: res.msg || 'Error',
        type: 'error',
        duration: 5 * 1000
      })

      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      // if(res.code === 50008 || res.code === 50012 || res.code === 50014 || )
      if (res.code === 2012) {
        // to re-login
        MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
          confirmButtonText: 'Re-Login',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      }
      return Promise.reject(new Error(res.msg || 'Error'))
    } else {
      return res
    }
  },
  error => {
    console.log('err' + error) // for debug
    hideFullScreenLoading();
    Message({
      message: error.msg,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
