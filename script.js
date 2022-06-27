class Canvas {
    constructor(){
        this.canvas = document.querySelector("canvas");
        this.ctx = this.canvas.getContext('2d');
        this.blockSize = 30;
        this.width = this.blockSize * 15;
        this.height = this.blockSize * 15;
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
            bodyParts && this.ctx.fillRect(bodyParts.x, bodyParts.y, this.blockSize, this.blockSize);
        }
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(snake.body[0].x, snake.body[0].y, this.blockSize, this.blockSize);
    }

    drawFruit(fruit) {
        this.ctx.fillStyle = "red";
        this.ctx.fillRect(fruit.position.x, fruit.position.y, this.blockSize, this.blockSize);
    }
}

class Game {
    constructor(canvas, fruit, snake, createFruit) {
        this.canvas = canvas;
        this.fruit = fruit;
        this.snake = snake;
        this.createFruit = createFruit;
    }

    resetVariables() {
        this.snake = this.snake.reset(this.canvas.blockSize);
        this.gameOver = false;
        this.score = 0;
    }

    restart() {
        this.stop();
        this.start();
    }

    start() {
        this.resetVariables();
        this.fruit.position = this.createFruit.execute(this.snake.body, this.canvas.blockSize, 15, 15);
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
        if (this.fruit.detectColision(this.snake.body[0])) {
            this.score++;
            this.fruit.position = this.createFruit.execute(this.snake.body, this.canvas.blockSize, 15, 15);
        } else {
            this.snake.removeTail();
        }
        if (this.snake.detectSelfColision() || this.snake.detectWallColision(this.canvas.width, this.canvas.height)) {
            this.stop();
            this.gameOver = true;
        }
    }

    draw() {
        this.canvas.draw(this.snake, this.fruit, this.score, this.gameOver);
    }
}

class Snake {
    constructor(blockSize) {
        this.velocityX = 0;
        this.velocityY = 0;
        this.body = [{
            x: blockSize * 7,
            y: blockSize * 7
        }];
        this.blockSize = blockSize;
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
            x: this.body[0].x + (this.velocityX * this.blockSize),
            y: this.body[0].y + (this.velocityY * this.blockSize)
        })
    }

    removeTail() {
        this.body.pop();
    }

    detectWallColision(width, height) {
        let head = this.body[0];
        if (!(head.x >= 0 && head.x < width && head.y >= 0 && head.y < height))
            return true;
        return false;
    }

    detectSelfColision() {
        let head = this.body[0];
        for (let i = 1; i < this.body.length; i++) {
            if (head.x == this.body[i].x && head.y == this.body[i].y)
                return true;
        }
        return false;
    }

    reset(blockSize) {
        return new Snake(blockSize);
    }

}

class CreateFruit {
    execute(snake, blockSize, width, height) {
        let x = Math.floor(Math.random() * width) * blockSize;
        let y = Math.floor(Math.random() * height) * blockSize;
        for (let bodyPart of snake) {
            if (bodyPart.x == x && bodyPart.y == y)
                return this.execute();
        }
        return { x, y };
    }
}

class Fruit {
    constructor() {
        this.position = {
            x: 0,
            y: 0
        }
    }

    detectColision(snakeHead) {
        return snakeHead.x == this.position.x && snakeHead.y == this.position.y
    }

}

addEventListener("keydown", (e) => {
    game.execCommand(e.code);
});

const canvas = new Canvas();
const fruit = new Fruit();
const snake = new Snake(canvas.blockSize);
const createFruit = new CreateFruit();
const game = new Game(canvas, fruit, snake, createFruit);
game.start();