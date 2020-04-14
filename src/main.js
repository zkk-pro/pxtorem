import Vue from 'vue'
import App from './App.vue'
import './utils/setRootFontSize'
import toast from './components/Toast'
import i18n from './i18n'

Vue.use(toast)

// 解析url参数
function parseUrl() {
  let query = window.location.search
  if (query) {
    query = query.replace(/\?/, "").replace(/&/g, ",").split(",");
    query = query.map(item => {
      let arr = item.replace(/=/g, ",").split(",");
      let temp = {
        [arr[0]]: arr[1]
      }
      return temp
    })
    return Object.assign(...query)
  }
  return {}
}

i18n.locale = parseUrl().lang

Vue.prototype.$url_query = parseUrl()

Vue.config.productionTip = false

const vue = new Vue({
  i18n,
  render: h => h(App),
}).$mount('#app')

export default vue