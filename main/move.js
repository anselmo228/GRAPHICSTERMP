document.addEventListener("DOMContentLoaded", function () {
  const clock = new THREE.Clock();

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x87ceeb); // 배경색 하늘색으로
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  const directionalLight = new THREE.DirectionalLight("white", 0.25); // 1은 높은 강도를 나타냄

  scene.add(directionalLight);

  const renderer = new THREE.WebGLRenderer({ antialias: true });

  //바닥 이미지
  const textureLoader = new THREE.TextureLoader();
  const floorTexture = textureLoader.load("../images/monun.jpg");
  const roadTexture = textureLoader.load("../images/road.png");

  const infin = new THREE.Vector3(-30, 0, -36); // 무한대
  const cu = new THREE.Vector3(-36, -2, -15); // 큐브
  const vis = new THREE.Vector3(-2, -4, -2);
  const exer = new THREE.Vector3(-1, -3.31, 56);
  const proximityThreshold = 5.0; // Set the proximity threshold within which the action will be triggered
  const walk = new Audio("../sound/walking.mp3");

  floorTexture.wrapS = THREE.RepeatWrapping;
  floorTexture.wrapT = THREE.RepeatWrapping;
  floorTexture.repeat.x = 10;
  floorTexture.repeat.y = 10;

  //바닥 풀 Mesh
  const meshes = [];
  const spaceMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(150, 150),
    new THREE.MeshStandardMaterial({
      map: floorTexture,
    })
  );

  spaceMesh.name = "floor";
  spaceMesh.position.set(0, -3.5, 0);
  spaceMesh.rotation.x = -Math.PI / 2;
  spaceMesh.receiveShadow = true;
  scene.add(spaceMesh);
  meshes.push(spaceMesh);

  // 바닥 이미지 텍스쳐
  const exersiceTexture = textureLoader.load("../images/exercise.jpg");
  const start_wordTexture = textureLoader.load("../images/start_word1.png");
  const start_wordTexture2 = textureLoader.load("../images/start_word2.png");
  const start_wordTexture3 = textureLoader.load("../images/start_word3.png");
  const start_wordTexture4 = textureLoader.load("../images/start_word4.png");
  const playGroundTexture = textureLoader.load("../images/playground.png");
  const moodangTexture = textureLoader.load("../images/moodang.png");
  const somangTexture = textureLoader.load("../images/somang.png");
  const busTexture = textureLoader.load("../images/bus.png");
  const bigRoadTexture = textureLoader.load("../images/big_road.png");
  const road2Texture = textureLoader.load("../images/road2.png");
  const apeachTexture = textureLoader.load("../images/apeach.png");
  const ryanTexture = textureLoader.load("../images/ryan.png");
  const last_wordTexture = textureLoader.load("../images/finish_word1.png");
  const last_wordTexture2 = textureLoader.load("../images/finish_word2.png");
  const last_wordTexture3 = textureLoader.load("../images/finish_word3.png");

  function createImage(x, y, z, texture, size_x, size_y, rotation) {
    const imageMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(size_x, size_y),
      new THREE.MeshStandardMaterial({
        map: texture,
        transparent: true,
        alphaTest: 0.5,
      })
    );
    imageMesh.position.set(x, y, z);

    imageMesh.rotation.x = -Math.PI / 2;
    imageMesh.rotation.z = -Math.PI;

    if (rotation == 1) {
      imageMesh.rotation.z += -Math.PI / 2;
    }

    scene.add(imageMesh);
  }

  // 과제면제권
  createImage(15, -3.3, -50, exersiceTexture, 10, 10);

  // 시작점 문장 4개
  createImage(0, -3.3, -50, start_wordTexture, 10, 5);
  createImage(0, -3.3, -53, start_wordTexture2, 14, 5);
  createImage(0, -3.3, -57, start_wordTexture3, 14, 5);
  createImage(0, -3.3, -60, start_wordTexture4, 16, 5);

  // 운동장
  createImage(-20, -3.3, -50, playGroundTexture, 20, 20);

  // 무당이
  createImage(0, -3.31, -26.5, moodangTexture, 13, 10);

  // 소망 로고
  createImage(-12, -3.31, -27.5, somangTexture, 13, 10);

  // 셔틀버스
  createImage(12, -3.31, -35.5, busTexture, 13, 10);

  // 큰길
  createImage(-12, -3.31, -25.5, bigRoadTexture, 40, 60);
  createImage(1.7, -3.31, 22, last_wordTexture, 10, 5);
  createImage(1.7, -3.31, 18, last_wordTexture2, 25, 5);
  createImage(1.7, -3.31, 14, last_wordTexture3, 25, 5);
  createImage(-1, -3.31, 37.5, road2Texture, 33, 33);
  createImage(1.7, -3.31, 58, exersiceTexture, 20, 20);

  // 라이언
  createImage(12, -3.31, -15.5, ryanTexture, 10, 10);

  // 어피치
  createImage(-10, -3.31, -8.5, apeachTexture, 10, 10);

  // 퀘스트 진행 여부 확인 로직
  var infinityImage = document.getElementById("infinity");
  var cubeImage = document.getElementById("cube");
  var visionImage = document.getElementById("vision");

  const checkGame1 = window.localStorage.getItem("game1");
  const checkGame2 = window.localStorage.getItem("game2");
  const checkGame3 = window.localStorage.getItem("game3");

  if (checkGame1 != null) {
    infinityImage.src = "image/infinity_check.png";
  }

  if (checkGame2 != null) {
    cubeImage.src = "image/cube_check.png";
  }

  if (checkGame3 != null) {
    visionImage.src = "image/vision_check.png";
  }

  renderer.setSize(window.innerWidth, window.innerHeight);
  document.getElementById("scene-container").appendChild(renderer.domElement);

  const loader = new THREE.GLTFLoader();
  let character;
  let mixer;

  let rotationSpeed = 0.1; // 회전 속도
  let movementSpeed = 0.5; // 이동 속도

  const currentX = localStorage.getItem("x");
  const currentY = localStorage.getItem("y");
  const currentZ = localStorage.getItem("z");

  // 무당이 //
  loader.load("../model/mudang.gltf", (gltf) => {
    character = gltf.scene;
    scene.add(character);

    if (currentX != null && currentY != null && currentZ != null) {
      character.position.set(
        parseInt(currentX),
        parseInt(currentY),
        parseInt(currentZ)
      );
    } else {
      character.position.set(0, -1, -63);
    }

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

    camera.position.set(2, 7, 8);
    camera.lookAt(character.position);

    animate();
  });

  // 깃발
  loader.load("../model/flag/scene.gltf", (gltf) => {
    const flag = gltf.scene;
    scene.add(flag);

    flag.position.set(0, 0, -66);

    flag.scale.set(2, 2, 2);

    flag.castShadow = true;
    flag.receiveShadow = true;

    animate();
  });

  // 무한대 ( 가천관 )
  loader.load("../model/infinity_loop/scene.gltf", (gltf) => {
    const infinity_loop = gltf.scene;
    scene.add(infinity_loop);

    infinity_loop.position.set(-30, 0, -36);
    infinity_loop.scale.set(0.01, 0.01, 0.01);
    infinity_loop.castShadow = true;
    infinity_loop.receiveShadow = true;

    infinity_loop.rotation.y = -Math.PI / 2;
    infinity_loop.rotation.z = -Math.PI / 2;

    animate();
  });

  // 큐브 ( AI 공학관 ) //
  loader.load("../model/cube/scene.gltf", (gltf) => {
    const cube = gltf.scene;
    scene.add(cube);

    cube.position.set(-36, -2, -15);
    cube.scale.set(3, 3, 3);

    cube.castShadow = true;
    cube.receiveShadow = true;

    animate();
  });

  // 비전타워 //
  loader.load("../model/vision/scene.gltf", (gltf) => {
    const vision = gltf.scene;
    scene.add(vision);

    vision.position.set(-2, -4, -2);
    vision.scale.set(0.6, 0.6, 0.6);

    vision.castShadow = true;
    vision.receiveShadow = true;
    vision.rotation.set(0, 1.6, 0);

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
        walk.play();
        break;
      case "s":
        // s 키 : 후진
        mixer.timeScale = -3;
        mixer.clipAction(mixer._actions[0].getClip()).play();
        character.position.x -= Math.sin(rotationAngle) * movementSpeed;
        character.position.z -= Math.cos(rotationAngle) * movementSpeed;
        walk.play();
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

  const start = new Audio("../sound/game_start.mp3");

  //3인칭 전면 시점
  function animate() {
    requestAnimationFrame(animate);

    //카메라 위치 업데이트
    camera.position.x = character.position.x; // x 위치를 캐릭터와 일치
    camera.position.z = character.position.z - 10; // 뒤에서 캐릭터를 바라보도록 설정
    camera.position.y = character.position.y + 9; // 머리 위에서 조금 떨어진 위치

    camera.lookAt(character.position);

    // 모델의 애니메이션 업데이트
    if (mixer) {
      mixer.update(0.008); //애니메이션 재생 속도
    }

    if (character) {
      const distance = character.position.distanceTo(infin);
      const distance1 = character.position.distanceTo(cu);
      const distance2 = character.position.distanceTo(vis);
      const distance3 = character.position.distanceTo(exer);

      if (distance < proximityThreshold) {
        start.play();
        setTimeout(function () {
          window.location.href = "../loading/loading.html";
        }, 500);
        return;
      }
      if (distance1 < proximityThreshold) {
        start.play();
        setTimeout(function () {
          window.location.href = "../SUBERUNKER/loading/loading.html";
        }, 500);
        return;
      }
      if (distance2 < proximityThreshold) {
        start.play();
        setTimeout(function () {
          window.location.href = "../RYTHMGAME/loading/loading.html";
        }, 500);
        return;
      }
      if (distance3 < 10) {
        start.play();
        setTimeout(function () {
          window.location.href = "../ending/exercise.html";
        }, 300);
        return;
      }
    }

    renderer.render(scene, camera);
  }
  animate();
});
