// Dependencies
// source: https://scotch.io/tutorials/making-mean-apps-with-google-maps-part-i
// -----------------------------------------------------
var http           = require('http');
var express        = require('express');
var mongoose       = require('mongoose');
var bcrypt 		   = require('bcryptjs');
var morgan         = require('morgan');
var bodyParser     = require('body-parser');
var methodOverride = require('method-override');
var jwt 		   = require('jwt-simple');
var moment 		   = require('moment');
var path 		   = require('path');
var config         = require('./server/config.json');
var app            = express();
var server         = http.createServer(app);

// Express Configuration
// -----------------------------------------------------
// Sets the connection to MongoDB
//mongoose.connect("mongodb://localhost/yourappname");

// Logging and Parsing
app.use(express.static(__dirname + '/public')); // sets the static files location to public
app.use('/bower_components', express.static(__dirname + '/bower_components')); // Use BowerComponents
app.use('/node_modules', express.static(__dirname + '/node_modules')); // Use NodeModules
app.use(morgan('dev'));                                         // log with Morgan
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.urlencoded({extended: true}));               // parse application/x-www-form-urlencoded
app.use(bodyParser.text());                                     // allows bodyParser to look at raw text
app.use(bodyParser.json({ type: 'application/vnd.api+json'}));  // parse application/vnd.api+json as json
app.use(methodOverride());

// Routes
// ------------------------------------------------------
require('./server/routes.js')(app, config);


// -----------------------------------------
// Start Server
// -----------------------------------------
server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
	var addr = server.address();
	console.log("Server running at: " + addr.address + ":" + addr.port);
});
