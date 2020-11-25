const cookieParser = require("cookie-parser");
const csrf = require("csurf");
const express = require('express');                 // Eases the use of Node.js
const socket = require('socket.io');                // Websocket event handling
const bodyParser = require('body-parser');          // For parsing JSON and data structures
// General Node.js server setup with help of Express module
var admin = require("firebase-admin");
//var firebase = require("firebase");
var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://nettside-a7c42.firebaseio.com"
});

const csrfMiddleware = csrf({ cookie: true });

const port = 80;

var app = express();
//var firebase_app = firebase.initializeApp({firebase.config});

app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(cookieParser());
app.use(csrfMiddleware);

app.use(bodyParser.urlencoded({ extended: true }));

// Static files
app.use('/assets', express.static('assets'));

app.all("*", (req, res, next) => {
  res.cookie("XSRF-TOKEN", req.csrfToken());
  next();
});

// Start listening to reqs
var server = app.listen(port, function() {
    console.log('%s Listening for requests on port %d...', Date().toString(), port);
});

//Web index html:
app.get('/', (req, res) => {
  console.log(Date().toString(), "Requested URL: ", req.url);
  res.render('index'); 
});

//Web index html:
app.get('/index.ejs', (req, res) => {
  console.log(Date().toString(), "Requested URL: ", req.url);
  res.render('index'); 
});

//About html:
app.get('/about.ejs', (req, res) => {
  console.log(Date().toString(), "Requested URL: ", req.url);
  res.render('about');
});

//kontroll html:
app.get('/kontroll.ejs', (req, res) => {
  console.log(Date().toString(), "Requested URL: ", req.url);
  const sessionCookie = req.cookies.session || "";

  admin
    .auth()
    .verifySessionCookie(sessionCookie, true /** checkRevoked */)
    .then(() => {
      res.render("kontroll");
    })
    .catch((error) => {
      res.redirect("/login.ejs");
    });
});

//logg inn html:
app.get('/login.ejs', (req, res) => {
  console.log(Date().toString(), "Requested URL: ", req.url);
  res.render('login');
});

//sign-in html:
app.get('/sign-in.ejs', (req, res) => {
  console.log(Date().toString(), "Requested URL: ", req.url);
  res.render('sign-in');
});

app.post("/sessionLogin", (req, res) => {
  const idToken = req.body.idToken.toString();

  const expiresIn = 60 * 60 * 24 * 5 * 1000;

  admin
    .auth()
    .createSessionCookie(idToken, { expiresIn })
    .then(
      (sessionCookie) => {
        const options = { maxAge: expiresIn, httpOnly: true };
        res.cookie("session", sessionCookie, options);
        res.end(JSON.stringify({ status: "success" }));
      },
      (error) => {
        res.status(401).send("UNAUTHORIZED REQUEST!");
      }
    );
});

app.get("/sessionLogout", (req, res) => {
  res.clearCookie("session");
  res.redirect("/index.ejs");
});


//Sende-Motta data:
var io = socket(server);
io.on("connection", socket => {

//Kontinuerlig Esp-data temperatur sensor  
socket.on("Data-from-mcu", data => {
console.log(data)
socket.broadcast.emit("temp-sensor", data);
  })

//Average Esp-data temperatur sensor  
socket.on("average", data => {
  console.log("Average temp:" + data)
  socket.broadcast.emit("temp-sensor-avg", data);
    })
});