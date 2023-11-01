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

  loader.load("model/mudang.glb", (gltf) => {
    character = gltf.scene;
    scene.add(character);

    // 이곳에 캐릭터의 초기 위치, 회전 및 크기를 설정할 수 있습니다.
    character.position.set(0, 0, 0);

    camera.position.z = 5;

    animate();
  });

  function animate() {
    requestAnimationFrame(animate);

    // 이곳에 움직임 논리를 추가하세요.

    renderer.render(scene, camera);
  }
});
