import request from '@/utils/request'
const baseURL = '/wisdomaudit'
import qs from 'qs'


// 模型任务新增 模型列表
export function historicalaudit_pageList (data) {
  return request({
    baseURL: baseURL,
    url: `/historyAuditFind/pageList `,
    method: 'post',
    isLoading: false,
    data,
  })
}


// 历史审计 新增
export function historicalaudit_add (data) {
  return request({
    baseURL: baseURL,
    url: `/historyAuditFind/save`,
    method: 'post',
    isLoading: false,
    data,
  })
}
// 历史审计 编辑详情
export function historicalaudit_details (data) {
  let id = data.id
  return request({
    baseURL: baseURL,
    url: '/historyAuditFind/getById/' + id + '',
    method: 'get',
    isLoading: false,
    data,
  })
}

// 历史审计 审计单位
export function historicalaudit_loaauditorg (data) {
  return request({
    baseURL: baseURL,
    url: `/init/loaauditorg`,
    method: 'post',
    isLoading: false,
    data,
  })
}
// 历史审计编辑 保存
export function historicalaudit_update (data) {
  return request({
    baseURL: baseURL,
    url: `/historyAuditFind/update `,
    method: 'put',
    isLoading: false,
    data,
  })
}

// 历史审计 删除
export function historicalaudit_delete (data) {
  let ids = data.ids
  return request({
    baseURL: baseURL,
    url: '/historyAuditFind/delete/' + ids + '',
    method: 'delete',
    isLoading: false,
    data,
  })
}



export function historicalaudit_yj (data) {
  return request({
    baseURL: baseURL,
    url: `/auditBasy/pageList`,
    method: 'post',
    isLoading: false,
    data,
  })
}