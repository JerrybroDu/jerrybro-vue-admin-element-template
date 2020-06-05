import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import app from './modules/app'
import settings from './modules/settings'
import user from './modules/user'
import permission from './modules/permission'
import tagsView from './modules/tagsView'

// 注入到根组件下的所有子组件中，即子组件能通过 this.$store.state.XXX 访问
Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    settings,
    user,
    permission,
    tagsView
  },
  // 可通过 this.$store.getters.XXX 访问
  getters
})

export default store
