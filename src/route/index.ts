import {EventType} from '../types';
import {getAppListStatus} from '../utils';
import {
  runBootstrap,
  runBeforeLoad,
  runMounted,
  runUnMounted,
} from '../lifeCycle'
// 1. 劫持history和hashHistory相关的事件
// 2. 在劫持后做子应用相关的逻辑处理

// 0. 保存浏览器原本的路由方法
const originPush = window.history.pushState;
const originReplace = window.history.replaceState;

// 存储原本路由相关事件的逻辑
const capturedListener: Record<EventType, Function[]> = {
  // hashchange 的 callback
  hashchange: [],
  // popstate 的 callback
  popstate: []
}
let lastUrl: string | null = null; // 记录当前url

// 1. 监听路由变化：即劫持并监听pushState，replaceState方法
export const hijackRoute = ()=>{
  // 1. 重写pushState，replaceState方法
  window.history.pushState = (...args: any)=>{
    originPush.apply(window.history, args);
    reroute(args[2]);
  }
  window.history.replaceState = (...args: any)=>{
    originReplace.apply(window.history, args);
    reroute(args[2]);
  }
  // 2. 监听pushState，replaceState事件
  window.addEventListener("hashchange", ()=>{
      
  })
  window.addEventListener("popstate", ()=>{
      
  })
  // 3. 不干扰原本hashchange,popstate事件的相关逻辑
  window.addEventListener = hijackEventListener(window.addEventListener);
  window.removeEventListener = hijackEventListener(window.removeEventListener);
}
// 相当于事件代理
const hijackEventListener = (func: Function): any =>{
  return function(name:string, fn: Function){
    if(name === 'hashchange' || name === 'popstate'){
      if(!hasListener(name, fn)){
          capturedListener[name].push(fn);
          return;
      }else{
          // 有就重新赋值，去除fn
          capturedListener[name] = capturedListener[name].filter(item=>item!==fn);
      }
    }
    return func.apply(window,arguments);
  }
}
// 判断是否已存储该callback
const hasListener = (name: EventType, fn:Function)=>{
  return capturedListener[name].filter(item=>item===fn).length;
}

// 2. 然后重写路由处理的方法：做子应用相关的逻辑处理
// 获取子应用列表后，不同应用状态的app执行相应生命周期
export const reroute = (url?:string|null)=>{
  // 获取渲染、卸载的应用列表
  const {actives, unmounts} = getAppListStatus();
  // 不是当前应用时处理: 拿到主应用的生命周期，执行渲染对应的子应用
   /*
    * 获取渲染、卸载的应用列表：
      * 先卸载需要卸载的应用，并执行卸载的子应用生命周期和全局微应用的卸载生命周期(`lifeCycles`) --- 在生命周期`lifeCycle/index.ts`中处理
            * 执行子应用卸载`unmounted`函数
            * 执行全局微应用的卸载`unmounted`函数
        * 再注册需要注册的应用，并执行对应子应用的生命周期和全局微应用的挂载生命周期(`lifeCycles`) --- 在生命周期`lifeCycle/index.ts`中处理
            * 执行`beforeLoad`函数，在其中==加载子应用资源==
            * 执行子应用`bootstrap`生命周期函数
            * 执行子应用挂载`mounted`函数
            * 执行全局微应用的挂载`mounted`函数
        * 然后执行路由相关事件的所有`callback`。
  */
  if(url !== lastUrl){
    //  先卸载需要卸载的应用并执行卸载的生命周期，然后注册需要注册的应用并执行对应的生命周期
    Promise.all(
      unmounts.map(async (app)=>{
        await runUnMounted(app);
      }).concat(
        actives.map(async (app)=>{
          // 执行对应的生命周期函数
          await runBeforeLoad(app);
          await runBootstrap(app);
          await runMounted(app);
        })
      )
    ).then(()=>{
        
    })
  }
  lastUrl = url || location.href; // 默认原始路径
}