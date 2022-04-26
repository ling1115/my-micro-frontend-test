/* 应用生命周期的处理 */
/*
    主应用：
        1. beforeLoad: 挂载子应用前
        2. mounted: 挂载子应用后
        3. unmounted: 卸载子应用
    子应用：
        1. bootstrap: 首次加载应用时触发，常用于配置子应用全局变量，只执行一次
        2. mount: 应用挂载时触发，常用于渲染子应用，可执行多次
        3. unmounted: 应用卸载时触发，常用于销毁应用，可执行多次
*/
import {ILifeCycle, IInternalAppInfo, IAppInfo} from "../types";
import {AppStatus} from '../enum';
import {loadHtml} from '../loader';

let lifeCycle: ILifeCycle = {};
export const setLifeCycle = (list:ILifeCycle)=>{
  lifeCycle = list;
}
export const getLifeCycle = ()=>{
  return lifeCycle;
}

// ·1. 挂载子应用前
export const runBeforeLoad =async (app:IInternalAppInfo)=>{
  // 1. 设置子应用状态为 加载中
  app.status = AppStatus.LOADING;
  // 2. 执行主应用 beforeLoad 周期函数
  await runLifeCycle("beforeLoad", app);
  // 3. 加载子应用资源
  app = await loadHtml(app);
  // 4. 设置子应用状态为 已加载
  app.status = AppStatus.LOADED;
}
// 2. 挂载子应用后
export const runMounted = async (app:IInternalAppInfo)=>{
  // 1. 设置应用状态为 挂载中 mounting
  app.status = AppStatus.MOUNTING;
  // 2. 执行应用的卸载声明周期函数 mount()
  await app.mount?.(app)
  // 3. 执行完 unmount() 生命周期后，修改应用状态为 mounted
  app.status = AppStatus.MOUNTED;
  // 4. 执行全局生命周期函数
  await runLifeCycle('mounted', app);
}
// 3. 卸载子应用时
export const runUnMounted = async (app: IInternalAppInfo)=>{
  // 1. 设置应用状态为 unmounted
  app.status = AppStatus.UNMOUNTING;
  // 2. 执行应用的卸载声明周期函数 unmount()
  await app.unmount?.(app)
  // 3. 执行完 unmount() 生命周期后，修改应用状态为 not_mounted
  app.status = AppStatus.NOT_MOUNTED;
  // 4. 执行全局生命周期函数
  await runLifeCycle('unmounted', app);
}

// 子应用初次加载时：首次加载应用时触发，常用与配置子应用全局变量，只执行一次
export const runBootstrap = async (app:IInternalAppInfo)=>{
  // 因为bootstrap只执行一次，所以需要判断
  // 如果应用状态不处于 已加载 状态，返回应用
  if(app.status !== AppStatus.LOADED){
    return app;
  }
  // 1. 设置状态为 bootstrapping
  app.status = AppStatus.BOOTSTRAPPING;
  // 2. 执行 bootstrap 生命周期
  await app.bootstrap?.(app)
  // 3. 设置状态为 卸载
  app.status = AppStatus.NOT_MOUNTED;
}
// 执行全局的生命周期函数
const runLifeCycle = async (name: keyof ILifeCycle, app: IAppInfo)=>{
  const fn = lifeCycle[name];
  if(fn instanceof Array){
    await Promise.all( fn.map(item=>item(app)) );
  }else{
    await fn?.(app);
  }
}
