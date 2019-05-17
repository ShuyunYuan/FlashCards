// Globals
const sqlite3 = require("sqlite3").verbose();  // use sqlite
const fs = require("fs"); // file system

const dbFileName = "Flashcards.db";
// makes the object that represents the database in our code
const db = new sqlite3.Database(dbFileName);  // object, not database.

// Initialize table.
// If the table already exists, causes an error.
// Fix the error by removing or renaming Flashcards.db
const cmdStr = 'CREATE TABLE Flashcards (user INT, english TEXT, chinese TEXT, seen INT, correct INT)';
//db.run(cmdStr,tableCreationCallback);

const eng = "hello";
const chi = "你好";
const cmdStr_in = 'INSERT into Flashcards(user, english, chinese, seen, correct) VALUES (133, @0, @1, 10, 2)';
db.run(cmdStr_in, eng, chi, insertCallback);

db.get('SELECT * FROM Flashcards WHERE seen>5', dataCallback);
db.all('SELECT * FROM Flashcards WHERE user = 133', arrayCallback);

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
