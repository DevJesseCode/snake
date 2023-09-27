const container = document.querySelector(".game-container");
const scoreDisplay = document.querySelector(".score-display");
const head = document.createElement("div");
const target = document.createElement("img");
const unitSize = 40;
container.style.width = `${
	Math.floor((window.innerWidth - 16) / unitSize) * unitSize
}px`;
container.style.height = `${
	Math.floor((window.innerHeight - 16) / unitSize) * unitSize
}px`;
/*
Better than this unreliable, laggy shit
container.style.width = window.innerWidth - 16;
container.style.height = window.innerHeight - 16;
let squareSize;
for (let i = 40; i < 200.01; i += 0.01) {
	if (container.clientWidth / i === parseFloat((container.clientWidth / i).toFixed(0)) &&
	container.clientHeight / i === parseFloat((container.clientHeight / i).toFixed(0))) {
		squareSize = i;
	};
};
*/
const game = {
	width: container.clientWidth,
	height: container.clientHeight,
	columns: Math.floor((window.innerWidth - 16) / unitSize),
	rows: Math.floor((window.innerHeight - 16) / unitSize),
	moveTime: 500,
	bodyCount: 0,
	score: 0,
};
let moveInterval;

head.classList.add("snake", "head");
head.style.top = `${Math.floor(game.height / 2 / unitSize) * unitSize}px`;
head.style.left = `${Math.floor(game.width / 2 / unitSize) * unitSize}px`;
target.classList.add("target", "snake");
target.style.top = "0px";
target.style.left = "0px";
target.src = "";
container.appendChild(head);
container.appendChild(target);

const changeDirection = (direction) => {
	switch (direction) {
		// Added checking moving in the current direction to if statements
		// to prevent players using direction keys to speed up the snake
		case "up":
			if (
				!(
					game.currentDirection === "up" ||
					game.currentDirection === "down"
				)
			) {
				if (moveInterval) clearInterval(moveInterval);
				bodyTick();
				head.style.top = `${
					parseInt(head.style.top) - unitSize < 0
						? game.height + (parseInt(head.style.top) - unitSize)
						: parseInt(head.style.top) - unitSize
				}px`;
				afterMove();
				moveInterval = setInterval(() => {
					bodyTick();
					head.style.top = `${
						parseInt(head.style.top) - unitSize < 0
							? game.height +
							  (parseInt(head.style.top) - unitSize)
							: parseInt(head.style.top) - unitSize
					}px`;
					afterMove();
				}, game.moveTime);
			}
			break;
		case "down":
			if (
				!(
					game.currentDirection === "up" ||
					game.currentDirection === "down"
				)
			) {
				if (moveInterval) clearInterval(moveInterval);
				bodyTick();
				head.style.top = `${
					(parseInt(head.style.top) + unitSize) % game.height
				}px`;
				afterMove();
				moveInterval = setInterval(() => {
					bodyTick();
					head.style.top = `${
						(parseInt(head.style.top) + unitSize) % game.height
					}px`;
					afterMove();
				}, game.moveTime);
			}
			break;
		case "left":
			if (
				!(
					game.currentDirection === "left" ||
					game.currentDirection === "right"
				)
			) {
				if (moveInterval) clearInterval(moveInterval);
				bodyTick();
				head.style.left = `${
					parseInt(head.style.left) - unitSize < 0
						? game.width + (parseInt(head.style.left) - unitSize)
						: parseInt(head.style.left) - unitSize
				}px`;
				afterMove();
				moveInterval = setInterval(() => {
					bodyTick();
					head.style.left = `${
						parseInt(head.style.left) - unitSize < 0
							? game.width +
							  (parseInt(head.style.left) - unitSize)
							: parseInt(head.style.left) - unitSize
					}px`;
					afterMove();
				}, game.moveTime);
			}
			break;
		case "right":
			if (
				!(
					game.currentDirection === "left" ||
					game.currentDirection === "right"
				)
			) {
				if (moveInterval) clearInterval(moveInterval);
				bodyTick();
				head.style.left = `${
					(parseInt(head.style.left) + unitSize) % game.width
				}px`;
				afterMove();
				moveInterval = setInterval(() => {
					bodyTick();
					head.style.left = `${
						(parseInt(head.style.left) + unitSize) % game.width
					}px`;
					afterMove();
				}, game.moveTime);
			}
			break;
	}
	game.currentDirection = direction;
	// Moved updating the direction in the game object end of function
	// to fix no movement bug caused by direction being set before it
	// is checked by the if statements.
};
const afterMove = () => {
	checkCollision();
};
const generateRandomPosition = () => {
	// Generate random row and column indices within the game grid.
	const randomRow = Number((Math.random() * (game.rows - 2) + 1).toFixed(0));
	const randomColumn = Number(
		(Math.random() * (game.columns - 2) + 1).toFixed(0)
	);

	// Calculate the top and left positions based on the random indices and unitSize.
	const top = randomRow * unitSize + "px";
	const left = randomColumn * unitSize + "px";

	return { top, left };
};
const placeTarget = () => {
	let targetPosition;
	let collision;

	// Generate a random target position until it's valid (not occupied by the snake).
	do {
		targetPosition = generateRandomPosition();
		// Check if the target position collides with the snake's body or head.
		collision = Array.from(document.querySelectorAll(".body")).some(
			(bodyPart) => {
				const bodyRect = bodyPart.getBoundingClientRect();
				return (
					(bodyRect.x === parseInt(targetPosition.left) &&
						bodyRect.y === parseInt(targetPosition.top)) ||
					(head.getBoundingClientRect().x ===
						parseInt(targetPosition.left) &&
						head.getBoundingClientRect().y ===
							parseInt(targetPosition.top))
				);
			}
		);
		// If there is a collision, regenerate the target position.
	} while (collision);

	// Set the target's position to the valid position.
	target.style.top = targetPosition.top;
	target.style.left = targetPosition.left;
};

// Call placeTarget to initially place the target when the game starts.
placeTarget();

const checkCollision = () => {
	if (
		head.getBoundingClientRect().x === target.getBoundingClientRect().x &&
		head.getBoundingClientRect().y === target.getBoundingClientRect().y
	) {
		const bodyPart = document.createElement("div");
		bodyPart.classList.add("snake", "body", "hidden");
		bodyPart.setAttribute("id", `body-${game.bodyCount}`);
		bodyPart.path = {};
		container.appendChild(bodyPart);
		game.bodyCount++;
		game.score++;
		scoreDisplay.textContent = game.score;
		placeTarget();
	}
};
const bodyTick = () => {
	const bodyParts = document.querySelectorAll(".body");
	if (!bodyParts) return false;
	for (let index = bodyParts.length - 1; index >= 0; index--) {
		const element = bodyParts[index];
		element.classList.remove("hidden");
		if (!(index === 0)) {
			element.style.top = bodyParts[index - 1].style.top;
			element.style.left = bodyParts[index - 1].style.left;
		} else {
			element.style.top = head.style.top;
			element.style.left = head.style.left;
		}
	}
	// I had to rewrite this whole fucking function to iterate
	// the bodyParts backwards and go to its predecessors position
	// rather than iterate forwards and keep track of the prev and
	// next elements and juggle handling path properties as objects
	// for all their motherfucking asses --- calm down😌
};

document.addEventListener("keydown", (e) => {
	switch (e.key) {
		case "ArrowUp":
		case "w":
			changeDirection("up");
			break;
		case "ArrowDown":
		case "s":
			changeDirection("down");
			break;
		case "ArrowLeft":
		case "a":
			changeDirection("left");
			break;
		case "ArrowRight":
		case "d":
			changeDirection("right");
			break;
	}
});
