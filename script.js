class Game {
    constructor() {
        this.canvas = document.querySelector("canvas");
        this.ctx = this.canvas.getContext('2d');
        this.blockSize = 30;
        this.width = this.blockSize * 15;
        this.height = this.blockSize * 15;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.fruit = new Fruit();
    }

    resetVariables() {
        this.velocityX = 0;
        this.velocityY = 0;
        this.snake = [{
            x: this.blockSize * 7,
            y: this.blockSize * 7
        }];
        this.gameOver = false;
        this.score = 0;
    }

    restart() {
        this.stop();
        this.start();
    }

    start() {
        this.resetVariables();
        this.fruit.createFruit(this.snake, this.blockSize, 15, 15);
        this.interval = window.setInterval(() => {
            this.update();
            this.draw();
        }, 1000 / 10);
    }

    stop() {
        window.clearInterval(this.interval);
    }

    execCommand(command) {
        this.commands = {
            ArrowUp: () => {
                if (this.velocityY != 1) {
                    this.velocityY = -1;
                    this.velocityX = 0;
                }
            },
            ArrowDown: () => {
                if (this.velocityY != -1) {
                    this.velocityY = +1;
                    this.velocityX = 0;
                }
            },
            ArrowRight: () => {
                if (this.velocityX != -1) {
                    this.velocityX = +1;
                    this.velocityY = 0;
                }
            },
            ArrowLeft: () => {
                if (this.velocityX != 1) {
                    this.velocityX = -1;
                    this.velocityY = 0;
                }
            },
            Space: () => {
                if (this.gameOver) {
                    this.restart();
                }
            }
        }
        this.commands[command] && this.commands[command]();
    }

    detectColision() {
        let head = this.snake[0];
        if (head.x >= this.width || head.x < 0 || head.y >= this.height || head.y < 0)
            return true;
        for (let i = 1; i < this.snake.length; i++) {
            if (head.x == this.snake[i].x && head.y == this.snake[i].y)
                return true;
        }
        return false;
    }

    update() {
        let lastHeadPosition = this.snake[0];
        if (this.fruit.detectColision(this.snake[0])) {
            this.score++;
            this.fruit.createFruit(this.snake, this.blockSize, 15, 15);
        } else {
            this.snake.pop();
        }
        this.snake.unshift({ ...lastHeadPosition });
        this.snake[0].x += this.velocityX * this.blockSize;
        this.snake[0].y += this.velocityY * this.blockSize;
        if (this.detectColision() == true) {
            this.gameOver = true;
            this.stop();
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.ctx.fillStyle = "green";
        for (let bodyParts of this.snake) {
            bodyParts && this.ctx.fillRect(bodyParts.x, bodyParts.y, this.blockSize, this.blockSize);
        }
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(this.snake[0].x, this.snake[0].y, this.blockSize, this.blockSize);
        this.ctx.font = "20px Arial";
        this.ctx.fillText(`Score: ${this.score}`, 10, 20);
        this.fruit.draw(this.ctx, this.blockSize);
        if (this.gameOver) {
            this.ctx.fillStyle = "black";
            this.ctx.font = "50px Arial";
            this.ctx.fillText(`Game Over`, 100, 150);
            this.ctx.fillText(`Score: ${this.score}`, 130, 210);
            this.ctx.font = "20px Arial";
            this.ctx.fillStyle = "orange";
            this.ctx.fillText(`Press "Space" to continue`, 110, 250);
        }
    }

}

class Fruit {
    constructor() {
        this.position = {
            x: 0,
            y: 0
        }
    }

    createFruit(snake, blockSize, width, height) {
        let x = Math.floor(Math.random() * width) * blockSize;
        let y = Math.floor(Math.random() * height) * blockSize;
        for (let bodyPart of snake) {
            if (bodyPart.x == x && bodyPart.y == y)
                return this.createFruit();
        }
        this.position = { x, y };
    }

    detectColision(snakeHead) {
        return snakeHead.x == this.position.x && snakeHead.y == this.position.y
    }

    draw(ctx, blockSize) {
        ctx.fillStyle = "red";
        ctx.fillRect(this.position.x, this.position.y, blockSize, blockSize);
    }


}

addEventListener("keydown", (e) => {
    game.execCommand(e.code);
});

let game = new Game();
game.start();