import request from '@/utils/request'
const baseURL = '/wisdomaudit_son'
import qs from 'qs'


// 模型任务新增 模型列表
export function historicalaudit_pageList (data) {
  return request({
    baseURL: baseURL,
    url: `/historyAuditFind/pageList `,
    method: 'post',
    data,
  })
}


// 历史审计 新增
export function historicalaudit_add (data) {
  return request({
    baseURL: baseURL,
    url: `/historyAuditFind/save`,
    method: 'post',
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
    data,
  })
}

// 历史审计 审计单位
export function historicalaudit_loaauditorg (data) {
  return request({
    baseURL: baseURL,
    url: `/init/loaauditorg`,
    method: 'post',
    data,
  })
}
// 历史审计编辑 保存
export function historicalaudit_update (data) {
  return request({
    baseURL: baseURL,
    url: `/historyAuditFind/update `,
    method: 'put',
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
    data,
  })
}