import request from '@/utils/request'
const baseURL = '/wisdomaudit'
import qs from 'qs'

//确认问题整改清单
export function pageList (data) {
  return request({
    baseURL: baseURL,
    url: `/problemCorrect/pageList`,
    method: 'post',
    isLoading: false,
    data,
  })
}
//编辑保存
export function editProblemCorrect (data) {
  return request({
    baseURL: baseURL,
    url: `/problemCorrect/editProblemCorrect`,
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

