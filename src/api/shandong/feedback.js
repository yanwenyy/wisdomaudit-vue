import request from '@/utils/request'
import qs from 'qs'

const baseURL = '/wisdomaudit'
// 反馈列表
export function data_pageList (data) {
  return request({
    baseURL: baseURL,
    url: `/addDataTask/pageListBuyUser`,
    method: 'post',
    isLoading: false,

    data
  })
}
// 反馈列表   弹窗资料列表
export function feedback_pageList (data) {
  return request({
    baseURL: baseURL,
    url: `/auditPreviousDemandData/pageList
    `,
    method: 'post',
    isLoading: false,

    data
  })
}
// 操作   操作记录
export function operation_record_list (data) {
  return request({
    baseURL: baseURL,
    url: `/auditPreviousDemandData/sysLogById`,
    method: 'post',
    isLoading: false,
    data
  })
}
//模版下载
export function operation_download (data) {
  return request({
    baseURL: baseURL,
    url: `/auditPreviousDemandData/downloadByBid`,
    method: 'post',
    responseType: 'blob',
    isLoading: false,

    data: qs.stringify(data),
  })
}

// 上传
export function operation_uploadData (data) {
  return request({
    baseURL: baseURL,
    url: `/auditPreviousDemandData/uploadData`,
    method: 'post',
    data: qs.stringify(data),
    isLoading: false,

  })
}

//附件列表
export function operation_findFile (data) {
  let id = data.id
  return request({
    baseURL: baseURL,
    url: '/auditPreviousDemandData/findFile/' + id + '',
    method: 'post',
    isLoading: false,

    data
  })
}



export function operation_reportData (data) {
  return request({
    baseURL: baseURL,
    url: `/auditPreviousDemandData/reportData`,
    method: 'post',
    isLoading: false,

    data
  })
}

// 删除附件 删除数据库的真删除
// export function file_remove_list (data) {
//   return request({
//     baseURL: baseURL,
//     url: `/attachment/fileRemove`,
//     method: 'post',
//     isLoading: false,
//     data: qs.stringify(data),
//   })
// }
// 删除附件  假删除
export function file_remove_list (data) {
  return request({
    baseURL: baseURL,
    url: `/attachment/fileRemove1`,
    method: 'post',
    isLoading: false,
    data: qs.stringify(data),
  })
}