$(function() {
	var cols = 25;
	var rows = 25;
	var board = LifeBoard(rows, cols);
	boardView_install($('#game_board'),board);

	configView_install("pulsar");
	configView_install("fourGlide");
	configView_install("spike");
	configView_install("weird");
})