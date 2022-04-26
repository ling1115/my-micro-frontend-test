import {IAppInfo} from "../types";
let appList: IAppInfo[] = [];
export const setAppList = (list:IAppInfo[])=>{
    appList = list;
}
export const getAppList = ()=>{
    return appList;
}
// 应用生命周期的处理
/*
    主应用：
        1. beforeLoad: 挂在子应用前
        2. mounted: 挂在子应用后
        3. unmounted: 卸载子应用
    子应用：
        1. bootstrap: 首次加载应用时触发，常用于配置子应用全局变量，只执行一次
        2. mount: 应用挂载时触发，常用于渲染子应用，可执行多次
        3. unmounted: 应用卸载时触发，常用于销毁应用，可执行多次
*/