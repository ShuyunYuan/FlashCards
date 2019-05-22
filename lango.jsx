'use strict';
import{sendTranslate} from './ajax.js';
import{sendDB} from './ajax.js';

// An element to go into the DOM
//const review = <button id="start">Start Review</button>
//const lango = <h1 id="logo">Lango!</h1>;


// A component - function that returns some elements 
/*function FirstCard() {
	 return (<div className="card">
	 <textarea value="Trans" />
	 </div>);
	 }

// Another component
function FirstInputCard() {
         return (<div className="card">
	          <textarea value="English" />
		  </div>);
            }

function Card() {
	return (<div className="cards">
		<FirstInputCard/>
		<FirstCard/>
	</div>);
}

const save = <button id="save" onclick={checkReturn}>Save</button>;
*/
// An element with some contents, including a variable
// that has to be evaluated to get an element, and some
// functions that have to be run to get elements. 
class CreateCardMain extends React.Component {
	constructor(props) {
		super(props);
		this.state = {input: ["English"], value: ["Chinese"]};
		this.checkReturn = this.checkReturn.bind(this);
	}
	checkReturn(event) {
		if (event.charCode == 13) {
			sendTranslate(this.callback.bind(this), this.state.input);
		} 
	}
	callback(res) {
		this.setState({value: res.translations[0].translatedText});
	}
	changeText(event) {
		this.setState({input: event.target.value});
	}
	saveCard() {
		sendDB(this.state.input, this.state.value);
	}
	render() {
		return (<main>
		<button id="start">Start Review</button>
		<h1 id="logo">Lango!</h1>
		<div className="cards">
			<div className="card">
	          	<textarea value={this.state.input} onChange={this.changeText.bind(this)} onKeyPress={this.checkReturn}/>
		  	</div>
			<div className="card">
	 			<textarea readOnly value={this.state.value}/>
	 		</div>
		</div>
		<button id="save" onClick={this.saveCard.bind(this)}>Save</button>
	</main>);
	}

}

ReactDOM.render(
    <CreateCardMain />,
    document.getElementById('root')
);

// onKeyPress function for the textarea element
// When the charCode is 13, the user has hit the return key
	 