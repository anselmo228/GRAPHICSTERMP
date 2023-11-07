var comments = ["EASY", "MEDIUM", "HARD"]; // level 코멘트 배열에서 항목을 줄입니다.
var myLevel = document.getElementById("level");
var myScore = document.getElementById("score");
var progressBar = document.getElementById("progress-bar");

// Initialize Three.js scene, camera, and renderer
var scene = new THREE.Scene();

// Calculate the desired size of the camera's view
var desiredWidth = 600; // Adjust this as needed
var aspectRatio = window.innerWidth / window.innerHeight;
var desiredHeight = desiredWidth / aspectRatio;


var camera = new THREE.OrthographicCamera(
  -desiredWidth / 2,
  desiredWidth / 2,
  desiredHeight / 2,
  -desiredHeight / 2,
  0.1,
  1000
);

var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("webgl-container").appendChild(renderer.domElement);

// Define player and missile geometries and materials
var playerGeometry = new THREE.SphereGeometry(10, 32, 32);
var playerMaterial = new THREE.MeshPhongMaterial({
  color: 0x0727CA,
  specular: 0xffffff, // Specular highlight color
});
var playerMesh = new THREE.Mesh(playerGeometry, playerMaterial);
playerMesh.position.set(0, 0, 300); // Adjust player's initial position
scene.add(playerMesh);

var missileGeometry = new THREE.SphereGeometry(5, 32, 32);
var missileMaterial = new THREE.MeshPhongMaterial({
  color: 0x07A852,
  specular: 0xffffff, // Specular highlight color
});

// Create an array to hold missile meshes
var missileMeshes = [];

var scoreGeometry = new THREE.SphereGeometry(5, 32, 32);
var scoreMaterial = new THREE.MeshPhongMaterial({
  color: 0xFFD500,
  specular: 0xffffff, // Specular highlight color
});

// Create an array to hold missile meshes
var scoreMeshes = [];


var directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(0, 499, 0);
scene.add(directionalLight);

var ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambientLight);

// Game state variables
var gameOver = false;
var score = 0;
var time = 0;
var player = {
  x: 0,
  y: 0,
  radius: 20
};
var level = 1;
var totalLevels = 3; // level 수를 3으로 수정합니다.
var score = 0;
var speed = 800;
var maxScore = 500;

document.addEventListener('mousemove', function (event) {
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

  if (gameOver) {
    score = 0;
    gameOver = false;
    restartScene();

    if (level == 1) {
      modal2.style.display = "block";
      myLevel.innerText = comments[level - 1];
    }
  }

  if(score < maxScore){
    if (time % 50 == 0) {  // Create a missile every 1000 milliseconds (1 second)
      var x = (Math.random() * 2 - 1) * 300;
      var missileMesh = new THREE.Mesh(missileGeometry, missileMaterial);
      missileMesh.position.set(x, 300, 0); // Start missiles at the top of the window
      scene.add(missileMesh);
      missileMeshes.push(missileMesh);
    }

    if (time % 10 == 0) {  // Create a missile every 1000 milliseconds (1 second)
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
          //popMissile(missileMeshes[i]);
          missileMeshes.splice(i, 1);
          i--;
          score-=100;
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
          //popMissile(missileMeshes[i]);
          scoreMeshes.splice(i, 1);
          i--;
          score+=100;
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
    speed /= 2;
    maxScore += 500;
    level += 1;
  } else {
    speed = 800;
    maxScore = 500;
    level = 1;
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
};

restartBtn.onclick = function () {
  modal2.style.display = "none"; // 시작 버튼을 누르면 모달이 사라집니다.
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
  }
  if (event.target == modal2) {
    modal2.style.display = "none"; // 모달 바깥을 누르면 모달이 사라집니다.
  }
};

window.onload = function () {
  modal1.style.display = "block";
  myLevel.innerText = comments[level - 1];

  // Set up camera position
  camera.position.z = 600;

  // Start the game loop
  requestAnimationFrame(gameLoop);
};