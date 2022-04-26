"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.start = exports.registerMicroApps = void 0;
var appList_1 = require("./appList");
var lifeCycle_1 = require("./lifeCycle");
var route_1 = require("./route");
var enum_1 = require("./enum");
var utils_1 = require("./utils");
// 接受两个参数：
// apps - Array<RegistrableApp> - 必选，微应用的一些注册信息
// lifeCycles - LifeCycles 函数 - 可选，全局的微应用生命周期钩子
// appList:IAppInfo[] -> appList是一个数组，且数组里的每一个是IAppInfo类型的对象
var registerMicroApps = function (appList, lifeCycle) {
    // 注册app
    (0, appList_1.setAppList)(appList);
    // 有声明周期时执行
    lifeCycle && (0, lifeCycle_1.setLifeCycle)(lifeCycle);
};
exports.registerMicroApps = registerMicroApps;
// 接受参数 opts - Options 可选
var start = function () {
    var list = (0, appList_1.getAppList)();
    if (!list.length) {
        throw new Error("请先注册应用");
    }
    (0, route_1.hijackRoute)();
    (0, route_1.reroute)(window.location.href);
    list.forEach(function (app) {
        if (!app.status || app.status === enum_1.AppStatus.NOT_LOADED) {
            (0, utils_1.prefetch)(app);
        }
    });
};
exports.start = start;
