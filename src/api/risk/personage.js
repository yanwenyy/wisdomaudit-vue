import request from '@/utils/request'

const baseURL = '/wisdomaudit'


export function  getTabList (data) {
  return request({
    baseURL: baseURL,
    url:  `/dataAuditApi/getTabList?${data}`,
    method: 'get',
  })
}


export function  getTypes (data) {
  return request({
    baseURL: baseURL,
    url:  `/dataAuditApi/getTypes?${data}`,
    method: 'get',
  })
}
