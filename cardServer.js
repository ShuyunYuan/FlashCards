"use strict"
const express = require('express')
const port = 59500
const api = require('./testAPI');
const db = require('./createDB');

function engHandler(req, res, next) {
    let url = req.url;
    let qObj = req.query;
    console.log(qObj);
    
    if (qObj.english != undefined) {
        api.issueRequest(qObj.english, getRes);
	    //res.json( {"palindrome" : qObj.english} );
    }
    else {
	next();
    }
    function getRes(resp) {
        res.json(resp);
    }
}

function dbHandler(req, res, next) {
    let q = req.query;
    console.log(q);
    if (q.english != undefined) {
        let eng = q.english;
        let chi = q.chinese;
        let id = 123;
        db.createCard(eng, chi, id);
    }
}

function fileNotFound(req, res) {
    let url = req.url;
    res.type('text/plain');
    res.status(404);
    res.send('Cannot find '+url);
    }

// put together the server pipeline
const app = express();
app.use(express.static('public'));  // can I find a static file? 
app.get('/translate', engHandler );   // if not, is it a valid query?
app.get('/store', dbHandler);
app.use( fileNotFound );            // otherwise not found


app.listen(port, function (){console.log('Listening...');} );