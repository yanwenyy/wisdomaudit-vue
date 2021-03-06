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

const baseURL = '/wisdomaudit'


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






export function searchRole(params) {
  return request({
    baseURL: baseURL,
    url: '/role/listRoleInfo',
    method: 'get',
    params
  })
}
export function getPermission() {
  return request({
    baseURL: baseURL,
    url: '/permission/treePerms',
    method: 'get'
  })
}
export function addRole(data) {
  return request({
    baseURL: baseURL,
    url: '/role/addRole',
    method: 'POST',
    data
  })
}
export function getRoleData(params) {
  return request({
    baseURL: baseURL,
    url: '/role/getRoleInfoByRoleId',
    method: 'get',
    params
  })
}

export function removeRole(data) {
  return request({
    baseURL: baseURL,
    url: '/role/deleteRole',
    method: 'POST',
    params:data
  })
}

export function modifyRole(data) {
  return request({
    baseURL: baseURL,
    url: '/role/updateRole',
    method: 'POST',
    data
  })
}



export function getUserList(params) {
  return request({
    baseURL: baseURL,
    url: '/user/listUserInfo',
    method: 'get',
    params
  })
}

export function removeUser(data) {
  return request({
    baseURL: baseURL,
    url: '/user/deleteUser',
    method: 'POST',
    params:data
  })
}
export function getUserTree() {
  return request({
    baseURL: baseURL,
    url: '/ecoOrg/tree',
    method: 'get',
  })
}

export function addUser(data) {
  return request({
    baseURL: baseURL,
    url: '/user/addUser',
    method: 'post',
    data

  })
}

export function obtainUser(params) {
  return request({
    baseURL: baseURL,
    url: '/user/getUserByUserId',
    method: 'get',
    params

  })
}

export function modifyUser(data) {
  return request({
    baseURL: baseURL,
    url: '/user/updateUser',
    method: 'post',
    data

  })
}


/*
* ????????????????????????
* 1.???????????????
*   ?????????AMSBASE.AB_DICT??????????????????????????????????????????
* 2.????????????????????????????????????
*  import { getDictList } from '@/utils'
*  getDictList('001001').then(data => {
        console.log(data)
   });
  3. ????????????
  ??????????????????????????????????????????getDict????????????????????????????????????????????????sessionStorage???
  ?????????????????????????????????????????????????????????????????????????????????????????????
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
// ??????codeValue????????????????????????????????????
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
