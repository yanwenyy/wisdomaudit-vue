import request from '@/utils/request'
import qs from 'qs'

const baseURL = '/wisdomaudit';

// 列表
export function pageList (data) {
  return request({
    baseURL: baseURL,
    url: '/referenceTable/pageList',
    method: 'post',
    isLoading: false,
    data
  })
}
// 新增
export function save_query (data) {
  return request({
    baseURL: baseURL,
    url: '/referenceTable/save',
    method: 'post',
    isLoading: false,
    data
  })
}
// 分类
export function loadcascader (data) {
  return request({
    baseURL: baseURL,
    url: '/init/loadcascader',
    method: 'post',
    isLoading: false,
    data
  })
}



// 编辑保存
export function update (data) {
  return request({
    baseURL: baseURL,
    url: '/referenceTable/update',
    method: 'post',
    isLoading: false,
    data
  })
}


// 删除
export function deleteEntity (data) {
  return request({
    baseURL: baseURL,
    url: '/referenceTable/deleteEntity',
    method: 'post',
    isLoading: false,
    data
  })
}

// 文件管理列表
export function toManagementList (data) {
  return request({
    baseURL: baseURL,
    url: '/referenceTable/toManagementList',
    method: 'post',
    isLoading: false,
    data
  })
}

// 资料树
export function queryByFid (data) {
  return request({
    baseURL: baseURL,
    url: '/dictType/queryByFid',
    method: 'post',
    isLoading: false,
    data
  })
}

// 上传
export function uploadFile (data) {
  return request({
    baseURL: baseURL,
    url: '/referenceTable/uploadFile',
    method: 'post',
    isLoading: false,
    data
  })
}

// 文件管理批量删除
export function deleteAttachment (data) {
  return request({
    baseURL: baseURL,
    url: '/referenceTable/deleteAttachment',
    method: 'post',
    isLoading: false,
    data
  })
}

// 下载
export function fileDownload (data) {
  return request({
    baseURL: baseURL,
    url: '/referenceTable/fileDownload',
    method: 'post',
    isLoading: false,
    data
  })
}