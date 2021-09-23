import request from '@/utils/request'

const baseURL = '/wisdomaudit'
import qs from 'qs'

// 资料列表
export function task_pageList (data) {
  console.log(data);
  return request({
    baseURL: baseURL,
    url: `/auditTask/selectTask/pageList`,
    method: 'post',
    data,
  })
}

// 资料列表