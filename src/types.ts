// 定义类型
import { AppStatus } from './enum'
// appList
export interface IAppInfo{
  name: string,
  entry: string | object,
  container: string,
  activeRule: string
}

export interface IInternalAppInfo extends IAppInfo {
  status: AppStatus
  bootstrap?: LifeCycle
  mount?: LifeCycle
  unmount?: LifeCycle
  proxy: any
}

// lifeCycles
export interface ILifeCycle{
  beforeLoad?: LifeCycle | LifeCycle[]
  mounted?: LifeCycle | LifeCycle[]
  unmounted?: LifeCycle | LifeCycle[]
}

export type LifeCycle = (app: IAppInfo)=> Promise<any>;

export type EventType = 'hashchange' | 'popstate';