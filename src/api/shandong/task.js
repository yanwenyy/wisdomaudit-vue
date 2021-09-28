import request from '@/utils/request'

const baseURL = '/wisdomaudit_son'
import qs from 'qs'

// 模型任务 自建任务
export function task_pageList (data) {
  return request({
    baseURL: baseURL,
    url: `/auditTask/selectTask/pageList`,
    method: 'post',
    data,
  })
}

// 模型任务新增 选择模型  引用
export function quoteModel (data) {
  return request({
    baseURL: baseURL,
    url: `/auditTask/quoteModel`,
    method: 'post',
    data,
  })
}


// 模型任务新增 模型列表
export function task_model_pageList (data) {
  return request({
    baseURL: baseURL,
    url: `/auditModel/pageList`,
    method: 'post',
    data,
  })
}


// 自建任务新增
export function task_add (data) {
  return request({
    baseURL: baseURL,
    url: `/auditTask/save`,
    method: 'post',
    data,
  })
}

// 自建任务编辑
export function task_remove (data) {
  return request({
    baseURL: baseURL,
    url: `/auditTask/update`,
    method: 'post',
    data,
  })
}



// 自建任务删除
export function task_edit (data) {
  let ids = data.ids
  return request({
    baseURL: baseURL,
    url: '/auditTask/delete/' + ids + '',
    method: 'post',
    data,
  })
}









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
