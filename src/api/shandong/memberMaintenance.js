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