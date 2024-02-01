var videoPlayer = function(){
    var $modal = $('.js-modal');
    var player = {};

    $modal.find('.js-content').height(0);

    player.open = function(hd, sd){
        $modal.fadeIn(function(){
            $modal.find('.js-content').animate({ height: 540 });
        });

        if($.flash.available){
            $modal.find('.js-body').flash({
                swf: "https://tianyu.res.netease.com/gw/14v4/player/player.swf",
                width: "100%",
                height: "100%",
                wmode: 'transparent',
                allowscriptaccess:"always",
                allowFullScreen:"true",
                flashvars:{
                    v1: hd,
                    v2: sd
                }
            });
        }

        // 360 ie9兼容模式下，flash播放器无法播放，也使用video播放视频
        if(navigator.userAgent.indexOf('compatible; MSIE 9.0;') > -1 || !$.flash.available){
            $modal.find('.js-body').html(
                '<video width="960" height="540" controls="controls" autoplay=true style="background-color: #000;">' +
                    '<source src="' + hd + '" type="video/mp4">' +
                '</video>'
            );
        }
    };

    player.close = function(){
        $modal.find('.js-content').animate({ height: 0 }, function(){
            $modal.find('.js-body').html('');
            $modal.fadeOut();
        });
    }

    $modal.on('click', '.js-close', function(){
        player.close();
        player.onClose && player.onClose();
    });

    return player;
}();