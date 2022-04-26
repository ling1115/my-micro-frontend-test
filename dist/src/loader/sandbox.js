"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProxySandbox = void 0;
var ProxySandbox = /** @class */ (function () {
    function ProxySandbox() {
        var _this = this;
        this.running = false;
        var fakeWindow = Object.create(null);
        var proxy = new Proxy(fakeWindow, {
            set: function (target, p, value) {
                if (_this.running) {
                    target[p] = value;
                }
                return true;
            },
            get: function (target, p) {
                switch (p) {
                    case 'window':
                    case 'self':
                    case 'globalThis':
                        return proxy;
                }
                if (!window.hasOwnProperty.call(target, p) &&
                    window.hasOwnProperty(p)) {
                    // @ts-ignore
                    var value = window[p];
                    if (typeof value === 'function')
                        return value.bind(window);
                    return value;
                }
                return target[p];
            },
            has: function () {
                return true;
            },
        });
        this.proxy = proxy;
    }
    ProxySandbox.prototype.active = function () {
        this.running = true;
    };
    ProxySandbox.prototype.inactive = function () {
        this.running = false;
    };
    return ProxySandbox;
}());
exports.ProxySandbox = ProxySandbox;
