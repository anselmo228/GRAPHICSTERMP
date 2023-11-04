document.addEventListener("DOMContentLoaded", function () {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  const renderer = new THREE.WebGLRenderer({ antialias: true });

  //바닥 생성
  const groundGeometry = new THREE.PlaneGeometry(20, 20); // 바닥 크기 설정
  const groundMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff }); // 바닥 색상 설정
  const ground = new THREE.Mesh(groundGeometry, groundMaterial);
  ground.position.set(0, -3.5, 0);
  ground.rotation.x = -Math.PI / 2; // 바닥을 수평으로 배치
  scene.add(ground);

  renderer.setSize(window.innerWidth, window.innerHeight);
  document.getElementById("scene-container").appendChild(renderer.domElement);

  const loader = new THREE.GLTFLoader();
  let character;
  let mixer;

  let rotationSpeed = 0.2; // 회전 속도
  let movementSpeed = 0.2; // 이동 속도

  loader.load("../model/mudang.gltf", (gltf) => {
    character = gltf.scene;
    scene.add(character);

    character.position.set(0, 0, 0);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1);
    character.add(directionalLight);

    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight2.position.set(-1, -1, -1);
    character.add(directionalLight2);

    const ambientLight = new THREE.AmbientLight(0x404040); // 회색 환경 조명
    scene.add(ambientLight);

    mixer = new THREE.AnimationMixer(gltf.scene);

    const action = mixer.clipAction(gltf.animations[0]);
    action.play();

    camera.position.set(2, 5, 10);
    camera.lookAt(character.position);

    animate();
  });

  let rotationAngle = 0; // 현재 회전 각도

  document.addEventListener("keydown", (event) => {
    switch (event.key) {
      case "w":
        // w 키 : 전진
        mixer.timeScale = 1.5;
        mixer.clipAction(mixer._actions[0].getClip()).play();
        character.position.x += Math.sin(rotationAngle) * movementSpeed;
        character.position.z += Math.cos(rotationAngle) * movementSpeed;
        break;
      case "s":
        // s 키 : 후진
        mixer.timeScale = -1.5;
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
      mixer.update(0.03); //애니메이션 재생 속도
    }

    renderer.render(scene, camera);
  }
});
