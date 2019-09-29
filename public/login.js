"use strict";

var landing = React.createClass({
    displayName: "landing",
    render: function render() {
        return React.createElement("div", null, React.createElement("meta", {
            charSet: "UTF-8"
        }), React.createElement("title", null, "Welcome to Lango: Customize your vocabulary"), React.createElement("meta", {
            name: "viewport",
            content: "width=device-width"
        }), React.createElement("meta", {
            name: "google-signin-client_id",
            content: "YOUR_CLIENT_ID.apps.googleusercontent.com"
        }), React.createElement("link", {
            href: "https://fonts.googleapis.com/css?family=Open+Sans:300|Raleway:900",
            rel: "stylesheet"
        }), React.createElement("link", {
            rel: "stylesheet",
            type: "text/css",
            href: "login.css"
        }), React.createElement("section", {
            id: "left"
        }, React.createElement("h1", null, "Welcome to Lango!"), React.createElement("h2", null, "Customize your vocabulary!")), React.createElement("section", {
            id: "right"
        }, React.createElement("button", {
            id: "login"
        }, React.createElement("img", {
            id: "icon",
            src: "google.jpg"
        }), React.createElement("div", {
            id: "btn_p"
        }, "Login with Google!"))));
    }
});