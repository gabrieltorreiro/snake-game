class Canvas {
    constructor(board){
        this.canvas = document.querySelector("canvas");
        this.ctx = this.canvas.getContext('2d');
        this.blockSize = 30;
        this.width = this.blockSize * board.size;
        this.height = this.blockSize * board.size;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
    }

    draw(snake, fruit, score, gameOver){
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.drawFruit(fruit);
        this.drawSnake(snake);
        this.ctx.font = "20px Arial";
        this.ctx.fillText(`Score: ${score}`, 10, 20);
        if (gameOver) {
            this.ctx.fillStyle = "black";
            this.ctx.font = "50px Arial";
            this.ctx.fillText(`Game Over`, 100, 150);
            this.ctx.fillText(`Score: ${score}`, 130, 210);
            this.ctx.font = "20px Arial";
            this.ctx.fillStyle = "orange";
            this.ctx.fillText(`Press "Space" to continue`, 110, 250);
        }
    }

    drawSnake(snake){
        this.ctx.fillStyle = "green";
        for (let bodyParts of snake.body) {
            bodyParts && this.ctx.fillRect(bodyParts.x * this.blockSize, bodyParts.y * this.blockSize, this.blockSize, this.blockSize);
        }
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(snake.body[0].x * this.blockSize, snake.body[0].y * this.blockSize, this.blockSize, this.blockSize);
    }

    drawFruit(fruit) {
        this.ctx.fillStyle = "red";
        this.ctx.fillRect(fruit.position.x * this.blockSize, fruit.position.y * this.blockSize, this.blockSize, this.blockSize);
    }
}

class Game {
    constructor(canvas, fruit, snake, createFruit, detectFruitColision, board, detectSnakeColision) {
        this.boardSize = board.size;
        this.canvas = canvas;
        this.fruit = fruit;
        this.snake = snake;
        this.createFruit = createFruit;
        this.detectFruitColision = detectFruitColision;
        this.detectSnakeColision = detectSnakeColision;
    }

    resetVariables() {
        this.snake.reset();
        this.gameOver = false;
        this.score = 0;
    }

    restart() {
        this.stop();
        this.start();
    }

    start() {
        this.resetVariables();
        this.fruit.position = this.createFruit.execute(this.snake.body);
        this.interval = window.setInterval(() => {
            this.update();
            this.draw();
        }, 1000 / 10);
    }

    stop() {
        window.clearInterval(this.interval);
    }

    execCommand(event) {
        if (this.gameOver && event == "Space") {
            this.restart();
        } else {
            this.snake.execCommand(event);
        }
    }

    update() {
        this.snake.moveHead();
        if (this.detectFruitColision.execute(this.snake.body[0], this.fruit)) {
            this.score++;
            this.fruit.position = this.createFruit.execute(this.snake.body);
        } else {
            this.snake.removeTail();
        }
        if (this.detectSnakeColision.execute(this.snake, this.boardSize)) {
            this.stop();
            this.gameOver = true;
        }
    }

    draw() {
        this.canvas.draw(this.snake, this.fruit, this.score, this.gameOver);
    }
}

class DetectSnakeColision {
    execute(snake, boardSize){
        return this.detectSelfColision(snake) || this.detectWallColision(snake, boardSize)
    }

    detectWallColision(snake, boardSize) {
        let head = snake.body[0];
        if (!(head.x >= 0 && head.x < boardSize && head.y >= 0 && head.y < boardSize))
            return true;
        return false;
    }
    
    detectSelfColision(snake) {
        let head = snake.body[0];
        for (let i = 1; i < snake.body.length; i++) {
            if (head.x == snake.body[i].x && head.y == snake.body[i].y)
                return true;
        }
        return false;
    }
}

class Snake {
    constructor(board) {
        this.board = board;
        this.velocityX = 0;
        this.velocityY = 0;
        this.body = [{
            x: Math.floor(this.board.size/2),
            y: Math.floor(this.board.size/2)
        }];
    }

    execCommand(command) {
        if (command == "ArrowUp" && (this.velocityY != +1 || this.body.length == 1)) {
            this.velocityY = -1;
            this.velocityX = 0;
        }
        if (command == "ArrowDown" && (this.velocityY != -1 || this.body.length == 1)) {
            this.velocityY = +1;
            this.velocityX = 0;
        }
        if (command == "ArrowRight" && (this.velocityX != -1 || this.body.length == 1)) {
            this.velocityY = 0;
            this.velocityX = +1;
        }
        if (command == "ArrowLeft" && (this.velocityX != +1 || this.body.length == 1)) {
            this.velocityY = 0;
            this.velocityX = -1;
        }
    }

    moveHead() {
        this.body.unshift({
            x: this.body[0].x + this.velocityX,
            y: this.body[0].y + this.velocityY
        })
    }

    removeTail() {
        this.body.pop();
    }

    reset() {
        this.velocityX = 0;
        this.velocityY = 0;
        this.body = [{
            x: Math.floor(this.board.size/2),
            y: Math.floor(this.board.size/2)
        }];
    }

}

class Board {
    constructor(size){
        this.size = size;
    }
}

class CreateFruit {
    constructor(board){
        this.board = board;
    }

    execute(snake) {
        let x = Math.floor(Math.random() * this.board.size);
        let y = Math.floor(Math.random() * this.board.size);
        for (let bodyPart of snake) {
            if (bodyPart.x == x && bodyPart.y == y)
                return this.execute();
        }
        return { x, y };
    }
}

class DetectFruitColision {
    execute(snakeHead, fruit) {
        return snakeHead.x == fruit.position.x && snakeHead.y == fruit.position.y
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

addEventListener("keydown", (e) => {
    game.execCommand(e.code);
});

const board = new Board(15);
const canvas = new Canvas(board);
const fruit = new Fruit();
const snake = new Snake(board);
const createFruit = new CreateFruit(board);
const detectFruitColision = new DetectFruitColision();
const detectSnakeColision = new DetectSnakeColision();
const game = new Game(canvas, fruit, snake, createFruit, detectFruitColision, board, detectSnakeColision);
game.start();