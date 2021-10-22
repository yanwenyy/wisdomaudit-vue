import { login, logout, getInfo } from '../../api/user'
import { getToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'
// import { onAccessSystem } from '@/utils/permission'
import { cacheDict } from '../../api/base/sys-dict'
// import Cookies from 'js-cookie'
const state = {
  ext: 'xxxx',
  token: getToken(),
  name: '',
  avatar: '',
  introduction: '',
  roles: [],
  id: '',
  code: '',
  scenecode: '',
  scenename: '',
  datauserid: '',
  datausername: ''
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_ID: (state, id) => {
    state.id = id
  },
  SET_RES: (state, res) => {
    state.res = res
  },
  SET_CODE: (state, code) => {
    state.code = code
  },
  SET_SCENECODE: (state, scenecode) => {
    state.scenecode = scenecode
  },
  SET_SCENENAME: (state, scenename) => {
    state.scenename = scenename
  },
  SET_DATAUSERID: (state, datauserid) => {
    state.datauserid = datauserid
  },
  SET_DATAUSERNAME: (state, datausername) => {
    state.datausername = datausername
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ userid: username.trim(), password: password }).then(response => {
        const { data } = response
        commit('SET_ID', data.personUuid)
        commit('SET_NAME', data.username)
        commit('SET_CODE', data.userid)
        var sysDict = JSON.parse(sessionStorage.getItem('sysDict'))
        if (sysDict == null) {
          //暂时注掉
          return
          cacheDict().then(resp => {
            sessionStorage.setItem('sysDict', JSON.stringify(resp.data))
          })
        }
        console.log(sysDict)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  getInfo({ commit, state }) {
    //暂时注掉
    return
    return new Promise((resolve, reject) => {
      // console.log(state);
      /* var personuuid = state.id;
      if(personuuid == "" || personuuid == null){
        personuuid = Cookies.get("PERSONUUID")
      }
      if(personuuid == "" || personuuid == null){
        personuuid = window.location.hash.replace('#/base/sso?param=', '').split(",")[0];
        Cookies.set("PERSONUUID", personuuid)
      }*/

      getInfo().then(response => {
        const { data } = response
        if (!data) {
          reject('Verification failed, please Login again.')
        }
        const { roles, name, avatar, introduction, id, personcode } = data
        // roles must be a non-empty array
        if (!roles || roles.length <= 0) {
          reject('getInfo: roles must be a non-null array!')
        }
        commit('SET_ID', id)
        commit('SET_ROLES', roles)
        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)
        commit('SET_INTRODUCTION', introduction)
        commit('SET_CODE', personcode)

        // if (state.scenecode === '' || state.scenecode == null) {
        //   var sceneCode = 'auditor'
        //   var dataUserId = personcode
        //   getSceneInst(sceneCode, dataUserId).then(resp => {
        //     var dataUserName = resp.data.dataUserName
        //     var sceneName = resp.data.sceneName
        //     commit('SET_SCENECODE', sceneCode)
        //     commit('SET_SCENENAME', sceneName)
        //     commit('SET_DATAUSERID', dataUserId)
        //     commit('SET_DATAUSERNAME', dataUserName)
        //   })
        // }
        resolve(data)
      }).catch(error => {
        reject(error)
      })
      resolve()
    })
  },

  // user logout
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        removeToken()
        resetRouter()
        dispatch('tagsView/delAllViews', null, { root: true })
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  },

  saveScene({ commit }, payload) {
    return new Promise(resolve => {
      commit('SET_SCENECODE', payload.sceneCode)
      commit('SET_SCENENAME', payload.sceneName)
      commit('SET_DATAUSERID', payload.dataUserId)
      commit('SET_DATAUSERNAME', payload.dataUserName)
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

// import { login, logout, getInfo } from '@/api/user'
// import { getToken, setToken, removeToken } from '@/utils/auth'
// import { resetRouter } from '@/router'

// const getDefaultState = () => {
//   return {
//     token: getToken(),
//     name: '',
//     avatar: ''
//   }
// }

// const state = getDefaultState()

// const mutations = {
//   RESET_STATE: (state) => {
//     Object.assign(state, getDefaultState())
//   },
//   SET_TOKEN: (state, token) => {
//     state.token = token
//   },
//   SET_NAME: (state, name) => {
//     state.name = name
//   },
//   SET_AVATAR: (state, avatar) => {
//     state.avatar = avatar
//   }
// }

// const actions = {
//   // user login
//   login({ commit }, userInfo) {
//     const { username, password } = userInfo
//     return new Promise((resolve, reject) => {
//       login({ username: username.trim(), password: password }).then(response => {
//         const { data } = response
//         commit('SET_TOKEN', data.token)
//         setToken(data.token)
//         resolve()
//       }).catch(error => {
//         reject(error)
//       })
//     })
//   },

//   // get user info
//   getInfo({ commit, state }) {
//     return new Promise((resolve, reject) => {
//       getInfo(state.token).then(response => {
//         const { data } = response

//         if (!data) {
//           return reject('Verification failed, please Login again.')
//         }

//         const { name, avatar } = data

//         commit('SET_NAME', name)
//         commit('SET_AVATAR', avatar)
//         resolve(data)
//       }).catch(error => {
//         reject(error)
//       })
//     })
//   },

//   // user logout
//   logout({ commit, state }) {
//     return new Promise((resolve, reject) => {
//       logout(state.token).then(() => {
//         removeToken() // must remove  token  first
//         resetRouter()
//         commit('RESET_STATE')
//         resolve()
//       }).catch(error => {
//         reject(error)
//       })
//     })
//   },

//   // remove token
//   resetToken({ commit }) {
//     return new Promise(resolve => {
//       removeToken() // must remove  token  first
//       commit('RESET_STATE')
//       resolve()
//     })
//   }
// }

// export default {
//   namespaced: true,
//   state,
//   mutations,
//   actions
// }

