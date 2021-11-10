import request from '@/utils/request'
const baseURL = '/wisdomaudit'
import qs from 'qs'

// 整改列表
export function pageProblemCorrectList (data) {
  return request({
    baseURL: baseURL,
    url: `/problemCorrect/pageProblemCorrectList`,
    method: 'post',
    isLoading: false,
    data,
  })
}
// 查看
export function details_pageList (data) {
  return request({
    baseURL: baseURL,
    url: `/problemCorrect/pageList`,
    method: 'post',
    isLoading: false,
    data,
  })
}
//设置整改跟进人
export function updateManagementProject (data) {
  return request({
    baseURL: baseURL,
    url: `/problemCorrect/updateManagementProject`,
    method: 'post',
    isLoading: false,
    data,
  })
}
// 整改计划  启动整改
export function isProjectLeader (data) {
  return request({
    baseURL: baseURL,
    url: `/problemCorrect/isProjectLeader`,
    method: 'post',
    isLoading: false,
    data,
  })
}

// 整改计划  启动整改
export function issueProject (data) {
  return request({
    baseURL: baseURL,
    url: `/problemCorrect/issueProject`,
    method: 'post',
    isLoading: false,
    data,
  })
}
