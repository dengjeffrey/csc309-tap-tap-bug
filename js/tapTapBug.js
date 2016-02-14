var canvas = document.getElementById("game");
var context = canvas.getContext("2d");
const AUDIO_ELEMENT_ID = "gameMusic";
const CANVAS_ELEMENT_ID = "game";

const FPS = 60;

var timeLeft = 60;
var topScore;
var level1Score = 0;
var level2Score = 0;
var level1TopScore = 0;
var level2TopScore = 0;
var score = 0;
var lost = Boolean(false);
var won = Boolean(false);

var blackSpeed = 150;
var redSpeed = 75;
var orangeSpeed = 60; 

var bugs = [];
var deadBugs = [];
var fruitList = ["apple", "banana", "watermelon", "orange", "grape"];
var fruits = [];
var level = 1;

var squashRadius = 30;
var levelDidChange = Boolean(false);

// Timers
var countdownTimer;
var mainGameTimer;
var addBugTimer;

var animationTimer;

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
const EXIT_TEXT = "Exit";

var retryButton;
var exitButton;
var okButton;

// High Scores
const HIGH_SCORE_TEXT = "Your Scores";
const OK_TEXT = "Ok";

// Next Level
const LEVEL_TEXT = "Level";
var nextLevelLabelAnimation;

// Colours
const ORANGE = "#F57336";
const RED = "#C22121";
const BLACK = "#161616";
const BLUE = "#577DC3";

// Menu Buttons
const BUTTON_WIDTH = 250;
const BUTTON_HEIGHT = 70;

function startGame() {
    document.getElementById("main").innerHTML = "<canvas id='"+ CANVAS_ELEMENT_ID + "' width = '" + CANVAS_WIDTH + "' height = '" + (CANVAS_HEIGHT + MENU_BAR_HEIGHT) + "'>  </canvas> <audio id ='" + AUDIO_ELEMENT_ID + "' controls autoplay loop hidden: true;> <source src='audio/PlantsVsZombies.ogg' type='audio/mpeg'> </audio>";
	canvas = document.getElementById(CANVAS_ELEMENT_ID);
	
	// Add Mouse down listener
	canvas.addEventListener("mousedown", mouseDidPressDown, false);
	canvas.addEventListener("mouseup", mouseDidRelease, false);

	
	context = canvas.getContext("2d");
	initFruits();
	beginTimers();
}

function endGame() {
	location.reload();
}

function restartGame() {
	lost = false;
	won = false;
	
	level = 1;
	timeLeft = 60;
	score = 0;
	lost = Boolean(false);
	
	blackSpeed = 150;
	redSpeed = 75;
	orangeSpeed = 60; 
	
	bugs = [];
	initFruits();
	beginTimers();
}

function selectLevel(number) {
	if (number == 2)  {
		topScore = level2TopScore;
		document.getElementById("content-score").innerHTML = "<h4>HIGH SCORE</h4> <p>" + topScore + "</p>";
	} else {
		topScore = level1TopScore;
		document.getElementById("content-score").innerHTML = "<h4>HIGH SCORE</h4> <p>" + topScore + "</p>";
	}
}

function nextLevel() {
		topScore = level2TopScore;
		level = 2;
		blackSpeed = 200;
		redSpeed = 100;
		orangeSpeed = 80;
}

function button(x, y, width, height) {
	this.xPosition = x;
	this.yPosition = y;
	this.buttonHeight = height;
	this.buttonWidth = width; 
}

/* Drawings */
// Callback when window refreshes

// Draw loop
function draw() {
	
	context.clearRect(0,0,CANVAS_WIDTH, CANVAS_HEIGHT + MENU_BAR_HEIGHT);
	
	drawMenu();
	moveBugs();
	spawnFruits();
	
	if (deadBugs.length > 0) {
		drawDeadBugs();
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

function drawNextLevelLabel(completionBlock) {
	
	context.globalAlpha = 1.0;
	context.fillStyle = "white";
	context.fillRect(0, MENU_BAR_HEIGHT, CANVAS_WIDTH, CANVAS_HEIGHT);
	
	var original
	var currentAlpha = 2;
	var alphaChange = 0.02;
	var currentLevelText = LEVEL_TEXT.concat(" " + level);

	levelDidChange = 1;
	
	context.fillStyle = "black";
	context.font = "60px Kenzo";
	
	var levelUpTextWidth = context.measureText(currentLevelText).width;
	
	this.update = function() {
		context.clearRect(0, MENU_BAR_HEIGHT,CANVAS_WIDTH, CANVAS_HEIGHT + MENU_BAR_HEIGHT);

		if (currentAlpha - alphaChange > 0) {
			currentAlpha -= alphaChange;			
			context.globalAlpha = currentAlpha;	
			context.fillStyle = "black";
			context.font = "60px Kenzo";
			context.fillText(currentLevelText, (CANVAS_WIDTH - levelUpTextWidth)/2, CANVAS_HEIGHT/2);		
		} else {
			currentAlpha = 0;
			levelDidChange = false;
			completionBlock();
		}
	}
		
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
	
	context.font = "40px Kenzo";
	
	// Retry
	const BUTTON_SPACING = 20;
	const TEXT_PADDING_TOP = 50;
	
	var retryTextWidth = context.measureText(RETRY_TEXT).width;
	var retryButtonY = CANVAS_HEIGHT/2 + 50;
	
	retryButton = new button((CANVAS_WIDTH - BUTTON_WIDTH)/2, retryButtonY, BUTTON_WIDTH, BUTTON_HEIGHT);
	context.fillText(RETRY_TEXT, (CANVAS_WIDTH - retryTextWidth)/2, retryButtonY + TEXT_PADDING_TOP);
	
	context.strokeStyle = "white";
	context.strokeRect(retryButton.xPosition, retryButton.yPosition, retryButton.buttonWidth, retryButton.buttonHeight);
	
	// Exit
	var exitTextWidth = context.measureText(EXIT_TEXT).width;
	var exitButtonY = retryButtonY + BUTTON_HEIGHT + BUTTON_SPACING;
	
	exitButton = new button((CANVAS_WIDTH - BUTTON_WIDTH)/2, exitButtonY, BUTTON_WIDTH, BUTTON_HEIGHT);
	context.fillText(EXIT_TEXT, (CANVAS_WIDTH - exitTextWidth)/2, exitButtonY + TEXT_PADDING_TOP);
	
	context.strokeStyle = "white";
	context.strokeRect(exitButton.xPosition, exitButton.yPosition, exitButton.buttonWidth, exitButton.buttonHeight);
}

function drawGameOverWithScore() {
	context.globalAlpha = 0.8;
	context.fillStyle = "black";
	context.fillRect(0, MENU_BAR_HEIGHT, CANVAS_WIDTH, CANVAS_HEIGHT);
	
	context.globalAlpha = 1;	
	context.fillStyle = "white";
	context.font = "60px Kenzo";
	
	var gameOverTextWidth = context.measureText(GAME_OVER_TEXT).width;
	context.fillText(GAME_OVER_TEXT, (CANVAS_WIDTH - gameOverTextWidth)/2, CANVAS_HEIGHT/2);
	
	context.font = "40px Kenzo";
	
	// Level 1 Score
	const TEXT_PADDING_TOP = 50;
	const TEXT_SPACING_TOP = 40;
	const SMALL_TEXT_SPACING_TOP = 40;

	const GAME_OVER_Y = CANVAS_HEIGHT/2 + 50
	
	var highScoreTextWidth = context.measureText(HIGH_SCORE_TEXT).width;
	var level1TextWidth = context.measureText("Level 1 : " + level1Score).width;
	var level2TextWidth = context.measureText("Level 2 : " + level2Score).width;
	
	context.fillText(HIGH_SCORE_TEXT, (CANVAS_WIDTH - highScoreTextWidth)/2, GAME_OVER_Y + TEXT_SPACING_TOP);
	
	context.font = "30px Kenzo";
	context.fillText("Level 1 : " + level1Score, (CANVAS_WIDTH - level1TextWidth)/2, GAME_OVER_Y + TEXT_PADDING_TOP + SMALL_TEXT_SPACING_TOP);
	context.fillText("Level 2 : " + level2Score, (CANVAS_WIDTH - level2TextWidth)/2, GAME_OVER_Y + TEXT_PADDING_TOP + 2 * SMALL_TEXT_SPACING_TOP);

	var levelTextEndY = GAME_OVER_Y + TEXT_SPACING_TOP + 2 * SMALL_TEXT_SPACING_TOP;

	// OK button
	const BUTTON_SPACING = 10;
	var okTextWidth = context.measureText(OK_TEXT).width;
	var okButtonY = levelTextEndY + BUTTON_HEIGHT + BUTTON_SPACING;
	
	okButton = new button((CANVAS_WIDTH - BUTTON_WIDTH)/2, okButtonY, BUTTON_WIDTH, BUTTON_HEIGHT);
	context.fillText(OK_TEXT, (CANVAS_WIDTH - okTextWidth)/2, okButtonY + TEXT_PADDING_TOP);
	
	context.strokeStyle = "white";
	context.strokeRect(okButton.xPosition, okButton.yPosition, okButton.buttonWidth, okButton.buttonHeight);
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
	window.clearInterval(mainGameTimer);
	window.clearInterval(addBugTimer);
	window.clearInterval(countdownTimer);
	
	drawMenu ();
	drawPausedOverlay();
}

function drawDeadBugs() {
	
	const ALPHA_DECREASE_INTERVAL = 0.05;
	var newDeadBugs = [];
	
	for (var i = 0; i < deadBugs.length; i ++) {
	
		var bug = deadBugs[i];	
		
		// Bug has not yet finished fading, then we fetch old bug details and decrease transparency
		if (bug.visibility - ALPHA_DECREASE_INTERVAL> 0) {
			
			var newVisibility = bug.visibility - ALPHA_DECREASE_INTERVAL;
			
			// Draw dead bug, and decrease the alpah
			var newDeadBug = new makeBug(bug.ctx, bug.colour, newVisibility, bug.x, bug.y);
			
			// store for later animation
			newDeadBugs.push(newDeadBug);
		} 		
	}
	
	deadBugs = newDeadBugs;
}

//Check and move every bug in a smooth manner towards fruits. If overlapping, move the slower bug slightly to the right or left as necessary.
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
			var fL = fruits[fruitNumber][1];
			var fR = fL + 30;
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
				for (var secondBug = 0; secondBug < bugs.length; secondBug++) {
					//Check all the bugs and see if any overlap, if so, consider if they are the same, if not, and they are overlapping, change the angle slightly. Continue to do this until none of the bugs are overlapping
					var WIDTH = HEIGHT * 0.65;
					var a = (bugs[i][3] + (WIDTH / 2)) - (bugs[secondBug][3] + (WIDTH / 2));
					var b = (bugs[i][4] + (HEIGHT / 2)) - (bugs[secondBug][4] + (HEIGHT / 2));
					var c = Math.sqrt(a * a + b * b);
					if (c < 20) {
						if (i == secondBug) {
							//Do Nothing
						} else if (bugs[i][1] > bugs[secondBug][1]) {
							//Also do nothing
						} else if (bugs[i][1] < bugs[secondBug][1]) {
							//Increase the xTranslation slightly to move the ant to the right
							if (bugs[i][3] < bugs[secondBug][3]) {
								xTranslation -= 2;
							} else {
								xTranslation += 2;
							}
							
						} else if (bugs[i][1] == bugs[secondBug][1]) {
							//Increase or decrease the angle
							var angle = Math.floor(Math.random());
							if (angle == 0) {
								xTranslation -= 2;
							} else {
								xTranslation += 2;
							}
						}

						if (fR < bL && xTranslation > 0) {
							xTranslation = -xTranslation;
						} else if (bR < fL && xTranslation < 0) {
							xTranslation = -xTranslation;
						}
					}
				}
				if (fT < bT) {
					yTranslation = -yTranslation;
				}
			}
			bugs[i][3] = bugs[i][3] + xTranslation;
			bugs[i][5] = bugs[i][3] + (HEIGHT * 0.65);
			bugs[i][4] = bugs[i][4] + yTranslation;
			bugs[i][6] = bugs[i][4] + (HEIGHT);

			makeBug(context, bugs[i][0], 1, bugs[i][3], bugs[i][4]);

			//Check if any of the corners of the bug is inside one of the corners of the fruit
			if (collide(bT, bB, bL, bR, fT, fB, fL, fR)) {
					fruits.splice(fruitNumber, 1);
			}
		} else {
			lost = true;
			checkGameOver();
		}
	}
}

//Check if any of the corners of object1 is inside one of the corners of the object2
function collide(o1T, o1B, o1L, o1R, o2T, o2B, o2L, o2R) {
	if ((o1L <= o2R && o1L >= o2L) || (o1R >= o2L && o1R <= o2R)) {
		if ((o1T >= o2T && o1T <= o2B) || (o1B >= o2T && o1B <= o2B)) {
			return true;
		}
	}

	return false;
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
		// The food should not appear within the top 20% of the table
		yPosition = randomize(CANVAS_HEIGHT * 0.2 + MENU_BAR_HEIGHT, 570);
		var image = document.getElementById(fruitList[i]);

		//Replace fruit name in array with array detailing image name, xPosition and yPosition
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
	
	if (timeLeft == 0 && checkGameOver() == false) {
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
			level1TopScore = score;
		}
	} else {
		if (score > level2TopScore) {
			localStorage.setItem("level2TopScore", score);
			level2TopScore = score;
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

/*  Given a button, and the mouse point check if pressed */
function wasButtonPressed(buttonPressed, pointX, pointY) {
	return isPointInRect(buttonPressed.xPosition, 
	buttonPressed.yPosition, 
	buttonPressed.buttonWidth, 
	buttonPressed.buttonHeight, 
	pointX, 
	pointY);	
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


	// Pause
	if (!lost && isPointInRect(PAUSE_BUTTON_X, PAUSE_BUTTON_Y, PAUSE_BUTTON_WIDTH, PAUSE_BUTTON_HEIGHT, mousePosition.x, mousePosition.y)) {
		
		if (isPaused) {
			isPaused = Boolean(false);
			beginTimers();
		} else {
			isPaused = Boolean(true);
			pauseGame();
		}
	}
	// Mute
	else if (isPaused && isPointInRect(MUTE_BUTTON_X, MUTE_BUTTON_Y, MUTE_TOTAL_WIDTH, MUTE_TOTAL_HEIGHT, mousePosition.x, mousePosition.y)) {
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
	// Game over buttons
	// Retry
	else if (lost == true && wasButtonPressed(retryButton, mousePosition.x, mousePosition.y)) {
		restartGame();
	}
	else if (lost == true && wasButtonPressed(exitButton, mousePosition.x, mousePosition.y)) {
		endGame();
	}
	else if (won == true && wasButtonPressed(okButton, mousePosition.x, mousePosition.y)) {
		endGame();
	}
		
	// Check Bug collision
	for (var i = 0; i < bugs.length; i++) {
		var a = mousePosition.x - (bugs[i][3] + (WIDTH / 2));
		var b = mousePosition.y - (bugs[i][4] + (HEIGHT / 2));
		var c = Math.sqrt(a * a + b * b);
		if (c <= squashRadius) {
			
			deadBugs.push(new makeBug(context, bugs[i][0], 1, bugs[i][3], bugs[i][4]));
			
			score += bugs[i][2];
			if (level == 1) {
				level1Score = score;
			} else {
				level2Score = score;
			}
			bugs.splice(i, 1);
			i--;
			setScore();
		}
	} 
}

function checkGameOver() {
	if (lost == true) {
		window.clearInterval(mainGameTimer);
		window.clearInterval(addBugTimer);
		window.clearInterval(countdownTimer);
		drawGameOver();
		return true;
	}
	else if (level == 2 && timeLeft <= 0) {
		won = true;
		window.clearInterval(mainGameTimer);
		window.clearInterval(addBugTimer);
		window.clearInterval(countdownTimer);
		drawGameOverWithScore();	;
		return true;
	}
	return false;
}

function loadLevel2() {
	
	nextLevel();
	window.clearInterval(mainGameTimer);
	window.clearInterval(addBugTimer);
	window.clearInterval(countdownTimer);

	levelDidChange = true;
	nextLevelLabelAnimation = new drawNextLevelLabel(function completion() {
		window.clearInterval(animationTimer);
		bugs = [];
		fruits = [];
		initFruits();
		score = 0;
		timeLeft = 60;
		beginTimers();
	});
	
	animationTimer = setInterval(nextLevelLabelAnimation.update, 1000/FPS);
}

function mouseDidRelease(event) {
	
}



