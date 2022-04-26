// 通过 fetch 请求获取子应用资源
// 解析子应用资源，进行渲染
// 因为都是spa的页面应用，所以可以通过提取标签，加载对应的资源

/** 资源加载
 * 1. 加载样式表
 * 2. 提取js代码
 * 3. 执行js渲染
 */
import {IInternalAppInfo} from '../types';
import { importEntry } from 'import-html-entry';
import {ProxySandbox} from './sanbox';

export const loadHtml = async (app: IInternalAppInfo)=>{
  const {container, entry} = app;
  const { template, getExternalScripts, getExternalStyleSheets } = await importEntry(entry);
  const dom = document.querySelector(container);

  if(!dom){
    throw new Error("容器不存在");
  }

  dom.innerHTML = template;
  await getExternalStyleSheets();
  const jsCode = await getExternalScripts();

  jsCode.forEach((script)=>{
    const lifeCycle = runJS(script, app);
    if(lifeCycle){
      app.bootstrap = lifeCycle.bootstrap;
      app.mount = lifeCycle.mount;
      app.unmount = lifeCycle.unmount;
    }
  })
  return app;
}

const runJS = (value: string, app: IInternalAppInfo)=>{
  if(!app.proxy){
    app.proxy = new ProxySandbox();
    // @ts-ignore
    window.__CURRENT_PROXY__ = app.proxy.proxy;
  }

  app.proxy.active();
  const code = `
    return (window=>{
      ${value}
      return window['${app.name}']
    })(window.__CURRENT_PROXY__)
  `

  return new Function(code)();
}