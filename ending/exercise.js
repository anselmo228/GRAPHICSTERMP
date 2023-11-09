
var renderer, scene, camera, composer, planet, mixer, clock;
var particleSystem;

window.onload = function() {
  init();
  animate();
}

function init() {
  // 렌더러 초기화
  renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true
  });
  renderer.setPixelRatio((window.devicePixelRatio) ? window.devicePixelRatio : 1);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.autoClear = false;
  document.getElementById('canvas').appendChild(renderer.domElement);

   // 씬 초기화
  scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0xA6CDFB, 1, 1000); // 안개 효과 설정

  // 카메라 초기화
  camera = new THREE.PerspectiveCamera(25, window.innerWidth / window.innerHeight, 1, 1000);
  camera.position.z = 400;
  camera.position.x = 0;
  camera.position.y = 100;
  scene.add(camera);

  // 주변 조명 설정
  var ambientLight = new THREE.AmbientLight(0x666666); // 더 어두운 ambient light
  scene.add(ambientLight);

  var directionalLight = new THREE.DirectionalLight(0x444444); // 더 어두운 directional light

  directionalLight.position.set(1, 1, 1).normalize();
  scene.add(directionalLight);

  clock = new THREE.Clock();

  // 이미지를 번갈아가면서 보여주는 코드 추가
  var starContainer = document.getElementById('starContainer');
  var star = document.getElementById('star');
  var star2 = document.getElementById('star2');
  var toggle = true;

  function toggleStar() {
    if (toggle) {
      star.style.display = 'none';
      star2.style.display = 'block';
    } else {
      star.style.display = 'block';
      star2.style.display = 'none';
    }
    toggle = !toggle;
  }

  // 최초 1초 후에 toggleStar 함수 호출
  setTimeout(function() {
    toggleStar();
    // 이후 1초 간격으로 toggleStar 함수 호출
    setInterval(toggleStar, 500); // 1000ms(1초) 간격으로 변경
  }, 500);

  // 3D 모델 로드
  const loader = new THREE.GLTFLoader();
	loader.load('../model/mudang.gltf', function(gltf){
	  mudang = gltf.scene;
	  mudang.scale.set(18, 18 ,18);
    mudang.position.x = 60;
    mudang.position.y = 85;
    mudang.position.z = 150;

    mudang.rotation.y = 150.5;

    mixer = new THREE.AnimationMixer(gltf.scene);

		var action = mixer.clipAction( gltf.animations[ 0 ] );
		action.play();
    
	  scene.add(gltf.scene);


	}, undefined, function (error) {
		console.error(error);
	});
  window.addEventListener('resize', onWindowResize, false);

};

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  // 애니메이션 프레임 요청
  requestAnimationFrame(animate);
  renderer.clear(); // 렌더러 초기화

  // 시간 경과에 따른 모델 애니메이션 업데이트
  var delta = clock.getDelta();
	if ( mixer ) mixer.update( delta );

  // 씬을 카메라로 렌더링
  renderer.render( scene, camera );
};