'use strict';
import {sendTranslate} from './ajax.js';
import {sendDB} from './ajax.js';
import {getName} from './ajax.js';
import {getDB} from './ajax.js';
import {update} from './ajax.js';

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
        if (event.charCode === 13) {
            sendTranslate(this.APIcallback.bind(this), this.state.input);
        }
    }

    APIcallback(res) {
        this.setState({value: res.translations[0].translatedText});
    }

    changeText(event) {
        this.setState({input: event.target.value});
    }

    saveCard() {
        sendDB(this.state.input, this.state.value);
    }

    render(props) {
        return (<div id="central">
            <div className="cards">
                <div className="card" id="English">
                    <textarea value={this.state.input} onChange={this.changeText.bind(this)}
                              onKeyPress={this.checkReturn}/>
                </div>
                <div className="card" id="Translation">
                    <textarea readOnly value={this.state.value}/>
                </div>
            </div>
            <div className="saveButton">
                <button id="save" onClick={this.saveCard.bind(this)}>Save</button>
            </div>
        </div>);
    }

}

class ReviewCard extends React.Component {
    constructor(props) {
        super(props);
        this.db = this.props.data;
        this.index = 0;
        //this.score = new Array(this.db.length);
        this.state = {input: [], value: this.db[0].chinese};
        this.checkReturn = this.checkReturn.bind(this);
        console.log(this.db);
        this.calScore = this.calScore.bind(this);
        //this.calScore(null);
        //getDB(this.DBcallback.bind(this));
    }

    calScore(select) {
        var score = 15;
        if (this.db[select].seen != 0) {
            score = (Math.max(1, 5 - this.db[select].correct) + (Math.max(1, 5 - this.db[select].seen) + 5 * ((this.db[select].seen - this.db[select].correct) / this.db[select].seen)));
        }
        console.log(score);
        return score;
    }

    checkReturn(event) {
        if (event.charCode === 13) {
            if (this.state.input == this.db[this.index].english) {
                this.setState({value: ["correct"]});
                this.db[this.index].seen = this.db[this.index].seen + 1;
                this.db[this.index].correct = this.db[this.index].correct + 1;
                update(this.db[this.index].english, this.db[this.index].seen, this.db[this.index].correct);

            } else {
                this.setState({value: this.db[this.index].chinese});
                this.db[this.index].seen = this.db[this.index].seen + 1;
                update(this.db[this.index].english, this.db[this.index].seen, this.db[this.index].correct);
            }
        }
    }

    changeText(event) {
        this.setState({input: event.target.value});
    }

    nextCard() {
        var randomIndex = Math.floor(Math.random() * (this.db.length));
        var random = Math.floor(Math.random() * 15);
        while (random >= this.calScore(randomIndex)) {
            randomIndex = Math.floor(Math.random() * (this.db.length));
        }
        this.index = randomIndex;
        this.setState({input: []});
        this.setState({value: this.db[this.index].chinese});
    }

    render(props) {
        return (<div id="central">
            <div className="cards">
                <div className="card" id="Translation">
                    <textarea readOnly value={this.state.value}/>
                </div>
                <div className="card" id="English">
                    <textarea value={this.state.input} onChange={this.changeText.bind(this)}
                              onKeyPress={this.checkReturn.bind(this)}/>
                </div>
            </div>
            <div className="saveButton">
                <button id="save" onClick={this.nextCard.bind(this)}>Next</button>
            </div>
        </div>);
    }
}

class Card extends React.Component {
    constructor(props) {
        super(props);
        this.state = {user: ["User Name"], reviewPage: false, db: []};
        getName(this.nameCallback.bind(this));
        getDB(this.DBcallback.bind(this));
    }

    DBcallback(array) {
        if (array.length != 0) {
            this.setState({db: array});
            this.setState({reviewPage: true});
            console.log(this.state.db);
        } else {
            alert("No cards in database");
        }
    }

    nameCallback(name) {
        this.setState({user: name});
    }

    enterReview() {
        getDB(this.DBcallback.bind(this));
    }

    quitReview() {
        this.setState({reviewPage: false});
    }

    render() {
        if (this.state.reviewPage == true) {
            return (<main>
                <h1 id="logo">
                    <button id="start" onClick={this.quitReview.bind(this)}> Add</button>
                    Lango!
                </h1>
                <ReviewCard data={this.state.db}/>
                <footer><span id="footer-name">{this.state.user}</span></footer>
            </main>);
        } else {
            return (<main>
                <h1 id="logo">
                    <button id="start" onClick={this.enterReview.bind(this)}> Start Review</button>
                    Lango!
                </h1>
                <CreateCardMain/>
                <footer><span id="footer-name">{this.state.user}</span></footer>
            </main>);
        }
    }

}

ReactDOM.render(
    <Card/>,
    document.getElementById('root')
);

// onKeyPress function for the textarea element
// When the charCode is 13, the user has hit the return key
