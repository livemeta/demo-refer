//全屏滚动
function initBanner(){
	var xxx=0;
	var imgLength=j(".b-img a").length;
	var ctWidth=imgLength*100;
	var itemWidth=1/imgLength*100;
	j(".b-img").width(ctWidth+"%");
	j(".b-img a").width(itemWidth+"%");
	//j(".b-list").width(imgLength*30);
	if(imgLength>1)
	{
	for(var i=0;i<imgLength;i++)
	{
		var listSpan=j("<span></span>")
		j(".b-list").append(listSpan);
		}
	}
	j(".b-list span:eq(0)").addClass("spcss").siblings("span").removeClass("spcss");
//	j(".bar-right em").click(function(){
//		if(n==imgLength-1)
//		{
//			var ctPosit=(n+1)*100;
//			j(".banner").append(j(".b-img").clone());
//			j(".b-img:last").css("left","100%");
//			j(".b-img:first").animate({"left":"-"+ctPosit+"%"},1000);
//			j(".b-img:last").animate({"left":"0"},1000);
//			var setTime0=setTimeout(function () {
//          j(".banner .b-img:first").remove();
//          }, 1000);
//			n=0;
//			j(".b-list span:eq("+n+")").addClass("spcss").siblings("span").removeClass("spcss");
//			}
//		else
//		{
//		n++;
//		var ctPosit=n*100;
//		j(".b-img").animate({"left":"-"+ctPosit+"%"},1000);
//		j(".b-list span:eq("+n+")").addClass("spcss").siblings("span").removeClass("spcss");
//		}
//		})
//	j(".bar-left em").click(function(){
//		if(n==0)
//		{
//			var stPosit=imgLength*100;
//			var etPosit=(imgLength-1)*100;
//			j(".banner").prepend(j(".b-img").clone());
//			j(".b-img:first").css("left","-"+stPosit+"%");
//			j(".b-img:last").animate({"left":"100%"},1000);
//			j(".b-img:first").animate({"left":"-"+etPosit+"%"},1000);
//			var setTime0=setTimeout(function () {
//          j(".banner .b-img:last").remove();
//          }, 1000);
//			n=imgLength-1;
//			j(".b-list span:eq("+n+")").addClass("spcss").siblings("span").removeClass("spcss");
//			}
//		else
//		{
//		n--;
//		var ctPosit=n*100;
//		j(".b-img").animate({"left":"-"+ctPosit+"%"},1000);
//		j(".b-list span:eq("+n+")").addClass("spcss").siblings("span").removeClass("spcss");
//		}
//		})
	j(".b-list span").click(function(){
		var lsIndex=j(this).index();
		xxx=lsIndex;
		var ctPosit=xxx*100;
		j(".b-img").animate({"left":"-"+ctPosit+"%"},1000);
		j(this).addClass("spcss").siblings("span").removeClass("spcss");
		})
	
	function rollEnvent(){
		if(xxx==imgLength-1)
		{
			var ctPosit=(xxx+1)*100;
			j(".banner").append(j(".b-img").clone());
			j(".b-img:last").css("left","100%");
			j(".b-img:first").animate({"left":"-"+ctPosit+"%"},1000);
			j(".b-img:last").animate({"left":"0"},1000);
			var setTime0=setTimeout(function () {
                 j(".banner .b-img:first").remove();
            }, 1000);
			xxx=0;
			j(".b-list span:eq(0)").addClass("spcss").siblings("span").removeClass("spcss");
			}
		else
		{
		xxx++;
		var ctPosit=xxx*100;
		j(".b-img").animate({"left":"-"+ctPosit+"%"},1000);
		j(".b-list span:eq("+xxx+")").addClass("spcss").siblings("span").removeClass("spcss");
		}
	}
	
	var slidesetInterval=setInterval(rollEnvent,5000);
	j(".banner").mouseover(function(){
		clearInterval(slidesetInterval);
		}).mouseleave(function(){
		slidesetInterval=setInterval(rollEnvent,5000)
	});
	//j(".banner").hover(function(){clearInterval(slidesetInterval);},function(){slidesetInterval=setInterval(rollEnvent,8000);});
//	j(".bar-left").mouseover(function(){
//		j(this).css("background","url(images/arr-bg.png)");
//		j(this).find("em").addClass("emcss");
//		}).mouseleave(function(){
//		j(this).css("background","none");
//		j(this).find("em").removeClass("emcss");
//			})
//	j(".bar-right").mouseover(function(){
//		j(this).css("background","url(images/arr-bg.png)");
//		j(this).find("em").addClass("emcss");
//		}).mouseleave(function(){
//		j(this).css("background","none");
//		j(this).find("em").removeClass("emcss");
//			})
	};
	
	
