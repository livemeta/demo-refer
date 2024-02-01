var Wave = (function () {
    if (!Support('webgl')) { return; }

    var pow = Math.pow;
    var cos = Math.cos;
    var PI = Math.PI;
    var loader = new THREE.TextureLoader();

    loader.crossOrigin = 'anonymous';

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

    function Wave (el, images, width, height) {
        this.webGLRenderer = null;
        this.scene = null;
        this.camera = null;
        this.planes = [];
        this.meshes = [];
        this.textures = [];
        this.currentIndex = null;                                        // 当前显示的索引
        this.lastIndex = null;                                           // 上显示的索引
        this.el = el;                                                    // webGLRenderer的包裹容器
        this.images = images || [];                                      // 图片列表，每一项为图片地址
        this.width = Math.floor(width || 1920);                          // 包裹容器的宽
        this.height = Math.floor(height || 1080);                        // 包裹容器的高
        this.duration = 1500;                                            // 动画持续时间
        this.startTime = 0;

        this._init();
    }

    Wave.prototype = {
        constructor: Wave,

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
            this.webGLRenderer.shadowMap.enabled = true;
            // 相机
            this.camera = new THREE.PerspectiveCamera(45, this.width / this.height, 0.1, 2100);
            this.camera.position.set(0, 0, 1200);
            this.camera.lookAt(new THREE.Vector3(0, 0, 0));

            // 添加图片平面
            this.images.forEach(function (image, i) {
                var width = this.width;
                var height = this.height;

                this.planes.push(
                    new THREE.ParametricGeometry(function (u, v) {
                        return new THREE.Vector3(
                            Math.floor((u - .5) * width),
                            Math.floor((v - .5) * height),
                            0
                        );
                    }, 1, 200)
                );

                var texture = loader.load(image, function () {
                    if (this.currentIndex === i) {
                        this.render();
                        this.stop();
                    }
                }.bind(this));
                var mat = new THREE.MeshPhongMaterial({
                    map: texture,
                    wireframe: false
                });

                texture.minFilter = THREE.LinearFilter;
                this.textures.push(texture);
                this.meshes.push(new THREE.Mesh(this.planes[this.planes.length - 1], mat))
                this.scene.add(this.meshes[this.meshes.length - 1]);
            }.bind(this));

            this.scene.add(new THREE.AmbientLight(0xffffff));

            // var light = new THREE.DirectionalLight();
            // light.position.set(0, 10, 10);
            // this.scene.add(light);

            $(this.el).append(this.webGLRenderer.domElement);
        },

        render: function () {
            var percent = (now() - this.startTime) / this.duration;
            var stop = percent > 1;
            var height = this.height;
            var offset = height / 2 - percent * height * 11 / 4;
            var maxRange = 300;

            percent = percent > 1 ? 1 : percent;

            this.planes.forEach(function (plane, i) {
                if (i !== this.currentIndex && i !== this.lastIndex) {
                    this.meshes[i].visible = false;
                } else {
                    this.meshes[i].visible = true;
                }
            }.bind(this));

            this.planes[this.currentIndex].vertices.forEach(function (vertice) {
                var y = vertice.y;

                // offset为动画的已经到达的y坐标
                // 动画分为3个阶段，阶段通过当前点与offset的距离
                // 第一阶段，在offset到offset之后1/2 height的地方， 使用easeOutCubic函数模拟
                // 第二阶段，在offset之后1/2 height 到 offset之后 height的地方， 使用easeInOutSine函数模拟
                // 第三阶段，在offset之后 height 到 offset之后 7/4 height的地方， 使用反向easeInOutSine函数模拟
                // easeing函数速查 http://easings.net/zh-cn
                if (y < offset) {
                    // 动画还未到达的点
                    vertice.z = -maxRange - 1;
                } else if (y >= offset && y < offset + height / 2) {
                    // 第一阶段
                    vertice.z = easeOutCubic((y - offset) * 2 / height) * maxRange - maxRange;
                } else if (y >= offset + height / 2 && y < offset + height) {
                    // 第二阶段
                    vertice.z = -easeInOutSine((y - offset - height / 2) * 2 / height) * 60;
                } else if (y >= offset + height && y < offset + height * 7 / 4) {
                    // 第三阶段
                    vertice.z = -easeInOutSine((offset + height * 7 / 4 - y) * 4 / (height * 3)) * 60;
                } else {
                    vertice.z = 0;
                }
            }.bind(this));
            this.planes[this.currentIndex].verticesNeedUpdate = true;
            // this.planes[this.currentIndex].mergeVertices();
            // this.planes[this.currentIndex].computeVertexNormals();

            if (this.lastIndex !== null && this.currentIndex !== this.lastIndex) {
                offset = offset + height / 200; // 防止两张图片之间出现缝隙，offset坐标回调一点

                this.planes[this.lastIndex].vertices.forEach(function (vertice) {
                    var y = vertice.y;

                    // 上一张图片，只需要和当前图片的第一个阶段对称的动画
                    if (y <= offset && y > offset - height / 2) {
                        vertice.z = easeOutCubic((offset - y) * 2 / height) * maxRange - maxRange;
                    } else if (y > offset) {
                        vertice.z = -maxRange - 1;
                    } else {
                        vertice.z = 0;
                    }
                }.bind(this));
                this.planes[this.lastIndex].verticesNeedUpdate = true;
                // this.planes[this.lastIndex].mergeVertices();
                // this.planes[this.lastIndex].computeVertexNormals();
            }

            this.webGLRenderer.render(this.scene, this.camera);

            if (stop) { return; }
            Util.raf(this.render.bind(this));
        },

        stop: function () {
            this.startTime = 0;
        },

        switchTo: function (index) {
            if (index === this.currentIndex) { return; }

            this.stop();

            Util.raf(function (){
                this.startTime = now();
                this.lastIndex = this.currentIndex;
                this.currentIndex = index;
                this.render();
            }.bind(this))
        }
    };

    return Wave
})();