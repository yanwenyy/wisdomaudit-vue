import request from '@/utils/request'
const baseURL = '/wisdomaudit'
import qs from 'qs'
// 管理指标
export function operatingIndicators_list (data) {
  return request({
    baseURL: baseURL,
    url: `/operatingIndicators/list2`,
    method: 'post',
    data,
  })
}


// 问题
export function task_pageList_wt (data) {
  return request({
    baseURL: baseURL,
    url: `/problemList/pageList`,
    method: 'post',
    data,
  })
}

// 问题导出
export function task_pageList_export (data) {
  return request({
    baseURL: baseURL,
    url: `/auditReport/export/word`,
    method: 'post',
    data: qs.stringify(data),
  })
}

// 附件
export function export_selectFile (data) {
  let id = data.id
  console.log(id);
  return request({
    baseURL: baseURL,
    url: '/auditReport/selectFile/' + id + '',
    method: 'post',
    data,
  })
}