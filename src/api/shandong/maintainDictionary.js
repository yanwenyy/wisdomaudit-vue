// 参数管理
import request from '@/utils/request'

const baseURL = '/wisdomaudit'

// 维护字典列表
export function get_dictionary(data){
    return request({
    baseURL: baseURL,
    url: `/dictType/pageList`,
    method: 'post',
    data
    })
}

// 根据字典分类编码查询字典数
export function dictionaryList_Code(code){
    return request({
    baseURL: baseURL,
    url: `/dictType/treeList?`+`typeCode=`+code,
    method: 'post'
    })
}

//新增字典
export function addDictionaryList(data){
    return request({
    baseURL: baseURL,
    url: `/dictType/saveDictType`,
    method: 'post',
    data
    })
}