class Canvas {
    constructor(canvas, board, snake, fruit) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.blockSize = 30;
        this.width = this.blockSize * board.size;
        this.height = this.blockSize * board.size;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.board = board;
        this.snake = snake;
        this.fruit = fruit;
    }
  
    execute() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.drawFruit();
        this.drawSnake();
        this.ctx.font = "20px Arial";
        this.ctx.fillText(`Score: ${this.board.score}`, 10, 20);
        if (this.board.gameOver) {
            this.ctx.fillStyle = "black";
            this.ctx.font = "50px Arial";
            this.ctx.fillText(`Game Over`, 100, 150);
            this.ctx.fillText(`Score: ${this.board.score}`, 130, 210);
            this.ctx.font = "20px Arial";
            this.ctx.fillStyle = "orange";
            this.ctx.fillText(`Press "Space" to continue`, 110, 250);
        }
    }
  
    drawSnake() {
        this.ctx.fillStyle = "green";
        for (let bodyParts of this.snake.body) {
            bodyParts && this.ctx.fillRect(
                bodyParts.x * this.blockSize,
                bodyParts.y * this.blockSize,
                this.blockSize,
                this.blockSize
            );
        }
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(this.snake.body[0].x * this.blockSize,
            this.snake.body[0].y * this.blockSize,
            this.blockSize,
            this.blockSize
        );
    }
  
    drawFruit() {
        this.ctx.fillStyle = "red";
        this.ctx.fillRect(
            this.fruit.position.x * this.blockSize,
            this.fruit.position.y * this.blockSize,
            this.blockSize,
            this.blockSize
        );
    }
  }

class GameLoopEvent {
    constructor() {
        this.observers = [];
        window.setInterval(() => {
            this.notify();
        }, 1000 / 10);
    }

    attach(observer) {
        this.observers.push(observer);
    }

    detach(observer) {
        this.observers = this.observers.filter(obs => obs !== observer);
    }

    notify() {
        this.observers.forEach(observer => observer.execute());
    }
}

class Keyboard {
    constructor() {
        this.observers = [];
        window.addEventListener("keydown", (e) => {
            this.notify(e.code);
        });
    }

    attach(observer) {
        this.observers.push(observer);
    }

    detach(observer) {
        this.observers = this.observers.filter(obs => obs !== observer);
    }

    notify(keycode) {
        this.observers.forEach(observer => observer.execute(keycode));
    }
}

class MoveSnake {
    constructor(snake, board, detectFruitColision, createFruit) {
        this.snake = snake;
        this.board = board;
        this.detectFruitColision = detectFruitColision;
        this.createFruit = createFruit;
    }

    execute() {
        if (!this.board.gameOver) {
            this.moveHead();
            if (this.detectFruitColision.execute()) {
                this.board.score++;
                this.createFruit.execute();
            } else {
                this.removeTail();
            }
        }
    }

    moveHead() {
        this.snake.body.unshift({
            x: this.snake.body[0].x + this.snake.velocityX,
            y: this.snake.body[0].y + this.snake.velocityY
        })
    }

    removeTail() {
        this.snake.body.pop();
    }
}

class DetectSnakeColision {
    constructor(snake, board) {
        this.snake = snake;
        this.board = board;
    }

    execute() {
        if (this.detectWallColision() || this.detectSelfColision()) {
            this.board.gameOver = true;
        }
    }

    detectWallColision() {
        let head = this.snake.body[0];
        if (!(head.x >= 0 && head.x < this.board.size && head.y >= 0 && head.y < this.board.size)) {
            return true;
        }
        return false;
    }

    detectSelfColision() {
        let head = this.snake.body[0];
        for (let bodyIndex = 1; bodyIndex < this.snake.body.length; bodyIndex++) {
            let bodyPart = this.snake.body[bodyIndex];
            if (head.x === bodyPart.x && head.y === bodyPart.y)
                return true;
        }
        return false;
    }
}

class UpMove {
    constructor(snake) {
        this.snake = snake;
    }
    execute(keycode) {
        if (keycode === "ArrowUp" && (this.snake.velocityY !== +1 || this.snake.body.length === 1)) {
            this.snake.velocityX = 0;
            this.snake.velocityY = -1;
        }
    }
}

class DownMove {
    constructor(snake) {
        this.snake = snake;
    }
    execute(keycode) {
        if (keycode === "ArrowDown" && (this.snake.velocityY !== -1 || this.snake.body.length === 1)) {
            this.snake.velocityX = 0;
            this.snake.velocityY = +1;
        }
    }
}

class RightMove {
    constructor(snake) {
        this.snake = snake;
    }
    execute(keycode) {
        if (keycode === "ArrowRight" && (this.snake.velocityX !== -1 || this.snake.body.length === 1)) {
            this.snake.velocityX = 1;
            this.snake.velocityY = 0;
        }
    }
}

class LeftMove {
    constructor(snake) {
        this.snake = snake;
    }
    execute(keycode) {
        if (keycode === "ArrowLeft" && (this.snake.velocityX !== +1 || this.snake.body.length === 1)) {
            this.snake.velocityX = -1;
            this.snake.velocityY = 0;
        }
    }
}

class Restart {
    constructor(snake, board, createFruit) {
        this.snake = snake;
        this.board = board;
        this.createFruit = createFruit;
    }
    execute(keycode) {
        if (keycode === "Space" && this.board.gameOver) {
            this.snake.reset();
            this.board.gameOver = false;
            this.board.score = 0;
            this.createFruit.execute();
        }
    }
}

class Snake {
    constructor(board) {
        this.board = board;
        this.velocityX = 0;
        this.velocityY = 0;
        this.body = [{
            x: Math.floor(this.board.size / 2),
            y: Math.floor(this.board.size / 2)
        }];
    }

    reset() {
        this.velocityX = 0;
        this.velocityY = 0;
        this.body = [{
            x: Math.floor(this.board.size / 2),
            y: Math.floor(this.board.size / 2)
        }];
    }

}

class Board {
    constructor(size) {
        this.size = size;
        this.score = 0;
        this.gameOver = false;
    }
}

class CreateFruit {
    constructor(board, snake, fruit) {
        this.board = board;
        this.snake = snake;
        this.fruit = fruit;
    }

    execute() {
        let x = Math.floor(Math.random() * this.board.size);
        let y = Math.floor(Math.random() * this.board.size);
        for (let bodyPart of this.snake.body) {
            if (bodyPart.x === x && bodyPart.y === y)
                return this.execute();
        }
        this.fruit.position = { x, y };
    }
}

class DetectFruitColision {
    constructor(snake, fruit) {
        this.snake = snake;
        this.fruit = fruit;
    }
    execute() {
        return this.snake.body[0].x === this.fruit.position.x && this.snake.body[0].y === this.fruit.position.y
    }
}

class Fruit {
    constructor() {
        this.position = {
            x: 0,
            y: 0
        }
    }
}

const board = new Board(15);
const fruit = new Fruit();
const snake = new Snake(board);
const createFruit = new CreateFruit(board, snake, fruit);
createFruit.execute();
const detectFruitColision = new DetectFruitColision(snake, fruit);
const detectSnakeColision = new DetectSnakeColision(snake, board);
const moveSnake = new MoveSnake(snake, board, detectFruitColision, createFruit);
const gameLoopEvent = new GameLoopEvent();
gameLoopEvent.attach(moveSnake)
gameLoopEvent.attach(detectSnakeColision)
gameLoopEvent.attach(detectFruitColision)
const upMove = new UpMove(snake);
const downMove = new DownMove(snake);
const rightMove = new RightMove(snake);
const leftMove = new LeftMove(snake);
const restart = new Restart(snake, board, createFruit);
const keyboardEvent = new Keyboard();
keyboardEvent.attach(upMove)
keyboardEvent.attach(downMove)
keyboardEvent.attach(rightMove)
keyboardEvent.attach(leftMove)
keyboardEvent.attach(restart)

export {
    gameLoopEvent,
    board,
    snake,
    fruit,
    Canvas
};