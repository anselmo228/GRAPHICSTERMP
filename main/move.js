// 스크립트를 작성할 때 반드시 DOM이 로드된 후 실행되도록 주의하세요.
document.addEventListener("DOMContentLoaded", function () {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  const renderer = new THREE.WebGLRenderer({ antialias: true });

  renderer.setSize(window.innerWidth, window.innerHeight);
  document.getElementById("scene-container").appendChild(renderer.domElement);

  const loader = new THREE.GLTFLoader();
  let character;

  loader.load("../model/mudang2.glb", (gltf) => {
    character = gltf.scene;
    scene.add(character);
    character.position.set(0, 0, 0);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1);
    character.add(directionalLight);

    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight2.position.set(0, 0, 0);
    character.add(directionalLight2);

    camera.position.z = 5;

    animate();
  });

  function animate() {
    requestAnimationFrame(animate);

    const movementSpeed = 0.01;

    document.addEventListener("keydown", (event) => {
      switch (event.key) {
        case "w":
          character.position.z -= movementSpeed;
          break;
        case "s":
          character.position.z += movementSpeed;
          break;
        case "a":
          character.position.x -= movementSpeed;
          break;
        case "d":
          character.position.x += movementSpeed;
          break;
      }
    });
    renderer.render(scene, camera);
  }
});
