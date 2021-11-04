import request from '@/utils/request'
const baseURL = '/wisdomaudit'
import qs from 'qs'

//确认问题整改清单
export function confirm_rectification (data) {
  return request({
    baseURL: baseURL,
    url: `/managementProject/PageProblemCorrect`,
    method: 'post',
    isLoading: false,
    data,
  })
}
// 编辑 删除 
export function edit_remove (data) {
  return request({
    baseURL: baseURL,
    url: `/managementProject/editProblemCorrect`,
    method: 'post',
    isLoading: false,
    data,
  })
}

//选择问题列表
export function selection_questions_list (data) {
  return request({
    baseURL: baseURL,
    url: `/managementProject/queryProblemList`,
    method: 'post',
    isLoading: false,
    data,
  })
}


//选择问题列表 保存
export function saveProblemCorrect (data) {
  console.log(data);
  return request({
    baseURL: baseURL,
    url: `managementProject/saveProblemCorrect`,
    method: 'post',
    isLoading: false,
    data,
  })
}



