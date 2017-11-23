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
	  pgn: "",
	  analyzeResult: analyzeResult,
	  allowMoves:false
    };
  }
	componentWillMount(){
		this.setState({
			fen: startPosition,
			pgn: ""
		});
	}

	render() {
		var self = this;
		function onMovePiece(piece, fromSquare, toSquare){
		}
		
    return (
			<div>
    	    	<h3> submit succeeded!</h3>
				<Chessdiagram
					allowMoves={this.state.allowMoves}
					flip={this.props.flip}
					fen={this.state.fen}
					squareSize={this.props.squareSize}
				  lightSquareColor={this.props.lightSquareColor}
					darkSquareColor={this.props.darkSquareColor}
					onMovePiece={onMovePiece} />
				<p>FEN String: {this.state.fen}</p>
				<p>Analyze Result: {this.state.analyzeResult}</p>
			</div>

    );
  }
}

ReactDOM.render(
		<Board chess={chess} flip={flip} squareSize={squareSize}
	    	lightSquareColor={lightSquareColor} darkSquareColor={darkSquareColor}/>,
		document.getElementById('root')
);
