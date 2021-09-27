import request from '@/utils/request'

const baseURL = '/wisdomaudit'


// 审计项目列表
export function projectList(data) {
    return request({
      baseURL: baseURL,
      url: `/addDataTask/pageList`,
      method: 'post',
      data
    })
  }