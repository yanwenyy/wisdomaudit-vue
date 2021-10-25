import request from '@/utils/request'
import qs from 'qs'

const baseURL = '/wisdomaudit';
//附件删除
export function del_file(data) {
  return request({
    baseURL: baseURL,
    url:'/attachment/fileRemove?fileId=' + data + '',
    method: 'post',
    data
  })
}
//附件批量删除
export function del_file_batch(data) {
  return request({
    baseURL: baseURL,
    url:'/auditBasy/deleteFilesByAttachmentUuid/' + data + '',
    method: 'post',
    data
  })
}
//附件下载
export function down_file(data) {
  return request({
    baseURL: baseURL,
    url: `/auditPreviousDemandData/downloadByFileId?fileId=${data}`,
    ifDownFile:true,
    responseType:'blob',
    method: 'post',
  })
}
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
//审计依据查看附件列表
export function auditBasy_getFileList (data) {
  return request({
    baseURL: baseURL,
    url: '/auditBasy/getFileListById/' + data + '',
    method: 'get',
    data
  })
}
//审计确认单列表
export function auditConfirmation_pageList(data) {
  return request({
    baseURL: baseURL,
    url: '/auditConfirmation/queryList',
    method: 'post',
    data
  })
}
//审计确认单新增
export function auditConfirmation_save(data) {
  return request({
    baseURL: baseURL,
    url: '/auditConfirmation/save',
    method: 'post',
    data
  })
}
//审计确认单编辑
export function auditConfirmation_update(data) {
  return request({
    baseURL: baseURL,
    url: '/auditConfirmation/update',
    method: 'put',
    data
  })
}
//审计确认单删除
export function auditConfirmation_delete (data) {
  return request({
    baseURL: baseURL,
    url: '/auditConfirmation/delete/' + data + '',
    method: 'delete',
    data
  })
}
//审计确认单编辑查看详情
export function auditConfirmation_getDetail (data) {
  return request({
    baseURL: baseURL,
    url: '/auditConfirmation/getById/' + data + '',
    method: 'get',
    data
  })
}
