import request from '@/utils/request'

const baseURL = '/wisdomaudit'

export function cacheDict() {
  return request({
    baseURL: baseURL,
    url: `/zhBaseCodeInfo/allBaseCode`,
    method: 'get'
  })
}

