import {IInternalAppInfo} from './types';
import {getAppList} from './appList';
import {AppStatus} from './enum';
import {match} from 'path-to-regexp';
import {importEntry} from 'import-html-entry';
import {getCache, setCache} from './cache';

export const getAppListStatus = ()=>{
  // 根据注册阶段传入的 applist，匹配当前的路由，返回app对于状态

  // 1. 需要渲染的应用列表
  const actives: IInternalAppInfo[] = [];
  // 2. 需要卸载的应用列表
  const unmounts: IInternalAppInfo[] = [];
  // 3. 需要注册的应用列表
  const list = getAppList() as IInternalAppInfo[];
  // 4. 路由匹配，返回状态
  // 遍历注册子应用，路由如果和当前路由一支，则放入渲染列表
  list.forEach((app)=>{
    const isActive = match(app.activeRule, {end: false})(location.pathname);
    // 根据app状态处理对应逻辑
    switch(app.status){
      case AppStatus.NOT_LOADED:
      case AppStatus.LOADING:
      case AppStatus.LOADED:
      case AppStatus.BOOTSTRAPPING:
      case AppStatus.NOT_MOUNTED:
        isActive && actives.push(app);
        break;
      case AppStatus.MOUNTED:
        !isActive && unmounts.push(app);
        break;
    }
  });
  return { actives, unmounts };
}

export const fetchResource = async (url: string, appName: string) => {
  if (getCache(appName, url)) return getCache(appName, url)
  const data = await fetch(url).then(async (res) => await res.text())
  setCache(appName, url, data)
  console.log(data)
  return data
}

export function getCompletionURL(src: string | null, baseURI: string) {
  if (!src) return src
  if (/^(https|http)/.test(src)) return src

  return new URL(src, getCompletionBaseURL(baseURI)).toString()
}

export function getCompletionBaseURL(url: string) {
  return url.startsWith('//') ? `${location.protocol}${url}` : url
}

export const prefetch = async (app: IInternalAppInfo) => {
  // requestIdleCallback: 在浏览器一帧的剩余空闲时间内执行 requestIdleCallback 里注册的任务
  requestIdleCallback(async () => {
    const { getExternalScripts, getExternalStyleSheets } = await importEntry(
      app.entry
    )
    requestIdleCallback(getExternalStyleSheets)
    requestIdleCallback(getExternalScripts)
  })
}