var Stretch = (function () {
    var pow = Math.pow;
    var cos = Math.cos;
    var PI = Math.PI;

    function now () {
        return new Date().getTime();
    }

    // 缓动函数：https://github.com/gdsmith/jquery.easing/blob/master/jquery.easing.js
    function easeOutCubic (x) {
        return 1 - pow( 1 - x, 3 );
    }

    function easeInOutSine (x) {
        return -( cos( PI * x ) - 1 ) / 2;
    }

    function Stretch (el, images, width, height) {
        this.webGLRenderer = null;
        this.scene = null;
        this.camera = null;
        this.planes = [];
        this.meshes = [];
        this.currentIndex = null;                                        // 当前显示的索引
        this.lastIndex = null;                                           // 上显示的索引
        this.el = el;                                                    // webGLRenderer的包裹容器
        this.images = images || [];                                      // 图片列表，每一项为图片地址
        this.width = width || 1920;                                      // 包裹容器的宽
        this.height = height || 1080;                                    // 包裹容器的高
        this.duration = 1000;                                            // 动画持续时间
        this.startTime = 0;

        this._init();
    }

    Stretch.prototype = {
        constructor: Stretch,

        reset: function () {
            this.currentIndex = null;
            this.lastIndex = null;
        },

        _init: function () {
            if (this.webGLRenderer) { return; }

            // 场景
            this.scene = new THREE.Scene();
            // 渲染器
            this.webGLRenderer = new THREE.WebGLRenderer({ alpha: true });
            // this.webGLRenderer.setClearColor(new THREE.Color(0x000000, 1.0));
            this.webGLRenderer.setSize(this.width, this.height);
            this.webGLRenderer.shadowMapEnabled = true;
            // 相机
            this.camera = new THREE.PerspectiveCamera(45, this.width / this.height, 0.1, 1300);
            this.camera.position.set(0, 0, 1200);
            this.camera.lookAt(new THREE.Vector3(0, 0, 0));

            // this.scene.add(new THREE.PlaneBufferGeometry(width, height, width, height));

            // 添加图片平面
            this.images.forEach(function (image, i) {
                var width = this.width;
                var height = this.height;
                var mat = new THREE.MeshPhongMaterial();

                mat.map = THREE.ImageUtils.loadTexture(image, {}, function () {
                    if (this.currentIndex === i) {
                        this.render();
                        this.stop();
                    }
                }.bind(this));
                mat.displacementMap = THREE.ImageUtils.loadTexture(__uri('../../images/normal.jpg'));
                mat.displacementScale = 0;

                this.planes.push(new THREE.PlaneBufferGeometry(width, height, width, height));
                this.meshes.push(new THREE.Mesh(this.planes[this.planes.length - 1], mat))
                this.scene.add(this.meshes[this.meshes.length - 1]);
            }.bind(this));

            this.scene.add(new THREE.AmbientLight(0xffffff));

            // var light = new THREE.DirectionalLight();
            // light.position.set(0, 10, 12);
            // this.scene.add(light);

            $(this.el).append(this.webGLRenderer.domElement);
        },

        render: function () {
            var percent = (now() - this.startTime) / this.duration;
            var stop = percent > 1;
            var maxRange = 300;

            percent = percent > 1 ? 1 : percent;

            this.planes.forEach(function (plane, i) {
                if (i !== this.currentIndex && i !== this.lastIndex) {
                    this.meshes[i].visible = false;
                } else if (i === this.currentIndex) {
                    this.meshes[i].material.needUpdate = true;
                    this.meshes[i].material.displacementScale = (1 - percent) * -20;
                    this.meshes[i].visible = true;
                } else if (i === this.lastIndex) {
                    this.meshes[i].material.needUpdate = true;
                    this.meshes[i].material.displacementScale = percent * -20;
                    this.meshes[i].visible = true;
                }
            }.bind(this));

            this.webGLRenderer.render(this.scene, this.camera);

            if (stop) { return; }
            Util.raf(this.render.bind(this));
        },

        stop: function () {
            this.startTime = 0;
        },

        switchTo: function (index) {
            if (index === this.currentIndex) { return; }

            this.startTime = now();
            this.lastIndex = this.currentIndex;
            this.currentIndex = index;
            this.render();
        }
    };

    return Stretch
})();