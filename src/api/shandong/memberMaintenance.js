// 组员维护
import request from '@/utils/request'

const baseURL = '/wisdomaudit'


// 组员维护列表
export function projectMembership(data){
    return request({
    baseURL: baseURL,
    url: `/projectMembership/pageList`,
    method: 'post',
    data
    })
}
// 下拉框接口
export function getProjectMember(data){
    return request({
    baseURL: baseURL,
    url: `/peopleTable/pageList`,
    method: 'post',
    data
    })
}

// 组员编辑
export function editprojectMembership(data){
    return request({
    baseURL: baseURL,
    url: `/projectMembership/update`,
    method: 'put',
    data
    })
}


//组员编辑批量
export function editprojectMembershipList(data){
    return request({
    baseURL: baseURL,
    url: `/projectMembership/batchUpdate`,
    method: 'put',
    data
    })
}


// 组员删除
export function deletprojectMembership(id){
    return request({
    baseURL: baseURL,
    url: `/projectMembership/delete/`+id+'',
    method: 'delete'
    })
}

// 组员增加
export function addprojectMembership(data){
    return request({
    baseURL: baseURL,
    url: `/projectMembership/save`,
    method: 'post',
    data
    })
}


// 模型列表
export function auditModelList(data){
    return request({
    baseURL: baseURL,
    url: `/auditModel/pageList`,
    method: 'post',
    data
    })
}

//引用模型
export function quoteModel(data){
    return request({
    baseURL: baseURL,
    url: `/auditTask/quoteModel`,
    method: 'post',
    data
    })
}


// 模型任务列表
export function modelTaskList(data){
    return request({
    baseURL: baseURL,
    url: `/auditTask/selectTask/pageList`,
    method: 'post',
    data
    })
}


// 模型任务编辑责任人
export function editmodelPerson(data){
    return request({
    baseURL: baseURL,
    url: `/auditTask/setChargePeople`,
    method: 'put',
    data
    })
}




// 模型任务删除
export function deletmodelTask(id){
    return request({
    baseURL: baseURL,
    url: `/auditTask/delete/`+id+'',
    method: 'delete'
    })
}


//自建任务完成
export function selfTaskFunction(data){
    return request({
    baseURL: baseURL,
    url: `/auditTask/saveTask`,
    method: 'post',
    data
    })
}


// 判断项目中模型是否存在
export function isModel(data){
    return request({
    baseURL: baseURL,
    url: `/auditTask/pageList`,
    method: 'post',
    data
    })
}


// 修改项目状态
export function editProjectCode(data){
    return request({
    baseURL: baseURL,
    url: `/managementProject/updateProjectNoRole`,
    method: 'put',
    data
    })
}

//获取初始化项目
export function initProject(data){
    return request({
    baseURL: baseURL,
    url: `/projectMembership/pageListInUse`,
    method: 'post',
    data
    })
}



