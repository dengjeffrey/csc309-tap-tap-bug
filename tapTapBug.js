var TIMEPERLEVEL = 60;
var score;
var canvas = document.getElementById("game");
var context = canvas.getContext("2d");
var bugs = [];

function startGame() {
    document.getElementById("main").innerHTML = "<canvas id='game' width = '400' height = '600'>  </canvas> <audio id ='gameMusic' controls autoplay loop hidden: true;> <source src='audio/PlantsVsZombies.mp3' type='audio/mpeg'> </audio>";
	canvas = document.getElementById("game");
	context = canvas.getContext("2d");
	createMenu();
	
	var myTimer = setInterval(runTimer, 1000);

	var timeToSpawn = randomize(1, 3);
	var spawnBugTimer = setInterval(playGame, timeToSpawn * 1000);
	//var audio = document.getElementById("gameMusic");
    //audio.remove(audio);
}

function createMenu () {
	context.globalAlpha=0.2;
	context.fillStyle="blue"; 
	context.fillRect(0,0,400,50);
}

function randomize(lowest, highest) {
	var number = Math.floor((Math.random() * highest) + lowest);
	return number;
}

function playGame() {
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
	context.font = "18px Arial";
	context.fillText(TIMEPERLEVEL, 10, 35);
}
/**
* On load, html page will fetch the stored score
**/
function loadScore() {
	score = Number(localStorage.getItem("score"));
	document.getElementById("content-score").innerHTML = "<h4>HIGH SCORE</h4> <p>" + score + "</p>"
}

function setScore() {
	localStorage.setItem("score", score);
}