router.add('boss', {
    el: $('.js-boss'),
    currentIndex: 0,
    lastIndex: 0,

    // 加载背景视频
    loadVideo: function () {
        var self = this;

        $.map(this.el.find('.js-boss-bg'), function (el, i) {
            Util.loadVideo(
                $(el).data('video'),
                $.noop,
                function ($video) {
                    $video.prop('loop', true);
                    $(el).data('video', $video);

                    if (i === self.currentIndex) {
                        $(el).append($video);
                        $video[0].play();
                        Util.fadeIn($video, 1000);
                    }
                },
                function () {
                    console.log(arguments);
                }
            );
        })
    },

    renderAside: function () {
        // 导航
        if (this.currentIndex > 0) {
            this.el.find('.js-aside-last-text').text('下一层');
        } else {
            this.el.find('.js-aside-last-text').text('入口');
        }

        if (this.currentIndex === this.total - 1) {
            this.el.find('.js-aside-next-text').text('首页');
        } else {
            this.el.find('.js-aside-next-text').text('上一层');
        }

        this.el.find('.js-aside-line').css({ height: 91 * (this.currentIndex) });
        this.el.find('.js-aside-item').removeClass('active').each($.proxy(function (i, item) {
            if (i >= this.total - this.currentIndex - 2) {
                $(item).addClass('active');
            }
        }, this));
    },

    changeAudio: function () {
        if (Support('audio')) {
            this.el.find('.js-boss-item').find('audio').each($.proxy(function (i, audio) {
                if (i === this.currentIndex) {
                    audio.play();
                } else {
                    audio.pause();
                    audio.currentTime = 0;
                }
            }, this));
        };
    },

    switchBoss: function () {
        this.switching = true;
        // boss
        this.el.find('.js-boss-item').removeClass('active').eq(this.currentIndex).addClass('active');
        Util.css3(this.el.find('.js-boss-list')[0], {
            transform: 'translate(0, ' + -this.currentIndex * Viewport.normalHeight + 'px)'
        });
        this.changeBg();
        this.changeAudio();
        this.renderAside();
        this.hideDesc(this.lastIndex);

        setTimeout($.proxy(function () {
            this.switching = false;
        }, this), 1000);
    },

    showDesc: function (index) {
        var $boss = this.el.find('.js-boss-item').eq(index);

        if ($boss.find('.js-boss-desc-toggle').hasClass('active')) {
            return;
        }

        $boss.find('.js-boss-desc-content').addClass('active');
        $boss.find('.js-boss-desc-content').prev().removeClass('fadeIn').addClass('fadeOut');
        $boss.find('.js-boss-desc-toggle').addClass('active');
        this.el.find('.js-boss-mask').removeClass('maskFadeOut').addClass('maskFadeIn');
    },

    hideDesc: function (index) {
        var $boss = this.el.find('.js-boss-item').eq(index);

        if (!$boss.find('.js-boss-desc-toggle').hasClass('active')) {
            return;
        }

        $boss.find('.js-boss-desc-content').removeClass('active');
        $boss.find('.js-boss-desc-content').prev().addClass('fadeIn').removeClass('fadeOut');
        $boss.find('.js-boss-desc-toggle').removeClass('active');
        this.el.find('.js-boss-mask').removeClass('maskFadeIn').addClass('maskFadeOut');
    },

    // 改变背景
    changeBg: function () {
        var page = this;
        var $last = null;

        this.el.find('.js-boss-bg').each(function (i, el) {
            var $el = $(el);

            if ($el.find('video').length) {
                $el.find('video')[0].pause();
            }
            if (!$el.hasClass('active')) {
                $el.hide();
            } else {
                $last = $el.removeClass('active').addClass('leave');
            }
        })
        .eq(this.currentIndex).each(function (i, el) {
            var index = page.currentIndex;
            var $el = $(el);

            if (!$el.find('video').length && $el.data('video')) {
                $el.append($el.data('video'));
            }

            if ($el.find('video').length) {
                $el.find('video')[0].play();
            }

            if (Support('animation')) {
                $el.show();
                $el.on(Support('animation').end, function () {
                    $last && $last[0] !== $el[0] && $last.hide().removeClass('leave');
                });
                Util.raf(function () {
                    $el.addClass('active');
                });
            } else {
                $el.fadeIn();
                $last && $last[0] !== $el[0] && $last.fadeOut();
            }
        });
    },

    _bindEvents: function () {
        var page = this;

        // 滚动切换boss
        this.el.on('mousewheel', $.proxy(function (e) {
            if (this.switching) { return; }
            if (this.entering) { return; }

            if (e.deltaY < 0) {
                if (this.currentIndex > this.total - 2) {
                    router.go('index');
                    return
                }
                this.lastIndex = this.currentIndex;
                this.currentIndex++;
            } else {
                if (this.currentIndex <= 0) {
                    router.go('intro');
                    return
                }
                this.lastIndex = this.currentIndex;
                this.currentIndex--;
            }

            this.switchBoss();
        }, this));

        // 点击切换boss
        this.el.on('click', '.js-aside-last', $.proxy(function () {
            if (this.currentIndex === 0) {
                // 进入入口
                router.go('intro');
            } else if (this.currentIndex > 0) {
                this.lastIndex = this.currentIndex;
                this.currentIndex--;
                this.switchBoss();
            }
        }, this));

        this.el.on('click', '.js-aside-next', $.proxy(function () {
            if (this.currentIndex === this.total - 1) {
                // 返回首页
                router.go('index');
            } else if (this.currentIndex < this.total - 1) {
                this.lastIndex = this.currentIndex;
                this.currentIndex++;
                this.switchBoss();
            }
        }, this));

        // 打开/关闭 boss介绍内容
        this.el.on('click', '.js-boss-desc-toggle', function () {
            var index = $(this).closest('.js-boss-item').index();

            if (!$(this).hasClass('active')) {
                page.showDesc(index);
            } else {
                page.hideDesc(index);
            }
        });

        var bgmPlaying = false

        this.el.on('click', '.js-video-play', function () {
            var data = $(this).data();

            videoPlayer.open(data.hd, data.sd);
            if (router.bgm && !router.bgm.paused) {
                $('.js-bgm').click();
                bgmPlaying = true;
            }
        });

        Viewport.on('resize', function () {
            if (page._status === 'enter') {
                page.responsive();
            }
        });

        videoPlayer.onClose = function () {
            if (router.bgm && router.bgm.paused && bgmPlaying) {
                bgmPlaying = false;
                $('.js-bgm').click();
            }
        };
    },

    _fixWritingMode: function () {
        var page = this;

        this.el.find('.js-boss-desc-content').each(function (i, content) {
            var right = 150;
            var rows = 30;
            var list = [];

            $(content).find('p').each(function (index) {
                var text = $(this).text();

                for (var i = 0; i < text.length; i++) {
                    list.push($('<span></span>').css({
                        right: right + (Math.floor(i / rows) * 35),
                        top: 15 * (i % rows)
                    }).text(text[i]));
                }

                right += (Math.ceil(i / rows) * 35) + 30;
            }).remove();

            $(content).append(list);
        });
    },

    responsive: function () {
        this.el.find('.js-boss-title').css({ marginLeft: router.bossTitleMarginLeft });
        this.el.find('.js-aside').css({ left: router.asideLeft });
        this.el.find('.js-boss-desc').css({ width: router.bossDescWidth });
    },

    ready: function () {
        this.el.html($('#boss-tmpl').text());
        this.el.find('.js-aside').hide();
        this._bindEvents();
        this.total = this.el.find('.js-boss-item').length;
        this._inited = true;
        this._fixWritingMode();

        if (this.$video) {
            this.el.find('.js-boss-video').append(this.$video);
        }

        if (Support('video')) {
            this.loadVideo();
        } else {
            this.el.find('.js-boss-video').remove();
        }

        if (!Support('transform')) {
            this.el.find('.js-boss-play-img').show().next().hide();
            this.el.find('.js-boss-desc-toggle').addClass('boss-item__arrow--old');
        }
    },

    // 加载boss过场视频 和 动画图片
    load: function (step, finish) {
        var page = this;
        var percent1 = 0;
        var percent2 = 0;
        var allFinish = function () {
            if (percent1 === 1 && percent2 === 1) {
                page.loading = false;
                page.loaded = true;
                page.ready();
                finish();
            }
        };

        if (page.loading) { return; }
        if (page.loaded) {
            finish();
            return;
        }
        page.loading = true;

        this.el.find('.js-boss-bg').each(function () {
            $(this).css({ background: 'url("' + $(this).data('src') + '") no-repeat 0 0' });
        });

        this.el.find('.js-boss-title').each(function () {
            $(this).css({ background: 'url("' + $(this).data('src') + '") no-repeat 0 0' });
        });

        Util.loadImages([
            __uri('../../images/mask.png'),
            __uri('../../images/boss1/bg.jpg'),
            __uri('../../images/boss2/bg.jpg'),
            __uri('../../images/boss3/bg.jpg'),
            __uri('../../images/boss4/bg.jpg'),
            __uri('../../images/boss5/bg.jpg'),
            __uri('../../images/boss6/bg.jpg'),
            __uri('../../images/boss7/bg.jpg')
        ], function (percent) {
            percent1 = percent;
            step(percent1 * percent2);
        }, function () {
            percent1 = 1;
            allFinish();
        });

        if (Support('video')) {
            Util.loadVideo(
                'https://tianyu.v.netease.com/2016/1212/qinglinzhenyao1.mp4',
                function (percent) {
                    percent2 = percent
                    step(percent1 * percent1);
                },
                function ($video) {
                    percent2 = 1;
                    page.$video = $video;
                    allFinish();
                },
                function () {
                    percent2 = 1;
                    page.el.find('.js-boss-video').remove();
                    allFinish();
                }
            );
        } else {
            percent2 = 1;
            page.el.find('.js-boss-video').remove();
            finish();
        }

        allFinish();
    },

    beforeEnter: function (next) {
        Util.fadeIn(this.el, 2000);
        this.el.find('.js-boss-bg').hide();
        this.el.find('.js-boss-bg-wrap').show();
        this.currentIndex = 0;
        this.entering = true;
        this.responsive();

        if (this.$video) {
            this.el.find('.js-boss-video').css({ opacity: 1 }).show();
            this.$video[0].play();
            setTimeout($.proxy(function() {
                Util.fadeOut(this.el.find('.js-boss-video'), 2000);
                next();
            }, this), 3000);
        } else {
            next();
        }
    },

    enter: function () {
        setTimeout($.proxy(function () {
            this.switchBoss();
            Util.fadeIn(this.el.find('.js-aside'), 2000);
            Util.fadeIn(this.el.find('.js-boss-list'), 1000);
            this.entering = false;
        }, this), 2000);
    },

    beforeLeave: function (next) {
        Util.fadeOut(this.el, 2000);
        Util.fadeOut(this.el.find('.js-aside'), 1000);
        this.el.find('.js-boss-list').hide();
        next();
    },

    leave: function () {
        
    }
});