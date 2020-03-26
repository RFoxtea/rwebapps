var elements;

$.getJSON( "elements.json" , function(data) {elements = data} );

$("#inputText").bind("input", function() {
	var forStr = $("#inputText").val();
	$("#properText").html(returnFuncHTML(forStr));
	$("#molarMass").html(returnFuncMass(forStr));
})

function returnFuncHTML(string) {

	if (!string) {return ""};
	
	var htmlStr = "";
	
	var molArray = string.split(" ");
	
	for (var i = 0; i < molArray.length; i++) {
		htmlStr += returnMolHTML(molArray[i]);
		if (i + 1 != molArray.length) {htmlStr += " "};
	}
	
	return htmlStr;
	
}

function roundMass(mass) {
	return Math.round(mass * 100) / 100;
}

function returnMolHTML(string) {
	var htmlStr = "";
	
	var writingAmount = true;
	var writingElement = false;
	
	for (var i = 0; i < string.length; i++) {
		if ( !isNaN(string[i]) ) {
			writingElement = false;
			
			if ( writingAmount ) {
				htmlStr += string[i];
			} else {
				htmlStr += "<sub>" + string[i] + "</sub>";
			}
		} else {
			writingAmount = false;
			if ( /^[a-zA-Z]*$/.test(string[i]) ) {
				htmlStr += string[i];
			} else {
				writingElement = false;
				
				htmlStr += string[i];
				
				if (!(string[i] == ")" || string[i] == "]")) {writingAmount = true};
			}
		}
	}
	
	return htmlStr;
}

function returnFuncMass(string) {
	if (!string) {return ""};
	
	var molMass = 0;
	
	var molArray = string.split(" ");
	
	for (var i = 0; i < molArray.length; i++) {
		var partialMolMass = returnMulMolMass(molArray[i]);
		if (!partialMolMass) {return ""};
		molMass += partialMolMass;
	}
	
	return roundMass(molMass);
}

function returnMulMolMass(string) {
	for (var i = 0; i < string.length; i++) {
		if ( isNaN(string[i]) ) {
			var formulaicMass;
			if ( i == 0 ) {
				formulaicMass = returnMolMass(string);
			} else {
				formulaicMass = string.slice(0, i) * returnMolMass(string.slice(i));
			}
			if (!formulaicMass) { return "" };
			return formulaicMass;
		}
	}
}

function returnMolMass(string) {
	var currentElement = "";
	var currentNumber = "";
	var molMass = 0;
	var currentElementMass = 0;
	
	var readBrackets = false;
	
	function addMolarMass(pointInString) { //Do the necessary calculations and add the molar mass of the current element / in bracket formula to the final molar mass.
	
		if ( currentElement ) { //When parsing an element.
			if ( isNaN(string[pointInString-1]) ) {
				currentNumber = "1";
			}
			currentElementMass = elementMass(currentElement);
			
			if ( !currentElementMass ) { return true }
			
			molMass += currentNumber * currentElementMass;
		} else if ( readBrackets ){ //When parsing an in bracket formula.
			if ( isNaN(string[pointInString-1]) ) {
				currentNumber = "1";
			}
			molMass += currentNumber * currentElementMass;
			readBrackets = false;
		}
		
		currentNumber = "";
		currentElement = "";
		
	}
	
	for (var i = 0; i < string.length; i++) {
		if ( /^[A-Z]*$/.test(string[i]) ) { //If character is a upper-case letter.
			
			if ( addMolarMass(i) ) {return ""};
			
			currentElement = string[i];
				
		} else if ( /^[a-z]*$/.test(string[i]) ) { //If character is a lower-case letter.
		
			if (!/^[a-zA-Z]*$/.test(string[i-1])) { return "" }
			
			currentElement += string[i];
			
		} else if ( !isNaN(string[i]) ) { // If character is a digit.
			
			currentNumber += string[i];
			
		} else if (string[i] == "(" || string[i] == "[") { // If character is some sort of opening bracket.
		
			if ( addMolarMass(i) ) {return ""};
			
			var endingBracket = findEndingBracket(string, i);
			currentElementMass = returnMolMass(string.slice(i + 1, endingBracket));
			i = endingBracket;
			
			readBrackets = true;
			
		} else {
		
			return "";
			
		}
	} 
		
	if ( addMolarMass(i) ) {return ""};
	
	return molMass;
}

function findEndingBracket(string, startingBracket) {
	var currentBrackets = 1;
	for (var i = startingBracket + 1; i < string.length; i++) {
		if ( string[i] === "(" || string[i] === "[" ) {currentBrackets++;};
		if ( string[i] === ")" || string[i] === "]" ) {currentBrackets--;};
		if ( currentBrackets === 0 ) {return i};
	}
}

function elementMass(string) {
	var element = $.grep(Object.keys(elements), function(e){ return elements[e].symbol == string });
	if ( elements[element] !== undefined ) {return elements[element].atomic_weight} else {return ""};
} 

function switchText() {
	if ($("#molarMassText").html() == "Molar mass:") {$("#molarMassText").html("Molecular mass:")} else {$("#molarMassText").html("Molar mass:")}
}