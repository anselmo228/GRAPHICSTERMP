const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const tryAgainButton = document.getElementById('tryAgain');
const progressBar = document.getElementById('progressFill');

const arrowImages = {
  ArrowUp: new Image(),
  ArrowDown: new Image(),
  ArrowLeft: new Image(),
  ArrowRight: new Image(),
};

let theme = 'MISSION IMPOSSIBLE OST';
const track1 = './songs/missionimpossible.mp3';
const track2 = './songs/Pirates of the Caribbean.mp3';
const track3 = './songs/stranger-things-124008.mp3';
let currentTrack = track1;
let song = new Audio(currentTrack);
const over = new Audio('./songs/gameover.mp3');
const clear = new Audio('./songs/clear.mp3')
const arrowKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
const arrowSize = 50;
let arrowSpeed = 3;
const arrows = [];
const maxLives = 7;
let score = 0;
let lives = maxLives;
let isGameOver = false;
showPopup('LEVEL1');

arrowImages.ArrowUp.src = './asets/arrow_up.png';
arrowImages.ArrowDown.src = './asets/arrow_down.png';
arrowImages.ArrowLeft.src = './asets/arrow_left.png';
arrowImages.ArrowRight.src = './asets/arrow_right.png';

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

function updateProgressBar() {
  const progress = (lives / maxLives) * 100;
  progressBar.style.width = progress + '%';
}

function switchTrack() {
  if (currentTrack === track1 && score >= 35) {
    showPopup('LEVEL2');
    currentTrack = track3;
    arrowSpeed = 5;
    song.pause();
    song = new Audio(currentTrack);
    song.play();
    theme = 'STRANGER THING OST OST';
    document.body.style.backgroundImage = 'url("./asets/vision.jpg")';
  }
  if (currentTrack === track3 && score >= 65) {
    showPopup('LEVEL3');
    currentTrack = track2;
    arrowSpeed = 7;
    song.pause();
    song = new Audio(currentTrack);
    song.play();
    theme = 'PIRATES OF THE CARIBBEAN OST';
    document.body.style.backgroundImage = 'url("./asets/vision.jpg")';
  }
}
function showPopup(level) {
  let color = 'black'; 

  if (level === 'GOOD') {
    color = 'green';
  } else if (level === 'BAD') {
    color = 'red';
  }

  // 모달 요소 생성
  const modal = document.createElement('div');
  modal.className = 'modal';

  // 모달 내용 설정
  modal.innerHTML = `<div class="modal-content">${level}</div>`;

  // 모달 스타일 설정
  modal.style.position = 'fixed';
  modal.style.top = '30%';
  modal.style.left = '50%';
  modal.style.transform = 'translate(-50%, -50%)';
  modal.style.backgroundColor = 'white';
  modal.style.color = color;
  modal.style.padding = '20px';
  modal.style.border = '2px solid black';
  modal.style.borderRadius = '20px';

  // 모달을 body에 추가
  document.body.appendChild(modal);

  // 1초 후 모달 제거
  setTimeout(() => {
    document.body.removeChild(modal);
  }, 1000);
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
      if (arrows[i].y >= canvas.height - arrowSize && arrows[i].y <= canvas.height - 2) {
        score += 1;
        showPopup('GOOD');
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
        showPopup('BAD');
        arrows.splice(i, 1);
        updateProgressBar();
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

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = '50px Arial';
  ctx.fillStyle = 'green';
  ctx.fillText('Game Clear!', canvas.width / 2 - 135, canvas.height / 3 - 150);
  song.pause();
  song.currentTime = 0;
  clear.play();
}

function gameOver() {
  isGameOver = true;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = '36px Arial';
  ctx.fillStyle = 'red';
  ctx.fillText('Game Over', canvas.width / 2 - 90, canvas.height / 2 - 50);
  ctx.font = '25px Arial';
  ctx.fillStyle = 'black';
  ctx.fillText('Your Score: ' + score, canvas.width / 2 - 75, canvas.height / 2 - 20);

  tryAgainButton.style.display = 'block';
  song.pause();
  song.currentTime = 0;
  over.play();
}

tryAgainButton.addEventListener('click', () => {
  isGameOver = false;
  score = 0;
  lives = maxLives;
  arrows.length = 0;
  updateProgressBar();
  tryAgainButton.style.display = 'none';
  currentTrack = track1;
  arrowSpeed = 3;
  song = new Audio(currentTrack);
  document.body.style.backgroundImage = 'url("./asets/gachon.jpg")';
  startGame();
});

function gameLoop() {
  if (isGameOver) {
    return;
  }

  increaseSpeed();

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.beginPath();
  ctx.moveTo(0, canvas.height);
  ctx.lineTo(canvas.width, canvas.height);
  ctx.strokeStyle = 'white';
  ctx.lineWidth = arrowSize;
  ctx.lineCap = 'round';
  ctx.stroke();

  for (let i = 0; i < arrows.length; i++) {
    const arrow = arrows[i];
    arrow.y += arrowSpeed;
    drawArrow(arrow);
  }

  ctx.font = '24px Arial';
  ctx.fillStyle = 'deep blue';
  ctx.fillText('Score: ' + score, 20, 40);
  updateProgressBar();
  ctx.fillStyle = 'white';
  ctx.fillText('Song: ' + theme, 20, 80);
  ctx.fillText('Speed: ' + arrowSpeed, 20, 120);

  requestAnimationFrame(gameLoop);
}

function startGame() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  window.addEventListener('keydown', onKeyDown);
  over.pause();
  over.currentTime = 0;
  song.play();
  setInterval(createArrow, 1000);
  gameLoop();
}

startGame();
