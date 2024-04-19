const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const width = canvas.width;
const height = canvas.height;
const speed = 150;

const blockSize = 10;
const widthInBlocks = width / blockSize;
const heightInBlocks = height / blockSize;

let score = 0;

const directions = {
  32: "space",
  37: "left",
  38: "up",
  39: "right",
  40: "down",
};

class Apple {
  constructor() {
    this.position = new Block(10, 10);
  }
}

class Block {
  constructor(col, row) {
    this.col = col;
    this.row = row;
  }
}

class Snake {
  constructor() {
    this.segments = [new Block(7, 5), new Block(6, 5), new Block(5, 5)];
    this.direction = "right";
    this.nextDirection = "right";
  }
}

Apple.prototype.draw = function () {
  this.position.drawCircle("LimeGreen");
};

Apple.prototype.move = function () {
  let randomCol = Math.floor(Math.random() * (widthInBlocks - 2) + 1);
  let randomRow = Math.floor(Math.random() * (heightInBlocks - 2) + 1);
  this.position = new Block(randomCol, randomRow);
};

Block.prototype.drawSquare = function (color) {
  let x = this.col * blockSize;
  let y = this.row * blockSize;
  ctx.fillStyle = color;
  ctx.fillRect(x, y, blockSize, blockSize);
};

Block.prototype.drawCircle = function (color) {
  let centerX = this.col * blockSize + blockSize / 2;
  let centerY = this.row * blockSize + blockSize / 2;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(centerX, centerY, blockSize / 2, 0, Math.PI * 2, false);
  ctx.fill();
};

Block.prototype.equel = function (otherBlock) {
  return this.col === otherBlock.col && this.row === otherBlock.row;
};

Snake.prototype.draw = function () {
  for (let i = 0; i < this.segments.length; i++) {
    this.segments[i].drawSquare("Blue");
  }
};

Snake.prototype.move = function () {
  let head = this.segments[0];
  let newHead;

  this.direction = this.nextDirection;

  if (this.direction === "right") {
    newHead = new Block(head.col + 1, head.row);
  } else if (this.direction === "down") {
    newHead = new Block(head.col, head.row + 1);
  } else if (this.direction === "left") {
    newHead = new Block(head.col - 1, head.row);
  } else if (this.direction === "up") {
    newHead = new Block(head.col, head.row - 1);
  }

  if (this.checkColision(newHead)) {
    gameOver();
    return;
  }

  this.segments.unshift(newHead);

  if (newHead.equel(apple.position)) {
    score++;
    apple.move();
  } else {
    this.segments.pop();
  }
};

Snake.prototype.checkColision = function (head) {
  let leftColision = head.col === 0;
  let topColision = head.row === 0;
  let rightColision = head.col === widthInBlocks - 1;
  let bottomColision = head.row === heightInBlocks - 1;

  let wallColision =
    leftColision || topColision || rightColision || bottomColision;

  let selfColision = false;

  for (let i = 0; i < this.segments.length; i++) {
    if (head.equel(this.segments[i])) {
      selfColision = true;
    }
  }

  return wallColision || selfColision;
};

Snake.prototype.setDirection = function (newDirection) {
  if (this.direction === "up" && newDirection === "down") {
    return;
  } else if (this.direction === "right" && newDirection === "left") {
    return;
  } else if (this.direction === "down" && newDirection === "up") {
    return;
  } else if (this.direction === "left" && newDirection === "right") {
    return;
  }

  this.nextDirection = newDirection;
};

function drawBorder() {
  ctx.fillStyle = "Grey";
  ctx.fillRect(0, 0, width, blockSize);
  ctx.fillRect(0, height - blockSize, width, blockSize);
  ctx.fillRect(0, blockSize, blockSize, height - blockSize);
  ctx.fillRect(width - blockSize, blockSize, width, height - blockSize);
}

function drawScore() {
  ctx.font = "15px Courier";
  ctx.fillStyle = "Black";
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.fillText(`Рахунок: ${score}`, blockSize, blockSize);
}

function gameOver() {
  clearInterval(intervalid);
  ctx.font = "40px Courier";
  ctx.fillStyle = "Black";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("Кінець гри", width / 2, height / 2);
}

let snake = new Snake();
let apple = new Apple();

const intervalid = setInterval(function () {
  ctx.clearRect(0, 0, width, height);
  drawScore();
  snake.move();
  snake.draw();
  apple.draw();
  drawBorder();
}, speed);

$("body").keydown(function (event) {
  let newDirection = directions[event.keyCode];
  if (newDirection !== undefined) {
    snake.setDirection(newDirection);
  }
});

$("#up").click(() => {
  snake.setDirection("up");
});

$("#down").click(() => {
  snake.setDirection("down");
});

$("#left").click(() => {
  snake.setDirection("left");
});

$("#right").click(() => {
  snake.setDirection("right");
});
