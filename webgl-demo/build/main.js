/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/*场景，渲染器，镜头，背景星星，帧率器，第一人称控制*/
var scene = void 0,
    renderer = void 0,
    camera = void 0,
    control = void 0;
var stat = void 0;

var Sun = void 0,
    Mercury = void 0,
    //水星
Venus = void 0,
    //金星
Earth = void 0,
    Mars = void 0,
    Jupiter = void 0,
    //木星
Saturn = void 0,
    //土星
Uranus = void 0,
    //天王
Neptune = void 0,
    //海王
stars = [],
    starNames = {},
    displayName = void 0,
    particleSystem = void 0;

var width = window.innerWidth;
var height = window.innerHeight;

var cameraFar = 3000; //镜头视距

var canvas = document.getElementById('main');
canvas.width = width;
canvas.height = height;

// renderer
renderer = new THREE.WebGLRenderer({ canvas: canvas });
renderer.shadowMap.enabled = true;
renderer.shadowMapSoft = true;
renderer.setClearColor(0xffffff, 0);

// scene
scene = new THREE.Scene();

// camera
camera = new THREE.PerspectiveCamera(45, width / height, 1, cameraFar);
camera.position.set(-200, 50, 0);
camera.lookAt(new THREE.Vector3(0, 0, 0));
scene.add(camera);

// add camera control
var clock = new THREE.Clock();
control = new THREE.FirstPersonControls(camera, canvas);
control.movementSpeed = 100;
control.lookSpeed = 0.0125;
control.lookVertical = true;

// add object-sun
addSun();

// add object-stars params: name, color, distance, volume, speed, angle, ringInfo)
Mercury = addPlanet('Mercury', 'rgb(124,131,203)', 20, 2, 0.02, 0);
Venus = addPlanet('Venus', 'rgb(190,138,44)', 30, 4, 0.012, 0);
Earth = addPlanet('Earth', 'rgb(46,69,119)', 40, 5, 0.01, 0);
Mars = addPlanet('Mars', 'rgb(210,81,16)', 50, 4, 0.008, 0);
Jupiter = addPlanet('Jupiter', 'rgb(254,208,101)', 70, 9, 0.006, 0);
Saturn = addPlanet('Saturn', 'rgb(210,140,39)', 100, 7, 0.005, 0, {
  color: 'rgb(136,75,30)',
  innerRedius: 9,
  outerRadius: 11
});
Uranus = addPlanet('Uranus', 'rgb(49,168,218)', 120, 4, 0.003, 0);
Neptune = addPlanet('Neptune', 'rgb(84,125,204)', 150, 3, 0.002, 0);

// add light
var ambient = new THREE.AmbientLight(0x999999);
scene.add(ambient);
var sunLight = new THREE.PointLight(0xddddaa, 1.5, 500);
scene.add(sunLight);

// add sky
initSky();

// mouse move event
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();

// render dynamically
renderer.render(scene, camera);
requestAnimationFrame(move);

// performance monitor
initStas();

function initStas() {
  stat = new Stats();
  stat.domElement.style.position = 'absolute';
  stat.domElement.style.right = '0px';
  stat.domElement.style.top = '0px';
  document.body.appendChild(stat.domElement);
}

function addSun() {
  var sunSkin = THREE.ImageUtils.loadTexture('./textures/patterns/sunCore.jpg');
  Sun = new THREE.Mesh(new THREE.SphereGeometry(12, 16, 16), new THREE.MeshLambertMaterial({
    // color: 0xffff00,
    emissive: 0xdd4422,
    map: sunSkin
  }));
  Sun.name = 'Sun';
  scene.add(Sun);
  addPlanetName('Sun', 12);

  var opSun = new THREE.Mesh(new THREE.SphereGeometry(14, 16, 16), new THREE.MeshLambertMaterial({
    color: 0xff0000,
    // emissive: 0xdd4422,
    transparent: true,
    opacity: .35
  }));

  opSun.name = 'Sun';
  scene.add(opSun);
}

function addPlanet(name, color, distance, volume, speed, angle, ringInfo) {

  var mesh = new THREE.Mesh(new THREE.SphereGeometry(volume, 16, 16), new THREE.MeshLambertMaterial({
    // emissive: color
    color: color
  }));
  mesh.position.z = -distance;
  mesh.receiveShadow = true;
  mesh.castShadow = true;
  mesh.name = name;
  scene.add(mesh);

  var star = {
    name: name,
    distance: distance,
    volume: volume,
    speed: speed,
    angle: angle,
    Mesh: mesh
  };

  var track = new THREE.Mesh(new THREE.RingGeometry(distance - 0.2, distance + 0.2, 64, 1), new THREE.MeshBasicMaterial({
    color: 0x888888,
    side: THREE.DoubleSide
  }));
  track.rotation.x = -Math.PI / 2;
  scene.add(track);

  // planet ring
  if (ringInfo) {
    var ring = new THREE.Mesh(new THREE.RingGeometry(ringInfo.innerRedius, ringInfo.outerRadius, 32, 6), new THREE.MeshBasicMaterial({
      color: ringInfo.color,
      side: THREE.DoubleSide,
      opacity: .7,
      transparent: true
    }));
    ring.name = 'Ring of ' + name;
    ring.rotation.x = Math.PI / 3;
    ring.rotation.y = Math.PI / 4;

    scene.add(ring);
    star.ring = ring;
  }
  stars.push(star);
  addPlanetName(name, volume);

  return star;
}

function addPlanetName(name, volume) {
  var planetName = new THREE.Mesh(new THREE.TextGeometry(name, {
    size: 4,
    height: 4
  }), new THREE.MeshBasicMaterial({
    color: 0xffffff,
    side: THREE.DoubleSide
  }));
  planetName.volume = volume;
  planetName.visible = false;

  scene.add(planetName);
  starNames[name] = planetName;
}

function move() {
  // show planet name
  displayName && (displayName.visible = false);
  raycaster.setFromCamera(mouse, camera);
  var intersects = raycaster.intersectObjects(scene.children);
  if (intersects.length > 0) {
    var obj = intersects[0].object;
    var name = obj.name;

    displayName = starNames[name];
    if (displayName) {
      displayName.visible = true;
      displayName.position.copy(obj.position);
      displayName.geometry.center();
      displayName.position.y = starNames[name].volume + 4;
      displayName.lookAt(camera.position);
    }
  }

  // the sun rotate
  Sun.rotation.y = Sun.rotation.y === 2 * Math.PI ? 0.0008 * Math.PI : Sun.rotation.y + 0.0008 * Math.PI;
  // the stars rotate
  stars.forEach(function (star) {
    return moveStar(star);
  });

  control.update(clock.getDelta());
  renderer.render(scene, camera);
  stat.update();

  requestAnimationFrame(move);
}

function moveStar(star) {
  star.angle += star.speed;
  if (star.angle > Math.PI * 2) {
    star.angle -= Math.PI * 2;
  }
  star.Mesh.position.set(star.distance * Math.sin(star.angle), 0, star.distance * Math.cos(star.angle));

  if (star.ring) {
    star.ring.position.set(star.distance * Math.sin(star.angle), 0, star.distance * Math.cos(star.angle));
  }
}

function initSky() {
  var gap = 1000;
  var particles = 20000;
  var bufferGeometry = new THREE.BufferGeometry();

  var positions = new Float32Array(particles * 3);
  var colors = new Float32Array(particles * 3);
  var color = new THREE.Color();

  for (var i = 0, l = positions.length; i < l; i += 3) {
    // positions
    var x = Math.random() * gap * 2 * (Math.random() < .5 ? -1 : 1);
    var y = Math.random() * gap * 2 * (Math.random() < .5 ? -1 : 1);
    var z = Math.random() * gap * 2 * (Math.random() < .5 ? -1 : 1);

    var biggest = Math.abs(x) > Math.abs(y) ? Math.abs(x) > Math.abs(z) ? 'x' : 'z' : Math.abs(y) > Math.abs(z) ? 'y' : 'z';
    var pos = { x: x, y: y, z: z };

    if (Math.abs(pos[biggest]) < gap) {
      pos[biggest] = pos[biggest] < 0 ? -gap : gap;
    }
    x = pos['x'];
    y = pos['y'];
    z = pos['z'];

    positions[i] = x;
    positions[i + 1] = y;
    positions[i + 2] = z;

    // colors
    var hasColor = Math.random() > 0.3;
    var vx = void 0,
        vy = void 0,
        vz = void 0;
    if (hasColor) {
      vx = (Math.random() + 1) / 2;
      vy = (Math.random() + 1) / 2;
      vz = (Math.random() + 1) / 2;
    } else {
      vx = 1;
      vy = 1;
      vz = 1;
    }

    color.setRGB(vx, vy, vz);
    colors[i] = color.r;
    colors[i + 1] = color.g;
    colors[i + 2] = color.b;
  }

  bufferGeometry.addAttribute('position', new THREE.BufferAttribute(positions, 3));
  bufferGeometry.addAttribute('color', new THREE.BufferAttribute(colors, 3));
  bufferGeometry.computeBoundingSphere();

  var material = new THREE.PointsMaterial({
    size: 6,
    vertexColors: THREE.VertexColors
  });
  particleSystem = new THREE.Points(bufferGeometry, material);
  scene.add(particleSystem);
}

/***/ })
/******/ ]);