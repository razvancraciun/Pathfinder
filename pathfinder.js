let rows = 100;
let cols = 100;
let obstacleChance = 0.2;
var field = [];

window.onload = () => {
	let canvas = document.getElementById('field');
	let ctx = canvas.getContext('2d');

	let over = document.getElementById('over');
	let oct = canvas.getContext('2d');
	over.addEventListener('mousemove', mouseMoved);
	over.addEventListener('mousedown', mouseDown);

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
	let path = [];
	let drawnPath = [];
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
			if (lastClickedAt.x != -1 && lastClickedAt.y != -1 && field) {
				let dist = findPath(lastClickedAt.y * cols + lastClickedAt.x, clickedAt.y * cols + clickedAt.x);
				drawnPath = [];
				if (dist.found) {
					setTimeout(
						function addToDrawnPath(i) {
							if (i < path.length) {
								drawnPath.push(path[i]);
								drawField();
								setTimeout(addToDrawnPath, 1000 / path.length, i + 1);
							}
						},
						1000 / path.length,
						0
					);
				}
				drawField();
			}
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

		for (let i = 0; i < drawnPath.length; i++) {
			oct.fillRect(
				(drawnPath[i] % cols) * squareWidth,
				Math.floor(drawnPath[i] / cols) * squareHeight,
				squareWidth,
				squareHeight
			);
		}
	}

	function findPath(v1, v2) {
		path = [];
		let dist = [];
		let queue = [];
		let parent = [];
		for (let i = 0; i < graph.length; i++) {
			dist.push(Number.MAX_SAFE_INTEGER);
		}
		dist[v1] = 0;
		parent[v1] = -1;
		queue.unshift(v1);

		while (queue.length > 0) {
			let v = queue[0];
			for (let i = 1; i < queue.length; i++) {
				if (dist[queue[i]] < dist[v]) {
					v = queue[i];
				}
			}
			queue.splice(queue.indexOf(v), 1);

			let found = false;
			graph[v].forEach((u) => {
				let alt = dist[v] + 1;
				if (alt < dist[u]) {
					dist[u] = alt;
					queue.unshift(u);
					parent[u] = v;
					if (u == v2) {
						found = true;
						return;
					}
				}
			});
			if (found === true) {
				let node = v2;
				while (node != -1) {
					path.unshift(node);
					node = parent[node];
				}
				return {
					dist  : dist[v2],
					path  : path,
					found : true
				};
			}
		}
		return {
			found : false
		};
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

function arrayMin(arr) {
	if (arr.length <= 0) {
		throw 'Array length is ' + arr.length;
	}
	let min = arr[0];
	for (let i = 1; i < arr.length; i++) {
		if (arr[i] < min) min = arr[i];
	}
	return min;
}
