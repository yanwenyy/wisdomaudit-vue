import request from '@/utils/request'
const baseURL = '/wisdomaudit'
import qs from 'qs'

//确认问题整改清单
export function getUserPermissionList (data) {
  return request({
    baseURL: baseURL,
    url: `/permission/getUserPermissionList`,
    method: 'get',
    isLoading: false,
    data,
  })
}