var configView_install = function(configName){
	var startConfig = function(){

		var reflectY = function(coords){
			var arr = [];
			coords.forEach(function(coord){
				arr.push(coord);
				arr.push([coord[0], 24-coord[1]]);
			})
			return arr;
		}

		var reflectX = function(coords){
			var arr = [];
			coords.forEach(function(coord){
				arr.push(coord);
				arr.push([24-coord[0], coord[1]]);
			})
			return arr;
		}
		var reflectXY = function(coords){
			return reflectY(reflectX(coords));
		}

		switch(configName){
			case "fourGlide": return reflectXY([[0,1], [1,2], [2,0],[2,1],[2,2]]);
			case "pulsar": return reflectXY([[6,8],[6,9],[6,10],[8,6],[9,6],[10,6],[8,11],[9,11],[10,11],[11,8],[11,9],[11,10]]);
			case "weird": return reflectX([[6,12],[7,12],[8,12],[9,12],[10,12],[6,11],[6,13],[10,11],[10,13]]).concat([[12,11],[12,12], [12,13]]);
			case "spike": return reflectXY([[11,10], [10, 11]]).concat(reflectX([[9,12], [8,12],[7,12]]).concat(reflectY([[12,9], [12,8],[12,7]])));
			default: throw "Not a starting configuration!"
		}
	}();

	$("#"+configName).click(function(){
		$("#game_board").empty();
		var board = LifeBoard(25,25);
		boardView_install($('#game_board'),board);
		board.changeManyStatuses(startConfig);
	})
}