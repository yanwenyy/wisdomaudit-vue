import request from '@/utils/request'

const baseURL = 'wisdomaudit'
// 分页
export function listByPage(data) {
  return request({
    baseURL: baseURL,
    url: `/manageSuggest/pageList`,
    method: 'post',
    data
  })
}

// 根据id查找
export function getById(id) {
  return request({
    baseURL: baseURL,
    url: `/manageSuggest/getById/${id}`,
    method: 'get'
  })
}
// 添加对象
export function save(data) {
  return request({
    baseURL: baseURL,
    url: '/manageSuggest/save',
    method: 'post',
    data
  })
}
// 删除对象
export function del(ids) {
  return request({
    baseURL: baseURL,
    url: `/manageSuggest/delete/${ids}`,
    method: 'delete'
  })
}
// 修改对象
export function update(data) {
  return request({
    baseURL: baseURL,
    url: '/manageSuggest/update',
    method: 'put',
    data
  })
}

// 查找项目分页
export function listProjectByPage(data) {
  return request({
    baseURL: baseURL,
    url: `/project/pageList`,
    method: 'post',
    data
  })
}
