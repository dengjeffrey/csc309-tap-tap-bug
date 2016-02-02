var TIMEPERLEVEL = 60;
var score = 0;
var canvas = document.getElementById("game");
var context = canvas.getContext("2d");

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
	setCookie("score", score, 100);


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
	score = getCookie("score");
	document.getElementById("content-score").innerHTML = "<h4>HIGH SCORE</h4> <p>" + score + "</p>"
}


//Taken from w3schools
function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
    }
    return "";
}