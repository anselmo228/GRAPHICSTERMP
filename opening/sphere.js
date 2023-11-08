
var renderer, scene, camera, composer, planet, mixer, clock;
var stars=[];

window.onload = function() {
  init();
  addSphere();
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

  // 행성 초기화
  planet = new THREE.Object3D();
  scene.add(planet);

  planet.position.y = -180;

  // 행성 지오메트리와 재질 설정
  var geom = new THREE.IcosahedronGeometry(15, 2);
  var mat = createMaterial(); // 사용자 정의 재질 설정
  var mesh = new THREE.Mesh(geom, mat);
  mesh.scale.x = mesh.scale.y = mesh.scale.z = 17;
  planet.add(mesh);

  // 주변 조명 설정
  var ambientLight = new THREE.AmbientLight(0xBD9779); // 환경 광 설정
  scene.add(ambientLight);

  var directionalLight = new THREE.DirectionalLight(0xffffff);
  directionalLight.position.set(1, 1, 1).normalize();
  scene.add(directionalLight);

  clock = new THREE.Clock();
  
  // 3D 모델 로드
  const loader = new THREE.GLTFLoader();
	loader.load('../model/mudang.gltf', function(gltf){
	  princess = gltf.scene;
	  princess.scale.set(20, 20 ,20);
    princess.position.x = 0;
    princess.position.y = 100;
    princess.position.z = 150;

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


function createMaterial(){
  // 디스코 텍스처 로드
  var discoTexture = THREE.ImageUtils.loadTexture("disco.jpeg");

  // 디스코 재질 생성
  var discoMaterial = new THREE.MeshBasicMaterial({
    // color: 0xBD9779,
    // shading: THREE.FlatShading
});

  // 디스코 텍스처를 디스코 재질의 맵으로 설정
  discoMaterial.map = discoTexture;

  return discoMaterial;
}

function animate() {
  // 애니메이션 프레임 요청
  requestAnimationFrame(animate);

  // 행성 회전 설정
  planet.rotation.x -= .001;
  planet.rotation.z = 0;
  planet.rotation.y = 0;

  renderer.clear(); // 렌더러 초기화

  // 시간 경과에 따른 모델 애니메이션 업데이트
  var delta = clock.getDelta();
	if ( mixer ) mixer.update( delta );

  // 별 애니메이션 실행
  animateStars();

  // 씬을 카메라로 렌더링
  renderer.render( scene, camera );
};


function addSphere(){

  // 루프를 통해 z 위치가 -1000에서 1000까지 이동하며 각 위치에 무작위 파티클을 추가합니다.
  for ( var x= -400; x < 400; x+=10 ) {

    // 구체를 만듭니다 (이전과 똑같음).
    var geometry   = new THREE.SphereGeometry(0.5, 32, 32)
    var material = new THREE.MeshBasicMaterial( {color: 0xffffff} );
    var sphere = new THREE.Mesh(geometry, material)

    // 이번에는 구체에 -500에서 500 범위 내의 무작위 x 및 y 위치를 지정합니다.
    sphere.position.z = Math.random() * 1000 - 500;
    sphere.position.y = Math.random() * 1000 - 500;

    // 그런 다음 루프에서의 z 위치 (카메라와의 거리)를 설정합니다.
    sphere.position.x = x;

    // 크기를 조절합니다.
    sphere.scale.x = sphere.scale.y = 4;

    // 씬에 구체를 추가합니다.

    scene.add( sphere );

    // 마지막으로 stars 배열에 구체를 추가합니다.
    stars.push(sphere); 
  }
}

function animateStars() { 
  // loop through each star
  for(var i=0; i<stars.length; i++) {
    star = stars[i]; 
    // and move it forward dependent on the mouseY position. 
    star.position.x -=  i/30;
    // if the particle is too close move it to the back
    if(star.position.x<-400) star.position.x+=800; 
  }
}