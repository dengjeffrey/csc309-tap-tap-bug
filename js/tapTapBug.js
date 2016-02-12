var canvas = document.getElementById("game");
var context = canvas.getContext("2d");
const AUDIO_ELEMENT_ID = "gameMusic";

const FPS = 60;

var timeLeft = 60;
var topScore;
var level1TopScore = 0;
var level2TopScore = 0;
var score = 0;
var lost = Boolean(false);

var blackSpeed = 150;
var redSpeed = 75;
var orangeSpeed = 60; 

var bugs = [];
var fruitList = ["apple", "banana", "watermelon", "orange", "grape"];
var fruits = [];
var level = 1;

var squashRadius = 30;
var levelDidChange = 0;

// Timers
var countdownTimer;
var mainGameTimer;
var addBugTimer;

// Button states
var isPaused = Boolean(false);
var isMute = Boolean(false);
var beatLevel = Boolean(false);

//////////////////////////////////////////
// UI
//////////////////////////////////////////
const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT = 600; 
const CANVAS_MARGIN = 30;

// Menu
const MENU_BAR_HEIGHT = 50;
const MENU_BAR_HORIZONTAL_MARGIN = 10;
const MENU_BAR_VERTICAL_MARGIN = 20;

// Pause
const PAUSE_TEXT = "PAUSED";
const PAUSE_BUTTON_WIDTH = 24;
const PAUSE_BUTTON_HEIGHT = 24;
const PAUSE_BUTTON_GAP = 10; 
const PAUSE_BUTTON_X = CANVAS_WIDTH/2 - PAUSE_BUTTON_WIDTH/2;
const PAUSE_BUTTON_Y = MENU_BAR_HEIGHT/2 - PAUSE_BUTTON_HEIGHT/2;

// Mute
const MUTE_TOTAL_WIDTH = 28;
const MUTE_SPEAKER_WIDTH = 18;
const MUTE_SPEAKER_END_WIDTH = 9;
const MUTE_TOTAL_HEIGHT = 24;
const MUTE_SPEAKER_END_HEIGHT = 12;
	
const MUTE_BUTTON_X = CANVAS_WIDTH - MUTE_TOTAL_WIDTH - CANVAS_MARGIN; 
const MUTE_BUTTON_Y = CANVAS_HEIGHT + MENU_BAR_HEIGHT - MUTE_TOTAL_HEIGHT - CANVAS_MARGIN; 
	
const SMALL_MUTEBAR_HEIGHT = MUTE_TOTAL_HEIGHT * 0.4;
const LARGE_MUTEBAR_HEIGHT = MUTE_TOTAL_HEIGHT * 0.8;
const MUTE_BAR_WIDTH = 2;
const MUTE_BAR_SPACING = 3;

// Game over
const GAME_OVER_TEXT = "Game over";
const RETRY_TEXT = "Retry";

var retryButton;


const EXIT_TEXT = "Exit";

// Next Level
const LEVEL_TEXT = "Level";
var nextLevelLabelAnimation;

// Colours
const ORANGE = "#F57336";
const RED = "#C22121";
const BLACK = "#161616";
const BLUE = "#577DC3";

function startGame() {
    document.getElementById("main").innerHTML = "<canvas id='game' width = '" + CANVAS_WIDTH + "' height = '" + (CANVAS_HEIGHT + MENU_BAR_HEIGHT) + "'>  </canvas> <audio id ='" + AUDIO_ELEMENT_ID + "' controls autoplay loop hidden: true;> <source src='audio/PlantsVsZombies.mp3' type='audio/mpeg'> </audio>";
	canvas = document.getElementById("game");
	
	// Add Mouse down listener
	canvas.addEventListener("mousedown", mouseDidPressDown, false);
	canvas.addEventListener("mouseup", mouseDidRelease, false);

	
	context = canvas.getContext("2d");
	initFruits();
	beginTimers();
}

function selectLevel(number) {
	if (number == 2)  {
		topScore = level2TopScore;
		document.getElementById("content-score").innerHTML = "<h4>HIGH SCORE</h4> <p>" + topScore + "</p>";
		level = 2;
		blackSpeed = 200;
		redSpeed = 100;
		orangeSpeed = 80;
	} else {
		topScore = level1TopScore;
		document.getElementById("content-score").innerHTML = "<h4>HIGH SCORE</h4> <p>" + topScore + "</p>";
		level = 1;
		blackSpeed = 150;
		redSpeed = 75;
		orangeSpeed = 60; 
	}
}

function nextLevel() {
		topScore = level2TopScore;
		level = 2;
		blackSpeed = 200;
		redSpeed = 100;
		orangeSpeed = 80;
}
function button(x, y, height, width) {
	this.x = x;
	this.y = y;
	this.height = height;
	this.width = width; 
}

/* Drawings */
// Callback when window refreshes

// Draw loop
function draw() {
	
	context.clearRect(0,0,CANVAS_WIDTH, CANVAS_HEIGHT + MENU_BAR_HEIGHT);
	
	drawMenu();
	moveBugs();
	spawnFruits();
	
	if (levelDidChange == 1 && nextLevelLabelAnimation) {
		nextLevelLabelAnimation.update();
	}
}

function drawMenu () {
	
	// Draw the bar itself
	context.globalAlpha = 1;
	context.fillStyle = BLUE; 
	context.fillRect(0, 0, CANVAS_WIDTH, MENU_BAR_HEIGHT);
	
	// Draw the other things
	drawPause();
	drawTimer();
	drawScore();
}

function drawPause() {
	
	// Pause button	
	if (!isPaused) {
		const BAR_WIDTH = PAUSE_BUTTON_WIDTH/2 - PAUSE_BUTTON_GAP/2;
		
		context.globalAlpha = 1;
		context.fillStyle = "white";
		context.fillRect(PAUSE_BUTTON_X, PAUSE_BUTTON_Y, BAR_WIDTH, PAUSE_BUTTON_HEIGHT);
	
		context.fillRect(PAUSE_BUTTON_X + BAR_WIDTH + PAUSE_BUTTON_GAP/2, 
						 PAUSE_BUTTON_Y, 
						 BAR_WIDTH, 
						 PAUSE_BUTTON_HEIGHT);	
	}
	// Play button
	else {
		context.globalAlpha = 1;
		context.fillStyle = "white";
		context.beginPath();
		context.moveTo(PAUSE_BUTTON_X, PAUSE_BUTTON_Y);
		context.lineTo(PAUSE_BUTTON_X, PAUSE_BUTTON_Y + PAUSE_BUTTON_HEIGHT);
		context.lineTo(PAUSE_BUTTON_X + PAUSE_BUTTON_WIDTH, PAUSE_BUTTON_Y + PAUSE_BUTTON_HEIGHT/2);
	    context.fill();
	}
}

function drawPausedOverlay() {
	
	context.globalAlpha = 0.8;
	context.fillStyle = "black";
	context.fillRect(0, MENU_BAR_HEIGHT, CANVAS_WIDTH, CANVAS_HEIGHT);
	
	context.globalAlpha = 1;	
	context.fillStyle = "white";
	context.font = "60px Kenzo";
	
	var pauseTextWidth = context.measureText(PAUSE_TEXT).width;
	context.fillText(PAUSE_TEXT, (CANVAS_WIDTH - pauseTextWidth)/2, CANVAS_HEIGHT/2);
	
	drawMute();
}

function drawNextLevel() {
	/*
	context.globalAlpha = 0.8;
	context.fillStyle = "black";
	context.fillRect(0, MENU_BAR_HEIGHT, CANVAS_WIDTH, CANVAS_HEIGHT);
	*/
	var currentAlpha = 1;
	var alphaChange = 0.2;
	var currentLevelText = LEVEL_TEXT.concat(" " + level);

	levelDidChange = 1;
	
	context.fillStyle = "black";
	context.font = "60px Kenzo";
	
	var levelUpTextWidth = context.measureText(currentLevelText).width;
	
	this.update = function() {
		
		if (currentAlpha - alphaChange > 0) {
			currentAlpha -= alphaChange;			
		} else {
			currentAlpha = 0;
			levelDidChange = 0;
		}
		
		context.globalAlpha = currentAlpha;	
		context.fillStyle = "white";
		context.font = "60px Kenzo";
		
		context.fillText(currentLevelText, (CANVAS_WIDTH - levelUpTextWidth)/2, CANVAS_HEIGHT/2);		
	}
	
	update();
	
	return this;
}

function drawGameOver() {
	context.globalAlpha = 0.8;
	context.fillStyle = "black";
	context.fillRect(0, MENU_BAR_HEIGHT, CANVAS_WIDTH, CANVAS_HEIGHT);
	
	context.globalAlpha = 1;	
	context.fillStyle = "white";
	context.font = "60px Kenzo";
	
	var gameOverTextWidth = context.measureText(GAME_OVER_TEXT).width;
	context.fillText(GAME_OVER_TEXT, (CANVAS_WIDTH - gameOverTextWidth)/2, CANVAS_HEIGHT/2);
	
	var retryTextWidth = context.measureText(RETRY_TEXT).width;
	context.fillText(RETRY_TEXT, (CANVAS_WIDTH - gameOverTextWidth)/2, CANVAS_HEIGHT/2 + 30);
	
	var exitTextWidth = context.measureText(EXIT_TEXT).width;
	context.fillText(EXIT_TEXT, (CANVAS_WIDTH - gameOverTextWidth)/2, CANVAS_HEIGHT/2 + 24);
	
	retryButton = new button((CANVAS_WIDTH - gameOverTextWidth)/2, CANVAS_HEIGHT/2 + 30, context.measureText(RETRY_TEXT).width, 60);
}

function drawMute() {
	context.globalAlpha = 1;	
	context.fillStyle="white";
	
	if (isMute) {
		context.fillStyle="black";
	}

	context.fillRect(MUTE_BUTTON_X + MUTE_SPEAKER_WIDTH + MUTE_BAR_SPACING, MUTE_BUTTON_Y + (MUTE_TOTAL_HEIGHT - SMALL_MUTEBAR_HEIGHT)/2, MUTE_BAR_WIDTH, SMALL_MUTEBAR_HEIGHT);
	context.fillRect(MUTE_BUTTON_X + MUTE_SPEAKER_WIDTH + 2*MUTE_BAR_SPACING + MUTE_BAR_WIDTH, MUTE_BUTTON_Y + (MUTE_TOTAL_HEIGHT - LARGE_MUTEBAR_HEIGHT)/2, MUTE_BAR_WIDTH, LARGE_MUTEBAR_HEIGHT);

	context.fillStyle="white";
	context.lineWidth=2;
	context.beginPath();
	context.moveTo(MUTE_BUTTON_X, MUTE_BUTTON_Y + (MUTE_TOTAL_HEIGHT - MUTE_SPEAKER_END_HEIGHT)/2);
	context.lineTo(MUTE_BUTTON_X, MUTE_BUTTON_Y + (MUTE_TOTAL_HEIGHT - MUTE_SPEAKER_END_HEIGHT)/2 + MUTE_SPEAKER_END_HEIGHT);

	// Diagonal
	context.lineTo(MUTE_BUTTON_X + MUTE_SPEAKER_END_WIDTH, MUTE_BUTTON_Y + (MUTE_TOTAL_HEIGHT - MUTE_SPEAKER_END_HEIGHT)/2 + MUTE_SPEAKER_END_HEIGHT);

	context.lineTo(MUTE_BUTTON_X + MUTE_SPEAKER_WIDTH, MUTE_BUTTON_Y + MUTE_TOTAL_HEIGHT);
	context.lineTo(MUTE_BUTTON_X + MUTE_SPEAKER_WIDTH, MUTE_BUTTON_Y);

	// Diagonal
	context.lineTo(MUTE_BUTTON_X + MUTE_SPEAKER_END_WIDTH, MUTE_BUTTON_Y + (MUTE_TOTAL_HEIGHT - MUTE_SPEAKER_END_HEIGHT)/2);
	context.lineTo(MUTE_BUTTON_X, MUTE_BUTTON_Y + (MUTE_TOTAL_HEIGHT - MUTE_SPEAKER_END_HEIGHT)/2);
	context.moveTo(MUTE_BUTTON_X, MUTE_BUTTON_Y + (MUTE_TOTAL_HEIGHT - MUTE_SPEAKER_END_HEIGHT)/2);
	context.fill();
}

function drawTimer() {
	
	const SPACING = 20;
	
	context.globalAlpha = 1;
	context.fillStyle = "white";
	
	context.font = "15px Kenzo";
	context.fillText("Time left", MENU_BAR_HORIZONTAL_MARGIN, MENU_BAR_VERTICAL_MARGIN);
		 
	context.font = "20px Kenzo";
	context.fillText(timeLeft + " sec", MENU_BAR_HORIZONTAL_MARGIN, MENU_BAR_VERTICAL_MARGIN + SPACING);
}

function drawScore() {
	
	const SPACING = 20;
	const SCORE_STRING = "SCORE";
	const SCORE_AT_DRAW = score.toString();
	
	var scoreTextWidth;
	var pointsTextWidth;

	// Draw SCORE
	context.globalAlpha = 1;
	context.fillStyle = "white"; 
	context.font = "15px Kenzo";
	scoreTextWidth = context.measureText(SCORE_STRING).width;

	context.fillText(SCORE_STRING, CANVAS_WIDTH - MENU_BAR_HORIZONTAL_MARGIN - scoreTextWidth, MENU_BAR_VERTICAL_MARGIN);	

	// Draw POINTS
	context.font = "20px Kenzo";
	pointsTextWidth = context.measureText(SCORE_AT_DRAW).width;
	context.fillText(SCORE_AT_DRAW, CANVAS_WIDTH - MENU_BAR_HORIZONTAL_MARGIN - pointsTextWidth, MENU_BAR_VERTICAL_MARGIN + SPACING);	
}

function playGame() {
	draw();
}

function beginTimers() {
	var timeToSpawn = randomize(1, 3);
	
	countdownTimer = setInterval(runTimer, 1000);
	mainGameTimer = setInterval(playGame, 1000/FPS);
	addBugTimer = setInterval(addBug, timeToSpawn * 1000);
}

function pauseGame() {
	window.clearTimeout(mainGameTimer);
	window.clearTimeout(addBugTimer);
	window.clearTimeout(countdownTimer);
	
	drawMenu ();
	drawPausedOverlay();
}

function moveBugs() {
	for (var i = 0; i < bugs.length; i++) {
		var xTranslation;
		var yTranslation;

		if (fruits.length > 0) {
			var fruitNumber = shortestDistance(i);

			//Initialize the four approximate corners of the Bug
			var bL = bugs[i][3];
			var bT = bugs[i][4];
			var bR = bugs[i][5];
			var bB = bugs[i][6];

			//Approximate the four corners of the Fruit
			var fL = fruits[fruitNumber][1] + 6;
			var fR = fL + 24;
			var fT = fruits[fruitNumber][2];
			var fB = fT + 30;

			if (bL == fL) {
				xTranslation = 0;
				yTranslation = bugs[i][1];
			} else if (bT == fT) {
				yTranslation = 0;
				xTranslation = bugs[i][1];

				if (fL < bL) {
					xTranslation = -xTranslation;
				}
			} else {
				var distanceAngle = Math.atan((fL-bL)/(fT-bT));
				xTranslation = bugs[i][1] * Math.sin(distanceAngle);
				yTranslation = bugs[i][1] * Math.cos(distanceAngle);
			}

			if (fT < bT) {
				yTranslation = -yTranslation;
			}

			bugs[i][3] = bugs[i][3] + xTranslation;
			bugs[i][4] = bugs[i][4] + yTranslation;
			bugs[i][5] = bugs[i][3] + (HEIGHT * 0.65);
			bugs[i][6] = bugs[i][4] + (HEIGHT);

			makeBug(context, bugs[i][0], 0.5, bugs[i][3], bugs[i][4]);

			//Check if any of the corners of the bug is inside one of the corners of the fruit
			if ((bL <= fR && bL >= fL) || (bR >= fL && bR <= fR)) {
				if ((bT >= fT && bT <= fB) || (bB >= fT && bB <= fB)) {
					fruits.splice(fruitNumber, 1);
				}
			}
		} else {
			lost = true;
			checkGameOver();
		}
	}
}

function randomize(lowest, highest) {
	var high = highest - lowest;
	var number = Math.floor((Math.random() * high) + lowest);
	return number;
}

function addBug() {
	var whereToSpawn = randomize(10, 390);
	var colourOfAnt = randomize(1, 100);
	var speed;
	var points;

	if (colourOfAnt < 30) {
		colourOfAnt = BLACK;
		points = 5;
		speed = blackSpeed/FPS;
	} else if (colourOfAnt < 60) {
		colourOfAnt = RED;
		points = 3;
		speed = redSpeed/FPS;
	} else {
		colourOfAnt = ORANGE;
		points = 1;
		speed = orangeSpeed/FPS;
	}

	var WIDTH = HEIGHT * 0.65;
	//Make an Array for the bug which has: colour, speed, points, x position, y position, right Limit, bottom Limit
	bugs.push([colourOfAnt, speed, points, whereToSpawn, 50, whereToSpawn + WIDTH, 50 + HEIGHT]);
	//Cookie Testing:
	
}


function shortestDistance(bugNumber) {
	var fruitNumber;
	var lowest;

	for (var i = 0; i < fruits.length; i++) {
		var d = distance(fruits[i][1], fruits[i][2], bugs[bugNumber][3], bugs[bugNumber][4]);
		if (d < lowest || lowest == null) {
			fruitNumber = i;
			lowest = d;
		}
	}

	return fruitNumber;
}

function distance(x1, y1, x2, y2) {
	var d = (x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1);
	return d;
}

function initFruits() {
	var xPosition;
	var yPosition;

	for (var i = 0; i < 5; i++) {
		xPosition = randomize(10, 350);
		yPosition = randomize(150, 570);
		var image = document.getElementById(fruitList[i]);

		//Replace fruit name in array with array detailing image name, alpha/visibility, xPosition and yPosition
		fruits.push([image, xPosition, yPosition]);
	}
}

function spawnFruits() {
	context.globalAlpha = 1;
	for (var i = 0; i < fruits.length; i++) {
		context.drawImage(fruits[i][0], fruits[i][1], fruits[i][2], 30, 30);
	} 
}

function runTimer() {
	checkGameOver();
	if (timeLeft == 0) {
		loadLevel2();
	}
	timeLeft--;
}

/**
* On load, html page will fetch the stored score
**/
function loadScore() {
	level1TopScore = Number(localStorage.getItem("level1TopScore"));
	level2TopScore = Number(localStorage.getItem("level2TopScore"));
	if (level2TopScore == null) {
		level2TopScore = 0;
	}
	if (level == 1) {
		topScore = level1TopScore;
	} else {
		topScore = level2TopScore;
	}
	document.getElementById("content-score").innerHTML = "<h4>HIGH SCORE</h4> <p>" + topScore + "</p>"
}

function setScore() {
	if (level == 1) {
		if (score > level1TopScore) {
			localStorage.setItem("level1TopScore", score);
		}
	} else {
		if (score > level2TopScore) {
			localStorage.setItem("level2TopScore", score);
		}
	}
}

/* Given a rectangle, and a point. True if point resides in rectangle */
function isPointInRect(rectX, rectY, rectWidth, rectHeight, pointX, pointY) {
	
	if (pointX >= rectX && pointX <= rectX + rectWidth &&
		pointY >= rectY && pointY <= rectY + rectHeight) {
		return Boolean(true);
	} else {
		return Boolean(false);
	}
	
}

/* Pass the event.clientX and event.clientY from a mouse press event other wise pass two x and y coordinates to convert them to x and y relative to the canvas */
function mousePositionInCanvas(mouseX, mouseY) {
	
	var canvasRect = canvas.getBoundingClientRect();
	
	return {
		x: (mouseX-canvasRect.left)/(canvasRect.right - canvasRect.left) * canvas.width,
		y: (mouseY-canvasRect.top)/(canvasRect.bottom - canvasRect.top) * canvas.height
	};
}

/* Delegate Event listeners */
function mouseDidPressDown(event) {
	var WIDTH = HEIGHT * 0.65;
	var mousePosition = mousePositionInCanvas(event.clientX, event.clientY);
	for (var i = 0; i < bugs.length; i++) {
		var a = mousePosition.x - (bugs[i][3] + (WIDTH / 2));
		var b = mousePosition.y - (bugs[i][4] + (HEIGHT / 2));
		var c = Math.sqrt(a * a + b * b);
		if (c <= squashRadius) {
			score += bugs[i][2];
			bugs.splice(i, 1);
			i--;
			setScore();
		}
	} 

	if(isPointInRect(PAUSE_BUTTON_X, PAUSE_BUTTON_Y, PAUSE_BUTTON_WIDTH, PAUSE_BUTTON_HEIGHT, mousePosition.x, mousePosition.y)) {
		
		if (isPaused) {
			isPaused = Boolean(false);
			beginTimers();
		} else {
			isPaused = Boolean(true);
			pauseGame();
		}
	}
	
	if(isPaused && isPointInRect(MUTE_BUTTON_X, MUTE_BUTTON_Y, MUTE_TOTAL_WIDTH, MUTE_TOTAL_HEIGHT, mousePosition.x, mousePosition.y)) {
		console.log("PRESS");
		if (isMute) {
			isMute = Boolean(false);
			//audio.muted = false;
			document.getElementById(AUDIO_ELEMENT_ID).muted = false;

			drawMute();
		} else {
			isMute = Boolean(true);
			//audio.muted = true;
			document.getElementById(AUDIO_ELEMENT_ID).muted = true;

			drawMute();
		}
	}
	
}

function checkGameOver() {
	if (level == 2 && timeLeft == 0 || lost == true) {
		window.clearTimeout(mainGameTimer);
		window.clearTimeout(addBugTimer);
		window.clearTimeout(countdownTimer);
		drawGameOver();
	}
}
function loadLevel2() {
	level = 2;
	nextLevel();
	window.clearTimeout(mainGameTimer);
	window.clearTimeout(addBugTimer);
	window.clearTimeout(countdownTimer);
	bugs = [];
	fruits = [];
	initFruits();
	score = 0;
	timeLeft = 60;
	beginTimers();

	//nextLevelLabelAnimation = new drawNextLevel();

}

function mouseDidRelease(event) {
	
}



