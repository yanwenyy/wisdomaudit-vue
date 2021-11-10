// 被审计机构管理
import request from '@/utils/request'

const baseURL = '/wisdomaudit'

// 被审计机构列表
export function auditOrgList(data){
    return request({
    baseURL: baseURL,
    url: `/auditOrg/pageList`,
    method: 'post',
    data
    })
}

// 被审计机构树形渲染
export function auditOrgTree(data){
    return request({
    baseURL: baseURL,
    url: `/auditOrg/treeList`,
    method: 'post',
    data
    })
}

//查看被审计机构
export function auditDetail(id){
    return request({
    baseURL: baseURL,
    url: `/auditOrg/getById/`+id+'',
    method: 'get'
    })
}
