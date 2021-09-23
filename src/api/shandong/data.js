import request from '@/utils/request'

const baseURL = '/wisdomaudit'
// 资料列表
export function data_pageList (data) {
  return request({
    baseURL: baseURL,
    url: `/addDataTask/pageList`,
    method: 'post',
    data
  })
}

// 资料列表 新增里的列表
export function add_pageList (data) {
  console.log(data);
  let id = data.taskId
  return request({
    baseURL: baseURL,
    url: `/auditPreviousData/pageList`,
    method: 'put',
    data
  })
}




// 资料列表 下发
export function data_push (data) {
  console.log(data);
  let id = data.taskId
  return request({
    baseURL: baseURL,
    url: '/addDataTask/push/' + id + '',
    method: 'put',
    data
  })
}


// 资料列表 新增
export function data_save (data) {
  console.log(data);
  let id = data.taskId
  return request({
    baseURL: baseURL,
    url: `/addDataTask/save`,
    method: 'pust',
    data
  })
}


// url: NewJingjiribao + '/select/work/page?activityId=' + data.activityId + '&current=' + data.current + '&size=' + data.size + '&type=' + data.type,
