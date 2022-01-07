import request from '@/utils/request'
const baseURL = '/wisdomaudit'
import qs from 'qs'
// 管理指标
export function operatingIndicators_list (data) {
  return request({
    baseURL: baseURL,
    url: `/operatingIndicators/list2`,
    method: 'post',
    isLoading: false,
    data,
  })
}


// 问题
// export function task_pageList_wt (data) {
//   return request({
//     baseURL: baseURL,
//     url: `/problemList/pageList1`,
//     method: 'post',
//     isLoading: false,
//     data,
//   })
// }
// 确认单 列表
export function task_pageList_wt (data) {
  return request({
    baseURL: baseURL,
    url: '/auditConfirmation/queryList',
    method: 'post',
    isLoading: false,
    data,
  })
}


// 确认单 列表确认
export function queryAllProblemList (data) {
  return request({
    baseURL: baseURL,
    url: '/problemList/queryAllProblemList ',
    method: 'post',
    isLoading: false,
    data,
  })
}


// 问题导出
export function task_pageList_export (data) {
  return request({
    baseURL: baseURL,
    url: `/auditReport/export/word`,
    method: 'post',
    isLoading: false,
    data: qs.stringify(data),
  })
}

// 附件 以及公用信息显示
export function export_selectFile (data) {
  let id = data.id
  console.log(id);
  return request({
    baseURL: baseURL,
    url: '/auditReport/selectFile/' + id + '',
    method: 'post',
    isLoading: false,
    data,
  })
}
// 删除
// 删除附件
export function file_remove_list (data) {
  return request({
    baseURL: baseURL,
    url: `/attachment/fileRemove`,
    method: 'post',
    isLoading: false,
    data: qs.stringify(data),
  })
}