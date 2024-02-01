var Viewport = (function () {
    // 视口设置对象
    var _handlers = [];
    var resizeTimer = 0;
    var viewport = {
        /**
         * @param name {String} 事件名称，可以传递命名空间，如：resize.namespace，这样可以在解绑的时候非常方便
         * @param fn {Function} 事件处理函数
         */
        on: function (name, fn) {
            _handlers.push({
                eventName: name,
                handler: fn
            })
        },

        off: function (name) {
            var eventName = name.split('.');
            var hasNameSpace = eventName.length > 1;

            for (var i = 0; i < _handlers.length; i++) {
                if (hasNameSpace
                    ? _handlers[i].eventName === name
                    : _handlers[i].eventName === eventName[0]) {
                    _handlers.splice(i, 1);
                    i--;
                }
            }
        },

        /**
         * @param name {String} 事件名称
         * @param data {Object} 数据
         */
        trigger: function (name, data) {
            for (var i = 0; i < _handlers.length; i++) {
                if (_handlers[i].eventName.split('.')[0] === name &&
                    _handlers[i].handler(data) === false) {
                    return;
                }
            }
        },

        // 正常的视口尺寸&内容的尺寸
        normalWidth: 1920,
        normalHeight: 1080,
        // 视口最小尺寸
        minWidth: 1300,
        minHeight: 800,
        // 视口当前尺寸
        width: 0,
        height: 0,
        // 视口（和窗口同大小）元素
        $el: $('.js-viewport'),
        // 有效的视口元素
        $valid: $('.js-valid-viewport'),
        // 主要内容
        $content: $('.js-container'),

        resize: function () {
            this.windowWidth = $(window).width();
            this.windowHeight = $(window).height();

            // 保证内容一致居中，小于最小宽度或者最小高度，会出现滚动条
            if (this.windowWidth > this.minWidth && this.windowWidth <= this.normalWidth) {
                this.width = this.windowWidth;
                this.$el.css({ width: '100%' });
            } else if (this.windowWidth > this.normalWidth) {
                this.width = this.normalWidth;
                this.$el.css({ width: '100%' });
            } else {
                this.width = this.minWidth;
                this.$el.css({ width: this.minWidth });
            }

            if (this.windowHeight > this.minHeight && this.windowHeight <= this.normalHeight) {
                this.height = this.windowHeight;
                this.$el.css({ height: '100%' });
                this.$valid.css({
                    overflow: 'hidden',
                    marginTop: 0
                });
            } else if (this.windowHeight > this.normalHeight) {
                this.height = this.normalHeight;
                this.$el.css({ height: '100%' });
                this.$valid.css({
                    overflow: 'hidden',
                    marginTop: (this.windowHeight - this.height) / 2
                });
            } else {
                this.height = this.minHeight;
                this.$el.css({ height: this.minHeight });
                this.$valid.css({
                    overflow: 'hidden',
                    marginTop: 0
                });
            }

            this.left = (this.width - this.normalWidth) / 2;
            this.top = (this.height - this.normalHeight) / 2;

            this.$valid.css({
                width: this.width,
                height: this.height
            });

            this.$content.css({
                marginLeft: this.left,
                marginTop: this.top
            });
        },

        fullScreen: function () {
            var scale = 1;

            if (this.height < this.windowHeight || this.width < this.windowWidth) {
                // 只有在实际内容小于屏幕大小的时候全屏
                if (this.normalWidth / this.normalHeight > this.windowWidth / this.windowHeight) {
                    // 如果宽度超出，已高度计算
                    scale = this.windowHeight / this.normalHeight;
                } else {
                    scale = this.windowWidth / this.normalWidth;
                }

                Util.css3(this.$valid[0], {
                    transform: 'scale3d(' + scale + ', ' + scale + ', 1)'
                });
            }
        },

        cancelFullScreen: function () {
            Util.css3(this.$valid[0], {
                transform: 'scale3d(1, 1, 1)'
            });
        }
    };

    // 视口初始化
    viewport.$content.css({ width: viewport.normalWidth, height: viewport.normalHeight });
    viewport.resize();

    // 视口尺寸
    $(window).resize(function () {
        if (resizeTimer) { clearTimeout(resizeTimer); }
        resizeTimer = setTimeout(function () {
            viewport.resize();
            viewport.trigger('resize', viewport);
        }, 100);
    });

    return viewport;
})();
