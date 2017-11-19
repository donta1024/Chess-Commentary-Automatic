import React, { Component } from 'react';
import ReactDOM from 'react-dom';	
import Chessdiagram from 'react-chessdiagram';

const lightSquareColor = '#2492FF'; // light blue
const darkSquareColor = '#005EBB'; // dark blue
const currentPosition =  'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'; // starting position
const flip = false;
const squareSize = 30;

ReactDOM.render(
	<Chessdiagram flip={flip} fen={currentPosition} squareSize={squareSize} 
    	lightSquareColor={lightSquareColor} darkSquareColor={darkSquareColor}/>,
	document.getElementById('root')
);