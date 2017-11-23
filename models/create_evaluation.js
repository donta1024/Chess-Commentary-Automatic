import React from 'react';
import ReactDOM from 'react-dom';
import Chessdiagram from 'react-chessdiagram';

var chess = new Chess();

const lightSquareColor = '#2492FF';
const darkSquareColor = '#005EBB';
const startPosition =  currentFen; // starting position
const flip = false;
const squareSize = 45;

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
			</div>
    );
  }
}

ReactDOM.render(
		<Board chess={chess} flip={flip} squareSize={squareSize}
	    	lightSquareColor={lightSquareColor} darkSquareColor={darkSquareColor}/>,
		document.getElementById('root')
);
