let rows = 15;
let cols = 10;
let obstacleChance = 0.3;
var field = [];

window.onload = () => {
	let canvas = document.getElementById('field');
	let ctx = canvas.getContext('2d');

	let over = document.getElementById('over');
	let oct = canvas.getContext('2d');
	canvas.addEventListener('mousemove', mouseMoved);
	canvas.addEventListener('mousedown', mouseDown);

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
	let graph = generateGraph();

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
		let lastClickedAt = {
			x : clickedAt.x,
			y : clickedAt.y
		};
		if (field[mouseAt.y * cols + mouseAt.x] >= obstacleChance) {
			clickedAt.x = mouseAt.x;
			clickedAt.y = mouseAt.y;
			oct.fillStyle = 'blue';
			oct.fillRect(mouseAt.x * squareWidth, mouseAt.y * squareHeight, squareWidth, squareHeight);
		}
		if (lastClickedAt.x != -1 && lastClickedAt.y != -1) {
			findPath(lastClickedAt.y * cols + lastClickedAt.x, clickedAt.y * cols + clickedAt.x);
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
		if (clickedAt.x != -1 && clickedAt.y != -1) {
			oct.fillStyle = 'blue';
			oct.fillRect(clickedAt.x * squareWidth, clickedAt.y * squareHeight, squareWidth, squareHeight);
		}
	}

	function findPath(v1, v2) {
		console.log(v1 + ' ' + v2);
		//run dijkstra
	}

	function generateGraph() {
		let graph = [];
		for (var i = 0; i < field.length; i++) {
			graph[i] = [];
		}
		for (var i = 0; i < rows; i++) {
			for (var j = 0; j < cols; j++) {
				if (field[i * cols + j] >= obstacleChance) {
					if (field[i * cols + j + 1] >= obstacleChance && j + 1 < cols) {
						//right
						graph[i * cols + j].push(i * cols + j + 1);
					}
					if (field[(i - 1) * cols + j] >= obstacleChance && i - 1 >= 0) {
						//up
						graph[i * cols + j].push((i - 1) * cols + j);
					}
					if (field[(i + 1) * cols + j] >= obstacleChance && i + 1 < rows) {
						//down
						graph[i * cols + j].push((i + 1) * cols + j);
					}
					if (field[i * cols + j - 1] >= obstacleChance && j - 1 >= 0) {
						//left
						graph[i * cols + j].push(i * cols + j - 1);
					}
				}
			}
		}
		return graph;
	}

	function logGraph(graph) {
		for (let i = 0; i < graph.length; i++) {
			console.log(i + '->' + graph[i]);
		}
	}
};
