var express = require('express')
  , app = express()
  , db = require('./config/dbschema')
  , pass = require('./config/pass')
  , passport = require('passport')
  , basic_routes = require('./routes/basic')
  , survey_routes = require('./routes/surveyserver')
  , user_routes = require('./routes/user')
  , maps_routes = require('./routes/maps')
  , domotics_routes = require('./routes/domoticsserver');

var fs = require('fs');
var http = require('http');
var https = require('https');


var privateKey  = fs.readFileSync('key.pem', 'utf8');
var certificate = fs.readFileSync('cert.pem', 'utf8');

var credentials = {key: privateKey, cert: certificate};
  
// configure Express
app.configure(function() {
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.logger('dev'));
  app.use(express.cookieParser());
  app.use(express.bodyParser({uploadDir:'./uploads'}));
  app.use(express.methodOverride());
  app.use(express.session({ secret: 'keyboard cat' }));
  // Initialize Passport!  Also use passport.session() middleware, to support
  // persistent login sessions (recommended).
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

// Remember Me middleware
  app.use( function (req, res, next) {
    if ( req.method == 'POST' && req.url == '/login' ) {
      if ( req.body.rememberme ) {
        req.session.cookie.maxAge = 2592000000; // 30*24*60*60*1000 Rememeber 'me' for 30 days
      } else {
        req.session.cookie.expires = false;
      }
    }
    next();
  });
  
//error handling middleware  
app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500);
  res.render('error', { errorMessage: err.message });
  next();
});

// Basic pages
app.get('/', basic_routes.index);

// User pages
app.get('/account', pass.ensureAuthenticated, user_routes.account);
app.get('/login', user_routes.getlogin);
app.get('/register', user_routes.register);
app.post('/forgot', user_routes.forgot);
app.get('/reset/:token',user_routes.resetPassword);
app.post('/resetPassword/:token',user_routes.postResetPassword);

app.post('/changePassword', user_routes.changePassword);
app.post('/changeUser', user_routes.changeUser);
app.post('/login', user_routes.postlogin);
app.post('/signup', user_routes.postRegister);
app.get('/api/userList', pass.ensureAuthenticatedApi, pass.ensureAdmin(), user_routes.userList);
app.get('/user/delete/:username', pass.ensureAuthenticatedApi, pass.ensureAdmin(), user_routes.deleteUser);
app.get('/user/cancel', pass.ensureAuthenticatedApi, user_routes.cancelUser);

//app.get('/admin', pass.ensureAuthenticated, pass.ensureAdmin(), user_routes.admin);
app.get('/logout', user_routes.logout);

app.get('/survey/create', survey_routes.create);
app.get('/survey/manage', survey_routes.manage);
app.post('/survey/create', survey_routes.postCreate);

app.get('/domotics/home', domotics_routes.home);
app.get('/domotics/turn/:plug/:status', domotics_routes.turn);


app.get('/maps/home', maps_routes.home);

/*
app.listen(8000, function() {
  console.log('Express server listening on port 8000');
    
});
*/
    
var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);


var server_port = process.env.OPENSHIFT_NODEJS_PORT || 8000
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1'

httpServer.listen(8000);
httpsServer.listen(8443);

httpServer.listen(server_port, server_ip_address, function () {
  console.log( "Listening on " + server_ip_address + ", server_port " + server_port )
});

