import request from '@/utils/request'

const baseURL = '/shandong'
// 资料列表
export function task_pageList (data) {
  console.log(data);
  return request({
    baseURL: baseURL,
    url: `/addDataTask/pageList`,
    method: 'post',
    data
  })
}
