let rows = 15;
let cols = 10;
let obstacleChance = 0.3;
var field = [];

window.onload = () => {
	let canvas = document.getElementById('field');
	let ctx = canvas.getContext('2d');

	let over = document.getElementById('over');
	let oct = canvas.getContext('2d');
	over.addEventListener('mousemove', mouseMoved);
	//over.addEventListener('mousedown', mouseDown);

	let squareWidth = canvas.width / cols;
	let squareHeight = canvas.height / rows;
	let mouseAt = {
		x : -1,
		y : -1
	};
	let clickedAt = {
		x : -1,
		y : -1
	};
	field = createCanvas();
	drawField();

	function createCanvas() {
		let field = [];
		for (let i = 0; i < rows; i++) {
			for (let j = 0; j < cols; j++) {
				field[i * cols + j] = Math.random();
			}
		}
		return field;
	}

	function mouseMoved(event) {
		var canvasMouseX = event.clientX - (canvas.offsetLeft - window.pageXOffset);
		var canvasMouseY = event.clientY - (canvas.offsetTop - window.pageYOffset);

		let squareX = Math.floor(canvasMouseX / squareWidth);
		let squareY = Math.floor(canvasMouseY / squareHeight);
		if (squareX != mouseAt.x || squareY != mouseAt.y) {
			mouseAt.x = squareX;
			mouseAt.y = squareY;
			oct.clearRect(0, 0, over.width, over.height);
			drawField();
			highlight(squareX, squareY);
		}
	}

	function mouseDown(event) {
		//?
		if (field[mouseAt.y * cols + mouseAt.x] >= obstacleChance) {
			clickedAt.x = mouseAt.x;
			clickedAt.y = mouseAt.y;
			oct.fillStyle = 'blue';
			oct.fillRect(mouseAt.x * squareWidth, mouseAt.y * squareHeight, squareWidth, squareHeight);
		}
	}

	function highlight(x, y) {
		oct.fillStyle = 'red';
		oct.globalAlpha = 0.6;
		oct.fillRect(x * squareWidth, y * squareHeight, squareWidth, squareHeight);
		oct.globalAlpha = 1;
	}

	function drawField() {
		ctx.clearRect(0, 0, ctx.width, ctx.height);
		for (let i = 0; i < rows; i++) {
			for (let j = 0; j < cols; j++) {
				if (field[i * cols + j] < obstacleChance) {
					ctx.fillStyle = '#333333';
				}
				else {
					ctx.fillStyle = '#eeeeee';
				}
				ctx.fillRect(j * squareWidth, i * squareHeight, squareWidth, squareHeight);
			}
		}
		/*if (clickedAt[0] != -1 && clickedAt[1] != -1) {
			ctx.fillStyle = 'blue';
			ctx.fillRect(clickedAt[0] * squareWidth, clickedAt[1] * squareHeight, squareWidth, squareHeight);
		} */
	}
};
