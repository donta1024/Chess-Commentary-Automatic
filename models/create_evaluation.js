import React from 'react';
import ReactDOM from 'react-dom';
import Chessdiagram from 'react-chessdiagram';
import { 
	Button, 
	Form, 
	TextArea, 
	Container, 
	Grid, 
	Header, 
	Accordion, 
	Icon,
	Segment,
	Dimmer,
	Loader
	} from 'semantic-ui-react';

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
		  allowMoves:false,
		  activeIndex: 0 
	    };
	}
	componentWillMount(){
		this.setState({
			fen: startPosition,
			pgn: ""
		});
	};


	render() {
		const panels = [
			{
				title: 'Show Details:',
				content: 'Analyze Result:' +  this.state.analyzeResult
			}
		];
	
		var self = this;
		function onMovePiece(piece, fromSquare, toSquare){
		}
		
    return (
		<div>
			<Container style={{ marginTop: '3em' }}>
				<div>
					<Header as='h1'> submit succeeded!</Header>
					<Grid columns={2} stackable>
						<Grid.Column>
							<Chessdiagram
								allowMoves={this.state.allowMoves}
								flip={this.props.flip}
								fen={this.state.fen}
								squareSize={this.props.squareSize}
								lightSquareColor={this.props.lightSquareColor}
								darkSquareColor={this.props.darkSquareColor}
							onMovePiece={onMovePiece} />
						</Grid.Column>
						<Grid.Column>
							<p>FEN String: {this.state.fen}</p>
							<Accordion panels={panels} />
						</Grid.Column>
					</Grid>
				</div>
			</Container>

		</div>
    );
  }
}

ReactDOM.render(
		<Board chess={chess} flip={flip} squareSize={squareSize}
	    	lightSquareColor={lightSquareColor} darkSquareColor={darkSquareColor}/>,
		document.getElementById('root')
);
