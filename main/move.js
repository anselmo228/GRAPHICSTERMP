document.addEventListener("DOMContentLoaded", function () {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x87ceeb); // 배경색 하늘색으로
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  const renderer = new THREE.WebGLRenderer({ antialias: true });

  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.minDistance = 20;
  controls.maxDistance = 800;
  controls.update();

  const textureLoader = new THREE.TextureLoader();
   // 바닥 //
  const skyMeterialArray = [];
  const texture_ft = new THREE.TextureLoader().load("../background/ft.jpg");
  const texture_bk = new THREE.TextureLoader().load("../background/bk.jpg");
  const texture_up = new THREE.TextureLoader().load("../background/up.jpg");
  const texture_dn = new THREE.TextureLoader().load("../background/dn.jpg");
  const texture_rt = new THREE.TextureLoader().load("../background/rt.jpg");
  const texture_lf = new THREE.TextureLoader().load("../background/lf.jpg");

  skyMeterialArray.push(
    new THREE.MeshStandardMaterial({
      map: texture_ft,
    })
  );
  skyMeterialArray.push(
    new THREE.MeshStandardMaterial({
      map: texture_bk,
    })
  );
  skyMeterialArray.push(
    new THREE.MeshStandardMaterial({
      map: texture_up,
    })
  );
  skyMeterialArray.push(
    new THREE.MeshStandardMaterial({
      map: texture_dn,
    })
  );
  skyMeterialArray.push(
    new THREE.MeshStandardMaterial({
      map: texture_rt,
    })
  );
  skyMeterialArray.push(
    new THREE.MeshStandardMaterial({
      map: texture_lf,
    })
  );
  for (let i = 0; i < 6; i++) {
    skyMeterialArray[i].side = THREE.BackSide;
  }
  const skyboxGeo = new THREE.BoxGeometry(100, 100, 100);
  const sky = new THREE.Mesh(skyboxGeo, skyMeterialArray);
  scene.add(sky);

  renderer.setSize(window.innerWidth, window.innerHeight);
  document.getElementById("scene-container").appendChild(renderer.domElement);

  // 길 //
  const roadTexture = textureLoader.load("../images/road.png"); 
  function createRoad(x, y, z) {
    const roadMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(30, 15), // 크기 조절
      new THREE.MeshStandardMaterial({
        map: roadTexture,
        transparent: true,
        alphaTest: 0.5,
      })
    );
    roadMesh.position.set(x, y, z);
    roadMesh.rotation.x = -Math.PI / 2;
    scene.add(roadMesh);
  }
  createRoad(0, -3.4, 0);
  createRoad(30, -3.4, 0);
  createRoad(60, -3.4, 0); // 이어붙여놨음

  const loader = new THREE.GLTFLoader();
  let character;
  let mixer;

  let rotationSpeed = 0.2; // 회전 속도
  let movementSpeed = 0.2; // 이동 속도

  // 무당이 //
  loader.load("../model/mudang.gltf", (gltf) => {
    character = gltf.scene;
    scene.add(character);

    character.position.set(0, -45, 0);
    character.castShadow = true;
    character.receiveShadow = true;

    const directionalLight = new THREE.DirectionalLight("white", 0.7);
    const directionalLightOriginPosition = new THREE.Vector3(1, 1, 1);
    directionalLight.position.x = directionalLightOriginPosition.x;
    directionalLight.position.y = directionalLightOriginPosition.y;
    directionalLight.position.z = directionalLightOriginPosition.z;
    directionalLight.castShadow = true;

    //그림자 퀄리티 설정
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    //그림자 범위
    directionalLight.shadow.camera.left = -100;
    directionalLight.shadow.camera.right = 100;
    directionalLight.shadow.camera.top = 100;
    directionalLight.shadow.camera.bottom = -100;
    directionalLight.shadow.camera.near = 0.1;
    directionalLight.shadow.camera.far = 100;
    scene.add(directionalLight);

    const ambientLight = new THREE.AmbientLight(0x404040); // 회색 환경 조명
    scene.add(ambientLight);

    mixer = new THREE.AnimationMixer(gltf.scene);

    const action = mixer.clipAction(gltf.animations[0]);
    action.play();

    camera.position.set(2, 5, 10);
    camera.lookAt(character.position);

    animate();
  });

  // 통나무 //
  loader.load("../model/log_stump/scene.gltf", (gltf) => {
    const log_stump = gltf.scene.children[0];
    scene.add(log_stump);

    log_stump.position.set(5, -3.5, 5); //위치 설정 (x,y,z)
    log_stump.scale.set(0.01, 0.01, 0.01); // 크기 조절
    log_stump.castShadow = true;
    log_stump.receiveShadow = true;

    const light = new THREE.DirectionalLight(0xffffff, 1);

    light.position.set(5, 0, 5);

    light.castShadow = true;

    scene.add(light);

    animate();
  });

  // 깃발 //
  loader.load("../model/flag/scene.gltf", (gltf) => {
    const flag = gltf.scene;
    scene.add(flag);

    flag.position.set(6, 0, 5);

    flag.scale.set(1, 1, 1);

    flag.castShadow = true;
    flag.receiveShadow = true;

    animate();
  });

  // 큐브 ( AI 공학관 ) //
  loader.load("../model/cube/scene.gltf", (gltf) => {
    const cube = gltf.scene;
    scene.add(cube);

    cube.position.set(-5, 0, 5);
    cube.scale.set(30, 30, 30);

    cube.castShadow = true;
    cube.receiveShadow = true;

    animate();
  });

  // 바람개비 ( 바람개비 동산 ) //
  loader.load("../model/pinwheel/scene.gltf", (gltf) => {
    const pinwheel = gltf.scene;
    scene.add(pinwheel);

    pinwheel.position.set(7, 0, 5);
    pinwheel.scale.set(30, 30, 30);

    pinwheel.castShadow = true;
    pinwheel.receiveShadow = true;

    animate();
  });

  // 무한대 ( 가천관 ) //
  loader.load("../model/infinity_loop/scene.gltf", (gltf) => {
    const infinity_loop = gltf.scene;
    scene.add(infinity_loop);

    infinity_loop.position.set(2, 3.5, 0);
    infinity_loop.scale.set(0.01, 0.01, 0.01);
    infinity_loop.castShadow = true;
    infinity_loop.receiveShadow = true;

    infinity_loop.rotation.z = Math.PI / 2;

    animate();
  });

  let rotationAngle = 0; // 현재 회전 각도

  // 무당이 조작 //
  document.addEventListener("keydown", (event) => {
    switch (event.key) {
      case "w":
        // w 키 : 전진
        mixer.timeScale = 3;
        mixer.clipAction(mixer._actions[0].getClip()).play();
        character.position.x += Math.sin(rotationAngle) * movementSpeed;
        character.position.z += Math.cos(rotationAngle) * movementSpeed;
        break;
      case "s":
        // s 키 : 후진
        mixer.timeScale = -3;
        mixer.clipAction(mixer._actions[0].getClip()).play();
        character.position.x -= Math.sin(rotationAngle) * movementSpeed;
        character.position.z -= Math.cos(rotationAngle) * movementSpeed;
        break;
      case "a":
        // a 키 : 좌측으로 회전
        mixer.timeScale = 0;
        rotationAngle += rotationSpeed;
        character.rotation.y = rotationAngle;
        break;
      case "d":
        // d 키 : 우측으로 회전
        mixer.timeScale = 0;
        rotationAngle -= rotationSpeed;
        character.rotation.y = rotationAngle;
        break;
    }
  });
  document.addEventListener("keyup", (event) => {
    // 키 안 눌렀을 때 멈추기
    mixer.timeScale = 0;
  });

  function animate() {
    requestAnimationFrame(animate);

    //카메라 위치 업데이트
    camera.position.x = character.position.x + 2; // x 위치를 캐릭터와 일치
    camera.position.z = character.position.z + 10; // 뒤에서 캐릭터를 바라보도록 설정
    camera.position.y = character.position.y + 5; // 머리 위에서 조금 떨어진 위치

    camera.lookAt(character.position);

    // 모델의 애니메이션 업데이트
    if (mixer) {
      mixer.update(0.003); //애니메이션 재생 속도
    }

    renderer.render(scene, camera);
  }
});