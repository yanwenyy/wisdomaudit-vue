import request from '@/utils/request'
import qs from 'qs'

const baseURL = '/wisdomaudit'
// 资料列表 未完成
export function data_pageList (data) {
  return request({
    baseURL: baseURL,
    url: `/addDataTask/pageListDoing`,
    method: 'post',
    data
  })
}
// 资料列表 已完成
export function data_pageListDone (data) {
  return request({
    baseURL: baseURL,
    url: `/auditPreviousDemandData/pageListDone`,
    method: 'post',
    data
  })
}

//未完成 删除
export function data_delete (data) {
  let ids = data.ids
  return request({
    baseURL: baseURL,
    url: '/addDataTask/delete/' + ids + '',
    method: 'delete',
    data
  })
}


// 新增 弹窗 初始化模型列表
export function add_pageList (data) {
  return request({
    baseURL: baseURL,
    url: `/auditPreviousData/pageList`,
    method: 'post',
    data
  })
}


// 资料列表 下发
export function data_push_ing (data) {
  console.log(data);
  let id = data.taskId
  return request({
    baseURL: baseURL,
    url: '/addDataTask/push/' + id + '',
    method: 'put',
    data
  })
}

// 资料新增 直接下发
export function data_savePush (data) {

  return request({
    baseURL: baseURL,
    url: '/addDataTask/savePush',
    method: 'post',
    data
  })
}



// 资料列表 确认保存
export function data_save (data) {
  return request({
    baseURL: baseURL,
    url: `/addDataTask/save`,
    method: 'post',
    data
  })
}

// 资料列表新增后的 编辑
export function data_edit_details (data) {
  return request({
    baseURL: baseURL,
    url: `/addDataTask/getById`,
    method: 'post',
    data
  })
}


// 资料列表新增后的 编辑保存
export function data_update (data) {
  return request({
    baseURL: baseURL,
    url: `/addDataTask/update`,
    method: 'put',
    data
  })
}

// 添加资料 模版数据
export function select_loadcascader (data) {
  return request({
    baseURL: baseURL,
    url: `/init/loadcascader`,
    method: 'post',
    data
  })
}

// 添加资料 保存确认
export function saveTemp (data) {
  return request({
    baseURL: baseURL,
    url: `auditPreviousData/saveTemp`,
    method: 'post',
    data
  })
}


// 操作  资料列表
export function operation_list_data (data) {
  return request({
    baseURL: baseURL,
    url: `/auditPreviousDemandData/pageList`,
    method: 'post',
    data
  })
}

// 操作   操作记录
export function operation_record_list (data) {
  let id = data.id
  return request({
    baseURL: baseURL,
    url: '/auditPreviousDemandData/sysLogById/' + id + '',
    method: 'post',
    data
  })
}

// 操作   审核
export function operation_audit (data) {
  return request({
    baseURL: baseURL,
    url: `/auditPreviousDemandData/audit`,
    method: 'post',
    data
  })
}

// 操作   提交
export function operation_uploadData (data) {
  return request({
    baseURL: baseURL,
    url: `/auditPreviousDemandData/uploadData`,
    method: 'post',
    data
  })
}

// 根据类型查看新增的  资料信息
export function select_user_data (data) {
  // let id = data.id
  return request({
    baseURL: baseURL,
    url: `/auditPreviousData/addNumber`,
    method: 'post',
    data
  })
}


// 附件详情
export function enclosure_details (data) {
  // let id = data.id
  // return request({
  //   baseURL: baseURL,
  //   url: '/auditPreviousDemandData/sysLogById/' + id + '',
  //   method: 'post',
  //   data
  // })
}




