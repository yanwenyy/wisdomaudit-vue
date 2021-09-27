import request from '@/utils/request'

const baseURL = '/wisdomaudit'
import qs from 'qs'

// 资料列表
export function task_pageList (data) {
  console.log(data);
  return request({
    baseURL: baseURL,
    url: `/auditTask/selectTask/pageList`,
    method: 'post',
    data,
  })
}

// 模型任务新增 资料列表



// 设置参数


//  点击结果 模型列表的  结果分类
export function task_selectModel (data) {
  // console.log(data);
  // return request({
  //   baseURL: baseURL,
  //   url: `/analysis/RunTaskRelController/getLikeRunTaskRelByPage`,
  //   method: 'post',
  //   data,
  // })
}

// 点击结果的 数据列表
// export function task_selectTable (data) {
//   console.log(data);
//   return request({
//     baseURL: baseURL,
//     url: `/analysis/RunResultTableController/selectTable`,
//     method: 'post',
//     data,
//   })
// }


// // 设置参数
// export function task_setting (data) {
//   console.log(data);
//   return request({
//     baseURL: baseURL,
//     url: `/analysis/RunResultTableController/selectTable`,
//     method: 'post',
//     data,
//   })
// }
