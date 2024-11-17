var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

canvas.width = window.innerWidth - 100;
canvas.height = window.innerHeight - 100;

var jump = false;
var gameover = false;

var dinoImg = new Image();
dinoImg.src = "dino.png"; 

var ground = {
    y: 250, 
    height: 4, 
    draw() {
      ctx.fillStyle = "black";
      ctx.fillRect(0, this.y, canvas.width, this.height);
    }
  };

var dino = {
  x: 500,
  y: 200 , // 공룡 기본 위치
  width: 50,
  height: 50, // 공룡 크기
  velocity: 0, // 점프를 위한 속도
  gravity: 0.5, // 중력
  jumpHeight: -10, // 점프 높이
  isJumping: false,
  draw() {
    ctx.drawImage(dinoImg, this.x, this.y, this.width, this.height);
  },
  update() {
    if (this.isJumping) {
      this.velocity += this.gravity;
      this.y += this.velocity;

      if (this.y >= 200) {
        this.y = 200;
        this.isJumping = false;
        this.velocity = 0;
      }
    }
  },
  jump() {
    if (!this.isJumping) {
      this.isJumping = true;
      this.velocity = this.jumpHeight;
    }
  }
};

var timer = 0;
var cactuses = [];

function Cactus() {
  this.x = canvas.width;
  this.y = 225;
  this.width = 25;
  this.height = 25;
  this.speed = 5; // 장애물의 속도
  this.draw = function() {
    ctx.drawImage(img1, this.x, this.y, this.width, this.height);
  };
  this.update = function() {
    this.x -= this.speed;
  };
}

var img1 = new Image();
img1.src = "cactus.png";

function executePerFrame() {
  requestAnimationFrame(executePerFrame);
  
  timer++;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ground.draw();
  dino.update();
  dino.draw();

  if (timer % 120 === 0) {
    var cactus = new Cactus();
    cactuses.push(cactus);
  }

  cactuses.forEach(function(cactus, index) {
    cactus.update();
    cactus.draw();

    if (isBumped(dino, cactus)) {
      cancelAnimationFrame(executePerFrame); // 게임 종료
      alert("Game Over!");
    }

    if (cactus.x < -10) {
      cactuses.splice(index, 1);
    }
  });
}

function isBumped(dino, cactus) {
  return dino.x < cactus.x + cactus.width &&
         dino.x + dino.width > cactus.x &&
         dino.y < cactus.y + cactus.height &&
         dino.y + dino.height > cactus.y;
}

document.addEventListener("keydown", function(e) {
  if (e.code === "Space") {
    dino.jump();
  }
});
document.addEventListener("touchstart", function(e) {
    e.preventDefault(); // 터치 이벤트가 스크롤로 이어지지 않도록 방지
    dino.jump();  // 터치하면 점프
  });

dinoImg.onload = function() {
  executePerFrame();
  
};

