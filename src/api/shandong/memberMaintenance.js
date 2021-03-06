// 组员维护
import request from '@/utils/request'

const baseURL = '/wisdomaudit'


// 组员维护列表
export function projectMembership (data) {
  return request({
    baseURL: baseURL,
    url: `/projectMembership/pageList`,
    method: 'post',
    isLoading: false,
    data
  })
}
// 组员人员下拉框接口
export function getProjectMember (num, size, id) {
  return request({
    baseURL: baseURL,
    url: `/projectMembership/listUserInfo?` + `pageCurrent=` + num + `&pageSize=` + size + `&projectId=` + id,
    method: 'get',
    isLoading: false,

  })
}

// 组员编辑
export function editprojectMembership (data) {
  return request({
    baseURL: baseURL,
    url: `/projectMembership/update`,
    method: 'put',
    isLoading: false,
    data
  })
}


//组员编辑批量
export function editprojectMembershipList (data) {
  return request({
    baseURL: baseURL,
    url: `/projectMembership/batchUpdate`,
    method: 'put',
    isLoading: false,
    data
  })
}


// 组员删除
export function deletprojectMembership (id) {
  return request({
    baseURL: baseURL,
    url: `/projectMembership/delete/` + id + '',
    method: 'delete',
    isLoading: false,

  })
}

// 组员增加
export function addprojectMembership (data) {
  return request({
    baseURL: baseURL,
    url: `/projectMembership/save`,
    method: 'post',
    isLoading: false,
    data
  })
}


// 模型列表
export function auditModelList (data) {
  return request({
    baseURL: baseURL,
    url: `/auditModel/pageList`,
    method: 'post',
    isLoading: false,
    data
  })
}

//引用模型
export function quoteModel (data) {
  return request({
    baseURL: baseURL,
    url: `/auditTask/quoteModel`,
    isLoading: false,
    method: 'post',
    data
  })
}


// 模型任务列表
export function modelTaskList (data) {
  return request({
    baseURL: baseURL,
    url: `/auditTask/selectTask/pageList`,
    method: 'post',
    isLoading: false,
    data
  })
}


// 模型任务编辑责任人
export function editmodelPerson (data) {
  return request({
    baseURL: baseURL,
    url: `/auditTask/setChargePeople`,
    method: 'put',
    isLoading: false,
    data
  })
}




// 模型任务删除
export function deletmodelTask (id) {
  return request({
    baseURL: baseURL,
    url: `/auditTask/delete/` + id + '',
    method: 'delete',
    isLoading: false,

  })
}


//自建任务完成
export function selfTaskFunction (data) {
  return request({
    baseURL: baseURL,
    url: `/auditTask/saveTask`,
    method: 'post',
    isLoading: false,

    data
  })
}


// 判断项目中模型是否存在
export function isModel (data) {
  return request({
    baseURL: baseURL,
    url: `/auditTask/pageList`,
    method: 'post',
    isLoading: false,

    data
  })
}


// 修改项目状态
export function editProjectCode (data) {
  return request({
    baseURL: baseURL,
    url: `/managementProject/updateProjectNoRole`,
    method: 'put',
    isLoading: false,

    data
  })
}

//获取初始化项目
export function initProject (data) {
  return request({
    baseURL: baseURL,
    url: `/projectMembership/pageListInUse`,
    method: 'post',
    isLoading: false,

    data
  })
}

// 根据用户查询项目列表
export function projectListByuser2 (data) {
  console.log(data);
  return request({
    baseURL: baseURL,
    // url: `/managementProject/pageListByUser`,
    url: `/managementProject/pageList2`,
    method: 'post',
    isLoading: false,

    data
  })
}

// 自建任务回显

export function editTaskSelf (id) {
  return request({
    baseURL: baseURL,
    url: `/auditTask/getById/` + id + '',
    method: 'get'
  })
}


// 自建任务编辑接口
export function editTaskSelfInfo (data) {
  return request({
    baseURL: baseURL,
    url: `/auditTask/update`,
    method: 'put',
    isLoading: false,

    data
  })
}

//设置接口人
export function setinterFaceperson (isperson, projectId, memberid) {
  return request({
    baseURL: baseURL,
    url: `/projectMembership/setIsLiaison?` + `isLiaison=` + isperson + `&managmentProjectId=` + projectId + `&projectMembershipUuid=` + memberid,
    method: 'put',
    isLoading: false,

  })
}


