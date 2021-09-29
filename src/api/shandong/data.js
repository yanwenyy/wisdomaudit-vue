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
  let id = data.id
  return request({
    baseURL: baseURL,
    url: '/addDataTask/getById/' + id + '',
    method: 'get',
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




// url: NewJingjiribao + '/select/work/page?activityId=' + data.activityId + '&current=' + data.current + '&size=' + data.size + '&type=' + data.type,
