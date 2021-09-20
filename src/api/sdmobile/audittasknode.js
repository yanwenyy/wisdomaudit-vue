import request from '@/utils/request'

const baseURL = 'sdmobile'

// 根获取项目资料树
export function getTaskNodeTree() {
  return request({
    baseURL: baseURL,
    url: `/auditTaskNode/getTaskNodeTree`,
    method: 'get'
  })
}
