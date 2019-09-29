// Globals
const sqlite = require("sqlite3").verbose();  // use sqlite
const fs = require("fs"); // file system

const dbFileName = "Users.db";
// makes the object that represents the database in our code
const dbUser = new sqlite.Database(dbFileName);  // object, not database.
const cmdStr = 'CREATE TABLE Users (firstName TEXT, lastName TEXT, GoogleID INT)';
dbUser.run(cmdStr, tableCreationCallback);

function createCard(given, family, id) {
    const cmdStr_in = 'INSERT into Users (firstName, lastName, GoogleID) VALUES (@0, @1, @2)';
    dbUser.run(cmdStr_in, given, family, id, insertCallback);
    //db.get('SELECT * FROM Flashcards WHERE user = ', dataCallback);
    //const cmdStr_get = 'SELECT * FROM Flashcards WHERE user = @0';
    dbUser.all('SELECT * FROM Users WHERE GoogleID = @0', id, arrayCallback);
}

function checkExist(id, callback) {
    const cmdStr_check = 'SELECT COUNT(*) AS number FROM Users WHERE GoogleID=@0';
    dbUser.get(cmdStr_check, id, (err, count) => {
        if (err) {
            console.log("error:", err);
        } else {
            callback(count.number);
            console.log(count.number);
        }
    });
}

function getData(id, callback) {
    const cmdStr_data = 'SELECT firstName FROM Users WHERE GoogleID=@0';
    dbUser.get(cmdStr_data, id, (err, name) => {
        if (err) {
            console.log("error: ", err);
        } else {
            console.log("first name: ", name, "\n");
            callback(name);
        }
    });
}

// Always use the callback for database operations and print out any
// error messages you get.
// This database stuff is hard to debug, give yourself a fighting chance.
function tableCreationCallback(err) {
    if (err) {
        console.log("Table creation error", err);
    } else {
        console.log("Database created");
        //db.close();
    }
}

function insertCallback(err) {
    if (err) {
        console.log(err);
    }
}

function arrayCallback(err, arrayData) {
    if (err) {
        console.log("error: ", err, "\n");
    } else {
        console.log("array: ", arrayData, "\n");
    }
}

exports.createCard = createCard;
exports.checkExist = checkExist;
exports.getData = getData;