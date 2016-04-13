boardView_install = function(domContainer, board){
	var height = domContainer.height();
	var width = domContainer.width();
	var dheight = height/board.getHeight();
	var dwidth = width/board.getWidth();
	var active = 0; //is animation active

	var generateCellDivs = function() { //generate divs of cells
		var row = 0;
		var col = 0;
		var currentRow;
		var addColDiv = function(el){ //adds a cell div into el
			el.append($("<div class='square hover' id=col" + col + "></div>"));
			col++;
			return el;
		}
		var generateCells = function(el, columnsLeft){ //generates a row of columnsLeft cell divs onto el
			if (columnsLeft === 0) return;
			generateCells(addColDiv(el), columnsLeft-1);
		}
		var addRowDiv = function(el) { //inserts row of cell divs into el
			col = 0;
			currentRow = $("<div class='row' id='row"+row+"'></div>");
			generateCells(currentRow, board.getWidth());
			el.append(currentRow);
			row++;
			return el;
		}
		var generateRows = function(el, rowsLeft){ //generates rowsLeft rows of cell divs
			if (rowsLeft === 0) return;
			generateRows(addRowDiv(el), rowsLeft-1);
		}
		generateRows($('#game_board'), board.getHeight());
	}

	generateCellDivs();

	$('.row').css("height", dheight); //not in css file because my choice height and width parameters aren't fixed
	$('.square').css("width", dwidth).css("height", dheight);

	$('.square').click(function(){ //lets user change state of cells when not active
		if (!active){ //only when not in animation
			var col = $(this).attr("id").substring(3);
			var row = $(this).parent().attr("id").substring(3);
			board.changeStatus(row, col);
			$('#row'+row+' #col'+col).css("background-color", board.getStatus(row, col) ? "black" : "white");
		}
	})

	var markSquares = function() { //update the colors of the cells
		var curRow = 0;
		board.getBoardStatus().forEach(function(cellRow){ //get status of each cell
			var curCol = 0;
			cellRow.forEach(function(cellStatus){ //update the color
				$('#row'+curRow+' #col'+curCol).css("background-color", cellStatus ? "black" : "white");
				curCol++;	
			});
			curRow++;
		})
	}

	board.subscribe(function(){ //subscriber pattern
		markSquares();
	});

	$(window).unbind("keypress"); //in case there was a previous instance

	$(window).keypress(function(e) { //controls animation
		if (e.keyCode === 0 || e.keyCode === 32) active = 1 - active;
		$('.square').toggleClass('hover'); //no hover interaction when animating
	});

	var evolution = window.setInterval(function(){
		if (active) board.evolve(); //evolve if not paused
	}, 300);

	$(".startImg").click(function(){ //stop this instance
		clearInterval(evolution);
	});
}