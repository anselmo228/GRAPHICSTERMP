var scene;
var cube;
var camera;
var renderer;
var clock;
var holder;
var intersects;
var particles = [];
var level = 1;
var totalLevels = 3; // level 수를 3으로 수정합니다.
var score = 0;
var totalTargets = 3;
var speed = 0.01;
var complete = false;
var comments = ["EASY", "MEDIUM", "HARD"]; // level 코멘트 배열에서 항목을 줄입니다.
var myLevel = document.getElementById("level");
var myScore = document.getElementById("score");
var progressBar = document.getElementById("progress-bar");

var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();

function myScene() {
  scene = new THREE.Scene();
  var light = new THREE.AmbientLight(0xffffff);
  var width = window.innerWidth;
  var height = window.innerHeight;
  camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
  camera.position.z = 18;

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(width, height);
  document.getElementById("webgl-container").appendChild(renderer.domElement);
  clock = new THREE.Clock();

  var sLight = new THREE.SpotLight(0xffffff);
  sLight.position.set(-100, 100, 100);
  scene.add(sLight);

  var aLight = new THREE.AmbientLight(0xffffff);
  scene.add(aLight);

  addStars();
}

function addStars() {
  var totalStars = 100; // 그릴 총 별의 수

  for (var i = 0; i < totalStars; i++) {
    var geometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
    var material = new THREE.MeshBasicMaterial({ color: 0xffffff }); // 흰색 별을 그립니다.
    var star = new THREE.Mesh(geometry, material);

    // 랜덤한 위치에 별을 배치합니다.
    star.position.x = Math.random() * 20 - 10;
    star.position.y = Math.random() * 20 - 10;
    star.position.z = Math.random() * 20 - 10;

    scene.add(star); // 씬에 별을 추가합니다.
  }
}

function spinner() {
  var geometry = new THREE.IcosahedronGeometry(1, 0);
  var material = new THREE.MeshPhongMaterial({
    color: 0x808080, // 회색으로 변경
    emissive: "#004593", // 변경된 부분
  });

  var sphere = new THREE.Mesh(geometry, material);
  sphere.position.x = 10;
  var spinner = new THREE.Object3D();
  spinner.rotation.x = 6;

  spinner.add(sphere);
  scene.add(spinner);
}

function addHolder() {
  holder = new THREE.Object3D();
  holder.name = "holder";

  for (var i = 1; i < totalTargets + 1; i++) {
    var ranCol = new THREE.Color();
    ranCol.setRGB(Math.random(), Math.random(), Math.random());

    var geometry = new THREE.IcosahedronGeometry(1.5, 0); // 변경된 부분
    var material = new THREE.MeshPhongMaterial({
      color: 0x808080, // 회색으로 변경
      ambient: "#004593", // 변경된 부분
    });

    var sphere = new THREE.Mesh(geometry, material); // 변경된 부분
    sphere.position.x = i * 5;
    sphere.name = "sphereName" + i; // 변경된 부분

    var spinner = new THREE.Object3D();
    spinner.rotation.x = i * 2.5 * Math.PI;
    spinner.name = "spinnerName" + i;

    spinner.add(sphere); // 변경된 부분
    holder.add(spinner);
  }
  scene.add(holder);
}

function addExplosion(point) {
  var timeNow = clock.getElapsedTime();

  for (var i = 0; i < 30; i++) {
    var geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);

    // 랜덤 색상 생성
    var randomColor = new THREE.Color();
    randomColor.setRGB(Math.random(), Math.random(), Math.random());

    var material = new THREE.MeshBasicMaterial({ color: randomColor });
    var part = new THREE.Mesh(geometry, material);
    part.position.x = point.x;
    part.position.y = point.y;
    part.position.z = point.z;
    part.name = "part" + i;
    part.birthDay = timeNow;

    var randomVelocity = new THREE.Vector3(
      Math.random() - 0.5,
      Math.random() - 0.5,
      Math.random() - 0.5
    );
    part.velocity = randomVelocity.multiplyScalar(1); // 파티클의 속도 설정

    scene.add(part);
    particles.push(part);
  }
}

function animate() {
  requestAnimationFrame(animate);
  render();

  if (particles.length > 0) {
    particles.forEach(function (elem, index, array) {
      elem.position.add(elem.velocity); // 파티클 이동

      if (elem.birthDay - clock.getElapsedTime() < -1) {
        scene.remove(elem);
        particles.splice(index, 1);
      }
    });
  }
}

function render() {
  holder.children.forEach(function (elem, index, array) {
    elem.rotation.y += speed * (6 - index);
    elem.children[0].rotation.x += 0.01;
    elem.children[0].rotation.y += 0.01;
  });

  if (particles.length > 0) {
    particles.forEach(function (elem, index, array) {
      switch (elem.name) {
        case "part0":
          elem.position.x += 1;
          break;
        case "part1":
          elem.position.x -= 1;
          break;
        case "part2":
          elem.position.y += 1;
          break;
        case "part3":
          elem.position.y -= 1;
          break;
        default:
          break;
      }

      if (elem.birthDay - clock.getElapsedTime() < -1) {
        scene.remove(elem);
        particles.splice(index, 1);
      }
    });
  }

  renderer.render(scene, camera);
}

function onDocumentMouseDown(event) {
  event.preventDefault();

  if (complete) {
    complete = false;
    score = 0;
    restartScene();
    return;
  }

  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  if (score < totalTargets) {
    holder.children.forEach(function (elem, index, array) {
      intersects = raycaster.intersectObjects(elem.children);
      if (intersects.length > 0 && intersects[0].object.visible) {
        intersects[0].object.visible = false;

        addExplosion(intersects[0].point);
        score += 1;

        if (score < totalTargets) {
          myScore.innerHTML =
            "<span class='hit'></span> Score: " + score + "/" + totalTargets;
        } else {
          complete = true;

          if (level < totalLevels) {
            myScore.innerHTML =
              "<strong>You got 'em all!</strong> Click the screen for level " +
              (level + 1) +
              ".";
          } else {
            myScore.innerHTML =
              "<strong>You win!</strong> Click the screen to play again.";
          }
        }
        updateProgressBar(); // 여기서 호출
      }
    });
  }
}

function restartScene() {
  myScore.innerHTML = "";

  if (level < totalLevels) {
    speed += 0.001;
    totalTargets += 1;
    level += 1;
  } else {
    speed = 0.01;
    totalTargets = 3;
    level = 1;
  }

  myLevel.innerText = comments[level - 1];
  scene.remove(holder);
  addHolder();
  updateProgressBar(); // 여기서 호출
}

function updateProgressBar() {
  var progress = (score / totalTargets) * 100;
  progressBar.style.width = progress + "%";
}

document
  .getElementById("webgl-container")
  .addEventListener("mousedown", onDocumentMouseDown, false);

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);

  render();
}

window.onload = function () {
  myLevel.innerText = comments[level - 1];
  myScene();
  addHolder();
  animate();

  window.addEventListener("resize", onWindowResize, false);
};
