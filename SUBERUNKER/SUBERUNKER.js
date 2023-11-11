var comments = ["EASY", "MEDIUM", "HARD"];
var myLevel = document.getElementById("level");
var myScore = document.getElementById("score");
var progressBar = document.getElementById("progress-bar");

var missileAudio = new Audio("assets/Crash.mp3");
var scoreAudio = new Audio("assets/Coin.mp3");
var BGM = new Audio("assets/bgm.mp3");

var scene, camera, renderer, playerMesh, missileMeshes, scoreMeshes;
var playerGeometry,
  playerMaterial,
  missileGeometry,
  missileMaterial,
  scoreGeometry,
  scoreMaterial;
var directionalLight, ambientLight;

var gameOver = false;
var score = 0;
var time = 0;
var player = {
  x: 0,
  y: 0,
  radius: 20,
};
var level = 1;
var totalLevels = 3;
var speed = 300;
var maxScore = 500;
var waitForRestart = true;
var complete = false;

function init() {
  scene = new THREE.Scene();

  missileAudio.load();
  scoreAudio.load();
  BGM.load();

  missileAudio.volume = 0.3; // 음량 설정
  scoreAudio.volume = 0.3; // 음량 설정
  BGM.volume = 0.3; // 음량 설정

  var desiredWidth = 600;
  var aspectRatio = window.innerWidth / window.innerHeight;
  var desiredHeight = desiredWidth / aspectRatio;

  camera = new THREE.OrthographicCamera(
    -desiredWidth / 2,
    desiredWidth / 2,
    desiredHeight / 2,
    -desiredHeight / 2,
    0.1,
    1000
  );

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.getElementById("webgl-container").appendChild(renderer.domElement);

  playerGeometry = new THREE.SphereGeometry(10, 32, 32);
  playerMaterial = new THREE.MeshPhongMaterial({
    color: 0x0727ca,
    specular: 0xffffff,
  });
  playerMesh = new THREE.Mesh(playerGeometry, playerMaterial);
  playerMesh.position.set(0, 0, 300);
  scene.add(playerMesh);

  missileGeometry = new THREE.SphereGeometry(5, 32, 32);
  missileMaterial = new THREE.MeshPhongMaterial({
    color: 0x07a852,
    specular: 0xffffff,
  });

  missileMeshes = [];
  scoreGeometry = new THREE.SphereGeometry(5, 32, 32);
  scoreMaterial = new THREE.MeshPhongMaterial({
    color: 0xffd500,
    specular: 0xffffff,
  });

  scoreMeshes = [];

  directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
  directionalLight.position.set(0, 499, 0);
  scene.add(directionalLight);

  ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
  scene.add(ambientLight);
}

document.addEventListener("mousemove", function (event) {
  if (!gameOver) {
    // Get the canvas size
    var canvasWidth = window.innerWidth;
    var canvasHeight = window.innerHeight;

    // Calculate the aspect ratio of the camera
    var aspectRatio = canvasWidth / canvasHeight;

    // Calculate the width and height of the camera's view
    var cameraWidth = camera.right - camera.left;
    var cameraHeight = camera.top - camera.bottom;

    // Calculate the updated player position
    player.x = (event.clientX / canvasWidth) * cameraWidth + camera.left;
    player.y = -(event.clientY / canvasHeight) * cameraHeight + camera.top;

    // Update the player's position based on the mouse coordinates
    playerMesh.position.x = player.x;
    playerMesh.position.y = player.y;
  }
});

// Game loop
function gameLoop() {
  BGM.play();
  BGM.loop = true;

  if (waitForRestart) {
    return; // If waiting for restart, do not continue the game loop
  }

  if (gameOver) {
    score = 0;
    gameOver = false;
    restartScene();

    if (level == 1) {
      modal2.style.display = "block";
      myLevel.innerText = comments[level - 1];
      waitForRestart = true; // Set the flag to wait for restart
    }
  }

  if (score < maxScore) {
    if (time % 50 == 0) {
      // Create a missile every 1000 milliseconds (1 second)
      var x = (Math.random() * 2 - 1) * 300;
      var missileMesh = new THREE.Mesh(missileGeometry, missileMaterial);
      missileMesh.position.set(x, 300, 0); // Start missiles at the top of the window
      scene.add(missileMesh);
      missileMeshes.push(missileMesh);
    }

    if (time % 10 == 0) {
      // Create a missile every 1000 milliseconds (1 second)
      var x = (Math.random() * 2 - 1) * 300;
      var scoreMesh = new THREE.Mesh(scoreGeometry, scoreMaterial);
      scoreMesh.position.set(x, 300, 0); // Start missiles at the top of the window
      scene.add(scoreMesh);
      scoreMeshes.push(scoreMesh);
    }

    time++;

    for (var i = 0; i < missileMeshes.length; i++) {
      missileMeshes[i].position.y -= 5 + time / speed; // Move missile meshes up the screen

      if (missileMeshes[i].position.y < -100) {
        scene.remove(missileMeshes[i]);
        missileMeshes.splice(i, 1);
        i--;
      } else {
        var distance = Math.sqrt(
          Math.pow(playerMesh.position.x - missileMeshes[i].position.x, 2) +
            Math.pow(playerMesh.position.y - missileMeshes[i].position.y, 2)
        );

        if (distance < player.radius + 10) {
          scene.remove(missileMeshes[i]);
          missileMeshes.splice(i, 1);
          i--;
          score -= 100;
          missileAudio.currentTime = 0; // 재생 위치를 처음으로 설정
          missileAudio.play();
        }
      }
    }

    for (var i = 0; i < scoreMeshes.length; i++) {
      scoreMeshes[i].position.y -= 5 + time / speed; // Move missile meshes up the screen

      if (scoreMeshes[i].position.y < -100) {
        scene.remove(scoreMeshes[i]);
        scoreMeshes.splice(i, 1);
        i--;
      } else {
        var distance = Math.sqrt(
          Math.pow(playerMesh.position.x - scoreMeshes[i].position.x, 2) +
            Math.pow(playerMesh.position.y - scoreMeshes[i].position.y, 2)
        );

        if (distance < player.radius + 10) {
          scene.remove(scoreMeshes[i]);
          scoreMeshes.splice(i, 1);
          i--;
          score += 100;
          scoreAudio.currentTime = 0; // 재생 위치를 처음으로 설정
          scoreAudio.play();
        }
      }
    }
  }

  if (score < maxScore) {
    myScore.innerHTML =
      "<span class='hit'></span> Score: " + score + "/" + maxScore;
  } else {
    gameOver = true;
  }
  updateProgressBar(); // 여기서 호출

  // Render the scene
  renderer.render(scene, camera);
  // Request the next frame
  requestAnimationFrame(gameLoop);
}

function restartScene() {
  myScore.innerHTML = "";

  if (level < totalLevels) {
    speed /= 1.1;
    maxScore += 500;
    level += 1;
  } else {
    speed = 300;
    maxScore = 500;
    level = 1;
    if (totalLevels == 3) {
      complete = true;
      restartBtn.innerText = "Go to Main";
    }
  }

  myLevel.innerText = comments[level - 1];
  updateProgressBar(); // 여기서 호출
}

function updateProgressBar() {
  var progress = (score / maxScore) * 100;
  progressBar.style.width = progress + "%";
}

// 모달 창 띄우기
var modal1 = document.getElementById("modal1");
var modal2 = document.getElementById("modal2");
var startBtn = document.getElementById("startGame");
var restartBtn = document.getElementById("RestartGame");
var closeBtn1 = document.getElementsByClassName("close1")[0];
var closeBtn2 = document.getElementsByClassName("close2")[0];

startBtn.onclick = function () {
  modal1.style.display = "none"; // 시작 버튼을 누르면 모달이 사라집니다.
  waitForRestart = false; // Reset the flag when restart button is clicked
  restartGame();
};

restartBtn.onclick = function () {
  if (complete === true) {
    window.localStorage.setItem("x", "-25");
    window.localStorage.setItem("y", "-2");
    window.localStorage.setItem("z", "-15");
    window.localStorage.setItem("game2", "true");
    window.location.href = "../main/main.html";
  }

  modal2.style.display = "none"; // 시작 버튼을 누르면 모달이 사라집니다.
  waitForRestart = false; // Reset the flag when restart button is clicked
  restartGame();
};

closeBtn1.onclick = function () {
  modal1.style.display = "none"; // 닫기 버튼을 누르면 모달이 사라집니다.
};

closeBtn2.onclick = function () {
  modal2.style.display = "none"; // 닫기 버튼을 누르면 모달이 사라집니다.
};

window.onclick = function (event) {
  if (event.target == modal1) {
    modal1.style.display = "none"; // 모달 바깥을 누르면 모달이 사라집니다.
    waitForRestart = false; // Reset the flag when restart button is clicked
  }
  if (event.target == modal2) {
    modal2.style.display = "none"; // 모달 바깥을 누르면 모달이 사라집니다.
    waitForRestart = false; // Reset the flag when restart button is clicked
  }
};

function restartGame() {
  waitForRestart = false; // Reset the flag when restart game is called
  missileMeshes.forEach((mesh) => scene.remove(mesh));
  scoreMeshes.forEach((mesh) => scene.remove(mesh));
  missileMeshes = [];
  scoreMeshes = [];
  requestAnimationFrame(gameLoop);
}

window.onload = function () {
  init();

  modal1.style.display = "block";
  myLevel.innerText = comments[level - 1];

  // Set up camera position
  camera.position.z = 600;

  // Start the game loop
  requestAnimationFrame(gameLoop);
};
