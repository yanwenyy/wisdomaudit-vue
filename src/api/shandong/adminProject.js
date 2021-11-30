import request from '@/utils/request'
const baseURL = '/wisdomaudit'
import qs from 'qs'

//确认问题整改清单
export function confirm_rectification (data) {
  return request({
    baseURL: baseURL,
    url: `/managementProject/PageProblemCorrect`,
    method: 'post',
    isLoading: false,
    data,
  })
}
// 编辑 删除 
export function edit_remove (data) {
  return request({
    baseURL: baseURL,
    url: `/managementProject/editProblemCorrect`,
    method: 'post',
    isLoading: false,
    data,
  })
}

//选择问题列表
export function selection_questions_list (data) {
  return request({
    baseURL: baseURL,
    url: `/managementProject/queryProblemList`,
    method: 'post',
    isLoading: false,
    data,
  })
}


//选择问题列表 保存
export function saveProblemCorrect (data) {
  console.log(data);
  return request({
    baseURL: baseURL,
    url: `managementProject/saveProblemCorrect`,
    method: 'post',
    isLoading: false,
    data,
  })
}



// 获取跟进人  广哥  
export function follow_up_person (data) {
  return request({
    baseURL: baseURL,
    url: '/projectMembership/listUserInfo/?projectid=' + data.projectid + '&pageCurrent=' + data.pageCurrent + '&pageSize=' + data.pageSize + '',
    method: 'get',
    isLoading: false,
    data,
  })
}


//选择整改跟进人  保存
export function updateManagementProject (data) {
  console.log(data);
  return request({
    baseURL: baseURL,
    url: `/managementProject/updateManagementProject`,
    method: 'post',
    isLoading: false,
    data,
  })
}


// 是否可以启动整改
export function isStartProject (data) {
  return request({
    baseURL: baseURL,
    url: `/managementProject/isStartProject`,
    method: 'post',
    isLoading: false,
    data,
  })
}

// 启动整改
export function startProject (data) {
  return request({
    baseURL: baseURL,
    url: `/managementProject/startProject`,
    method: 'post',
    isLoading: false,
    data,
  })
}



// 任务 select（
export function selectTask_s (data) {
  return request({
    baseURL: baseURL,
    url: `/auditTask/selectTaskProblem`,
    method: 'post',
    isLoading: false,
    data,
  })
}