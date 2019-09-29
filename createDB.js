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
db.run(cmdStr, tableCreationCallback);

function createCard(eng, chi, id) {
    const cmdStr_in = 'INSERT into Flashcards(user, english, chinese, seen, correct) VALUES (@0, @1, @2, 0, 0)';
    db.run(cmdStr_in, id, eng, chi, insertCallback);
//db.get('SELECT * FROM Flashcards WHERE user = ', dataCallback);
//const cmdStr_get = 'SELECT * FROM Flashcards WHERE user = @0';
    db.all('SELECT * FROM Flashcards WHERE user = @0', id, arrayCallback);
}

function queryUser(id, callback) {
    db.all('SELECT * FROM Flashcards WHERE user = @0', id, (err, arrayData) => {
        if (err) {
            console.log("error: ", err, "\n");
        } else {
            callback(arrayData);
            console.log("array: ", arrayData, "\n");
        }
    });

}

function update(id, english, seen, correct) {
    // column = 0: seen / =1: correct and seen
    const cmdStr_ud = 'UPDATE Flashcards SET seen=@0, correct=@1 WHERE user=@2 AND english=@3';
    db.run(cmdStr_ud, seen, correct, id, english, (err) => {
        if (err) {
            console.log("error: ", err, "\n");
        }
    });
    db.get('SELECT * FROM Flashcards WHERE user = @0 AND english = @1', id, english, dataCallback);

}

/*
function checkCard(id, callback) {
    const cmdStr_check =  'SELECT COUNT(*) AS number FROM Users WHERE GoogleID=@0';
    dbUser.get(cmdStr_check, id, (err, count) => {
        if (err) {
            console.log("error:", err);
        } else {
            callback(count.number);
            console.log(count.number);
        }
    });
}*/

// Always use the callback for database operations and print out any
// error messages you get.
// This database stuff is hard to debug, give yourself a fighting chance.
function tableCreationCallback(err) {
    if (err) {
        console.log("Table creation error", err);
    } else {
        console.log("Database created");
        db.close();
        //db.close();
    }
}

function insertCallback(err) {
    if (err) {
        console.log(err);
    }
}

function dataCallback(err, rowData) {
    if (err) {
        console.log("error: ", err);
    } else {
        console.log("got: ", rowData, "\n");
    }
}

/*
function arrayCallback(err, arrayData) {
    if(err) {
        console.log("error: ", err,"\n");
    }
    else {
        console.log("array: ", arrayData, "\n");
    }
}
}*/

exports.createCard = createCard;
exports.createCard = createCard;
exports.queryUser = queryUser;
exports.update = update;