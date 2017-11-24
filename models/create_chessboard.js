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
	Segment,
	Dimmer,
	Loader,
	Menu
	} from 'semantic-ui-react';
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
	  pgn: "",
	  load: false
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }
	componentWillMount(){
		this.setState({
			fen: startPosition,
			pgn: ""
		});
	}
	handleChange(event) {
	    // ネストされたオブジェクトのdataまでアクセスしておく
	    var data = this.state.data;
	    if (event.target.name == "fen"){
	    	data.fen = document.getElementById("root").firstElementChild.lastElementChild.value;
	    }
	    
        this.setState({
            data: data
        });
	}
	
	handleSubmit() {
		this.setState({load:true});
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
			<Menu borderless attached='top' color='teal'>
				<Menu.Item>Chess-Commentary-Automatic</Menu.Item>
				<Menu.Item href="/">Top Page</Menu.Item>
			</Menu>
			<Segment attached='bottom'>
				<Dimmer active={this.state.load} inverted>
					<Loader content='Calculating. Please Wait...' />
				</Dimmer>
				<Container style={{ marginTop: '3em' }}>
					<Header as='h1'>Welcome to Chess-Commentary-Automatic!</Header>
					<p>By donta1024, ishihara1989, interimadd, & AyatsujiP</p>
					<Grid columns={2} stackable>
						<Grid.Column>
							<Chessdiagram
								flip={this.props.flip}
								fen={this.state.fen}
								squareSize={this.props.squareSize}
								lightSquareColor={this.props.lightSquareColor}
								darkSquareColor={this.props.darkSquareColor}
							onMovePiece={onMovePiece} />
						</Grid.Column>
						<Grid.Column>
							<Form name="FENSubmitForm" action="fensubmit" method="POST" onSubmit={this.handleSubmit}>
								<TextArea cols="80" rows="4" readOnly={true} value={this.state.pgn}></TextArea>
								<input name="FENtoAnalyze" type="text" size="80" maxLength="80" readOnly={true} value={this.state.fen}></input>
								<Button type="submit">FEN submit</Button>
							</Form>
							<Form name="PGNSubmitForm" action="pgnsubmit" method="POST" onSubmit={this.handleSubmit}>
								<input name="PGNtoAnalyze" type="hidden" cols="80" rows="4" readOnly={true} value={this.state.pgn}></input>
								<Button type="submit">PGN submit</Button>
							</Form>
						</Grid.Column>
					</Grid>
				</Container>
			</Segment>
		</div>
    );
  }
}





ReactDOM.render(
	<Board chess={chess} flip={flip} squareSize={squareSize}
    	lightSquareColor={lightSquareColor} darkSquareColor={darkSquareColor}/>,
	document.getElementById('root')
);