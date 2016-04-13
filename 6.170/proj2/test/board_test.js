var Board = LifeBoard(3, 3);
var statuses;
var flatten = function(){
	return [].concat.apply([], Board.getBoardStatus())
}

var reset = function(){
	Board = LifeBoard(3,3);
}

arrayEquals = function(arr1, arr2){
	var i = -1;
	if (arr1.length != arr2.length) return false;
	else if (arr1.length === 0) return true;
	else return arr1.reduce(function(eq, el){
		i++; return eq && (arr1[i] === arr2[i]);
	}, true);
}

/**
* Empty board
**/
QUnit.test( "Ghost Town", function( assert ) {
	var pass = true;
	statuses = flatten();
	pass = statuses.map(function(el, other){
		return other && !el;
	})
	assert.ok( pass, "Passed!" );
});

/**
* One element alive
**/
QUnit.test( "Single", function( assert ) {
	reset();
	//Corner
	// * o o
	// o o o
	// o o o
	Board.changeStatus(0,0);
	statuses = flatten();
	assert.ok( arrayEquals(statuses, [1, 0, 0, 0,0,0,0,0,0]), "Passed!" );
	Board.evolve();
	statuses = flatten();
	assert.ok( arrayEquals(statuses, [0, 0, 0, 0,0,0,0,0,0]), "Passed!" );

	reset(); 
	//Center
	// o o o
	// o * o
	// o o o
	Board.changeStatus(1,1);
	statuses = flatten();
	assert.ok( arrayEquals(statuses, [0, 0, 0, 0,1,0,0,0,0]), "Passed!" );
	Board.evolve();
	statuses = flatten();
	assert.ok( arrayEquals(statuses, [0, 0, 0, 0,0,0,0,0,0]), "Passed!" );

});

/**
* Two elements alive
**/
QUnit.test( "Couple", function( assert ) {
	reset();
	//Non-adjacent
	// * o o
	// o o o
	// o o *
	Board.changeStatus(0,0);
	Board.changeStatus(2,2);
	statuses = flatten();
	assert.ok( arrayEquals(statuses, [1, 0, 0, 0,0,0,0,0,1]), "Passed!" );
	Board.evolve();
	statuses = flatten();
	assert.ok( arrayEquals(statuses, [0, 0, 0, 0,0,0,0,0,0]), "Passed!" );

	reset();
	//Adjacent
	// * o o
	// o * o
	// o o o
	Board.changeStatus(0,0);
	Board.changeStatus(1,1);
	statuses = flatten();
	assert.ok( arrayEquals(statuses, [1, 0, 0, 0,1,0,0,0,0]), "Passed!" );
	Board.evolve();
	statuses = flatten();
	assert.ok( arrayEquals(statuses, [0, 0, 0, 0,0,0,0,0,0]), "Passed!" );

});

/**
* Three elements alive
**/
QUnit.test( "Trio", function( assert ) {
	reset();
	//Live cell w/ two neighbors, dead cell w/ three neighbors
	// * * o
	// o * o
	// o o o
	Board.changeStatus(0,0);
	Board.changeStatus(0,1);
	Board.changeStatus(1,1);
	Board.evolve();
	statuses = flatten();
	assert.ok( arrayEquals(statuses, [1, 1, 0, 1,1,0,0,0,0]), "Passed!" );

	reset();
	//Live cells w/ < two neighbors, dead cell w/ three neighbors
	// * * o
	// o o o
	// o o *
	Board.changeStatus(0,0);
	Board.changeStatus(0,1);
	Board.changeStatus(2,2);
	Board.evolve();
	statuses = flatten();
	assert.ok( arrayEquals(statuses, [0, 0, 0, 0, 1, 0, 0, 0, 0]), "Passed!" );

	reset();
	//Same as previous but not separated
	// * * o
	// o o *
	// o o o
	Board.changeStatus(0,0);
	Board.changeStatus(0,1);
	Board.changeStatus(1,2);
	Board.evolve();
	statuses = flatten();
	assert.ok( arrayEquals(statuses, [0, 1, 0, 0, 1, 0, 0, 0, 0]), "Passed!" );
});

/**
* Many elements alive
**/
QUnit.test( "8-Circle", function( assert ) {
	reset();
	//Live cell w/ 2 neighbors
	//Live cell w/ >3 neighbors
	//Dead cell w/ >3 neighbors
	// * * *
	// * o *
	// * * *
	Board.changeStatus(0,0);
	Board.changeStatus(0,1);
	Board.changeStatus(0,2);
	Board.changeStatus(1,0);
	Board.changeStatus(1,2);
	Board.changeStatus(2,0);
	Board.changeStatus(2,1);
	Board.changeStatus(2,2);
	Board.evolve();
	statuses = flatten();
	assert.ok( arrayEquals(statuses, [1, 0, 1, 0, 0, 0, 1, 0, 1]), "Passed!" );
});