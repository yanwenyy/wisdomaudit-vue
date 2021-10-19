import request from '@/utils/request'

const baseURL = 'wisdomaudit'
const personURL = '/base'
// 分页
export function listByPage(data) {
  return request({
    baseURL: baseURL,
    url: `/project/pageList`,
    method: 'post',
    data
  })
}

// 根据id查找
export function getById(id) {
  return request({
    baseURL: baseURL,
    url: `/project/getById/${id}`,
    method: 'get'
  })
}
// 添加对象
export function save(data) {
  return request({
    baseURL: baseURL,
    url: '/project/save',
    method: 'post',
    data
  })
}
// 删除对象
export function del(ids) {
  return request({
    baseURL: baseURL,
    url: `/project/delete/${ids}`,
    method: 'delete'
  })
}
// 修改对象
export function update(data) {
  return request({
    baseURL: baseURL,
    url: '/project/update',
    method: 'put',
    data
  })
}

// 获取被审计机构树
export function getAuditedTree() {
  return request({
    baseURL: baseURL,
    url: `/auditedOrg/getAuditedTree`,
    method: 'get'
  })
}
// 获取审计人员
export function getAllPerson(data) {
  return request({
    baseURL: personURL,
    url: `/personalManage/pageList`,
    method: 'post',
    data
  })
}
//项目报表统计查询
export function projectReportList(data){
  return request({
    baseURL:baseURL,
    url:`/report/projectReportList`,
    method:'post',
    data
  })
}
