var canvas = document.getElementById("game");
var context = canvas.getContext("2d");

const FPS = 60;

var timeLeft = 60;
var topScore;
var score = 0;

var blackSpeed = 150;
var redSpeed = 75;
var orangeSpeed = 60; 

var bugs = [];
var fruits = ["apple", "banana", "watermelon", "orange", "grape"];
var Level = 1;

//////////////////////////////////////////
// UI
//////////////////////////////////////////
const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT = 600; 

// Menu
const MENU_BAR_HEIGHT = 50;
const MENU_BAR_HORIZONTAL_MARGIN = 10;
const MENU_BAR_VERTICAL_MARGIN = 20;

// Colours
const ORANGE = "#F57336";
const RED = "#C22121";
const BLACK = "#161616";
const BLUE = "#577DC3";

function startGame() {
    document.getElementById("main").innerHTML = "<canvas id='game' width = '" + CANVAS_WIDTH + "' height = '" + (CANVAS_HEIGHT + MENU_BAR_HEIGHT) + "'>  </canvas> <audio id ='gameMusic' controls autoplay loop hidden: true;> <source src='audio/PlantsVsZombies.mp3' type='audio/mpeg'> </audio>";
	canvas = document.getElementById("game");
	context = canvas.getContext("2d");
	initFruits();
	beginTimers();
	drawMenu();

	if (document.getElementById('level2').checked == true || Level == 2)  {
		Level = 2;
		blackSpeed = 200;
		redSpeed = 75;
		orangeSpeed = 60;
	}

	//var audio = document.getElementById("gameMusic");
    //audio.remove(audio);
}
/* Drawings */

// Draw loop
function draw() {
	context.clearRect(0,0,CANVAS_WIDTH, CANVAS_HEIGHT + MENU_BAR_HEIGHT);
	drawMenu();
	drawTimer();
	drawScore();

	moveBugs();
	spawnFruits();
}

function drawMenu () {
	context.globalAlpha = 1;
	context.fillStyle = BLUE; 
	context.fillRect(0, 0, CANVAS_WIDTH, MENU_BAR_HEIGHT);
}

function drawTimer() {
	
	var spacing = 20;
	
	context.globalAlpha = 1;
	context.fillStyle = "white";
	
	context.font = "15px Kenzo";
	context.fillText("Time left", MENU_BAR_HORIZONTAL_MARGIN, MENU_BAR_VERTICAL_MARGIN);
		 
	context.font = "20px Kenzo";
	context.fillText(timeLeft + " sec", MENU_BAR_HORIZONTAL_MARGIN, MENU_BAR_VERTICAL_MARGIN + spacing);
}

function drawScore() {
	
	var spacing = 20;
	var scoreTextWidth;
	var pointsTextWidth;
	var scoreString = "SCORE";
	var scoreAtDraw = score.toString();
	
	// Draw SCORE
	context.globalAlpha = 1;
	context.fillStyle = "white"; 
	context.font = "15px Kenzo";
	scoreTextWidth = context.measureText(scoreString).width;

	context.fillText(scoreString, CANVAS_WIDTH - MENU_BAR_HORIZONTAL_MARGIN - scoreTextWidth, MENU_BAR_VERTICAL_MARGIN);	

	// Draw POINTS
	context.font = "20px Kenzo";
	pointsTextWidth = context.measureText(scoreAtDraw).width;
	context.fillText(scoreAtDraw, CANVAS_WIDTH - MENU_BAR_HORIZONTAL_MARGIN - pointsTextWidth, MENU_BAR_VERTICAL_MARGIN + spacing);	
}

function playGame() {
	draw();
}

function beginTimers() {
	var timeToSpawn = randomize(1, 3);
	
	var countdownTimer = setInterval(runTimer, 1000);
	var mainGameTimer = setInterval(playGame, 1000/FPS);
	var addBugTimer = setInterval(addBug, timeToSpawn * 1000);
}

function pauseGame() {
	window.clearTimeout(mainGameTimer);
	window.clearTimeout(addBugTimer);
	window.clearTimeout(countdownTimer);
}

function moveBugs() {
	for (var i = 0; i < bugs.length; i++) {
		var xTranslation;
		var yTranslation;
		var fruitNumber = shortestDistance(i);
		var x1 = bugs[i][3];
		var y1 = bugs[i][4];
		var x2 = fruits[fruitNumber][1];
		var y2 = fruits[fruitNumber][2];

		if (x1 == x2) {
			xTranslation = 0;
			yTranslation = bugs[i][1];
		} else if (y1 == y2) {
			yTranslation = 0;
			xTranslation = bugs[i][1];
		} else {
			var distanceAngle = Math.atan((x2-x1)/(y2-y1));
			xTranslation = bugs[i][1] * Math.sin(distanceAngle);
			yTranslation = bugs[i][1] * Math.cos(distanceAngle);
		}

		bugs[i][3] = bugs[i][3] + xTranslation;
		bugs[i][4] = bugs[i][4] + yTranslation;

		makeBug(context, bugs[i][0], 0.5, bugs[i][3], bugs[i][4]);
	}
}

function randomize(lowest, highest) {
	var number = Math.floor((Math.random() * highest) + lowest);
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

	//Make an Array for the bug which has: colour, speed, points, x position, y position
	bugs.push([colourOfAnt, speed, points, whereToSpawn, 50]);
	//Cookie Testing:
	score += 1;
	setScore();
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
		yPosition = randomize(150, 530);
		var image = document.getElementById(fruits[i]);

		//Replace fruit name in array with array detailing image name, alpha/visibility, xPosition and yPosition
		fruits[i] = [image, xPosition, yPosition];
		
	}
}

function spawnFruits() {
	context.globalAlpha = 1;
	for (var i = 0; i < fruits.length; i++) {
		context.drawImage(fruits[i][0], fruits[i][1], fruits[i][2], 30, 30);
	} 
}

function runTimer() {
	timeLeft--;
}

/**
* On load, html page will fetch the stored score
**/
function loadScore() {
	topScore = Number(localStorage.getItem("score"));
	document.getElementById("content-score").innerHTML = "<h4>HIGH SCORE</h4> <p>" + topScore + "</p>"
}

function setScore() {
	if (score > topScore) {
		localStorage.setItem("score", score);
	}
	
}