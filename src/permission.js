import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login', '/auth-redirect'] // 不用重定向，直接放行的白名单(免登录的路径)

router.beforeEach(async(to, from, next) => {
  // 交互友好性：进行路由跳转时，开启等待进度条
  NProgress.start()
  // 设置页面标题
  document.title = getPageTitle(to.meta.title)
  // 确定用户是否已登录
  const hasToken = getToken()
  console.log('唯一凭证[token/id]   ', hasToken ? 'True' : 'False') // for debug 可删除！！！！！！

  if (hasToken) {
    if (to.path === '/login') {
      // 如果已经登录，重定向到主页，即会映射到http://xxxxx:yyyy/#/dashboard
      next({ path: '/' })
      NProgress.done()
    } else {
      // 1.1解析：若当前路径不在登录页面且有Token(已经登录过了)，则从store中获取用户信息
      const hasRoles = store.getters.roles && store.getters.roles.length > 0
      if (hasRoles) {
      // 1.2解析：store中用户信息(roles权限)存在，则放行
        next()
      } else {
        // 1.3解析：store中用户信息不存在，则触发store/user模块/action里的getInfo方法，
        // getInfo()会调用封装好的api/user.js里的getInfo方法，发送请求获取用户信息，并存储到store中
        try {
          await store.dispatch('user/getInfo') // 获取用户信息，且存储到store中

          const roles = store.getters.roles // ------对应store/modules/user.js、根据登录的账号设置权限【以后在此处修改，现在先写死】---------

          // generate accessible routes map based on roles
          const accessRoutes = await store.dispatch('permission/generateRoutes', roles)
          console.log('当前账号的权限页面(非公共页面)', accessRoutes) // for debug 可删除！！！！！！

          // dynamically add accessible routes
          router.addRoutes(accessRoutes)

          // hack method to ensure that addRoutes is complete
          // set the replace: true, so the navigation will not leave a history record
          next({ ...to, replace: true })
        } catch (error) {
          // 若有错误抛出，则移除token，跳转到登录页面进行重新登录
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`) // 即已经没有了Token，会进入下面的else语句再判断
          NProgress.done()
        }
      }
    }
  } else {
    // 没有唯一凭证Token
    if (whiteList.indexOf(to.path) !== -1) {
      // 白名单whiteList里，/login 与当前路径匹配相同，则放行，即跳到登陆页面
      next()
    } else {
      // 没有访问权限的其他页面被重定向到登录页面，这个路径后面拼接了/login?redirect=访问的路径名
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // 交互友好性：路由跳转结束，取消等待进度条
  NProgress.done()
})
