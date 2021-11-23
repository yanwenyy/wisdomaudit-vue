import request from '@/utils/request'
const baseURL = '/wisdomaudit'
import qs from 'qs'

//被审计 列表
export function pageBsjProblemCorrectList (data) {
  return request({
    baseURL: baseURL,
    url: `/problemCorrect/pageBsjProblemCorrectList`,
    method: 'post',
    isLoading: false,
    data,
  })
}
//提交
export function submitReview (data) {
  console.log(data);
  return request({
    baseURL: baseURL,
    url: `/problemCorrect/submitReview`,
    method: 'post',
    isLoading: false,
    data,
  })
}
// 提交验证
export function post_rules (data) {
  console.log(data);
  return request({
    baseURL: baseURL,
    url: `/problemCorrect/formIsAll`,
    method: 'post',
    isLoading: false,
    data,
  })
}

// 启动整改弹窗


export function notice (data) {
  console.log(data);
  return request({
    baseURL: baseURL,
    url: `/problemCorrect/notice`,
    method: 'post',
    isLoading: false,
    data,
  })
}
