import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    roles: []
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  }
}

const actions = {
  // 用户登录
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        const { data } = response.data
        // commit('SET_TOKEN', data.token) // 将token存入state中
        // setToken(data.token) // 将token存入Cookies中
        commit('SET_TOKEN', data.id) // 将唯一凭证用户id存入state.token中,【这里本应该用token替换用户id做唯一凭证】
        setToken(data.id) // 将唯一凭证用户id存入Cookies中
        resolve()
      }).catch(error => {
        console.log('login请求失败', 'api/user.js的login请求失败') // 可删除！！for debug
        reject(error)
      })
    })
  },

  // 获取用户信息
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response.data
        if (!data) {
          reject('验证失败，请重新登录.')
        }

        // ------根据登录的账号设置权限【以后在此处修改，现在先写死】---------
        let roles = []
        if (data.username === 'jerrybro') {
          roles = ['admin']
        } else {
          roles = ['editor']
        }
        commit('SET_ROLES', roles)
        commit('SET_NAME', data.username) // 将name存入state.name中
        // 由于接口返回没有avatar头像字段，这里写死头像地址了
        commit('SET_AVATAR', 'http://www.jerrybro.cn:85/images/test/avatar01.gif')
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 用户登出
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout().then(() => {
        removeToken() // must remove token first
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // 必须先移除token，再commit('RESET_STATE')
      commit('RESET_STATE')
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

