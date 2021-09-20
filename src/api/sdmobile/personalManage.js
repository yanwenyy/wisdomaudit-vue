import request from '@/utils/request'

const baseURL = 'base'
const sdmobileURL = 'sdmobile'
// 人员分页
export function listByPage(data) {
  return request({
    baseURL: baseURL,
    url: `/personalManage/pageList`,
    method: 'post',
    data
  })
}
// 人员统计
export function personReportList(data) {
  return request({
    baseURL: sdmobileURL,
    url: `/report/personReportList`,
    method: 'post',
    data
  })
}


// 根据id查找
export function getById(id) {
  return request({
    baseURL: baseURL,
    url: `/personalManage/getById/${id}`,
    method: 'get'
  })
}

// 添加人员
export function save(data) {
  return request({
    baseURL: baseURL,
    url: `/personalManage/save`,
    method: 'post',
    data
  })
}

// 删除人员
export function del(ids) {
  return request({
    baseURL: baseURL,
    url: `/personalManage/delete/${ids}`,
    method: 'delete'
  })
}
// 修改人员
export function update(data) {
  return request({
    baseURL: baseURL,
    url: `/personalManage/update`,
    method: 'put',
    data
  })
}

// 启用人员
export function startPerson(ids) {
  return request({
    baseURL: baseURL,
    url: `/personalManage/startPerson/${ids}`,
    method: 'put'
  })
}

// 注销人员
export function logoutPerson(ids, leaveTime, personDetailUuid) {
  return request({
    baseURL: baseURL,
    url: `/personalManage/logoutPerson/${ids}/${leaveTime}/${personDetailUuid}`,
    method: 'put'
  })
}

// 解锁人员
export function unlockPerson(ids) {
  return request({
    baseURL: baseURL,
    url: `personalManage/unlockPerson/${ids}`,
    method: 'put'
  })
}

// 权限分配
export function authorityForPerson(id,roleIds) {
  return request({
    baseURL: baseURL,
    url: `personalManage/authorityForPerson/${id}/${roleIds}`,
    method: 'put'
  })
}

// 获取所有的审计机构
export function getOrgList(data) {
  return request({
    baseURL: sdmobileURL,
    url: `/roOrg/pageList`,
    method: 'post',
    data
  })
}

// 获取总行系统所有角色
export function getRoleList(data) {
  return request({
    baseURL: baseURL,
    url: `/sysRole/pageList`,
    method: 'post',
    data
  })
}

// 获取系统所有职务
export function getPositionList(data) {
  return request({
    baseURL: sdmobileURL,
    url: `/personPosition/pageList`,
    method: 'post',
    data
  })
}
