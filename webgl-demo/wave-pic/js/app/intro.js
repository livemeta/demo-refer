router.add('intro', {
    el: $('.js-intro'),
    currentIndex: 0,

    _bindEvents: function () {
        var page = this;

        if (Support('webgl')) {
            var $stage = this.el.find('.js-award-stage');

            this.awardWave = new Wave(
                $stage,
                $.map(this.el.find('.js-award-list img'), function (el) {
                    return $(el).attr('src');
                }),
                $stage.width(),
                $stage.height()
            );

            this.el.find('.js-award-list').hide().parent().css({ overflow: 'visible' });
        }

        // 滚动切换
        this.el.on('mousewheel', $.proxy(function (e) {
            if (this.switching) { return; }
            if (this._status !== 'enter') { return; }

            if (e.deltaY < 0) {
                if (this.currentIndex > this.total - 2) {
                    router.go('boss');
                    return
                }
                this.currentIndex++;
            } else {
                if (this.currentIndex <= 0) {
                    router.go('index');
                    return
                }
                this.currentIndex--;
            }
            this.el.find('.js-intro-nav a').eq(this.currentIndex).click();
        }, this));

        this.el.on('click', '.js-award-item', $.proxy(function (e) {

            var index = this.el.find('.js-award-item').index($(e.target).closest('.js-award-item'));
            var preivewHeight = 329;

            this.el.find('.js-award-item').removeClass('active').eq(index).addClass('active');

            if (this.awardWave) {
                this.awardWave.switchTo(index);
            }  else {
                this.el.find('.js-award-list').stop().animate({
                    top: -index * preivewHeight
                });
            }
        }, this));

        this.el.find('.js-intro-nav').on('click', 'a', function () {
            if (page.switching) { return; }

            var index = $(this).index();

            page.currentIndex = index;
            page.switching = true;

            page.el.find('.js-intro-nav a').removeClass('active').eq(index).addClass('active');
            Util.fadeOut(page.el.find('.js-intro-content').not(':eq(' + index + ')'));
            Util.fadeIn(page.el.find('.js-intro-content').eq(index));

            Util.raf(function () {
                page.el.find('.js-intro-content').removeClass('active').eq(index).addClass('active');
            });

            if (index === 2) {
                // 如果是副本掉落页面
                page.el.find('.js-award-item:eq(0)').click();
            }

            setTimeout(function () {
                page.switching = false;
            }, 800);
        });

        Viewport.on('resize', function () {
            if (page._status === 'enter') {
                page.responsive();
                router.$root.find('.js-scroll').css({ marginBottom: router.scrollMarginBottom });
            }
        });
    },

    responsive: function () {
        if (Viewport.height < 920) {
            this.el.find('.js-intro-title').css({ marginTop: 60 });
            this.el.find('.js-intro-nav').css({ marginBottom: 80 });
        } else {
            this.el.find('.js-intro-title').css({ marginTop: 0 });
            this.el.find('.js-intro-nav').css({ marginBottom: 146 });
        }
    },

    ready: function () {
        this.el.html($('#intro-tmpl').text());
        this.total = this.el.find('.js-intro-nav a').length;
        this._bindEvents();
    },

    beforeEnter: function (next) {
        Util.fadeIn(this.el);
        this.el.find('.js-intro-content').hide();
        this.el.find('.js-intro-nav a:eq(0)').click();
        this.el.find('.js-intro-bg').addClass('active');
        this.responsive();

        router.$root.find('.js-scroll').css({ marginBottom: router.scrollMarginBottom });
        router.$root.find('.js-scroll-text').text('- 立 即 挑 战 -');
        router.$root.find('.js-scroll-direction').hide();
        Util.fadeIn(router.$root.find('.js-scroll-rect'), 2000);

        setTimeout(function () {
            next();
        }, 1000);
    },

    enter: function () {
        var page = this;

        router.get('boss').load(
            function (percent) {
                router.$root.find('.js-scroll-percent').css({ height: percent + '%' });
            },
            function () {
                router.$root.find('.js-scroll-percent').css({ height: '100%' });
                router.$root.find('.js-scroll').addClass('active');
            }
        );
    },

    beforeLeave: function (next) {
        Util.fadeOut(this.el);
        next();
    },

    leave: function () {
        
    }
});