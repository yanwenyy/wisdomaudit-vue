import request from '@/utils/request'
const baseURL = '/wisdomaudit'
import qs from 'qs'



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


