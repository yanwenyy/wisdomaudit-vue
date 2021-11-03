import request from '@/utils/request'
const baseURL = '/wisdomaudit'
import qs from 'qs'

// 模型列表
export function model_list (data) {
  return request({
    baseURL: baseURL,
    url: `/auditModel/pageList`,
    method: 'post',
    isLoading: false,
    data
  })
}



// 查看
export function model_list_details (data) {
  let id = data.AuditModelID
  return request({
    baseURL: baseURL,
    url: '/auditModel/getById/' + id + '',
    method: 'get',
    isLoading: false,
    data
  })
}
