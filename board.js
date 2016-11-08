/* buildCurrBoard
 *
 * This is the main function that builds the board
 * and sets the appropriate next board as part of
 * the response string
 */
function buildCurrBoard(req, res){
	// grab the board from req.query
	var board = req.query.board;
	var ans = validateBoard(board);
	if (!ans){
		res.statusCode = 400;
	}
	else{
		// we now know the board is valid
		var newBoard = findBestMove(board);
		var answer = newBoard.split(' ').join("+");
		res.statusCode = 200;
		res.set('board', answer);
	}
	res.render('pages/index');
}

/* validateBoard
 *
 * This function ensures that it is a valid
 * board with O's turn
 */
function validateBoard(board){
	if (!board){
		return false;
	}
	var numXs = 0;
	var numOs = 0;
	// the board must consist of 9 characters
	if (board.length != 9){
		return false;
	}
	// we now iterate through each character
	for (var i=0; i<9; i++){
		if (board[i] == 'x'){
			numXs += 1;
		}
		else if (board[i] == 'o'){
			numOs +=1;
		}
	}
	// now that we have numXs and numOs, two scenarios
	// Xs went first or Os went first
	// if Xs first then numXs - numOs is 1
	// otherwise, they should both be equal with Os turn
	// we also make sure that the board isn't completely full
	if (((numXs - numOs == 1) || (numXs == numOs))
			&& (numXs + numOs != 9)){
		return true;
	}
	return false;
}

/* findBestMove
 *
 * This function takes in a board and outputs a new board
 * with the o placed in an optimal way
 */
function findBestMove(board){
	const centerPos = 4;

	var sideX = 'x';
	var sideO = 'o';

  var boardsToConsider1 = getNextBoards(board, sideO);
  var boardsToConsider2 = getNextBoards(board, sideX);
	var numBoards = boardsToConsider1.length;

	// first try to see if we can do a move that
	// flat out wins the game
  for (var i=0; i<numBoards; i++){
		var currOBoard = boardsToConsider1[i];
		if (determineWinner(currOBoard, sideO)){
			return currOBoard;
		}
	}

	// next try to see if we can do a move that
	// blocks opponent from winning
	for (var i=0; i<numBoards; i++){
		var currXBoard = boardsToConsider2[i];
		if (determineWinner(currXBoard, sideX)){
			var blockingBoard = boardsToConsider1[i];
			return blockingBoard
		}
	}

	var nextBoard;
	//otherwise, see if we can place it in the center
	if (board[centerPos] == ' '){
		nextBoard = getNextBoard(board, centerPos, sideO);
	}
	// if center is taken, then just take an arbitrary slot
	else{
		nextBoard = boardsToConsider1[0];
	}
	return nextBoard;
}
/* getNextBoards
 *
 * Takes in a board and returns an arry of
 * the next board given it is side's move
 */
function getNextBoards(board, side){
	var boards = [];
	positionsToConsider = [];
	for(var i=0; i<9; i++){
		if (board[i] == ' '){
			positionsToConsider.push(i);
		}
	}
	for (var i=0; i<positionsToConsider.length; i++){
		var index = positionsToConsider[i];
		var newBoard = getNextBoard(board, index, side);
		boards.push(newBoard);
	}
	return boards;
}
/* getNextBoard
 *
 * This function returns the next board by putting
 * the value of side in the position at index
 */
function getNextBoard(board, index, side){
	var topHalf = board.substr(0, index);
	var bottomHalf = board.substr(index+1, board.length-1-index);
	var newBoard = "";

	newBoard = newBoard.concat(topHalf);
	newBoard = newBoard.concat(side);
	newBoard = newBoard.concat(bottomHalf);
	return newBoard;
}


/* determineWinner
 *
 * This function determines if a given board is a winning board
 * Board is a 9 character string,
 * so contains positions 012345678
 *
 * As a board, this maps to:
 *
 * 0 1 2
 * 3 4 5
 * 6 7 8
 */
function determineWinner(board, side){
	//check rows
	for (var i=0; i<3; i++){
		if ((board[3*i] == side)
			&& (board[3*i] == board[3*i + 1])
			&& (board[3*i+1] == board[3*i + 2])){
				return true;
		}
	}
	//check columns
	for (var i=0; i<3; i++){
		if ((board[i] == side)
			&& (board[i] == board[i + 3])
			&& (board[i+3] == board[i+6])){
				return true;
		}
	}
	//check diagonals
	if ((board[0] == side)
		&& (board[0] == board[4])
		&& (board[4] == board[8])){
			return true;
	}
	if ((board[2] != ' ')
		&& (board[2] == board[4])
		&& (board[4] == board[6])){
			return true;
	}
  return false;
}

module.exports = {
	play: buildCurrBoard
};
