import request from '@/utils/request'
const baseURL = '/wisdomaudit'
import qs from 'qs'

// 整改列表
export function toReviewPage (data) {
  return request({
    baseURL: baseURL,
    url: `/problemCorrect/toReviewPage`,
    method: 'post',
    isLoading: false,
    data,
  })
}

// 审核

export function reviewResult (data) {
  return request({
    baseURL: baseURL,
    url: `/problemCorrect/reviewResult`,
    method: 'post',
    isLoading: false,
    data,
  })
}