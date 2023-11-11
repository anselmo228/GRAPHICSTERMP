const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const tryAgainButton = document.getElementById("tryAgain");
const heartsContainer = document.querySelector(".hearts-container");

const arrowImages = {
  ArrowUp: new Image(),
  ArrowDown: new Image(),
  ArrowLeft: new Image(),
  ArrowRight: new Image(),
};

let theme = "MISSION IMPOSSIBLE OST";
let song;
const track1 = "./songs/missionimpossible.mp3";
const track2 = "./songs/Pirates of the Caribbean.mp3";
const track3 = "./songs/stranger-things-124008.mp3";
const over = new Audio("./songs/gameover.mp3");
const clear = new Audio("./songs/clear.mp3");
const arrowKeys = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];
const arrowSize = 70;
let arrowSpeed = 3;
const arrows = [];
const maxLives = 10;
let score = 0;
let lives = maxLives;
let isGameOver = false;

showPopup1("LEVEL1");

arrowImages.ArrowUp.src = "./asets/arrow_up.png";
arrowImages.ArrowDown.src = "./asets/arrow_down.png";
arrowImages.ArrowLeft.src = "./asets/arrow_left.png";
arrowImages.ArrowRight.src = "./asets/arrow_right.png";

// 추가: 하트 이미지 설정
const heartImage = new Image();
const heartSize = 25; // 하트 이미지 크기

function createArrow() {
  const direction = arrowKeys[Math.floor(Math.random() * 4)];
  const arrow = {
    x: Math.random() * (canvas.width - arrowSize),
    y: -arrowSize,
    key: direction,
    image: arrowImages[direction],
  };
  arrows.push(arrow);
}

function drawArrow(arrow) {
  ctx.drawImage(arrow.image, arrow.x, arrow.y, arrowSize, arrowSize);
}

function switchTrack() {
  if (score >= 35) {
    showPopup1("LEVEL2");
    arrowSpeed = 5;
  }
  if (score >= 65) {
    showPopup1("LEVEL3");
    arrowSpeed = 7;
  }
}

function showPopup(level) {
  let color = "black";

  if (level === "GOOD") {
    color = "green";
  } else if (level === "BAD") {
    color = "red";
  }

  // 모달 요소 생성
  const modal1 = document.createElement("div");
  modal1.className = "modal1";

  // 모달 내용 설정
  modal1.innerHTML = `<div class="modal1-content">${level}</div>`;

  // 모달 스타일 설정
  modal1.style.position = "fixed";
  modal1.style.top = "30%";
  modal1.style.left = "50%";
  modal1.style.transform = "translate(-50%, -50%)";
  modal1.style.backgroundColor = "white";
  modal1.style.color = color;
  modal1.style.padding = "20px";
  modal1.style.border = "2px solid black";
  modal1.style.borderRadius = "20px";

  // 모달을 body에 추가
  document.body.appendChild(modal1);

  // 1초 후 모달 제거
  setTimeout(() => {
    document.body.removeChild(modal1);
  }, 1000);
}

function showPopup1(level) {
  let color = "white";

  // 모달 요소 생성
  const modal1 = document.createElement("div");
  modal1.className = "modal1";

  // 모달 내용 설정
  modal1.innerHTML = `<div class="modal1-content">${level}</div>`;

  // 모달 스타일 설정
  modal1.style.position = "fixed";
  modal1.style.top = "10%";
  modal1.style.left = "50%";
  modal1.style.transform = "translate(-50%, -50%)";
  modal1.style.backgroundColor = "green";
  modal1.style.color = color;
  modal1.style.padding = "20px";
  modal1.style.border = "4px solid black";
  modal1.style.borderRadius = "40px";

  // 모달을 body에 추가
  document.body.appendChild(modal1);

  // 1초 후 모달 제거
  setTimeout(() => {
    document.body.removeChild(modal1);
  }, 5000);
}

function increaseSpeed() {
  if (score >= 20) {
    arrowSpeed = 4;
  }
  if (score >= 40) {
    arrowSpeed = 6;
  }
  if (score >= 60) {
    arrowSpeed = 8;
  }
  if (score >= 80) {
    arrowSpeed = 9;
  }
  if (score >= 90) {
    arrowSpeed = 10;
  }
}

function onKeyDown(event) {
  if (isGameOver) {
    return;
  }

  const key = event.key;
  let isHit = false;

  for (let i = 0; i < arrows.length; i++) {
    if (key === arrows[i].key) {
      if (
        arrows[i].y >= canvas.height - arrowSize &&
        arrows[i].y <= canvas.height - 2
      ) {
        score += 5;
        showPopup("GOOD");
        arrows.splice(i, 1);
        isHit = true;
        break;
      }
    }
  }

  if (!isHit) {
    for (let i = 0; i < arrows.length; i++) {
      if (arrows[i].y >= canvas.height - arrowSize) {
        lives -= 1;
        showPopup("BAD");
        arrows.splice(i, 1);

        // 추가: 하트 이미지 업데이트
        updateHearts();
        break;
      }
    }
    if (lives === 0) {
      gameOver();
    }
  }

  if (score === 100) {
    gameClear();
  }

  switchTrack();
}

function gameClear() {
  isGameOver = true;

  const modal = document.getElementById("modal");
  const modalContent = document.querySelector(".modal-content");

  // 모달 내용 설정
  modalContent.innerHTML = `
    <h2>GAME CLEAR</h2>
    <p>Your Score: ${score}</p>
    <button id="next">NEXT</button>
  `;

  // 모달 스타일 설정 (기존 스타일 사용)
  modal.style.display = "block";
  modalContent.style.backgroundColor = "#fefefe";
  modalContent.style.color = "black";
  modalContent.style.borderRadius = "10px";
  modalContent.style.display = "block";
  modalContent.style.margin = "15% auto";
  modalContent.style.padding = "20px";
  modalContent.style.border = "1px solid #888";
  modalContent.style.width = "30%";
  song.pause();
  song.currentTime = 0;
  clear.play();

  const nextButton = document.getElementById("next");
  nextButton.addEventListener("click", function () {
    // Add the following lines to execute the desired actions
    window.localStorage.setItem("x", "-2");
    window.localStorage.setItem("y", "0");
    window.localStorage.setItem("z", "5");
    window.localStorage.setItem("game3", "ture");

    window.location.href = "../main/main.html";

    modalContent.style.display = "none";
  });
}

function gameOver() {
  isGameOver = true;

  // 모달 요소 가져오기
  const modal = document.getElementById("modal");
  const modalContent = document.querySelector(".modal-content");

  // 모달 내용 설정
  modalContent.innerHTML = `
    <h2>Game Over</h2>
    <p>Your Score: ${score}</p>
    <button id="tryAgain1">Try Again</button>
  `;

  // 모달 스타일 설정 (기존 스타일 사용)
  modal.style.display = "block";
  modalContent.style.backgroundColor = "#fefefe";
  modalContent.style.color = "black";
  modalContent.style.borderRadius = "10px";
  modalContent.style.display = "block";
  modalContent.style.margin = "15% auto";
  modalContent.style.padding = "20px";
  modalContent.style.border = "1px solid #888";
  modalContent.style.width = "30%";

  const tryAgainButton = document.getElementById("tryAgain1");

  tryAgainButton.addEventListener("click", () => {
    modal.style.display = "none";
    isGameOver = false;
    score = 0;
    lives = maxLives;
    arrows.length = 0;

    tryAgainButton.style.display = "none";
    currentTrack = track1;
    arrowSpeed = 3;
    song = new Audio(currentTrack);
    document.body.style.backgroundImage = 'url("./asets/vision.jpg")';
    initHearts(); // 추가: 하트 이미지 초기화
    updateHearts(); // 추가: 하트 이미지 업데이트
    startGame();
  });

  song.pause();
  song.currentTime = 0;
  over.play();
}

function gameLoop() {
  if (isGameOver) {
    return;
  }

  increaseSpeed();

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.beginPath();
  ctx.moveTo(0, canvas.height);
  ctx.lineTo(canvas.width, canvas.height);
  ctx.strokeStyle = "dark blue";
  ctx.lineWidth = arrowSize * 1.3;
  ctx.lineCap = "round";
  ctx.stroke();

  for (let i = 0; i < arrows.length; i++) {
    const arrow = arrows[i];
    arrow.y += arrowSpeed;
    drawArrow(arrow);
  }

  ctx.font = "25px Arial Black"; // 폰트 크기 두 배로 키우기
  ctx.fillStyle = "pink"; // 핑크색으로 변경
  ctx.textAlign = "right";

  ctx.fillStyle = "black"; // 핑크색으로 변경
  ctx.fillText(theme, 520, 180);
  ctx.fillText("Speed: " + arrowSpeed, 250, 280);
  ctx.fillText(score + "/100", 1405, 75);

  requestAnimationFrame(gameLoop);
}

function startGame(currentTrack) {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  song = new Audio(currentTrack);

  if (currentTrack == track1) {
    theme = "MISSION IMPOSSIBLE OST  ";
  }
  if (currentTrack == track2) {
    theme = "Pirates of Caribbean OST     ";
  }
  if (currentTrack == track3) {
    theme = "Stranger Things Main OST   ";
  }
  window.addEventListener("keydown", onKeyDown);
  over.pause();
  over.currentTime = 0;
  song.play();

  setInterval(createArrow, 1000);
  gameLoop();
}

// 모달 창 띄우기
var modal = document.getElementById("modal");
var startBtn = document.getElementById("startGame");
var closeBtn = document.getElementsByClassName("close")[0];

startBtn.onclick = function () {
  modal.style.display = "none"; // 시작 버튼을 누르면 모달이 사라집니다.
  songModal.style.display = "block";
};

closeBtn.onclick = function () {
  modal.style.display = "none"; // 닫기 버튼을 누르면 모달이 사라집니다.
  startGame();
};

window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none"; // 모달 바깥을 누르면 모달이 사라집니다.
    startGame();
  }
};

window.onload = function () {
  modal.style.display = "block";
  window.addEventListener("resize", onWindowResize, false);
};

var songModal = document.getElementById("songModal");
var closeSongModal = document.getElementById("closeSongModal");
var songButton1 = document.getElementById("songButton1");
var songButton2 = document.getElementById("songButton2");
var songButton3 = document.getElementById("songButton3");

songButton1.onclick = function () {
  songModal.style.display = "none";
  let currentTrack = songButton1.getAttribute("data-song");
  startGame(currentTrack);
};

songButton2.onclick = function () {
  songModal.style.display = "none";
  let currentTrack = songButton2.getAttribute("data-song");
  startGame(currentTrack);
};

songButton3.onclick = function () {
  songModal.style.display = "none";
  let currentTrack = songButton3.getAttribute("data-song");
  startGame(currentTrack);
};

// 추가: 하트 이미지 초기화 함수
function initHearts() {
  heartsContainer.innerHTML = "";
  for (let i = 0; i < maxLives; i++) {
    const heart = document.createElement("img");
    heart.src = "./asets/heart.png";
    heart.width = heartSize * 1.8;
    heart.height = heartSize * 1.8;
    heartsContainer.appendChild(heart);
  }
}

// 추가: 하트 이미지 업데이트 함수
function updateHearts() {
  const heartImages = heartsContainer.querySelectorAll("img");
  for (let i = 0; i < maxLives; i++) {
    if (i < lives) {
      heartImages[i].style.display = "block";
    } else {
      heartImages[i].style.display = "none";
    }
  }
}

// 추가: 초기에 하트 이미지 생성
initHearts();
