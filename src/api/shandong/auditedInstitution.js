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