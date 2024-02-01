var Support = (function () {
    var fns = {
        isIE: function () {
            return /(msie|trident)/.test(navigator.userAgent.toLowerCase());
        },
        // 判断浏览器是否支持transition，并且返回transitionend事件的事件名
        transition : function supportTransition( ) {
          var transitionEnd = (function () {
              var el = document.createElement('bootstrap')
              var  transEndEventNames = {
                  'WebkitTransition' : 'webkitTransitionEnd',
                  'MozTransition'    : 'transitionend',
                  'OTransition'      : 'oTransitionEnd otransitionend',
                  'transition'       : 'transitionend'
              };
              var name;

              for (name in transEndEventNames){
                  if (el.style[name] !== undefined) {
                      return transEndEventNames[name]
                  }
              }
          }());

          return transitionEnd && {
              end: transitionEnd
          }
        },
        // 判断浏览器是否支持animation，并且返回animationend事件的事件名
        animation: function supportAnimation () {
            var animationEnd = (function () {
                var el = document.createElement('bootstrap')
                var  aniEndEventNames = {
                    'WebkitAnimationName' : 'webkitAnimationEnd',
                    'MozAnimationName'    : 'animationend',
                    'OAnimationName'      : 'oanimationend',
                    'msAnimationName'     : 'animationend',
                    'animation'           : 'animationend'
                };
                var name;

                for (name in aniEndEventNames){
                    if (el.style[name] !== undefined) {
                        return aniEndEventNames[name]
                    }
                }
            }());

            return animationEnd && {
                end: animationEnd
            }
        },
        webgl: function () {
            if(!window.WebGLRenderingContext)return false;
            try{
                var canvas = document.createElement( 'canvas' );
                var gl = canvas.getContext( 'webgl' ) || canvas.getContext( 'experimental-webgl' );

                gl.clearStencil( 0 );
                return gl.getError() == 0;
            }catch(e){
                return false;
            }
        },
        audio: function supportAudio () {
            var a = document.createElement('audio');
            return !!(a.canPlayType);
        },
        // 判断浏览器是否支持video标签
        video: function supportVideo () {
            var canPlay = false;
            var v = document.createElement('video');
            if(v.canPlayType && v.canPlayType('video/mp4').replace(/no/, '')) {
                canPlay = true;
            }
            return canPlay;
        },
        // 判断是否支持css3属性
        transform: function supportTransform () {
            var vendors = [ '-webkit-', '-o-', '-moz-', '-ms-', '' ];
            var el = document.createElement('p');
            
            for (var i = 0, len = vendors.length, prop; i < len; i++) {
                prop = Util.toCamelCase(vendors[i] + 'transform');

                if (prop in el.style) {
                    return prop;
                }
            }

            return false;
        },
        // 判断浏览器是否支持canvas标签
        canvas: function supportCanvas () {
            return !!document.createElement('canvas').getContext;
        },
        svg: function supportSVG(){ 
            var SVG_NS = 'http://www.w3.org/2000/svg';
            return !!document.createElementNS && !!document.createElementNS(SVG_NS, 'svg').createSVGRect; 
        },
        writeingMode: function () {
            
        }
    };

    return function (method) {
        if (typeof fns[method] === 'function') {
            fns[method] = fns[method].apply(fns);
        }

        return fns[method];
    };
})();