import request from '@/utils/request'
import qs from 'qs'

const baseURL = '/wisdomaudit';
//获取用户信息
export function get_userInfo() {
  return request({
    baseURL: baseURL,
    url:'/init/getCurrentInfo',
    method: 'get',
  })
}
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
    url: `/auditPreviousDemandData/downloadByFileId`,
    ifDownFile:true,
    responseType:'blob',
    method: 'post',
    data
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
//经营指标列表
export function indexManagement_pageList(data) {
  return request({
    baseURL: baseURL,
    url:'/operatingIndicators/list',
    method: 'post',
    data
  })
}
//经营指标编辑
export function indexManagement_edit(data) {
  return request({
    baseURL: baseURL,
    url:'/operatingIndicators/updateValue',
    method: 'put',
    data
  })
}
//新增指标分页查询
export function indexManagement_addList(data) {
  return request({
    baseURL: baseURL,
    url:'/indexManagement/pageList',
    method: 'post',
    data
  })
}
//新增指标新增
export function indexManagement_addSave(data) {
  return request({
    baseURL: baseURL,
    url:'/indexManagement/save',
    method: 'post',
    data
  })
}
//生成经营指标
export function indexManagement_save(data) {
  return request({
    baseURL: baseURL,
    url:'/operatingIndicators/cite',
    method: 'post',
    data
  })
}
//经营指标删除
export function indexManagement_delete (data) {
  return request({
    baseURL: baseURL,
    url: '/operatingIndicators/delete/' + data + '',
    method: 'delete',
    data
  })
}
//整改措施接口人列表
export function correctStep_pageListJkr(data) {
  return request({
    baseURL: baseURL,
    url:'/correctStep/pageListJkr',
    method: 'post',
    data
  })
}
//整改措施领导列表
export function correctStep_pageListLd(data) {
  return request({
    baseURL: baseURL,
    url:'/correctStep/pageListLd',
    method: 'post',
    data
  })
}
//整改措施跟进人列表
export function correctStep_pageList(data) {
  return request({
    baseURL: baseURL,
    url:'/correctStep/pageList',
    method: 'post',
    data
  })
}
//整改措施项目下拉列表
export function correctStep_getProjectList(data) {
  return request({
    baseURL: baseURL,
    url:'/correctStep/getProjectList',
    method: 'post',
    data
  })
}
//整改措施详情
export function correctStep_getById(data) {
  return request({
    baseURL: baseURL,
    url:'/correctStep/getById/' + data + '',
    method: 'get',
    data
  })
}
//整改措施录入整改
export function correctStep_inputAlter(data) {
  return request({
    baseURL: baseURL,
    url:'/correctStep/inputAlter',
    method: 'post',
    data
  })
}
//整改措施详情提交
export function correctStep_submitAlter(data) {
  return request({
    baseURL: baseURL,
    url:'/correctStep/submitAlter',
    method: 'post',
    data
  })
}
//整改措施列表提交
export function correctStep_submitAlterLb(data) {
  return request({
    baseURL: baseURL,
    url:'/correctStep/submitAlterLb',
    method: 'post',
    data
  })
}
