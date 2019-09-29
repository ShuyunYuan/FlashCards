"use strict";

export function sendTranslate(callback, phrase) {
    let url = 'translate?english=' + phrase;
    let xhr = new XMLHttpRequest();
    xhr.open('GET', url);

    xhr.onload = function () {
        let responseStr = xhr.responseText;  // get the JSON string
        let object = JSON.parse(responseStr);  // turn it into an object
        console.log(JSON.stringify(object, undefined, 2));  // print it out as a string, nicely formatted
        console.log(phrase);
        callback(object);
    };
    xhr.onerror = function () {
        alert('Woops, there was an error making the request.');
    };
    xhr.send();
    //console.log(url);
}

export function sendDB(eng, chi) {
    let url = 'store?english=' + eng + '&chinese=' + chi;
    let xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.onload = function () {
        console.log("sent successfully");
    };
    xhr.onerror = function () {
        alert('Woops, there was an error sending to database.');
    };
    xhr.send();
}

export function getName(callback) {
    let url = 'query';
    let xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.onload = function () {
        let responseStr = xhr.responseText;  // get the JSON string
        let object = JSON.parse(responseStr);  // turn it into an object
        callback(object.firstName);
        console.log(object.firstName);
    };
    xhr.onerror = function () {
        alert('Woops, there was an error getting the name.');
    };
    xhr.send();
}

export function getDB(callback) {
    let url = 'getDB';
    let xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.onload = function () {
        let responseStr = xhr.responseText;  // get the JSON string
        let object = JSON.parse(responseStr);  // turn it into an object
        callback(object);
        //console.log(object);
    };
    xhr.onerror = function () {
        alert('Woops, there was an error getting the name.');
    };
    xhr.send();
}

export function update(eng, seen, cor) {
    let url = 'update?english=' + eng + '&seen=' + seen + '&correct=' + cor;
    let xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.onload = function () {
        console.log('sent');
    };
    xhr.onerror = function () {
        alert('Woops, there was an error updating.');
    };
    xhr.send();
}