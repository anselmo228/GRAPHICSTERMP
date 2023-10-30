const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const tryAgainButton = document.getElementById('tryAgain');

const arrowImages = {
  ArrowUp: new Image(),
  ArrowDown: new Image(),
  ArrowLeft: new Image(),
  ArrowRight: new Image(),
};

const song = new Audio('missionimpossible.mp3');
const over = new Audio('gameover.mp3');
const arrowKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
const arrowSize = 50;
const arrowSpeed = 3;
const arrows = [];
const maxLives = 5;
let score = 0;
let lives = maxLives;
let isGameOver = false;

arrowImages.ArrowUp.src = 'arrow_up.png';
arrowImages.ArrowDown.src = 'arrow_down.png';
arrowImages.ArrowLeft.src = 'arrow_left.png';
arrowImages.ArrowRight.src = 'arrow_right.png';

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
        score += 1;
        arrows.splice(i, 1);
        isHit = true;
        break;
      }
    }
  }

  /*목숨 줄어드는 경우 수정 필요 버그 ㅈㄴ 많음*/
  if (!isHit) {
    for (let i = 0; i < arrows.length; i++) {
      if (arrows[i].y >= canvas.height - arrowSize) {
        lives -= 1;
        arrows.splice(i, 1);
        break;
      }
    }
    if (lives === 0) {
      gameOver();
    }
  }
}

function gameOver() {
  isGameOver = true;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = '36px Arial';
  ctx.fillStyle = 'red';
  ctx.fillText('Game Over', canvas.width / 2 - 90, canvas.height / 2 - 50);
  ctx.font = '17px Arial';
  ctx.fillStyle = 'white';
  ctx.fillText('Your Sore: ' + score, canvas.width / 2 - 50, canvas.height / 2 - 20);

  tryAgainButton.style.display = 'block';
  /*Stop Song and Replay*/
  song.pause();
  song.currentTime = 0;
  over.play();
}

tryAgainButton.addEventListener('click', () => {
  isGameOver = false;
  score = 0;
  lives = maxLives;
  arrows.length = 0;
  tryAgainButton.style.display = 'none';
  startGame();
});

function gameLoop() {
  if (isGameOver) {
    return;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.beginPath();
  ctx.moveTo(0, canvas.height - arrowSize);
  ctx.lineTo(canvas.width, canvas.height - arrowSize);
  ctx.strokeStyle = 'gray';
  ctx.lineWidth = 5;
  ctx.stroke();

  for (let i = 0; i < arrows.length; i++) {
    const arrow = arrows[i];
    arrow.y += arrowSpeed;
    drawArrow(arrow);
  }

  ctx.font = '24px Arial';
  ctx.fillStyle = 'white';
  ctx.fillText('Score: ' + score, 20, 40);
  ctx.fillText('Lives: ' + lives, 20, 80);

  requestAnimationFrame(gameLoop);
}

function startGame() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  canvas.style.backgroundColor = 'darkblue';

  window.addEventListener('keydown', onKeyDown);
  over.pause();
  over.currentTime = 0;
  song.play();
  setInterval(createArrow, 1000);
  gameLoop();
}

startGame();
