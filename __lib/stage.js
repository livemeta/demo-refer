var Stage = (function () {
	window.requestAnimationFrame = (function(){
		return window.requestAnimationFrame    ||
			window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame    ||
			window.oRequestAnimationFrame      ||
			window.msRequestAnimationFrame     ||
			function (callback) { window.setTimeout(callback, 1000 / 60); };
	})();

	function Stage (id, width, height) {
		var _this = this;

		this.canvas = document.getElementById(id);
		this.ctx = this.canvas.getContext('2d');
		this.renderList = [];
		this.needClear = true;

		this.canvas.width = width || $(window).width();
		this.canvas.height = height || $(window).height();

		$(window).on('resize', function () {
			_this.canvas.width = width || $(window).width();
			_this.canvas.height = height || $(window).height();
		});
	}

	Stage.prototype.update = function () {
		var _this = this;

		_this.needClear && _this.ctx.clearRect(0, 0, _this.canvas.width, _this.canvas.height);
		_this.renderList.forEach(function (render) {
			render(_this.ctx, _this.canvas);
		});
		requestAnimationFrame(function () {
			_this.update();
		});
	};

	Stage.prototype.onUpdate = function (fn) {
		this.renderList.push(fn);
	};

	return Stage;
})();
window.Stage = Stage
