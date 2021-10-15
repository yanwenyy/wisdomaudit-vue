import request from '@/utils/request'

const baseURL = 'wisdomaudit'

// 分页
export function listByPage(data) {
  return request({
    baseURL: baseURL,
    url: `/projectMember/pageList`,
    method: 'post',
    data
  })
}

// 查找数据
export function getMemberList() {
  return request({
    baseURL: baseURL,
    url: `/projectMember/getList`,
    method: 'get'
  })
}

// 根据id查找
export function getById(id) {
  return request({
    baseURL: baseURL,
    url: `/projectMember/getById/${id}`,
    method: 'get'
  })
}
// 添加对象
export function saveMember(data) {
  return request({
    baseURL: baseURL,
    url: '/projectMember/save',
    method: 'post',
    data
  })
}
// 删除对象
export function del(ids) {
  return request({
    baseURL: baseURL,
    url: `/projectMember/delete/${ids}`,
    method: 'delete'
  })
}
// 修改对象
export function update(data) {
  return request({
    baseURL: baseURL,
    url: '/projectMember/update',
    method: 'put',
    data
  })
}

// 根据项目id删除成员
export function deleteAllProjectMemberById(id) {
  return request({
    baseURL: baseURL,
    url: `/projectMember/deleteAllProjectMemberById/${id}`,
    method: 'delete'
  })
}
