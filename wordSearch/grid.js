visGrids = {}; //Used to remember which divs belong to which objects.

//Object containing a grid. You could call it a simple matrix.
function grid(gridX, gridY) {
	this.width = gridX;
	this.height = gridY;

	this.array = [];
	for(y = 0; y < this.height; y++) {
		this.array.push([]);
		for(x = 0; x < this.width; x++) {
			this.array[y].push("");
		}
	};
	
	this.rebuild = function() {
		this.array = [];
		for(y = 0; y < this.height; y++) {
			this.array.push([]);
			for(x = 0; x < this.width; x++) {
				this.array[y].push("");
			}
		};
	}
	
	this.reInit = function() {
		for(y = 0; y < this.height; y++) {
			for(x = 0; x < this.width; x++) {
				this.array[y][x] = "";
			}
		}
	}
}

//Object binding a grid to a div.
function visGrid(grid, div) {
	this.grid = grid;
	this.div = div;
	this.divId = $(div).attr('id');
	this.divHei = $(this.div).height();
	this.divWid = $(this.div).width();
	visGrids[this.divId] = this;
	
	//Draws a grid for the first time.
	this.init = function(divStyle, bottom, right) {
		bottom = bottom || false;
		right = right || false;
		$(this.div).html('');
		this.boxHei = this.divHei / this.grid.height;
		this.boxWid = this.divWid / this.grid.width;
		for(y = 0; y < this.grid.height; y++) {
			$(this.div).append("<div id=\"" + this.divId + "-y" + y + "\"> </div>");
			for(x = 0; x < this.grid.width; x++) {
				$("#" + this.divId + "-y" + y).append("<div id=\"" + this.divId + "-x" + x + "y" + y + "\" class=\"" + divStyle + "\"> </div>");
				var gridDivver = $("#" + this.divId + "-x" + x + "y" + y);
				gridDivver.css({"top": this.boxHei * y, "left": this.boxWid * x});
				gridDivver.width(this.boxWid);
				gridDivver.height(this.boxHei);
				gridDivver.html(this.grid.array[y][x]);
				if (x == this.grid.width - 1 && right == false) {gridDivver.css({"border-right-width": "0px"})};
				if (y == this.grid.height - 1 && bottom == false) {gridDivver.css({"border-bottom-width": "0px"})};
			}
		}
	}
	
	//Reloads all inner HTML of a grid.
	this.resetGrid = function() {
		for(y = 0; y < this.grid.height; y++) {
			for(x = 0; x < this.grid.width; x++) {
				var gridDivver = $("#" + this.divId + "-x" + x + "y" + y);
				gridDivver.html(this.grid.array[y][x]);
			}
		}
	}
	
	//Reloads HTML of a single box.
	this.resetBox = function(x, y) {
		var gridDivver = $("#" + this.divId + "-x" + x + "y" + y);
		gridDivver.html(this.grid.array[y][x]);
	}
	
	this.box = function(x, y) {
		var gridDivver = $("#" + this.divId + "-x" + x + "y" + y);
		return gridDivver;
	}
}

//Object that gives information about a cell, given the div.
function gridDiv(gridDivver) {
	var divId = gridDivver.attr('id');
	this.parId = divId.slice(0, divId.indexOf("-"));
	this.parent = $("#" + this.parId);
	this.x = parseInt(divId.slice(divId.indexOf("x") + 1, divId.indexOf("y")));
	this.y = parseInt(divId.slice(divId.indexOf("y") + 1));
	this.parGrid = visGrids[(this.parId)];
}