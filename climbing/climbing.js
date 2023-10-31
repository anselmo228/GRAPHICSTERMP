"use strict";
console.clear();

class Stage {

  constructor() {
    // container
    this.render = function () {
      this.renderer.render(this.scene, this.camera);
    };

    this.add = function (elem) {
      this.scene.add(elem);
    };

    this.remove = function (elem) {
      this.scene.remove(elem);
    };

    this.container = document.getElementById('game');

    // renderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false
    });

    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setClearColor('#D0CBC7', 1);
    this.container.appendChild(this.renderer.domElement);

    // scene
    this.scene = new THREE.Scene();

    // camera
    let aspect = window.innerWidth / window.innerHeight;
    let d = 20;
    this.camera = new THREE.OrthographicCamera(-d * aspect, d * aspect, d, -d, -100, 1000);
    this.camera.position.x = 2;
    this.camera.position.y = 2;
    this.camera.position.z = 2;
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));

    //light
    this.light = new THREE.DirectionalLight(0xffffff, 0.5);
    this.light.position.set(0, 499, 0);
    this.scene.add(this.light);
    this.softLight = new THREE.AmbientLight(0xffffff, 0.4);
    this.scene.add(this.softLight);
    window.addEventListener('resize', () => this.onResize());
    this.onResize();
  }

  // y = 카메라 이동 좌표 / speed = 애니메이션 속도 조절값 (기본값 0.3)
  setCamera(y, speed = 0.3) {
    TweenLite.to(this.camera.position, speed, { y: y + 4, ease: Power1.easeInOut });
    TweenLite.to(this.camera.lookAt, speed, { y: y, ease: Power1.easeInOut });
  }


  // 웹브라우저 창 크기에 따라 카메라, 렌더러 속성 조정
  onResize() {
    // viewSize 변수를 30으로 설정 (3D 공간의 가시 영역 크기)
    let viewSize = 30;

    // 렌더러 크기를 현재 창 크기로 설정
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    // 카메라의 투영 행렬(projection matrix) 업데이트
    // 창 크기 변경에 따라 투영 행렬을 업데이트하여 뷰포트(viewport)를 조절
    this.camera.left = window.innerWidth / -viewSize;     //왼
    this.camera.right = window.innerWidth / viewSize;     //오
    this.camera.top = window.innerHeight / viewSize;      //위
    this.camera.bottom = window.innerHeight / -viewSize;  //아래

    // 카메라의 투영 행렬을 업데이트하여 새로운 뷰포트 설정을 반영
    this.camera.updateProjectionMatrix();
  }
}

class Block {

  /* Three.js 써서 3D 블록 생성하고초기화 */
  constructor(block) {

    // 블록의 차원 (가로, 세로, 깊이)
    this.STATES = { ACTIVE: 'active', STOPPED: 'stopped', MISSED: 'missed' };
    // 블록 이동 거리
    this.MOVE_AMOUNT = 12;
    // 블록의 차원 (가로, 세로, 깊이)
    this.dimension = { width: 0, height: 0, depth: 0 };
    // 블록의 위치 (x, y, z)
    this.position = { x: 0, y: 0, z: 0 };
    // 이전 블록 정보 (앞에 쌓았던 블록)
    this.targetBlock = block;
    this.index = (this.targetBlock ? this.targetBlock.index : 0) + 1;
    //블록 이동 방향 && 차원
    this.workingPlane = this.index % 2 ? 'x' : 'z';
    this.workingDimension = this.index % 2 ? 'width' : 'depth';


    // 블록의 차원 및 위치 설정 (이전 블록 정보 또는 또는 기본값)
    this.dimension.width = this.targetBlock ? this.targetBlock.dimension.width : 10;
    this.dimension.height = this.targetBlock ? this.targetBlock.dimension.height : 2;
    this.dimension.depth = this.targetBlock ? this.targetBlock.dimension.depth : 10;
    this.position.x = this.targetBlock ? this.targetBlock.position.x : 0;
    this.position.y = this.dimension.height * this.index;
    this.position.z = this.targetBlock ? this.targetBlock.position.z : 0;
    this.colorOffset = this.targetBlock ? this.targetBlock.colorOffset : 500; //


    // 블록색상 설정
    if (!this.targetBlock) {
      this.color = 0x6B2E05; //기본 블록 색상 (땅부터 시작하는 느낌으로.. 갈색함)
    }

    else {
      // targetBlock 있을 때 블록 색상설정
      let offset = this.index + this.colorOffset;

      //각 색상값 계산
      var r = 0;
      var g = Math.sin(0.3 * offset + 2) * 55 + 200;
      var b = 0;

      // THREE.Color 객체를 사용하여 RGB 값을 0에서 1 사이로 정규화하고, 블록의 색상 설정
      this.color = new THREE.Color(r / 255, g / 255, b / 255);
    }

    // state
    this.state = this.index > 1 ? this.STATES.ACTIVE : this.STATES.STOPPED;

    // set direction
    this.speed = -0.1 - (this.index * 0.005);

    if (this.speed < -4)
      this.speed = -4;

    // 이동 방향 설정
    this.direction = this.speed;

    // 3D 블록 생성
    //3D블록 가로세로깊이 설정
    let geometry = new THREE.BoxGeometry(this.dimension.width, this.dimension.height, this.dimension.depth);

    //중심 이동위한 변환 행렬 설정
    geometry.applyMatrix4(new THREE.Matrix4().makeTranslation(this.dimension.width / 2,
      this.dimension.height / 2, this.dimension.depth / 2));

    // 3D 블록 matrial 설정 (색상 및 그림자 설정)
    this.material = new THREE.MeshToonMaterial({ color: this.color, shading: THREE.FlatShading });

    //3D블록 객체생성
    this.mesh = new THREE.Mesh(geometry, this.material);

    // 블록 위치 설정
    this.mesh.position.set(this.position.x, this.position.y + (this.state == this.STATES.ACTIVE ? 0 : 0),
      this.position.z);

    // 블록이 활성 상태인 경우, 무작위로 왼쪽 또는 오른쪽 방향으로 이동

    // this.workingPlane에 따라 이동할 평면 선택
    // Math.random() > 0.5 조건을 사용하여 50% 확률로 왼쪽 또는 오른쪽 방향 선택
    // 왼쪽으로 이동할 경우, `-this.MOVE_AMOUNT` 값 할당
    // 오른쪽으로 이동할 경우, `this.MOVE_AMOUNT` 값 할당
    if (this.state == this.STATES.ACTIVE) {
      this.position[this.workingPlane] = Math.random() > 0.5 ? -this.MOVE_AMOUNT : this.MOVE_AMOUNT;
    }
  }

  /* 블록 이동 방향 반대로 변경 */
  reverseDirection() {
    // 현재 이동 방향 (this.direction)이 양수인지 검사
    if (this.direction > 0) {
      // 현재 이동 방향이 양수인 경우, 음수로 변경하여 반대 방향으로 전환
      this.direction = this.speed;
    } else {
      // 현재 이동 방향이 음수인 경우, 절댓값을 취해 양수로 변경하여 반대 방향으로 전환
      this.direction = Math.abs(this.speed);
    }
  }

  /* 블록 배치랑 상태관리 */
  place() {
    // 블록 상태를 "STOPPED"로 설정
    this.state = this.STATES.STOPPED;

    // 블록과 대상 블록 간의 겹침 계산
    let overlap = this.targetBlock.dimension[this.workingDimension] - Math.abs(this.position[this.workingPlane] - this.targetBlock.position[this.workingPlane]);

    // 반환할 블록 정보를 담는 객체
    let blocksToReturn = {
      plane: this.workingPlane,
      direction: this.direction
    };

    // 겹침이 작으면 (0.3보다 작으면) 블록을 놓고 보너스 플래그 설정
    if (this.dimension[this.workingDimension] - overlap < 0.3) {
      overlap = this.dimension[this.workingDimension];
      blocksToReturn.bonus = true;
      this.position.x = this.targetBlock.position.x;
      this.position.z = this.targetBlock.position.z;
      this.dimension.width = this.targetBlock.dimension.width;
      this.dimension.depth = this.targetBlock.dimension.depth;
    }

    // 겹침이 있는 경우
    if (overlap > 0) {
      // 겹치는 부분을 자르고 남은 블록과 잘린 블록 생성
      let choppedDimensions = { width: this.dimension.width, height: this.dimension.height, depth: this.dimension.depth };
      choppedDimensions[this.workingDimension] -= overlap;
      this.dimension[this.workingDimension] = overlap;

      // 배치된 블록의 기하학적 모양 생성
      let placedGeometry = new THREE.BoxGeometry(this.dimension.width, this.dimension.height, this.dimension.depth);
      placedGeometry.applyMatrix4(new THREE.Matrix4().makeTranslation(this.dimension.width / 2, this.dimension.height / 2, this.dimension.depth / 2));
      let placedMesh = new THREE.Mesh(placedGeometry, this.material);

      // 잘린 블록의 기하학적 모양 생성
      let choppedGeometry = new THREE.BoxGeometry(choppedDimensions.width, choppedDimensions.height, choppedDimensions.depth);
      choppedGeometry.applyMatrix4(new THREE.Matrix4().makeTranslation(choppedDimensions.width / 2, choppedDimensions.height / 2, choppedDimensions.depth / 2));
      let choppedMesh = new THREE.Mesh(choppedGeometry, this.material);

      // 잘린 블록의 위치 설정
      let choppedPosition = {
        x: this.position.x,
        y: this.position.y,
        z: this.position.z
      };

      // 배치된 블록과 잘린 블록의 위치 설정
      if (this.position[this.workingPlane] < this.targetBlock.position[this.workingPlane]) {
        this.position[this.workingPlane] = this.targetBlock.position[this.workingPlane];
      } else {
        choppedPosition[this.workingPlane] += overlap;
      }

      // 배치된 블록과 잘린 블록의 위치 설정
      placedMesh.position.set(this.position.x, this.position.y, this.position.z);
      choppedMesh.position.set(choppedPosition.x, choppedPosition.y, choppedPosition.z);

      // 반환 객체에 배치된 블록 추가
      blocksToReturn.placed = placedMesh;

      // 보너스가 아닌 경우 잘린 블록 추가
      if (!blocksToReturn.bonus)
        blocksToReturn.chopped = choppedMesh;
    }

    // 겹침이 없는 경우 블록 상태를 "MISSED"로 설정
    else {
      this.state = this.STATES.MISSED;
    }

    // 블록의 차원 정보 업데이트
    this.dimension[this.workingDimension] = overlap;

    // 반환할 블록 정보 객체 반환
    return blocksToReturn;
  }

  /* 블록의 이동 관리 */
  tick() {
    // 블록이 활성 상태인 경우에만 이동 처리
    if (this.state == this.STATES.ACTIVE) {
      let value = this.position[this.workingPlane];

      // 블록이 일정 범위를 벗어나면 이동 방향을 반대로 변경
      if (value > this.MOVE_AMOUNT || value < -this.MOVE_AMOUNT)
        this.reverseDirection();

      // 이동 방향에 따라 블록을 이동
      this.position[this.workingPlane] += this.direction;
      this.mesh.position[this.workingPlane] = this.position[this.workingPlane];
    }
  }

}

class Game {
  constructor() {
    // 게임 상태 상수 정의
    this.STATES = {
      'LOADING': 'loading',
      'PLAYING': 'playing',
      'READY': 'ready',
      'ENDED': 'ended',
      'RESETTING': 'resetting'
    };

    // 블록을 저장할 배열 초기화
    this.blocks = [];

    // 초기 게임 상태를 'LOADING'으로 설정
    this.state = this.STATES.LOADING;

    // 게임 화면을 렌더링할 Stage 객체 생성
    this.stage = new Stage();

    // HTML 문서에서 컨테이너 엘리먼트 가져오기
    this.mainContainer = document.getElementById('container');

    // 점수를 표시할 엘리먼트 가져오기
    this.scoreContainer = document.getElementById('score');

    // 게임 시작 버튼 엘리먼트 가져오기
    this.startButton = document.getElementById('start-button');

    // 게임 안내 메시지 엘리먼트 가져오기
    this.instructions = document.getElementById('instructions');

    // 초기 점수를 0으로 설정
    this.scoreContainer.innerHTML = '0m';

    // Three.js의 그룹 객체를 사용하여 새로운 블록, 배치된 블록, 잘린 블록을 관리
    this.newBlocks = new THREE.Group();
    this.placedBlocks = new THREE.Group();
    this.choppedBlocks = new THREE.Group();

    // Stage에 새로운 블록, 배치된 블록, 잘린 블록 그룹을 추가
    this.stage.add(this.newBlocks);
    this.stage.add(this.placedBlocks);
    this.stage.add(this.choppedBlocks);

    // 초기 블록 추가
    this.addBlock();

    // 게임 루프 시작
    this.tick();

    // 초기 게임 상태를 'READY'로 설정
    this.updateState(this.STATES.READY);

    // 스페이스 바 처리
    document.addEventListener('keydown', e => { if (e.keyCode == 32) this.onAction(); });

    // 마우스 클릭 이벤트 처리
    document.addEventListener('click', e => { this.onAction(); });

    // 터치 이벤트 처리
    document.addEventListener('touchstart', e => { e.preventDefault(); });
  }

  /* 게임 상태 업데이트 */
  updateState(newState) {
    // 현재 설정된 상태 클래스를 모두 제거
    for (let key in this.STATES)
      this.mainContainer.classList.remove(this.STATES[key]);

    // 새로운 상태 클래스 추가
    this.mainContainer.classList.add(newState);

    // 새로운 상태를 현재 상태로 설정
    this.state = newState;
  }

  onAction() {
    // 현재 상태에 따라 다른 동작 수행
    switch (this.state) {
      // 게임이 준비된 상태에서 게임시작 함ㅅ호출
      case this.STATES.READY:
        this.startGame();
        break;

      // 게임중일때 블록을 놓는 동작 호출
      case this.STATES.PLAYING:
        this.placeBlock();
        break;

      // 게임이 끝난 상태에서 게임 재시작 호출
      case this.STATES.ENDED:
        this.restartGame();
        break;
    }
  }

  startGame() {
    // PLAYING 아닐 때 게임 시작
    if (this.state != this.STATES.PLAYING) {

      // 점수 초기화, 게임상태 PLAYING으로 변경
      this.scoreContainer.innerHTML = '0m';
      this.updateState(this.STATES.PLAYING);

      // 새블록 추가 후 게임시작
      this.addBlock();
    }
  }

  restartGame() {
    // 게임 상태를 "리셋 중"으로 업데이트
    this.updateState(this.STATES.RESETTING);

    // 기존에 배치된 블록들을 제거
    let oldBlocks = this.placedBlocks.children;
    let removeSpeed = 0.2;  // 블록 제거 속도
    let delayAmount = 0.02; // 지연 시간 조절

    for (let i = 0; i < oldBlocks.length; i++) {
      // 블록을 제거하는 애니메이션 설정
      TweenLite.to(oldBlocks[i].scale, removeSpeed, { x: 0, y: 0, z: 0, delay: (oldBlocks.length - i) * delayAmount, ease: Power1.easeIn, onComplete: () => this.placedBlocks.remove(oldBlocks[i]) });
      TweenLite.to(oldBlocks[i].rotation, removeSpeed, { y: 0.5, delay: (oldBlocks.length - i) * delayAmount, ease: Power1.easeIn });
    }
    // 카메라 이동 속도 설정
    let cameraMoveSpeed = removeSpeed * 2 + (oldBlocks.length * delayAmount);

    // 카메라를 움직여 게임 화면 조절
    this.stage.setCamera(2, cameraMoveSpeed);

    // 점수 카운트 다운 애니메이션 설정
    let countdown = { value: this.blocks.length - 1 };
    TweenLite.to(countdown, cameraMoveSpeed, { value: 0, onUpdate: () => { this.scoreContainer.innerHTML = String(Math.round(countdown.value)) + 'm'; } });

    // 블록 배열에서 땅 블록(맨 아래 갈색) 유지
    this.blocks = this.blocks.slice(0, 1);

    // 일정 시간 이후에 게임 재시작
    setTimeout(() => {
      this.startGame();
    }, cameraMoveSpeed * 1000);
  }

  /* 새로운 블록 배치 && 애니메이션 처리 */
  placeBlock() {
    // 현재 블록을 가져옴
    let currentBlock = this.blocks[this.blocks.length - 1];

    // 현재 블록을 배치하고 반환된 새로운 블록 정보를 얻음
    let newBlocks = currentBlock.place();

    // 새로운 블록을 새 블록 그룹에서 제거
    this.newBlocks.remove(currentBlock.mesh);

    // 배치된 블록을 추가
    if (newBlocks.placed)
      this.placedBlocks.add(newBlocks.placed);

    // 잘린 블록이 있는 경우
    if (newBlocks.chopped) {
      // 잘린 블록을 잘린 블록 그룹에 추가하고 애니메이션 설정
      this.choppedBlocks.add(newBlocks.chopped);
      let positionParams = { y: '-=30', ease: Power1.easeIn, onComplete: () => this.choppedBlocks.remove(newBlocks.chopped) };
      let rotateRandomness = 10;
      let rotationParams = {
        delay: 0.05,
        x: newBlocks.plane == 'z' ? ((Math.random() * rotateRandomness) - (rotateRandomness / 2)) : 0.1,
        z: newBlocks.plane == 'x' ? ((Math.random() * rotateRandomness) - (rotateRandomness / 2)) : 0.1,
        y: Math.random() * 0.1,
      };

      // 잘린 블록의 위치와 회전 애니메이션을 설정
      if (newBlocks.chopped.position[newBlocks.plane] > newBlocks.placed.position[newBlocks.plane]) {
        positionParams[newBlocks.plane] = '+=' + (40 * Math.abs(newBlocks.direction));
      }

      else {
        positionParams[newBlocks.plane] = '-=' + (40 * Math.abs(newBlocks.direction));
      }

      // 애니메이션 적용
      TweenLite.to(newBlocks.chopped.position, 1, positionParams);
      TweenLite.to(newBlocks.chopped.rotation, 1, rotationParams);
    }

    // 새로운 블록 추가
    this.addBlock();
  }

  /* 새로운 블록 추가 */
  addBlock() {
    // 이전 블록을 가져옴
    let lastBlock = this.blocks[this.blocks.length - 1];

    // 이전 블록이 "MISSED" 상태라면 게임 종료 처리
    if (lastBlock && lastBlock.state == lastBlock.STATES.MISSED) {
      return this.endGame();
    }

    // 현재 블록 개수를 점수로 표시
    this.scoreContainer.innerHTML = String(this.blocks.length - 1) + 'm';

    // 새로운 블록 생성
    let newKidOnTheBlock = new Block(lastBlock);

    // 새 블록을 "newBlocks" 그룹에 추가
    this.newBlocks.add(newKidOnTheBlock.mesh);

    // 새 블록을 블록 배열에 추가
    this.blocks.push(newKidOnTheBlock);

    // 화면 카메라 위치 조정
    this.stage.setCamera(this.blocks.length * 2);

    // 5개 이상의 블록이 있을 때, 게임 안내 메시지 숨김
    if (this.blocks.length >= 5)
      this.instructions.classList.add('hide');
  }

  // 게임 상태를 "종료 상태"로 업데이트
  endGame() {
    this.updateState(this.STATES.ENDED);
  }

  tick() {
    // 가장 최근 블록의 상태를 업데이트
    this.blocks[this.blocks.length - 1].tick();

    // 게임 화면을 렌더링
    this.stage.render();

    // 다음 프레임을 요청하고 게임 루프를 유지
    requestAnimationFrame(() => { this.tick(); });
  }
}

let game = new Game();