import React from 'react';
import ReactDOM from 'react-dom';
import Chessdiagram from 'react-chessdiagram';

var chess = new Chess();

const lightSquareColor = '#2492FF';
const darkSquareColor = '#005EBB';
const startPosition =  'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'; // starting position
const flip = false;
const squareSize = 45;

chess.load(startPosition);

class Board extends React.Component{
	constructor(){
    super();
    this.state = {
      fen: startPosition,
			pgn: ""
    };
  }
	componentWillMount(){
		this.setState({
			fen: startPosition,
			pgn: ""
		});
	}
	render() {
		var self = this
		function onMovePiece(piece, fromSquare, toSquare){
			let message = fromSquare + ' -> ' + toSquare;
			console.log(message);
			let r = chess.move({ from: fromSquare, to: toSquare });
			if(r){
				console.log(self.props.chess.fen());
				console.log(self.props.chess.pgn());
				self.setState({
					fen: self.props.chess.fen(),
					pgn: self.props.chess.pgn()
				});
			} else{
				console.log("invalid move!");
			}
		}
    return (
			<div>
				<Chessdiagram
					flip={this.props.flip}
					fen={this.state.fen}
					squareSize={this.props.squareSize}
				  lightSquareColor={this.props.lightSquareColor}
					darkSquareColor={this.props.darkSquareColor}
					onMovePiece={onMovePiece} />
				<textarea cols="80" rows="4" readOnly={true} value={this.state.pgn}></textarea>
				<br />
				<input type="text" size="80" maxLength="80" readOnly={true} value={this.state.fen}></input>
			</div>
    );
  }
}

ReactDOM.render(
	<Board chess={chess} flip={flip} squareSize={squareSize}
    	lightSquareColor={lightSquareColor} darkSquareColor={darkSquareColor}/>,
	document.getElementById('root')
);
