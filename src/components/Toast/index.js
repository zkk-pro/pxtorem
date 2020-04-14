import Vue from 'vue'
import toast from './toast.vue'

let toastInstance = null

function Create(Component, props) {
  // 创建Vue实例
  const vm = new Vue({
    // render 方法提供一个h函数（createElement），h函数可以渲染 VNode
    render(h) {
      return h(Component, { props })
    }
  }).$mount() // $mount 不能挂载在body上，所以这里先不挂载

  // 获取组件实例
  const comp = vm.$children[0]

  // 追加到body元素上

  document.body.appendChild(vm.$el)

  // 清理函数
  comp.remove = () => {
      document.body.removeChild(vm.$el)
      vm.$destroy()
      toastInstance = null
  }

  // 返回组件实例
  return comp
}

function show(props) {
  if (toastInstance) {
    toastInstance._hide()
  }
  toastInstance = new Create(toast, props)
  toastInstance._show()
}

function hide() {
  console.log('hide')
  if (toastInstance) {
    console.log('hide2')
    toastInstance._hide()
  }
}

function install(_Vue) {
  _Vue.prototype.$showToast = show
  _Vue.prototype.$hideToast = hide
}

export default {
  show,
  hide,
  install
}