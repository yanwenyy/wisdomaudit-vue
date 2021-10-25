import request from '@/utils/request'

const baseURL = '/wisdomaudit'


// 审计项目列表
export function projectList(data) {
    return request({
      baseURL: baseURL,
      url: `/managementProject/pageList`,
      method: 'post',
      data
    })
  }

// 根据用户查询项目列表
export function projectListByuser(data) {
  return request({
    baseURL: baseURL,
    url: `/managementProject/pageListByUser`,
    method: 'post',
    data
  })
}


// 项目类型下拉框数据
export function projectType(data) {
  return request({
    baseURL: baseURL,
    url: `/init/loadcascader`,
    method: 'post',
    data
  })
}


// 下拉人员选择器
export function projectPeople(data) {
  return request({
    baseURL: baseURL,
    url: `/init/loaduser`,
    method: 'post',
    data
  })
}


// 被审计对象选择器
export function loadaudittorg(data) {
  return request({
    baseURL: baseURL,
    url: `/init/loaauditorg`,
    method: 'post',
    data
  })
}

export function getItemId(data) {
  return request({
    baseURL: baseURL,
    url: `/managementProject/getProjectCode`,
    method: 'post',
    data
  })
}



export function addProject(data) {
  return request({
    baseURL: baseURL,
    url: `/managementProject/save`,
    method: 'post',
    data
  })
}


// 编辑项目回显
export function editProject(id){
  return request({
  baseURL: baseURL,
  url: `/managementProject/getById/`+id+'',
  method: 'get'
  })
}


// 编辑项目上传
export function editProjectUpdata(data){
  return request({
  baseURL: baseURL,
  url: `/managementProject/update`,
  method: 'put',
  data
  })
}


// 删除专项
export function deleteProject(id){
  return request({
  baseURL: baseURL,
  url: `/managementProject/delete/`+id+'',
  method: 'delete'
  })
}


// 专题领域下拉框
export function thematicAreas(data) {
  return request({
    baseURL: baseURL,
    url: `/init/loadcascader`,
    method: 'post',
    data
  })
}


// 更新当前项目接口
export function setprojectInit(id){
  return request({
  baseURL: baseURL,
  url: `/peopleTable/setCurrentProject?`+`managementProjectUuid=`+id+'',
  method: 'put',
  })
}


// 负责人，组长下拉框接口
export function getProjectMember(num,size){
  return request({
  baseURL: baseURL,
  url: `/user/listUserInfo?`+`pageCurrent=`+num+`&pageSize=`+size,
  method: 'get',
  })
}

//附件回显接口
export function attachmentEcho(data){
  return request({
  baseURL: baseURL,
  url: `/attachment/pageList`,
  method: 'post',
  data
  })
}





