// import request from '@/utils/request'

// export function login(data) {
//   return request({
//     url: '/vue-admin-template/user/login',
//     method: 'post',
//     data
//   })
// }

// export function getInfo(token) {
//   return request({
//     url: '/vue-admin-template/user/info',
//     method: 'get',
//     params: { token }
//   })
// }

// export function logout() {
//   return request({
//     url: '/vue-admin-template/user/logout',
//     method: 'post'
//   })
// }
import request from '@/utils/request'

const baseURL = '/base'
export function login(data) {
  return request({
    baseURL: baseURL,
    url: '/login',
    method: 'post',
    data
  })
}

export function getInfo() {
  return request({
    baseURL: baseURL,
    url: '/userInfo',
    method: 'get',
    params: { }
  })
}
export function getUserRes() {
  return request({
    baseURL: baseURL,
    url: '/menu/index',
    method: 'post'
  })
}
export function logout() {
  return request({
    url: '/logout',
    method: 'post'
  })
}


/*
* 获取系统字典信息
* 1.数据维护：
*   需要在AMSBASE.AB_DICT中维护数据，参照示例“性别”
* 2.调用方式（以第一个为例）
*  import { getDictList } from '@/utils'
*  getDictList('001001').then(data => {
        console.log(data)
   });
  3. 实现细节
  采用懒加载的方式，第一次调用getDict的时候将远程数据库字典信息加载到sessionStorage，
  当字典信息变更的时候，需要重新打开浏览器才能加载最新的字典信息
* */
export function getDictList(code) {
  var sysDict = JSON.parse(sessionStorage.getItem('sysDict'))
  var parent = sysDict.filter(obj => { return obj.dataSortValue === code })
  if (parent.length === 0) {
    return parent
  } else {
    return sysDict.filter(obj => { return obj.dataSortUuid === parent[0].dataSortUuid })
  }
}
// 根据codeValue的得到所有下级节点的方法
export function getDictSonList(code) {
  var sysDict = JSON.parse(sessionStorage.getItem('sysDict'))
  var parent = sysDict.filter(obj => { return obj.codeValue === code })
  if (parent.length === 0) {
    return parent
  } else {
    return sysDict.filter(obj => { return obj.parentCodeUuid === parent[0].codeUuid })
  }
}

export function getOneDict(code) {
  var sysDict = JSON.parse(sessionStorage.getItem('sysDict'))
  return sysDict.filter(obj => { return obj.codeValue === code })
}