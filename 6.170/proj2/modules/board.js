var LifeBoard = function(nRows, nColumns){
	//Initializes a Game of Life Board with nRows rows and nColumns columns
	var that = Object.create(LifeBoard.prototype);

	var subscribers = [];

	that.subscribe = function(subscriber) {
		subscribers.push(subscriber);
	};
	var publishChanges = function() {
		var i;
		for (i = 0; i < subscribers.length; i++)
			subscribers[i]();
	};

	//Represents a cell in the board
	var Cell = function(){
		var thatCell = Object.create(Cell.prototype);
		var status = 0; //1 if live 0 if dead
		var checkEvolve = 0; //does it need too change status

		thatCell.getStatus = function() {return status};

		thatCell.evolveCell = function() {
			if (checkEvolve) { //change status if ready to evolve
				thatCell.changeStatus();
			}
		}

		thatCell.changeStatus = function(){ //changes status
			status = 1 - thatCell.getStatus();
		}

		thatCell.markEvolve = function(row, col) {//sets checkEvolve if Cell is ready to evolve
			var getNeighborStatuses = function(){  //check live neighbors
				var statuses = [];
				var offsets = [-1,0,1];
				var isMiddle= function(off1, off2){ //not a neighbor
					return off1 === 0 && off2 === 0;
				}
				var outOfRange = function(idx1, idx2){//out of board
					return (idx1+1)*(idx1-nRows) >= 0 || (idx2+1)*(idx2-nColumns) >= 0; 
				}
				offsets.forEach(function(rowOffset){ //iterate through neighbors
					offsets.forEach(function(colOffset){
						if (!isMiddle(rowOffset, colOffset) && !outOfRange(row+rowOffset, col+colOffset)){
							statuses.push(that.getStatus(row+rowOffset, col+colOffset)); //push the status of the neighbor
						}
					});
				});
				return statuses;
			} 
			var checkEvolveCell = function() {
				var survivalCount = getNeighborStatuses().filter(function(el){ return el}).length; //gets how many neighbors are alive
				if (thatCell.getStatus()){ //Game of Life logic depends whether middle cell is alive or not
					return !(survivalCount === 2 || survivalCount === 3);
				}
				else {
					return survivalCount === 3;
				}
			}
			checkEvolve = checkEvolveCell() ? 1 : 0; //update
		};

		Object.freeze(thatCell);
		return thatCell;
	}

	var board = function(){
		//For loops weren't allowed so I used recursion, hopefully that's alright
		var theBoard = [];
		var initRow = function(cellRow, columnsLeft){ //initialize a fresh row of cells
			if (columnsLeft === 0){
				return cellRow;
			}
			else{ 
				cellRow.push(Cell());
				return initRow(cellRow, columnsLeft-1);
			}
		};
		var initAllRows = function(currentBoard, rowsLeft){ //initialize the entire board
			if (rowsLeft === 0){
				return currentBoard;
			} 
			else {
				currentBoard.push(initRow([], nColumns));
				return initAllRows(currentBoard, rowsLeft-1);
			}
			return;
		}
		return initAllRows(theBoard, nRows);
	}();

	that.getWidth = function() {return nColumns}

	that.getHeight = function() {return nRows}

	that.getStatus = function(row, column){ //gets status of cell at row, column of board
		return board[row][column].getStatus();
	}

	var changeStat = function(row, column){ //status change helper
		board[row][column].changeStatus();
	}

	that.changeManyStatuses = function(coords){ //changes a lot of statuses before updating
		coords.forEach(function(coord){
			changeStat(coord[0], coord[1]);
		})
		publishChanges();
	}

	that.changeStatus = function(row, column){ //changes status of cell at row, column of board and updates
		changeStat(row, column);
		publishChanges();
	}

	that.evolve = function(){ //evolves the entire board i.e. updates statuses(alive/dead) of each cell
		var curRow = 0;
		board.forEach(function(row){
			var curCol = 0;
			row.forEach(function(cell){
				cell.markEvolve(curRow, curCol);
				curCol++;
			});
			curRow++;
		});
		board.forEach(function(row){
			row.forEach(function(cell){
				cell.evolveCell();
			});
		});
		publishChanges();
	}

	that.getBoardStatus = function(){ //returns array of statuses (alive/dead) of each cell in board
		var boardStatus = [];
		board.forEach(function(row){
			var rowStatus = [];
			row.forEach(function(cell){
				rowStatus.push(cell.getStatus());
			});
			boardStatus.push(rowStatus);
		});
		return boardStatus;
	}

	publishChanges();
	Object.freeze(that);
	return that;
}