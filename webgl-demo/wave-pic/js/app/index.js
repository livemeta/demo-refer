var router = new Router();

router.$root = $('.js-container');
router.responsive = function () {
    if (Viewport.height < 920) {
        router.scrollMarginBottom = -105;
    } else {
        router.scrollMarginBottom = -175;
    }
    if (Viewport.width <= 1790) {
        router.bossTitleMarginLeft = 322;
        router.asideLeft = 605;
        router.bossDescWidth = 778;
    } else {
        router.bossTitleMarginLeft = 72;
        router.asideLeft = 355;
        router.bossDescWidth = 1018;
    }
};

router.$root.on('click', '.js-scroll.active', function () {
    router.go('boss');
});

router.responsive();
Viewport.on('resize', router.responsive);

if (!window.screenfull || window.screenfull.raw.requestFullscreen === 'msRequestFullscreen') {
    $('.js-fullscreen').remove();
} else {
    $('.js-fullscreen').on('click', function () {
        if (screenfull.enabled) {
            screenfull.toggle();
        }
    });

    Viewport.on('resize', function () {
        if (screenfull.isFullscreen) {
            Viewport.fullScreen();
        } else {
            Viewport.cancelFullScreen();
        }
    });
}

if (!Support('audio')) {
    $('.js-bgm').remove();
} else {
    router.bgm = $('.js-bgm').find('audio')[0];
}

$('.js-bgm').on('click', function () {
    var $audio = $(this).find('audio');

    if (!$audio[0].paused) {
        $audio[0].pause();
        $(this).removeClass('audio--pause');
        $(this).find('span').text('MUSIC ON');
        $(this).attr('title', '播放音乐');
    } else {
        $audio[0].play();
        $(this).addClass('audio--pause');
        $(this).find('span').text('MUSIC OFF');
        $(this).attr('title', '暂停音乐');
    }
});

router.add('index', {
    el: $('.js-index'),
    maxPerspective: 1000,
    minPerspective: 200,

    // 初始化3d空间
    _initSpace: function () {
        var $space = this.el.find('.js-index-space');
        var maxPerspective = this.maxPerspective;
        var spaceX = Viewport.normalWidth / 2;
        var spaceY = Viewport.normalHeight / 2;
        var self = this;

        this.$center = this.el.find('.js-index-center');
        this.$blur = this.el.find('.js-index-blur');
        this.$space = $space;

        $space.find('[data-z]').each(function (i, item) {
            // 计算启用3d后的位置
            var $item = $(item);
            var z = $item.data('z');
            var scale = (maxPerspective - z) / (maxPerspective);
            var position = $item.position();
            var x = (spaceX - position.left - $item.width() / 2) * (1 - scale);
            var y = (spaceY - position.top - $item.height() / 2) * (1 - scale);

            Util.css3(item, {
                transform: 'translate3d(' + x + 'px, ' + y + 'px,' + z + 'px) scale(' + scale + ', ' + scale + ')',
                transformOrigin: '50% 50% 50%'
            });

            $item.data('transform', {
                x: x,
                y: y,
                z: z,
                scale: scale
            });
        });

        Util.css3($space[0], {
            perspective: maxPerspective + 'px',
            transformStyle: 'preserve-3d'
        });

        // 动画
        this.tween = new TWEEN.Tween({ perspective: maxPerspective });
        this.tween.onUpdate(function () {
            self.renderSpace(this.perspective);
        });
        this.tween.onComplete($.proxy(function () {
            this.animateStoped = true;
        }, this));
    },

    _bindEvents: function () {
        this.el.on('mousewheel', $.proxy(function (e) {
            e.preventDefault();
            if (Support('transition')) {
                this.changePrespective(e.deltaY);
            } else {
                if (e.deltaY < 0) {
                    router.go('intro');
                }
            }
        }, this));
    },

    changePrespective: function (deltaY) {
        var maxPerspective = this.maxPerspective;
        var minPerspective = this.minPerspective;

        if (this.finished) {
            return;
        }

        var $space = this.el.find('.js-index-space');
        var step = 40;
        var nowPerspective = +$space.data('perspective');

        if (deltaY > 0) {
            // 鼠标下滚
            if (nowPerspective < 440 && nowPerspective > 240) {
                nowPerspective += Math.max(step, 440 - nowPerspective);
            } else {
                nowPerspective += step;
            }
        } else if (deltaY < 0) {
            // 鼠标上滚
            if (nowPerspective < 440 && nowPerspective > 240) {
                nowPerspective -= Math.max(step, nowPerspective - 240);
            } else {
                nowPerspective -= step;
            }
        }

        if (nowPerspective > maxPerspective) {
            nowPerspective = maxPerspective;
        } else if (nowPerspective < minPerspective) {
            nowPerspective = minPerspective;
            this.finished = true;
        }

        this.tween.to({ perspective: nowPerspective }, 1000);
        this.tween.stop();
        this.tween.start();
        this.animateStoped = false;

        $space.data('perspective', nowPerspective);
    },

    // 根据提供的视距设置场景
    renderSpace: function (perspective) {
        // 设置中间石台掉落
        var $center = this.$center;
        var data = $center.data('transform');
        var minPerspective = this.minPerspective;
        var maxPerspective = this.maxPerspective;
        var percent = (perspective - minPerspective) / (maxPerspective - minPerspective);
        var offsetY = (1 - percent) * 50;

        Util.css3($center[0], {
            transform: 'translate3d(' + data.x + 'px, ' + (data.y + offsetY) + 'px,' + data.z + 'px)' +
                ' scale(' + data.scale + ', ' + data.scale + ')'
        });

        // 设置视距
        Util.css3(this.$space[0], {
            perspective: perspective + 'px'
        });

        // 设置背景模糊
        this.$blur.css({
            opacity: percent
        });
    },

    // 动画
    animateSpace: function () {
        if (this.finished && this.animateStoped) {
            router.go('intro');
        } else {
            Util.raf($.proxy(this.animateSpace, this));
            TWEEN.update();
        }
    },

    ready: function () {
        this._initSpace();
        this._bindEvents();

        var imageCount = 0;
        var loadedCount = 0;
        var $line = $('.js-loading-line');
        var page = this;

        this.el.find('*').each(function (i, el) {
            var bg = $(el).css('backgroundImage');

            if (bg && bg !== 'none') {
                imageCount++;

                var image = new Image();

                image.onerror =
                image.onload = function () {
                    loadedCount++;

                    if (Support('transition')) {
                        Util.css3($line[0], {
                            transform: 'translate3d(' + -Math.floor(loadedCount * 100 / imageCount) + '%, 0, 0)'
                        });
                        Util.css3($line[1], {
                            transform: 'translate3d(' + Math.floor(loadedCount * 100 / imageCount) + '%, 0, 0)'
                        });
                    } else {
                        $line.eq(0).stop().animate({ left: (100 - Math.floor(loadedCount * 100 / imageCount)) + '%' });
                        $line.eq(1).stop().animate({ right: (100 - Math.floor(loadedCount * 100 / imageCount)) + '%' });
                    }

                    if (loadedCount >= imageCount) {
                        setTimeout(function () {
                            Util.fadeOut($('.js-loading'), 2000, function () {
                                page.el.mousemove();
                            });
                        }, 1000);
                    }
                };

                image.src = bg.replace(/url\(["']?(.*?)["']?\)/, '$1');
            }
        });
    },

    beforeEnter: function (next) {
        this.finished = false;

        router.$root.find('.js-scroll').removeClass('active').css({ marginBottom: 0 });
        router.$root.find('.js-scroll-text').text('- 向 下 滚 动 -');
        router.$root.find('.js-scroll-rect').hide();
        Util.fadeIn(router.$root.find('.js-scroll-direction'), 2000);

        Util.fadeIn(this.el, 2000);
        this.el.find('.js-index-space').data('perspective', this.maxPerspective);
        this.tween.to({ perspective: this.maxPerspective }, 1000);
        this.tween.stop();
        this.tween.start();
        this.animateStoped = false;
        this.animateSpace();
        next();
    },

    enter: function () {

    },

    beforeLeave: function (next) {
        this.el.find('.js-index-blur').addClass('active');
        next();
    },

    leave: function () {

    }
});

router.go('index');