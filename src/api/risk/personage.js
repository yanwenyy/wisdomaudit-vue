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


export function  getSignature (data) {
  return request({
    baseURL: baseURL,
    url:  `/dataAuditApi/getSignature?userName=${data}`,
    method: 'get',
  })
}

export function  getdataAuditApi (date) {
  return request({
    url:  'http://10.19.206.196:8088/WebReport/decision/third/auth/cross/login',
    method: 'get',
    data:{third_token:date}
  })
}


