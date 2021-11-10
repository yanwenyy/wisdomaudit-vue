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
