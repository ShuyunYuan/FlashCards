'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import { sendTranslate } from './ajax.js';
import { sendDB } from './ajax.js';

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

var CreateCardMain = function (_React$Component) {
	_inherits(CreateCardMain, _React$Component);

	function CreateCardMain(props) {
		_classCallCheck(this, CreateCardMain);

		var _this = _possibleConstructorReturn(this, (CreateCardMain.__proto__ || Object.getPrototypeOf(CreateCardMain)).call(this, props));

		_this.state = { input: ["English"], value: ["Chinese"] };
		_this.checkReturn = _this.checkReturn.bind(_this);
		return _this;
	}

	_createClass(CreateCardMain, [{
		key: 'checkReturn',
		value: function checkReturn(event) {
			if (event.charCode == 13) {
				sendTranslate(this.callback.bind(this), this.state.input);
			}
		}
	}, {
		key: 'callback',
		value: function callback(res) {
			this.setState({ value: res.translations[0].translatedText });
		}
	}, {
		key: 'changeText',
		value: function changeText(event) {
			this.setState({ input: event.target.value });
		}
	}, {
		key: 'saveCard',
		value: function saveCard() {
			sendDB(this.state.input, this.state.value);
		}
	}, {
		key: 'render',
		value: function render() {
			return React.createElement(
				'main',
				null,
				React.createElement(
					'button',
					{ id: 'start' },
					'Start Review'
				),
				React.createElement(
					'h1',
					{ id: 'logo' },
					'Lango!'
				),
				React.createElement(
					'div',
					{ className: 'cards' },
					React.createElement(
						'div',
						{ className: 'card' },
						React.createElement('textarea', { value: this.state.input, onChange: this.changeText.bind(this), onKeyPress: this.checkReturn })
					),
					React.createElement(
						'div',
						{ className: 'card' },
						React.createElement('textarea', { readOnly: true, value: this.state.value })
					)
				),
				React.createElement(
					'button',
					{ id: 'save', onClick: this.saveCard.bind(this) },
					'Save'
				)
			);
		}
	}]);

	return CreateCardMain;
}(React.Component);

ReactDOM.render(React.createElement(CreateCardMain, null), document.getElementById('root'));

// onKeyPress function for the textarea element
// When the charCode is 13, the user has hit the return key

