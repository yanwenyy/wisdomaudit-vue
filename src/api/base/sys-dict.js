import request from '@/utils/request'

const baseURL = '/base'

export function cacheDict() {
  return request({
    baseURL: baseURL,
    url: `/zhBaseCodeInfo/allBaseCode`,
    method: 'get'
  })
}

