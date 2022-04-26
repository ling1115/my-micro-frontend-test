"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAppList = exports.setAppList = void 0;
var enum_1 = require("../enum");
var appList = [];
var setAppList = function (list) {
    appList = list;
    appList.map(function (app) {
        ;
        app.status = enum_1.AppStatus.NOT_LOADED;
    });
};
exports.setAppList = setAppList;
var getAppList = function () {
    return appList;
};
exports.getAppList = getAppList;
