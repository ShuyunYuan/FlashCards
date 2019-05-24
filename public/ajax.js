"use strict"
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
    let url = 'store?english='+eng+'&chinese='+chi;
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
