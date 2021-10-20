import request from '@/utils/request'
import qs from 'qs'

const baseURL = '/wisdomaudit'
export function data_pageList(data) {
  return request({
    baseURL: baseURL,
    url: `/auditBasy/pageList`,
    method: 'post',
    data
  })
}
