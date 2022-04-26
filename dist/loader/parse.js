"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseHTML = void 0;
var utils_1 = require("../utils");
var scripts = [];
var links = [];
var inlineScript = [];
var parseHTML = function (parent, app) {
    var children = Array.from(parent.children);
    children.length && children.forEach(function (item) { return (0, exports.parseHTML)(item, app); });
    for (var _i = 0, children_1 = children; _i < children_1.length; _i++) {
        var dom = children_1[_i];
        if (/^(link)$/i.test(dom.tagName)) {
            var data = parseLink(dom, parent, app);
            data && links.push(data);
        }
        else if (/^(script)$/i.test(dom.tagName)) {
            var data = parseScript(dom, parent, app);
            data.text && inlineScript.push(data.text);
            data.url && scripts.push(data.url);
        }
        else if (/^(img)$/i.test(dom.tagName) && dom.hasAttribute('src')) {
            dom.setAttribute('src', (0, utils_1.getCompletionURL)(dom.getAttribute('src'), app.entry));
        }
    }
    return { scripts: scripts, links: links, inlineScript: inlineScript };
};
exports.parseHTML = parseHTML;
var parseScript = function (script, parent, app) {
    var comment;
    var src = script.getAttribute('src');
    if (src) {
        comment = document.createComment('script replaced by micro');
    }
    else if (script.innerHTML) {
        comment = document.createComment('inline script replaced by micro');
    }
    // @ts-ignore
    comment && parent.replaceChild(comment, script);
    return { url: (0, utils_1.getCompletionURL)(src, app.entry), text: script.innerHTML };
};
var parseLink = function (link, parent, app) {
    var rel = link.getAttribute('rel');
    var href = link.getAttribute('href');
    var comment;
    if (rel === 'stylesheet' && href) {
        comment = document.createComment("link replaced by micro");
        // @ts-ignore
        comment && parent.replaceChild(comment, script);
        return (0, utils_1.getCompletionURL)(href, app.entry);
    }
    else if (href) {
        link.setAttribute('href', (0, utils_1.getCompletionURL)(href, app.entry));
    }
};
