// Initialize Three.js scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor('#D0CBC7', 1);
document.body.appendChild(renderer.domElement);

// Define player and missile geometries and materials
const playerGeometry = new THREE.SphereGeometry(10, 32, 32);
const playerMaterial = new THREE.MeshPhongMaterial({ color: 0xbcb5df });
const playerMesh = new THREE.Mesh(playerGeometry, playerMaterial);
playerMesh.position.set(0, 0, 300); // Adjust player's initial position
scene.add(playerMesh);

const missileGeometry = new THREE.SphereGeometry(10, 32, 32);
const missileMaterial = new THREE.MeshPhongMaterial({
  color: 0xbcb5df, // Red color
  specular: 0xffffff, // Specular highlight color
});

// Create an array to hold missile meshes
const missileMeshes = [];

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(0, 499, 0);
scene.add(directionalLight);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambientLight);

const clock = new THREE.Clock();

// Game state variables
let gameOver = false;
let score = 0;
let time = 0;
const player = {
  x: 0,
  y: 0,
  radius: 20
};
const missiles = [];

// Get the score display element
const scoreDisplay = document.getElementById("score");

// Event listeners
document.addEventListener('keydown', function (event) {
  if (event.code === 'Escape') {
    gameOver = true;
  }
});

document.addEventListener('mousemove', function (event) {
  if (!gameOver) {
    player.x = (event.clientX / window.innerWidth) * 2 - 1;
    player.y = (event.clientY / window.innerHeight) * 2 - 1;

    // Update the player's position based on the mouse coordinates
    playerMesh.position.x = player.x * 300;
    playerMesh.position.y = -player.y * 300; // Negate 'y' to account for the flipped y-coordinate system in Three.js
  }
});

// Game loop
function gameLoop() {
  // if (gameOver) {
  //   score = 0;
  //   clock.start();
  //   gameOver = false;
  // }

  time = clock.elapsedTime * 1000;

  if (clock.elapsedTime % 10000 === 0) {
    const x = (Math.random() * 2 - 1) * 300;
    const missileMesh = new THREE.Mesh(missileGeometry, missileMaterial);
    missileMesh.position.set(x, 300, 0); // Start missiles at the top of the window
    scene.add(missileMesh);
    missileMeshes.push(missileMesh);
  }

  for (let i = 0; i < missileMeshes.length; i++) {
    missileMeshes[i].position.y -= 5 + time / 500; // Move missile meshes up the screen

    if (missileMeshes[i].position.y < -300) {
      scene.remove(missileMeshes[i]);
      missileMeshes.splice(i, 1);
      i--;
    } else {
      const distance = Math.sqrt(
        Math.pow(playerMesh.position.x - missileMeshes[i].position.x, 2) +
        Math.pow(playerMesh.position.y - missileMeshes[i].position.y, 2)
      );

      if (distance < player.radius + 10) {
        scene.remove(missileMeshes[i]);
        //popMissile(missileMeshes[i]);
        missileMeshes.splice(i, 1);
        i--;
        score+=100;
      }
    }
  }

  // Update the score display
  scoreDisplay.innerText = `Score: ${score}`;

  // Render the scene
  renderer.render(scene, camera);

  // Request the next frame
  requestAnimationFrame(gameLoop);
}

// Set up camera position
camera.position.z = 600;
clock.start();
// Start the game loop
requestAnimationFrame(gameLoop);