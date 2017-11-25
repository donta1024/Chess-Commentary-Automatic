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
	Loader,
	Menu
	} from 'semantic-ui-react';

var chess = new Chess();

const lightSquareColor = '#2492FF';
const darkSquareColor = '#005EBB';
const startPosition =  currentFen; // starting position
const flip = false;
const squareSize = 45;
const pgn = PGNtoAnalyze;

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
			pgn: PGNtoAnalyze
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
			<Menu borderless attached='top' color='teal'>
				<Menu.Item>Chess-Commentary-Automatic</Menu.Item>
				<Menu.Item href="/">Top Page</Menu.Item>
			</Menu>
			<Container style={{ marginTop: '3em' }} attached='bottom'>
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
							<Form>
								<TextArea readOnly={true} value={this.state.pgn}></TextArea>
							</Form>
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
