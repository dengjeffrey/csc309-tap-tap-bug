var canvas = document.getElementById("game");
var context = canvas.getContext("2d");

const FPS = 45;

var timeLeft = 60;
var topScore;
var score = 0;

var blackSpeed = 150/FPS;
var redSpeed = 75/FPS;
var orangeSpeed = 60/FPS; 

var bugs = [];
var fruits = ["apple", "banana", "watermelon", "orange", "grape"];
var Level = 1;

// UI
var CANVAS_WIDTH = 400;
var CANVAS_HEIGHT = 600; 
var MENU_BAR_HEIGHT = 50;

// Colours

var orange = "#F57336";
var red = "#C22121";
var black = "#161616";
var blue = "#577DC3";

function startGame() {
    document.getElementById("main").innerHTML = "<canvas id='game' width = '" + CANVAS_WIDTH + "' height = '" + (CANVAS_HEIGHT + MENU_BAR_HEIGHT) + "'>  </canvas> <audio id ='gameMusic' controls autoplay loop hidden: true;> <source src='audio/PlantsVsZombies.mp3' type='audio/mpeg'> </audio>";
	canvas = document.getElementById("game");
	context = canvas.getContext("2d");
	initFruits();
	beginTimers();
	drawMenu();

	//var audio = document.getElementById("gameMusic");
    //audio.remove(audio);
}
/* Drawings */

// Draw loop
function draw() {
	context.clearRect(0,0,CANVAS_WIDTH, CANVAS_HEIGHT + MENU_BAR_HEIGHT);
	drawMenu();
	drawTimer();
	moveBugs();
	spawnFruits();
}

function drawMenu () {
	context.globalAlpha = 1;
	context.fillStyle = blue; 
	context.fillRect(0, 0, CANVAS_WIDTH, MENU_BAR_HEIGHT);
}

function drawTimer() {
	context.globalAlpha = 1;
	context.fillStyle = "white"; 
	context.font = "18px Kenzo";
	context.fillText(timeLeft, 10, 35);
}

function playGame() {
	draw();
}

function beginTimers() {
	var timeToSpawn = randomize(1, 3);
	
	var countdownTimer = setInterval(runTimer, 1000);
	var mainGameTimer = setInterval(playGame, FPS);
	var addBugTimer = setInterval(addBug, timeToSpawn * 1000);
}

function pauseGame() {
	window.clearTimeout(mainGameTimer);
	window.clearTimeout(addBugTimer);
	window.clearTimeout(countdownTimer);
}

function moveBugs() {
	for (var i = 0; i < bugs.length; i++) {
		bugs[i][4] = bugs[i][4] + bugs[i][1];
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
		colourOfAnt = "#161616";
		points = 5;
		speed = blackSpeed;
	} else if (colourOfAnt < 60) {
		colourOfAnt = "#C22121";
		points = 3;
		speed = redSpeed;
	} else {
		colourOfAnt = "#F57336";
		points = 1;
		speed = orangeSpeed;
	}

	//Make an Array for the bug which has: colour, speed, visibility, points, x position, y position

	bugs.push([colourOfAnt, speed, points, whereToSpawn, 50]);
	//Cookie Testing:
	score += 1;
	setScore();
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