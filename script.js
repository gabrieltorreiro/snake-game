class Game {
    constructor() {
        this.canvas = document.querySelector("canvas");
        this.ctx = this.canvas.getContext('2d');
        this.blockSize = 30;
        this.width = this.blockSize * 15;
        this.height = this.blockSize * 15;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.fruit = { x: 0, y: 0 };
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

    createFruit() {
        let x = Math.floor(Math.random() * 15) * this.blockSize;
        let y = Math.floor(Math.random() * 15) * this.blockSize;
        for (let bodyPart of this.snake) {
            if (bodyPart.x == x && bodyPart.y == y)
                return this.createFruit();
        }
        this.fruit = { x, y };
    }

    restart() {
        this.stop();
        this.start();
    }

    start() {
        this.resetVariables();
        this.createFruit();
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
        if (this.snake[0].x == this.fruit.x && this.snake[0].y == this.fruit.y) {
            this.score++;
            this.createFruit();
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
        this.ctx.fillStyle = "red";
        this.ctx.fillRect(this.fruit.x, this.fruit.y, this.blockSize, this.blockSize);
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

addEventListener("keydown", (e) => {
    game.execCommand(e.code);
});

let game = new Game();
game.start();