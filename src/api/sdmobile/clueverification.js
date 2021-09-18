import request from '@/utils/request'

const baseURL = 'clueVerification'

export function pageList(data) {
  return request({
    baseURL: baseURL,
    url: `/clueVerification/pageList`,
    method: 'post',
    data
  })
}
