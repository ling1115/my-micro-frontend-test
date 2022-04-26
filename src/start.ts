import {IAppInfo, IInternalAppInfo, ILifeCycle} from './types';
import {getAppList, setAppList } from './appList';
import { setLifeCycle } from './lifeCycle';
import {hijackRoute, reroute} from './route';
import {AppStatus} from './enum';
import { prefetch } from './utils';


// 接受两个参数：
// apps - Array<RegistrableApp> - 必选，微应用的一些注册信息
// lifeCycles - LifeCycles 函数 - 可选，全局的微应用生命周期钩子
// appList:IAppInfo[] -> appList是一个数组，且数组里的每一个是IAppInfo类型的对象
export const registerMicroApps = (appList:IAppInfo[],lifeCycle?:ILifeCycle)=>{
  // 注册app
  setAppList(appList);
  // 有声明周期时执行
  lifeCycle && setLifeCycle(lifeCycle);
}
// 接受参数 opts - Options 可选
export const start = ()=>{
  const list = getAppList();
  if(!list.length){
    throw new Error("请先注册应用");
  }

  hijackRoute();
  reroute(window.location.href);

  list.forEach(app=>{
    if (!(app as IInternalAppInfo).status || (app as IInternalAppInfo).status === AppStatus.NOT_LOADED) {
      prefetch(app as IInternalAppInfo)
    }
  })
}