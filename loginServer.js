const express = require('express');
const port = 59500;
/*const port = 56299;*/
const passport = require('passport');
const cookieSession = require('cookie-session');
const GoogleStrategy = require('passport-google-oauth20');
const api = require('./testAPI');
const dbCard = require('./createDB');
const dbUser = require('./userDB');

// Google login credentials, used when the user contacts
// Google, to tell them where he is trying to login to, and show
// that this domain is registered for this service.
// Google will respond with a key we can use to retrieve profile
// information, packed into a redirect response that redirects to
// server162.site:[port]/auth/redirect
const googleLoginData = {
    clientID: 'CLIENT_ID.apps.googleusercontent.com',
    clientSecret: 'CLIENT_SECRET',
    callbackURL: '/auth/redirect'
};

// Strategy configuration.
// Tell passport we will be using login with Google, and
// give it our data for registering us with Google.
// The gotProfile callback is for the server's HTTPS request
// to Google for the user's profile information.
// It will get used much later in the pipeline.
passport.use( new GoogleStrategy(googleLoginData, gotProfile) );


// Let's build a server pipeline!

// app is the object that implements the express server
const app = express();

// pipeline stage that just echos url, for debugging
app.use('/', printURL);

// Check validity of cookies at the beginning of pipeline
// Will get cookies out of request, decrypt and check if
// session is still going on.
app.use(cookieSession({
    maxAge: 6 * 60 * 60 * 1000, // Six hours in milliseconds
    // meaningless random string used by encryption
    keys: ['hanger waldo mercy dance']
}));

// Initializes request object for further handling by passport
app.use(passport.initialize());

// If there is a valid cookie, will call deserializeUser()
app.use(passport.session());

// Public static files
app.get('/*',express.static('public'));

// next, handler for url that starts login with Google.
// The app (in public/login.html) redirects to here (not an AJAX request!)
// Kicks off login process by telling Browser to redirect to
// Google. The object { scope: ['profile'] } says to ask Google
// for their user profile information.
app.get('/auth/google',
	passport.authenticate('google',{ scope: ['profile'] }) );
// passport.authenticate sends off the 302 response
// with fancy redirect URL containing request for profile, and
// client ID string to identify this app.

// Google redirects here after user successfully logs in
// This route has three handler functions, one run after the other.
app.get('/auth/redirect',
	// for educational purposes
	function (req, res, next) {
	    console.log("at auth/redirect");
	    next();
	},
	// This will issue Server's own HTTPS request to Google
	// to access the user's profile information with the
	// temporary key we got in the request.
	passport.authenticate('google'),
	// then it will run the "gotProfile" callback function,
	// set up the cookie, call serialize, whose "done"
	// will come back here to send back the response
	// ...with a cookie in it for the Browser!
	function (req, res) {
	    console.log('Logged in and using cookies!')
        res.redirect('/user/lango.html');
        //console.log('request user: '+req.user.userData);
        //res.send(req.user.userData);
	});

// static files in /user are only available after login
app.get('/user/*',
	isAuthenticated, // only pass on to following function if
	// user is logged in
	// serving files that start with /user from here gets them from ./
	express.static('.')
       );

// next, all queries (like translate or store or get...
//app.get('/query', function (req, res) { res.send('HTTP query!') });
app.get('/user/translate', engHandler);   // if not, is it a valid query?
app.get('/user/store', dbHandler);
app.get('/user/query', function (req, res, next) {
    let q = req.user;
    if (q !== undefined) {
        dbUser.getData(q.userData, (name) => {
        res.send(name);
    });
    } else {
        next();
    }
});
app.get('/user/getDB', function (req, res) {
    let id = req.user.userData;
    dbCard.queryUser(id, (arrayData) => {
        res.json(arrayData);
    });
});
app.get('/user/update', function(req, res) {
    let id = req.user.userData;
    let q = req.query;
    if (q !== undefined) {
        let eng = q.english;
        let seen = q.seen;
        let cor = q.correct;
        dbCard.update(id, eng, seen, cor);
    } else {
        next();
    }
})

// finally, not found...applies to everything
app.use( fileNotFound );

// Pipeline is ready. Start listening!
app.listen(port, function (){console.log('Listening...');} );


// middleware functions

// print the url of incoming HTTP request
function printURL (req, res, next) {
    console.log(req.url);
    next();
}

// function to check whether user is logged when trying to access
// personal data
function isAuthenticated(req, res, next) {
    if (req.user) {
    //res.send(req.user.userData);
	console.log("Req.session:",req.session);
	console.log("Req.user:",req.user);
	next();
    } else {
	res.redirect('/login.html');  // send response telling
	// Browser to go to login page
    }
}


// function for end of server pipeline
function fileNotFound(req, res) {
    let url = req.url;
    res.type('text/plain');
    res.status(404);
    res.send('Cannot find '+url);
    }

// Some functions Passport calls, that we can use to specialize.
// This is where we get to write our own code, not just boilerplate.
// The callback "done" at the end of each one resumes Passport's
// internal process.

// function called during login, the second time passport.authenticate
// is called (in /auth/redirect/),
// once we actually have the profile data from Google.
function gotProfile(accessToken, refreshToken, profile, done) {
    console.log("Google profile",profile);
    // here is a good place to check if user is in DB,
    // and to store him in DB if not already there.
    // Second arg to "done" will be passed into serializeUser,
    // should be key to get user out of database.
    function getCount(num) {
        if (num == 0)
            dbUser.createCard(profile.name.givenName, profile.name.familyName, profile.id);
    }
    dbUser.checkExist(profile.id, getCount);

    let dbRowID = profile.id;  // temporary! Should be the real unique
    // key for db Row for this user in DB table.
    // Note: cannot be zero, has to be something that evaluates to
    // True.

    done(null, dbRowID);
}

// Part of Server's sesssion set-up.
// The second operand of "done" becomes the input to deserializeUser
// on every subsequent HTTP request with this session's cookie.
passport.serializeUser((dbRowID, done) => {
    console.log("SerializeUser. Input is",dbRowID);
    done(null, dbRowID);
});

// Called by passport.session pipeline stage on every HTTP request with
// a current session cookie.
// Where we should lookup user database info.
// Whatever we pass in the "done" callback becomes req.user
// and can be used by subsequent middleware.
passport.deserializeUser((dbRowID, done) => {
    console.log("deserializeUser. Input is:", dbRowID);
    // here is a good place to look up user data in database using
    // dbRowID. Put whatever you want into an object. It ends up
    // as the property "user" of the "req" object.

    let userData = {userData: dbRowID};
    done(null, userData);
});

function engHandler(req, res, next) {
    let url = req.url;
    let qObj = req.query;
    console.log(qObj);

    if (qObj.english !== undefined) {
        api.issueRequest(qObj.english, getRes);
        //res.json( {"palindrome" : qObj.english} );
    } else {
        next();
    }

    function getRes(resp) {
        res.json(resp);
    }
}

function dbHandler(req, res, next) {
    let q = req.query;
    let id = req.user.userData;
    console.log(q);
    if (q.english !== undefined) {
        let eng = q.english;
        let chi = q.chinese;
        dbCard.createCard(eng, chi, id);
    } else {
        next();
    }
}
