"use strict"
const sqlite3 = require("sqlite3").verbose();  // use sqlite
const fs = require("fs"); // file system

const dbFileName = "Flashcards.db";
// makes the object that represents the database in our code
const db = new sqlite3.Database(dbFileName);  // object, not database.

// Initialize table.
// If the table already exists, causes an error.
// Fix the error by removing or renaming Flashcards.db
const cmdStr = 'CREATE TABLE Flashcards (user INT, english TEXT, chinese TEXT, seen INT, correct INT)';
db.run(cmdStr,tableCreationCallback);

const APIrequest = require('request');
const http = require('http');

const APIkey = "AIzaSyC4iz9aFfnOfR5VtmcsfcleRwrY6NsDtzY";  // ADD API KEY HERE
const url = "https://translation.googleapis.com/language/translate/v2?key="+APIkey;

// An object containing the data expressing the query to the
// translate API. 
// Below, gets stringified and put into the body of an HTTP PUT request.
let requestObject = 
    {
	"source": "en",
	"target": "zh-CN",
	"q": [
	    "example phrase" // user input english phrase
	]
    }

console.log("English phrase: ", requestObject.q[0]);

// The call that makes a request to the API
// Uses the Node request module, which packs up and sends off
// an HTTP message containing the request to the API server
APIrequest(
	{ // HTTP header stuff
	    url: url,
	    method: "POST",
	    headers: {"content-type": "application/json"},
	    // will turn the given object into JSON
	    json: requestObject	},
	// callback function for API request
	APIcallback
    );

    // callback function, called when data is received from API
    function APIcallback(err, APIresHead, APIresBody) {
	// gets three objects as input
	if ((err) || (APIresHead.statusCode != 200)) {
	    // API is not working
	    console.log("Got API error");
	    console.log(APIresBody);
	} else {
	    if (APIresHead.error) {
		// API worked but is not giving you data
		console.log(APIresHead.error);
	    } else {
		console.log("In Chinese: ", 
		    APIresBody.data.translations[0].translatedText);
		console.log("\n\nJSON was:");
		console.log(JSON.stringify(APIresBody, undefined, 2));
        // print it out as a string, nicely formatted
        createNewcard(requestObject.q[0], APIresBody.data.translations[0].translatedText);
	    }
	}
    } // end callback function

db.get('SELECT * FROM Flashcards WHERE seen>5', dataCallback);
db.all('SELECT * FROM Flashcards WHERE user = 133', arrayCallback);

//store new card in database
function createNewcard(eng, chi) {
    const cmdStr_in = 'INSERT into Flashcards(user, english, chinese, seen, correct) VALUES (133, @0, @1, 10, 2)';
    db.run(cmdStr_in, eng, chi, insertCallback);
}

// Always use the callback for database operations and print out any
// error messages you get.
// This database stuff is hard to debug, give yourself a fighting chance.
function tableCreationCallback(err) {
    if (err) {
	console.log("Table creation error",err);
    } else {
	console.log("Database created");
	db.close();
    }
}

function insertCallback(err) {
    if(err) {
        console.log(err);
    }
}

function dataCallback(err, rowData) {
    if (err) {
        console.log("error: ", err);
    }
    else {
        console.log("got: ", rowData, "\n");
    }
}

function arrayCallback(err, arrayData) {
    if(err) {
        console.log("error: ", err,"\n");
    }
    else {
        console.log("array: ", arrayData, "\n");
    }
}
