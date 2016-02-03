var TIMEPERLEVEL = 60;
var score = 0;
var topScore;
var canvas = document.getElementById("game");
var context = canvas.getContext("2d");
var bugs = [];

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
	drawMenu();
	
	var myTimer = setInterval(runTimer, 1000);

	var timeToSpawn = randomize(1, 3);
	var mainGameTimer = setInterval(playGame, 1000/25);
	var spawnBugTimer = setInterval(spawnBug, timeToSpawn * 1000);
	//var audio = document.getElementById("gameMusic");
    //audio.remove(audio);
}

/* Drawings */

// Draw loop
function draw() {
	context.clearRect(0,0,CANVAS_WIDTH, CANVAS_HEIGHT + MENU_BAR_HEIGHT);
	drawMenu();
	drawTimer();
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
	context.fillText(TIMEPERLEVEL, 10, 35);
}


function playGame() {
	draw();
}

function moveBugs() {

}

function randomize(lowest, highest) {
	var number = Math.floor((Math.random() * highest) + lowest);
	return number;
}

function spawnBug() {
	var whereToSpawn = randomize(10, 390);
	var colourOfAnt = randomize(1, 100);

	if (colourOfAnt < 30) {
		colourOfAnt = "black"
	} else if (colourOfAnt < 60) {
		colourOfAnt = "red"
	} else {
		colourOfAnt = "orange"
	}

	makeBug(context, colourOfAnt, 0.5, whereToSpawn, 70);

	//Cookie Testing:
	score += 1;
	context.font = "18px Arial";
	context.fillText(score, 50, 35);
	setScore();


}

function runTimer() {
	TIMEPERLEVEL--;
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