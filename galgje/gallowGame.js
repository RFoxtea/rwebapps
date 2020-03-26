var alphabet = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
var hangTime = 0;
var maxHangTime = 11;
var hangWord = "";
var hangWordSecret = "";
var lettersDone = [];
var wordArray = [];
var image = [];
var hits = 0;
var misses = 0;
var games = 0;
setWords("words.txt");
disabled = true;
allDisable(true);

if (window.File && window.FileReader && window.FileList && window.Blob) {
  // Great success! All the File APIs are supported.
} else {
  alert('The File APIs are not fully supported in this browser.\nUse a real browser you fool!');
}

for (var i = 0; i < maxHangTime; i++) {
	image[i] = new Image();
	image[i].src = "hangman" + pad(i) + ".gif";
	}

var letterSpace = document.getElementById("letterSpace");
var hangmanPicPlace = document.getElementById("hangmanPicPlace");

function setWords(url) {
	$.get(url, function(data) {
		wordArray = data.split('\n');
	});
}

function choose(arr) {return arr[Math.floor(Math.random()*arr.length)];}

function pad(d) {
    return (d < 10) ? '0' + d.toString() : d.toString();
}

function loadOpened(bool) {
	if (bool) {
		$("#loadScreen").css("visibility","visible");}
	else {
		$("#loadScreen").css("visibility","hidden");}
}

$("#files").on("change", function(){
	var inputFile = document.getElementById("files");
	readSingleFile(inputFile);
});

function readSingleFile(evt) {
	//Retrieve the first (and only!) File from the FileList object
	var f = evt.files[0]; 
	if (f) {
		var r = new FileReader();
		r.onload = function(e) { 
			var contents = e.target.result;
			wordArray = contents.toUpperCase().split('\n');
		}
      r.readAsText(f);
    } else { 
      alert("Failed to load file");
    }
}

function typeLetter(letterTyped) {
	if (!disabled && lettersDone.indexOf(letterTyped) == -1) {
		lettersDone.push(letterTyped);
		$("#letter" + letterTyped).css("backgroundColor", "#AAAAAA");
		if (hangWord.indexOf(letterTyped) != "-1")
			resecret();
		else {
			hangTime++;
			hangmanPic.src = "hangman" + pad(hangTime) + ".gif";
			if (hangTime >= maxHangTime) {gameLose()}
		}
	}
}

function resecret() {
	var hangWordSecret = "";
	var hangWordSecretPretty = "";
	for (var i = 0;i < hangWord.length;i++)
	{
		if (lettersDone.indexOf(hangWord[i]) != "-1" || alphabet.indexOf(hangWord[i]) == "-1")
		{
			hangWordSecret += hangWord[i];
			hangWordSecretPretty += hangWord[i];
		}
		else
		{
			hangWordSecret += "?";
			hangWordSecretPretty += "?";
		}
		if (i < hangWord.length - 1) {hangWordSecretPretty += "&nbsp;"}
	}
	letterSpace.innerHTML = hangWordSecretPretty;
	if (hangWord == hangWordSecret) {gameWin()}
}

function reloadScore() {
	var hitter = document.getElementById("hits");
	var misser = document.getElementById("misses");
	var gamer = document.getElementById("games");
	hitter.innerHTML = "Hits: " + hits;
	misser.innerHTML = "Misses: " + misses;
	gamer.innerHTML = "Games: " + games;
}

function gameLose() {
	document.body.style.backgroundColor = "#ff0000";
	allDisable(true, "#ff0000");
	var hangWordSecretPretty = "";
	for (var i = 0;i < hangWord.length;i++) {
		hangWordSecretPretty += hangWord[i];
		if (i < hangWord.length - 1) {hangWordSecretPretty += "&nbsp;"}
	}
	letterSpace.innerHTML = hangWordSecretPretty;
	games++;
	misses++;
	reloadScore()
}

function gameWin() {
	hangmanPicPlace.style.color = "green";
	hangmanPicPlace.innerHTML = choose(["HIT!","NOW DO IT AGAIN","UR SMART","YOU ROCK","SWAG","YOU DIDN'T LOSE","HITTERDY HIT","HIP HIT","HITPARADE","CHECK IT","HITS++;","ONE MORE TIME","BRETTY GUD","10 POINTS TO GRYFFINDOR","AWWW YEAH","HOLY GUACAMOLE","YOU MISSED A MISS","HITCITY","STOP HITTING ME","HITTENTIT","YOU ARE A GOOD PERSON","YES! YES!","EBIN WIN","SUCCESS","PARTY TIME","FIT TO HIT","YOU DIDN'T FAIL","AMAZINGNESS","GOAL!","STRIKE", "EXCELLENT", "YOU ARE THE CHAMPION"]);
	allDisable(true);
	games++;
	hits++;
	reloadScore()
}

function allDisable(enabler, color) {
	disabled = enabler;
	if (enabler) {
		color = color || "#AAAAAA";
		for (var i = 0;i < alphabet.length;i++) {
			$("#letter" + alphabet[i]).css("backgroundColor", color);
		}
	} else {
		for (var i = 0;i < alphabet.length;i++) {
			color = color || "#FFFFFF";
			$("#letter" + alphabet[i]).css("backgroundColor", color);
		}
	}
}

function gameReset() {
	hangmanPicPlace.style.color = "black";
	document.body.style.backgroundColor = "white";
	hangmanPicPlace.innerHTML = '<img id="hangmanPic" src="hangman00.gif" alt="HANGMAN" width="250px">'
	hangmanPic = document.getElementById("hangmanPic");
	hangTime = 0;
	hangWordSecret = "";
	allDisable(false);
	lettersDone = [];
	newWord();
	resecret();
	hangmanPic.src = "hangman" + pad(hangTime) + ".gif";
}

function newWord() {
	hangWord = choose(wordArray);
}

function buttonChanger(string) {
	$("#buttonInfo").html("<font size=\"6\"><b>" + string + "</font> <br> </b> press NEW GAME");
	$("#buttonInfo").css("line-height", "170%");
}

function welcome() {
	$("#buttonInfo").html("Welcome to <b>GALGJE!</b>");
}

$("button")
	.mouseenter(function() {
		switch($( this ).attr('id')) {
			case "startGame":
				$( "#buttonInfo" ).css("line-height", "170%");
				$("#buttonInfo").html("<font size=\"6\"><b>" + choose(["Do it!", "Go go go!", "Yes!", "Now!", "What are you waiting for?","Let the games begin!", "Play!", "Yay!", ":^D", "One more game...", "Press it!", "Begin!", "Woohoo!", "I ♥ U", "Fun!", "Amazing!", "This button!", "Game time!", "Click it!", "Greatness awaits!"]) + "</b></font>");
				break;
			case "classicw":
				$("#buttonInfo").html( "Play with the set of words <b>I came up with myself</b>. <br> Yes, I know, it's amazing." );
				break;
			case "rafw":
				$("#buttonInfo").html( "Play with a set of words containing the <b>swaggest</b> name on the planet." );
				break;
			case "deluxew":
				$("#buttonInfo").html( "Play with <b>362790 words!</b> Including some that <b>don't even exist</b>!" );
				break;
			case "customw":
				$("#buttonInfo").html( "Play with your own words. Just use a .txt file with one word per line. <br> <b>NOTEPAD FTW!</b>" );
				break;
		}
	})
	.mouseleave(function() {
		$( "#buttonInfo" ).css("line-height", "120%");
		welcome();
	});