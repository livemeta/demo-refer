var Util = (function () {
    var RAF = window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function(callback) {
            window.setTimeout(callback, 1000 / 60);
        };

    var $body = $('body');

    var utils = {
        raf: function (fn) {
            RAF(fn);
        },
        // 逐帧运行
        rafFlow: function () {
            var args = arguments;
            var i = 0;
            var run = function () {
                if (args[i]) {
                    RAF(function () {
                        args[i]();
                        i++;
                        run();
                    });
                }
            };

            run();
        },
        // 在支持transition的浏览器中会监听transitionend事件
        // 事件触发时执行endFn函数
        // 如果有参数noTransitionFn，会在不支持transition时调用
        transitionAndEnd: function ($el, transitionFn, endFn, noTransitionFn) {
            var transition = Support('transition');

            if (transition) {
                transitionFn($el);
                var endCount = 0;
                var len = $el.length;

                $el.each(function (_, el) {
                    $(el).on(transition.end, function (e) {
                        if (e.target !== el) { return; }
                        $(el).off(transition.end);
                        endCount++;
                        if (len === endCount) {
                            // utils.raf(function () {
                                endFn && endFn($el);
                            // });
                        }
                    });
                });
            } else {
                transitionFn($el);
                noTransitionFn ? noTransitionFn($el) : endFn($el);
            }
        },
        fadeOut: function (el, duration, fn) {
            var $el = $(el);

            if (Support('transition')) {
                var style = {};
                var transitionName = Util.css3Prop('transition');

                style[transitionName] = 'opacity ' + (duration || 1000) / 1000 + 's ease-out';
                style.opacity = 1;

                $el.off(Support('transition').end);
                $el.data('transition', $el.css(transitionName));
                $el.css(style);
                $el.on(Support('transition').end, function (e) {
                    if (this === e.target) {
                        var style = {};

                        style[transitionName] = $el.data('transition');
                        $el.css(style);
                        $el.off(Support('transition').end);
                        $el.hide();
                        fn && fn();
                    }
                });

                Util.raf(function () {
                    $el.css({ opacity: 0 });
                });
            } else {
                $el.stop().fadeOut(duration || 1000, fn);
            }
        },
        fadeIn: function (el, duration, fn) {
            var $el = $(el);

            if (Support('transition')) {
                var transitionName = Util.css3Prop('transition');

                $el.off(Support('transition').end);
                $el.data('transition', $el.css(transitionName));
                $el.css({ opacity: 0 });
                $el.show();
                $el.on(Support('transition').end, function (e) {
                    if (this === e.target) {
                        var style = {};

                        style[transitionName] = $el.data('transition');
                        $el.css(style);
                        $el.off(Support('transition').end);
                        fn && fn();
                    }
                });

                Util.raf(function () {
                    var style = {};

                    style[transitionName] = 'opacity ' + (duration || 1000) / 1000 + 's ease-out';
                    style.opacity = 1;
                    $el.css(style);
                });
            } else {
                $el.stop().fadeIn(duration || 1000, fn);
            }
        },
        // 加载video
        // 返回video的jQuery对象
        loadVideo: function (src, step, end, error) {
            var $video = $('<video>');
            var video = $video[0];
            var timer;
            var triggered = false;

            if (Support('isIE')) {
                // ie下，如果视频有缓存，请求会被挂起
                src = src + '?t=' + utils.now();

                // 触发oncanplaythrough的时候，直接判断视频可以播放
                $video.on('canplaythrough', function(){
                    clearInterval(timer);
                    triggered || end && end($video);
                    triggered = true;
                });
            }

            $video.on('error stalled', function(){
                clearInterval(timer);
                triggered || error && error($video);
                triggered = true;
            });

            timer = setInterval(function () {
                var percent = 0;

                if (video.buffered &&
                    video.buffered.length > 0 &&
                    video.buffered.end &&
                    video.duration) {
                    percent = video.buffered.end(0) / video.duration;
                }

                step && step(percent * 100);

                // 在某些浏览器下，个别视频加载到.95和1之间后停止加载，导致无法播放
                if (percent >= .95 || video.readyState > 3) {
                    clearInterval(timer);
                    triggered || end && end($video);
                    triggered = true;
                }
            }, 1000 / 15);

            $video.attr('preload', 'auto');
            $video.attr('src', src);

            return $video;
        },
        // 加载指定元素包含的图片
        loadImages: function (images, step, end) {
            var loadedCount = 0;
            var total = images.length;

            $.map(images, function (src, i) {
                var img = new Image();

                img.onload = img.onerror = function () {
                    loadedCount++;

                    step(loadedCount * 100 / total);

                    if (loadedCount === total) {
                        end(images);
                    }
                }

                img.crossOrigin = 'anonymous';
                img.src = src;
            });

            return images;
        },
        // 异步加载script
        loadScript: jQuery
        ? jQuery.getScript
        : function (src, fn) {
            var script = document.createElement('script');

            script.type = 'text/javascript';
            script.charset = "gb2312";
            script.onload = script.onreadystatechange = function () {
                if (!script.readyState || /loaded|complete/.test(script.readyState)) {
                    callback && callback();
                    script.onload = script.onreadystatechange = null;
                }
            };
            script.error = function () {
                errorCallback && errorCallback();
            };

            script.src = src;
            document.body.appendChild(script);
        },
        toCamelCase: jQuery
        ? jQuery.camelCase
        : function (str) {
            return str.toLowerCase().replace(/(\-[a-z])/g, function($1) {
                return $1.toUpperCase().replace('-', '');
            });
        },
        css3Prop: function (name) {
            var vendors = [ '-webkit-', '-o-', '-moz-', '-ms-', '' ];
            
            for (var i = 0, len = vendors.length, prop; i < len; i++) {
                prop = utils.toCamelCase(vendors[i] + name);

                if (prop in document.body.style) {
                    return prop;
                }
            }
        },
        // 设置css3属性
        css3: function (el, style) {
            var vendors = [ '-webkit-', '-o-', '-moz-', '-ms-', '' ];
            
            for (var n in style) {
                for (var i = 0, len = vendors.length, prop; i < len; i++) {
                    prop = jQuery.camelCase(vendors[i] + n);

                    if (prop in el.style) {
                        el.style[prop] = style[n];
                    }
                }
            }
        },
        now: function () {
            return new Date().getTime();
        },
        // 需要添加IE9的跨域支持
        loadCanvasImage: function (imageObject, url) {
            var deferred = $.Deferred();

            // if (Support('canvas') && typeof URL === 'undefined') {
                // ie9跨域请求图片
                // url = url.replace('local.163.com', '127.0.0.1');
                // if (!this.crossDomainImageIframe) {
                //     this.crossDomainImageIframe = document.createElement('iframe');
                //     this.crossDomainImageIframe.style.width = '1px';
                //     this.crossDomainImageIframe.style.height = '1px';
                //     this.crossDomainImageIframe.style.position = 'absolute';
                //     this.crossDomainImageIframe.style.top = '-1px';
                //     this.crossDomainImageIframe.style.left = '-1px';
                //     this.crossDomainImageIframe.name = 'crossDomainImageIframe';
                //     this.crossDomainImageIframe.onload = function () {
                //         window.frames['crossDomainImageIframe'].postMessage(url, 'http://127.0.0.1:7000');
                //     };
                //     this.crossDomainImageIframe.onerror = function (e) {
                //         deferred.reject(e);
                //     };
                //     this.crossDomainImageIframe.src = 'http://127.0.0.1:7000/crossdomainImage.html';
                //     document.body.appendChild(this.crossDomainImageIframe);
                //     window.addEventListener('message', function (e) {
                //         if (e.data.indexOf('error:') === 0) {
                //             deferred.reject(e.data);
                //         } else {
                //             imageObject.onload = function () {
                //                 deferred.resolve(imageObject);
                //             };
                //             imageObject.onerror = function (e) {
                //                 deferred.reject(e);
                //             };
                //             imageObject.src = e.data;
                //         }
                //     }, false);
                // } else {
                //     window.frames['crossDomainImageIframe'].postMessage(url, 'http://127.0.0.1:7000');
                // }
            // } else {
                var xhr = new XMLHttpRequest();

                xhr.onload = function () {
                    var url = URL.createObjectURL(this.response);

                    imageObject.onload = function () {
                        deferred.resolve(imageObject);
                        // don't forget to free memory up when you're done (you can do this as soon as image is drawn to canvas)
                        URL.revokeObjectURL(url);
                    };
                    imageObject.onerror = function (e) {
                        deferred.reject(e);
                    };
                    imageObject.src = url;
                };

                xhr.onerror = function (e) {
                    deferred.reject(e);
                };

                xhr.open('GET', url, true);
                xhr.responseType = 'blob';
                xhr.send();
            // }

            return deferred.promise();
        },

        random: function (max, min) {
            min = min || 0;
            return Math.ceil(Math.random() * (max - min)) + min;
        },

        retina: function (canvas, width, height) {
            var width = parseInt(width);
            var height = parseInt(height);

            canvas.style.width = width;
            canvas.style.height = height;

            // retina
            var dpr = window.devicePixelRatio || 1;
            canvas.width = width*dpr;
            canvas.height = height*dpr;
            canvas.getContext("2d").scale(dpr, dpr);
        }
    };

    return utils;
})();