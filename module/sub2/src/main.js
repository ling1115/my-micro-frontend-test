import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false

let app;
let render = () => {
  app = new Vue({
    render: (h) => h(App),
  })
  app.$mount('#app')
}
if(!window.__QIANKUN_DEVELOPMENT__){
  render();
}

export async function bootstrap() {
  console.log('vue2 app bootstraped');
}

/**
 * 应用每次进入都会调用 mount 方法，通常我们在这里触发应用的渲染方法
 */
export async function mount() {
  render();
}

/**
 * 应用每次 切出/卸载 会调用的方法，通常在这里我们会卸载微应用的应用实例
 */
export async function unmount() {
  app.$destroy();
}


