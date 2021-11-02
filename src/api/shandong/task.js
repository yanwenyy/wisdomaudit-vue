import request from '@/utils/request'
const baseURL = '/wisdomaudit'
import qs from 'qs'

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

// 新增上传附件
export function enclosure_update (data) {
  let id = data.id
  return request({
    baseURL: baseURL,
    url: '/auditPreviousDemandData/sysLogById/' + id + '',
    method: 'post',
    isLoading: false,
    data
  })
}

// 模型任务 自建任务
export function task_pageList (data) {
  return request({
    baseURL: baseURL,
    url: `/auditTask/selectTask/pageList`,
    method: 'post',
    isLoading: false,
    data,
  })
}

// 模型任务新增 选择模型  引用
export function quoteModel (data) {
  return request({
    baseURL: baseURL,
    url: `/auditTask/quoteModel`,
    method: 'post',
    isLoading: false,
    data,
  })
}

// 模型任务新增 模型列表
export function task_model_pageList (data) {
  return request({
    baseURL: baseURL,
    url: `/auditModel/pageList`,
    method: 'post',
    isLoading: false,
    data,
  })
}
// 自建任务新增
export function task_add (data) {
  return request({
    baseURL: baseURL,
    url: `/auditTask/saveTask`,
    method: 'post',
    isLoading: false,

    data,
  })
}
// 自建任务编辑详情
export function task_details (data) {
  let id = data.id
  return request({
    baseURL: baseURL,
    url: '/auditTask/getById/' + id + '',
    method: 'get',
    isLoading: false,
    data,
  })
}
// 自建任务编辑 保存
export function task_update (data) {
  return request({
    baseURL: baseURL,
    url: `/auditTask/update`,
    method: 'put',
    isLoading: false,


    data,
  })
}
// 自建任务删除
export function task_remove (data) {
  let ids = data.ids
  return request({
    baseURL: baseURL,
    url: '/auditTask/delete/' + ids + '',
    method: 'delete',
    isLoading: false,

    data,
  })
}
// 更新状态
export function Task_update_status (data) {
  return request({
    baseURL: baseURL,
    url: `/auditTask/update`,
    method: 'put',
    isLoading: false,

    data,
  })
}
// 判断是否有重复的  判断否存在
export function task_select_repeat (data) {
  return request({
    baseURL: baseURL,
    url: `/auditTask/pageList`,
    method: 'post',
    isLoading: false,

    data,
  })
}
// 责任人
export function task_select_people (data) {
  return request({
    baseURL: baseURL,
    url: `/projectMembership/pageList`,
    method: 'post',
    isLoading: false,

    data,
  })
}
// 责任人 保存
export function task_setChargePeople (data) {
  return request({
    baseURL: baseURL,
    url: `/auditTask/setChargePeople`,
    method: 'put',
    isLoading: false,

    data,
  })
}
// 查看结果  核实
export function task_data_verify (data) {
  return request({
    baseURL: baseURL,
    url: `/resultDetailProjectRel/verify`,
    method: 'post',
    isLoading: false,

    data,
  })
}
// 问题数
// 列表
export function task_problems_list (data) {
  return request({
    baseURL: baseURL,
    url: `problemList/pageList`,
    method: 'post',
    isLoading: false,

    data,
  })
}
// 新增
export function task_problems_save (data) {
  return request({
    baseURL: baseURL,
    url: `/problemList/save`,
    method: 'post',
    isLoading: false,

    data,
  })
}
// 删除
export function task_problems_delete (data) {
  let ids = data.ids
  return request({
    baseURL: baseURL,
    url: '/problemList/delete/' + ids + '',
    method: 'delete',
    isLoading: false,

    data,
  })
}
// 编辑 回显
export function task_problems_details (data) {
  let id = data.id
  return request({
    baseURL: baseURL,
    url: '/problemList/getById/' + id + '',
    method: 'get',
    isLoading: false,
    data,
  })
}
// 编辑修改
export function task_problems_update (data) {
  return request({
    baseURL: baseURL,
    url: '/problemList/update',
    method: 'put',
    isLoading: false,

    data,
  })
}
// 领域 select
export function task_problems_loadcascader (data) {
  return request({
    baseURL: baseURL,
    url: '/init/loadcascader',
    method: 'post',
    isLoading: false,

    data,
  })
}
// 关联任务
export function task_problems_relation (data) {
  return request({
    baseURL: baseURL,
    url: '/auditTask/selectTask',
    method: 'post',
    isLoading: false,

    data,
  })
}



// 新建任务上传
// export function task_problems_uopload (data) {
//   return request({
//     baseURL: baseURL,
//     url: '/attachment/fileUploads',
//     method: 'post',
//     data: qs.stringify(data),
//   })
// }

// 附件详情
export function task_problems_uopload_details (data) {
  return request({
    baseURL: baseURL,
    url: '/attachment/pageList',
    method: 'post',
    isLoading: false,

    data,
  })
}


// 删除附件
export function task_fileRemove (data) {
  return request({
    baseURL: baseURL,
    url: `/attachment/fileRemove`,
    method: 'post',
    isLoading: false,
    data,
  })
}

// 获取责任人
export function task_personLiable (data) {
  return request({
    baseURL: baseURL,
    url: `/user/getLoginUserInfo`,
    method: 'get',
    isLoading: false,
    data,
  })
}




// 核实列表 新增动态表头
export function projectRel_pgeList (data) {
  return request({
    baseURL: baseURL,
    url: `/resultDetailProjectRel/pageList`,
    method: 'post',
    isLoading: false,

    data,
  })
}







// 附件详情  新版
export function projectRel_taskAttachment (data) {
  return request({
    baseURL: baseURL,
    url: `/auditTask/taskAttachment`,
    method: 'post',
    isLoading: false,

    data,
  })
}


