import React from 'react';
import ReactDOM from 'react-dom';
import Chessdiagram from 'react-chessdiagram';


class FormApp extends React.Component{
    constructor(){
        super();
        this.state = {
        	data :{
                fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
        	}
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
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
		this.state.data.fen = document.getElementById("root").firstElementChild.lastElementChild.value;
		document.forms.FENSubmitForm.FENtoAnalyze.value = document.getElementById("root").firstElementChild.lastElementChild.value;
		console.log(document.forms.FENSubmitForm.FENtoAnalyze.value);
	}
	render(){
	    return (
	        <form name="FENSubmitForm" action="fensubmit" method="POST" onSubmit={this.handleSubmit}>
	            {/* fen */}
	            <input id="fen_text" type="hidden" name="FENtoAnalyze" value={this.state.data.fen} onChange={this.handleChange}/>
	
	             {/* Submit Button */}
	            <button type="submit">送信</button>
	        </form>
	    );
	}

};

ReactDOM.render(
		<FormApp />,
		document.getElementById('fen_form')
);