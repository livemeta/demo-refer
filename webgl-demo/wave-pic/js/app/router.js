var Router = (function () {
    function Router (map) {
        var router = this;

        this.map = map || {};
        this.handlers = [];

        $(document.body).on('click', '[data-link]', function () {
            router.go($(this).data('link'));
        });
    }

    Router.prototype = {
        constructor: Router,
        add: function (path, options) {
            this.map[path] = options;
        },
        remove: function () {
            delete this.map[path];
        },
        get: function (path) {
            return this.map[path];
        },
        // 进入指定页面
        go: function (path, isLast) {
            var nextPage;
            var lastPath = this.currentPath;
            var lastPage = this.map[lastPath];
            var router = this;
            var next = function () {
                if (this._status === 'beforeLeave') {
                    this.leave && this.leave();
                    this._status = 'leave';
                    router.trigger('leave', [lastPath, path]);
                } else if (this._status === 'beforeEnter') {
                    this.enter && this.enter();
                    this._status = 'enter';
                    router.trigger('enter', [lastPath, path]);
                    router.switching = false;
                }
            }

            if (lastPage === path) { return; }

            if (this.switching) { return; }

            if (!(nextPage = this.map[path])) {
                throw '跳转的页面不存在';
                return;
            }

            this.switching = true;

            if (lastPath !== void 0) {
                lastPage._status = 'beforeLeave';
                this.trigger('beforeLeave', [lastPath, path]);

                // 如果页面对象中配置了beforeLeave函数，需要手动调用next函数进入leave阶段
                if (lastPage.beforeLeave) {
                    lastPage.beforeLeave.call(lastPage, $.proxy(next, lastPage));
                }
            }

            this.currentPath = path;

            if (!nextPage._inited) {
                nextPage.ready && nextPage.ready();
                nextPage._inited = true;
            }

            nextPage._status = 'beforeEnter';
            this.trigger('beforeEnter', [lastPath, path]);

            // 如果页面对象中配置了beforeEnter函数，需要手动调用next函数进入enter阶段
            if (nextPage.beforeEnter) {
                nextPage.beforeEnter.call(nextPage, $.proxy(next, nextPage));
            }
        },
        on: function (type, handler) {
            this.handlers.push({
                type: type,
                handler: handler
            });
        },
        off: function (type) {
            var handlers = this.handlers;

            for (var i = 0; i < handlers.length; i++) {
                if (handlers[i].type === type) {
                    handlers.splice(i, 1);
                    i--;
                }
            }
        },
        trigger: function (type, args) {
            var handlers = this.handlers;

            for (var i = 0; i < handlers.length; i++) {
                if (handlers[i].type === type) {
                    handlers[i].handler.apply(this, args);
                }
            }
        }
    }

    return Router;
})();