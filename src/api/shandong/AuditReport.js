import request from '@/utils/request'
const baseURL = '/wisdomaudit'
import qs from 'qs'



// 问题
export function task_pageList_wt (data) {
  return request({
    baseURL: baseURL,
    url: `/problemList/pageList`,
    method: 'post',
    data,
  })
}
