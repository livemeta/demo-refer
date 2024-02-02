
/*场景，渲染器，镜头，背景星星，帧率器，第一人称控制*/
let scene, renderer, camera, control;
let stat;

let Sun,
    Mercury,  //水星
    Venus,  //金星
    Earth,
    Mars,
    Jupiter, //木星
    Saturn, //土星
    Uranus, //天王
    Neptune, //海王
    stars = [],
    starNames = {},
    displayName,
    particleSystem;

let width = window.innerWidth;
let height = window.innerHeight;

const cameraFar = 3000;  //镜头视距

const canvas = document.getElementById('main');
canvas.width = width;
canvas.height = height;

// renderer
renderer = new THREE.WebGLRenderer({ canvas });
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
const clock = new THREE.Clock();
control = new THREE.FirstPersonControls( camera, canvas);
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
      color:'rgb(136,75,30)',
      innerRedius:9,
      outerRadius:11
  });
Uranus = addPlanet('Uranus', 'rgb(49,168,218)', 120, 4, 0.003, 0);
Neptune = addPlanet('Neptune', 'rgb(84,125,204)', 150, 3, 0.002, 0);

// add light
let ambient = new THREE.AmbientLight(0x999999);
scene.add(ambient);
let sunLight = new THREE.PointLight(0xddddaa, 1.5, 500);
scene.add(sunLight);

// add sky
initSky();

// mouse move event
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

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
  let sunSkin = THREE.ImageUtils.loadTexture('./img/textures/patterns/sunCore.jpg');
  Sun = new THREE.Mesh(
    new THREE.SphereGeometry(12, 16, 16),
    new THREE.MeshLambertMaterial({
      // color: 0xffff00,
      emissive: 0xdd4422,
      map: sunSkin
    })
  );
  Sun.name = 'Sun';
  scene.add(Sun);
  addPlanetName('Sun', 12);

  let opSun = new THREE.Mesh( new THREE.SphereGeometry( 14 ,16 ,16 ),
      new THREE.MeshLambertMaterial({
          color: 0xff0000,
          // emissive: 0xdd4422,
          transparent: true,
          opacity: .35
      })
  );

  opSun.name = 'Sun';
  scene.add(opSun);
}

function addPlanet(name, color,
  distance, volume,
  speed, angle, ringInfo) {

  let mesh = new THREE.Mesh(
    new THREE.SphereGeometry(volume, 16, 16),
    new THREE.MeshLambertMaterial({
      // emissive: color
      color: color
    })
  );
  mesh.position.z = -distance;
  mesh.receiveShadow = true;
  mesh.castShadow = true;
  mesh.name = name;
  scene.add(mesh);

  let star = {
    name,
    distance,
    volume,
    speed,
    angle,
    Mesh: mesh
  };

  let track = new THREE.Mesh(
    new THREE.RingGeometry(distance - 0.2, distance + 0.2, 64, 1),
    new THREE.MeshBasicMaterial({
      color: 0x888888,
      side: THREE.DoubleSide
    })
  );
  track.rotation.x = -Math.PI / 2;
  scene.add(track);

  // planet ring
  if (ringInfo) {
    let ring = new THREE.Mesh(
      new THREE.RingGeometry(ringInfo.innerRedius, ringInfo.outerRadius, 32, 6),
      new THREE.MeshBasicMaterial({
        color: ringInfo.color,
        side: THREE.DoubleSide,
        opacity: .7,
        transparent: true
      })
    );
    ring.name = `Ring of ${name}`;
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
  let planetName = new THREE.Mesh(
    new THREE.TextGeometry(name, {
      size: 4,
      height: 4
    }),
    new THREE.MeshBasicMaterial({
      color: 0xffffff,
      side: THREE.DoubleSide
    })
  );
  planetName.volume = volume;
  planetName.visible = false;

  scene.add(planetName);
  starNames[name] = planetName;
}

function move() {
  // show planet name
  displayName && (displayName.visible = false);
  raycaster.setFromCamera(mouse, camera);
  let intersects = raycaster.intersectObjects(scene.children);
  if (intersects.length > 0) {
    let obj = intersects[0].object;
    let name = obj.name;

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
  Sun.rotation.y =
    Sun.rotation.y === 2 * Math.PI ?
    0.0008 * Math.PI : Sun.rotation.y + 0.0008 * Math.PI;
  // the stars rotate
  stars.forEach(star => moveStar(star));

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
  star.Mesh.position.set(
    star.distance * Math.sin(star.angle),
    0,
    star.distance * Math.cos(star.angle)
  );

  if (star.ring) {
    star.ring.position.set(
      star.distance * Math.sin(star.angle),
      0,
      star.distance * Math.cos(star.angle)
    )
  }
}

function initSky() {
  const gap = 1000;
  const particles = 20000;
  const bufferGeometry = new THREE.BufferGeometry();

  let positions = new Float32Array(particles * 3);
  let colors = new Float32Array(particles * 3);
  let color = new THREE.Color();

  for (let i = 0, l = positions.length; i < l; i += 3) {
    // positions
    let x = (Math.random() * gap * 2) * (Math.random() < .5 ? -1 : 1);
    let y = (Math.random() * gap * 2) * (Math.random() < .5 ? -1 : 1);
    let z = (Math.random() * gap * 2) * (Math.random() < .5 ? -1 : 1);

    let biggest = Math.abs(x) > Math.abs(y)
      ? (Math.abs(x) > Math.abs(z) ? 'x' : 'z')
      : (Math.abs(y) > Math.abs(z) ? 'y' : 'z');
    let pos = { x, y, z };

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
    let hasColor = Math.random() > 0.3;
    let vx, vy, vz;
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

  let material = new THREE.PointsMaterial({
    size: 6,
    vertexColors: THREE.VertexColors
  });
  particleSystem = new THREE.Points(bufferGeometry, material);
  scene.add(particleSystem);
}
