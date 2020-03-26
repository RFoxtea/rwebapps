//////////////////////
// HTML AND GLOBALS //
//////////////////////

//Initialising grid.
var innerGrid = new grid(20,10);
var outerGrid = new visGrid(innerGrid, "#gridFull");

//Initialising grid showing words to find.
var wordGrid = new grid(4,10);
var wordGridShown = new visGrid(wordGrid, "#wordGrid");

//Removing selection.
document.onselectstart = function () { return false; }
$('canvas').on('dragstart', function(event) { event.preventDefault(); });
$('div').on('dragstart', function(event) { event.preventDefault(); });

//Everything all right?
if (window.File && window.FileReader && window.FileList && window.Blob) {
  // Great success! All the File APIs are supported.
} else {
  alert('The File APIs are not fully supported in this browser.\nUse a real browser you fool!');
}

//////////////////////
// USEFUL FUNCTIONS //
//////////////////////

//SO RANDUMB!!!11
function choose(arr) {return arr[Math.floor(Math.random()*arr.length)];}

//OMGF EBEN MOAR RANDUMB?!!!1?112...
function chooseSome(arr, num) {
	var cloneArr = arr.slice(0);
	var outArr = [];
	for(i = 0; i < num && i < cloneArr.length; i++) {
		var newW = choose(cloneArr);
		var index = cloneArr.indexOf(newW);
		if (index > -1) {
			cloneArr.splice(index, 1);
		}
		outArr.push(newW);
	}
	return outArr;
}

//Addin sum 0s.
function pad(d) {
    return (d < 10) ? '0' + d.toString() : d.toString();
}
//////////////////////
// GENERATING WORDS //
//////////////////////

//Get words from server. This doesn't work from when ran locally but works fine online.
function wordsFromServer(url) {
	var wordedArray;
	$.ajax({
		async: false,
		type: 'GET',
		url: url,
		success: function(data) {
			wordedArray = data.split("\n");
		}
	});
	for (var i = 0; i < wordedArray.length; i++) {
		wordedArray[i] = wordedArray[i].replace(/[^A-Z]+/g, "");
	}
	return wordedArray;
};

//Pastes a word in the grid.
function pasteWord(toPaste) {
	var xPlus = 0;
	var yPlus = 0;
	
	var xPos = 0;
	var yPos = 0;
	
	for (var i = 0;checkPosPos(xPlus,yPlus,xPos,yPos,toPaste); i++) {
		xPlus = choose([-1, 0, 0, 0, 0, 1, 1, 1]);
		yPlus = choose([-1, 0, 0, 1, 1]);
		
		if (xPlus == 0) {xPos = Math.floor(Math.random()*(innerGrid.width));}
		else if (xPlus == -1) {xPos = Math.floor(Math.random()*(innerGrid.width - toPaste.length)) + toPaste.length;}
		else if (xPlus == 1) {xPos = Math.floor(Math.random()*(innerGrid.width - toPaste.length));}
		
		if (yPlus == 0) {yPos = Math.floor(Math.random()*(innerGrid.height));}
		else if (yPlus == -1) {yPos = Math.floor(Math.random()*(innerGrid.height - toPaste.length)) + toPaste.length;}
		else if (yPlus == 1) {yPos = Math.floor(Math.random()*(innerGrid.height - toPaste.length));}
		
		if (i > 1000) {
			return false;
		}
	}
	var xPosA = xPos;
	var yPosA = yPos;
	for (var i = 0; i < toPaste.length; i++) {
		innerGrid.array[yPos][xPos] = toPaste[i];
		if (i == toPaste.length) {break;}
		xPos += xPlus;
		yPos += yPlus;
	}
	usedArray.push(toPaste);
	checkList.push(false);
	placeArray.push([parseInt(xPosA), parseInt(yPosA), parseInt(xPlus * toPaste.length + xPosA - xPlus), parseInt(yPlus * toPaste.length + yPosA - yPlus)]);
	return true;
};

//Checks if a position is possible.
function checkPosPos(xPlus,yPlus,xPos,yPos,pasteWord) {
	var length = pasteWord.length;
	var checkMove = (xPlus == 0 && yPlus == 0);
	if (checkMove) {return true};
	var checkIfInX = ((0 >= xPlus * length + xPos) || (innerGrid.width <= xPlus * length + xPos));
	if (checkIfInX) {return true};
	var checkIfInY = ((0 >= yPlus * length + yPos) || (innerGrid.height <= yPlus * length + yPos));
	if (checkIfInY) {return true};
	for (i = 0; i <= length; i++) {
		if (innerGrid.array[yPos][xPos] != "" && innerGrid.array[yPos][xPos] != pasteWord[i]) {return true};
		xPos += xPlus;
		yPos += yPlus;
	}
	return false;
}

//Simple function for filling the empty boxes.
function fillRan() {
	for(y = 0; y < innerGrid.height; y++) {
		for(x = 0; x < innerGrid.width; x++) {
			if (innerGrid.array[y][x] == "") {
				innerGrid.array[y][x] = choose("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
			}
		}
	}
}

//Simple function for loading an array of words.
function loadWords(wordedArray) {
	var loops = 0;
	for (var i = 0; i < wordedArray.length; i++) {
		if (pasteWord(wordedArray[i]) == false){
			i--;
		}
		loops++;
		if (loops > wordedArray.length) {
			going = false;
			emptyTrigger();
			return true;
		}
	}	
	return false;
}

//Simple function for filling in the word boxes.
function showWords(usedArray) {
	for (var i = 0; i < usedArray.length; i++) {
		wordGrid.array[Math.floor(i / 4)][i % 4] = usedArray[i];
	}	
}

//////////////////////////
// GRAPHICAL PROCESSING //
//////////////////////////

var canvas = document.getElementById("lineCanvas");

// Actual line drawing
function strokeDraw(divAInf, divBInf) {
	var stroking = canvas.getContext("2d");
	stroking.beginPath();
	stroking.lineWidth=3;
	stroking.strokeStyle="rgba(255, 0, 0, 0.8)";
	stroking.moveTo((divAInf.parGrid.boxWid * divAInf.x) + (divAInf.parGrid.boxWid / 2), (divAInf.parGrid.boxHei * divAInf.y) + (divAInf.parGrid.boxHei / 2));
	stroking.lineTo((divBInf.parGrid.boxWid * divBInf.x) + (divBInf.parGrid.boxWid / 2), (divBInf.parGrid.boxHei * divBInf.y) + (divBInf.parGrid.boxHei / 2));
	stroking.stroke();
};


//Checking of line possibility. (\/-|)
function checkValidCoor(divAInf, divBInf) {
	if (divAInf.x - divBInf.x == 0 || divAInf.y - divBInf.y == 0
	|| Math.abs(divAInf.x - divBInf.x) == Math.abs(divAInf.y - divBInf.y)) {return true;}
	else {return false;}
}

//Checking of word presence.
function checkWord(divAInf, divBInf) {
	var coordinates = [parseInt(divAInf.x), parseInt(divAInf.y), parseInt(divBInf.x), parseInt(divBInf.y)];
	var index = -1;
	for(var i = 0; i < placeArray.length; i++) {
		var isSame = true;
		for (j = 0; j < 4 && isSame == true; j++) {
			if (placeArray[i][j] != coordinates[j]) {
				isSame = false;
				break;
			}
		}
		if (isSame == true) {
			if (checkList[i] == false) {
				index = i;
			}
			break;
		}
	}
	if (index == -1) {return false;}
	else {
		var toStroke = wordGridShown.box(index % 4, Math.floor(index / 4));
		toStroke.css("backgroundColor", "green");
		checkList[i] = true;
		return true; 
	}
}

//Tracking of mouse movement.
var firstGridInf;
var secondGridInf;
var mouseDown = false;

$(document)
	.mouseup( function() {
		mouseDown = false;
	});

function resetMouseTrack() {	
	$("div.gridBox")
		.mousedown( function() {
			mouseDown = true;
			firstGridInf = new gridDiv($(this));
		})
		.mouseup( function() {
			secondGridInf = new gridDiv($(this));
			if (mouseDown && checkValidCoor(firstGridInf, secondGridInf) && checkWord(firstGridInf, secondGridInf, usedArray)) {
				strokeDraw(firstGridInf, secondGridInf);
			}
		});
}

//instructions screen

instPage = 0;
instPageMax = 4;

function changeArrows(direction) {
	$("#arrUp").stop();
	if (instPage == 0){
		$("#arrUp").fadeTo(250, 0.0);
	} else if (direction != "up") {
		$("#arrUp").fadeTo(250, 0.1);
	}
	
	$("#arrDown").stop();
	if (instPage == instPageMax){
		$("#arrDown").fadeTo(250, 0.0);
	} else if (direction != "down") {
		$("#arrDown").fadeTo(250, 0.1);
	}
}

$("#instScreen")
	.mouseenter(function() {
		changeArrows();
	})
	.mouseleave(function() {
		$("#arrUp").stop();
		$("#arrUp").fadeTo(250, 0);
		$("#arrDown").stop();
		$("#arrDown").fadeTo(250, 0);
	});
	
$("#arrUp")
	.click(function() {
		if (instPage > 0) {
			instPage--;
			changeArrows("up");
			$(".instructions").stop();
			$(".instructions").animate({ scrollTop: instPage * 550}, 1000);
		}
	})
	.mouseenter(function() {
		if (instPage > 0) {
			$("#arrUp").stop();
			$("#arrUp").fadeTo(250, 0.2);
		} else {
			changeArrows();
		}
	})
	.mouseleave(function() {
		changeArrows();
	});

$("#arrDown")
	.click(function() {
		if (instPage < instPageMax) {
			instPage++;
			changeArrows("down");
			$(".instructions").stop();
			$(".instructions").animate({ scrollTop: instPage * 550}, 1000);
		}
	})
	.mouseenter(function() {
		if (instPage < instPageMax) {
			$("#arrDown").stop();
			$("#arrDown").fadeTo(250, 0.2);
		} else {
			changeArrows();
		}
	})
	.mouseleave(function() {
		changeArrows();
	});
	
//Screen graphics
var currentScreen = "";

function openPop(screen) {
	$screen = $(screen);
	$screen.stop();
	$screen.show();
	$screen.fadeTo(250, 1, function() {currentScreen = $screen;});
}

$(document).mouseup(function (e)
{
	if (currentScreen != "") {
	
		if (!currentScreen.is(e.target) // if the target of the click isn't the container...
			&& currentScreen.has(e.target).length === 0) // ... nor a descendant of the container) 
		{	
			currentScreen.stop();
			currentScreen.fadeTo(250, 0, function() {currentScreen.hide();});
		}
	}
});

//////////////////////
// GAME & INTERFACE //
//////////////////////

var wordArray = [];
var usedArray = [];
var placeArray = [];
var checkList = [];

var going = false;
var fullReInit = true;

var oldWordsInc = 24;
var oldFileName = "words.txt";

var gameMode = 0;

var setWordsInc;

$("#files").on("change", function(){
	var inputFile = document.getElementById("files");
	readSingleFile(inputFile);
});

function setOpen() {
	$("#words").val(setWordsInc || oldWordsInc);
	$("#height").val(innerGrid.height);
	$("#width").val(innerGrid.width);
	$("#font").val(parseInt($("#gridFull").css("font-size")));
	openPop("#setScreen");
}

function loadSettings() {
	$("#setScreen").fadeTo(250, 0, function() {currentScreen.hide();});
	setWordsInc = $("#words").val();
	innerGrid.height = $("#height").val();
	innerGrid.width = $("#width").val();
	$("#gridFull").css("font-size", $("#font").val() + "px")
	innerGrid.rebuild();
	fullReInit = true;
}

//read a local file
function readSingleFile(evt) {
	//Retrieve the first (and only!) File from the FileList object
	var f = evt.files[0]; 
	if (f) {
		var r = new FileReader();
		r.onload = function(e) { 
			var contents = e.target.result;
			wordArray = contents.toUpperCase().split('\n');
			for (var i = 0; i < wordArray.length; i++) {
				wordArray[i] = wordArray[i].replace(/[^A-Z]+/g, "");
			}
		}
      r.readAsText(f);
    } else { 
      alert("Failed to load file");
    }
}

//start a new game
function serverTrigger(newFileName, newWordsInc) {
	if (going == true) {
		return;
	}
	going = true;
	
	newFileName = newFileName || oldFileName;
	newWordsInc = setWordsInc || newWordsInc || oldWordsInc;
	oldFileName = newFileName;
	oldWordsInc = newWordsInc;
	var wordyServer = wordsFromServer(newFileName);
	gameLoad(wordyServer, newWordsInc);
}

function emptyTrigger() {
	if (going == true) {
		return;
	}
	going = true;
	
	var wordsInc = setWordsInc || oldWordsInc;
	oldWordsInc = wordsInc;
	gameLoad(wordArray, wordsInc);
}

function gameResetVars() {
	innerGrid.reInit();
	usedArray = [];
	placeArray = [];
	checkList = [];
	canvas.width = canvas.width;
}

function gameLoad(wordsArr, wordsInc) {
	gameResetVars();
	wordArray = wordsArr;
	if (fullReInit) {
		outerGrid.init("gridBox");
		resetMouseTrack();
		fullReInit = false;
	}
	if (loadWords(chooseSome(wordsArr, wordsInc))) {
		return;
	}
	wordGrid = new grid(4, Math.ceil(usedArray.length / 4));
	showWords(usedArray);
	fillRan();
	wordGridShown = new visGrid(wordGrid, "#wordGrid");
	wordGridShown.divHei = (Math.ceil(usedArray.length / 4) * 24);
	wordGridShown.divHei = (Math.ceil(usedArray.length / 4) * 24);
	wordGridShown.init("wordBox", true);
	outerGrid.resetGrid();
	
	going = false;
}

serverTrigger();