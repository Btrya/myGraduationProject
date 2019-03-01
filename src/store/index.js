import Vue  from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
const key = 'lfuser'
// 状态 通过this.$store.state.xxx 获取值
const state = {
  username: '',
  objectId: '',
  avatar: ''
}
// 相当于一个computed 通过this.$store.getters.函数名 获得返回的结果
const getters = {
  // 获取用户状态，假如localStorage中存在则取localStorage中的状态
  getUser: state => {
    const tempStorage = JSON.parse(localStorage.getItem(key))
    if (tempStorage) {
      [state.username, state.objectId, state.avatar] = [tempStorage.username, tempStorage.objectId, tempStorage.avatar]
    }
    return state
  }
}
// 同步事务 通过this.$store.commit('函数名') 来调用
const mutations = {
  // 储存用户状态到localStorage
  saveUser: (state, user) => {
    [state.username, state.objectId, state.avatar] = [user.username, user.objectId, user.avatar]
    const tempUser = {
      username: state.username,
      objectId: state.objectId,
      avatar: state.avatar
    }
    localStorage.setItem(key, JSON.stringify(tempUser))
  },
  clearUser: (state) => {
    localStorage.clear()
    state.username = ''
    state.objectId = ''
    state.avatar = ''
  }
}
// 异步事务 Action 提交的是 mutation，而不是直接变更状态。
// Action函数接受一个与 store 实例具有相同方法和属性的 context 对象, 即可以通过context.commit('mutations函数')来提交
const actions = {
  // 异步存储用户状态
  saveUser: (context, user) => {
    context.commit('saveUser', user)
  },
  clearUser: (context) => {
    context.commit('clearUser')
  }
}

const store = new Vuex.Store({
  state,
  getters,
  mutations,
  actions
})

export default store


