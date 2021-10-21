import request from '@/utils/request'
import qs from 'qs'

const baseURL = '/wisdomaudit'
//审计依据列表
export function auditBasy_pageList(data) {
  return request({
    baseURL: baseURL,
    url: `/auditBasy/pageList`,
    method: 'post',
    data
  })
}
//审计依据新增或修改保存
export function auditBasy_save(data) {
  return request({
    baseURL: baseURL,
    url: `/auditBasy/saveOrUpdate`,
    method: 'post',
    data
  })
}
//审计依据删除
export function auditBasy_delete (data) {
  return request({
    baseURL: baseURL,
    url: '/auditBasy/delete/' + data + '',
    method: 'delete',
    data
  })
}
//审计依据编辑查看详情
export function auditBasy_getDetail (data) {
  return request({
    baseURL: baseURL,
    url: '/auditBasy/getById/' + data + '',
    method: 'get',
    data
  })
}

//审计确认单列表
export function auditConfirmation_pageList(data) {
  return request({
    baseURL: baseURL,
    url: `/auditConfirmation/pageList`,
    method: 'post',
    data
  })
}
