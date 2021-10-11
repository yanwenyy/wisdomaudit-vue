
import request from '@/utils/request'

const baseURL = '/wisdomaudit_task'
import qs from 'qs'

// 设置参数
export function task_findModelList (data) {
  return request({
    baseURL: baseURL,
    url: `/modelController/findModelList`,
    method: 'post',
    data,
  })
}


// 全部参数  对比
export function task_findModelList_all (data) {
  return request({
    baseURL: baseURL,
    url: `paramController/findParamsAndModelRelParams`,
    method: 'post',
    data,
  })
}



// 运行
export function Task_run (data) {
  return request({
    baseURL: baseURL,
    url: `/RunTaskController/addSdRunTaskAndRunTaskRel`,
    method: 'post',
    data,
  })
}

//查询任务状态
export function Task_data_status (data) {
  return request({
    baseURL: baseURL,
    url: `/RunTaskRelController/sdGetRunTaskRelByPage`,
    method: 'post',
    data,
  })
}

//  查看结果  模型列表的  结果分类
// export function task_selectModel (data) {
// return request({
//   baseURL: baseURL,
//   url: `/analysis/RunTaskRelController/getLikeRunTaskRelByPage`,
//   method: 'post',
//   data,
// })
// }

// 查看结果 数据列表
// export function task_selectTable (data) {
//   return request({
//     baseURL: baseURL,
//     url: `/analysis/RunResultTableController/selectTable`,
//     method: 'post',
//     data,
//   })
// }


// 查看结果  下载
// export function task_setting (data) {
//   return request({
//     baseURL: baseURL,
//     url: `/analysis/RunResultTableController/selectTable`,
//     method: 'post',
//     data,
//   })
// }

