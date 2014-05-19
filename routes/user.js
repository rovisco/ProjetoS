var passport = require('passport');
var fs = require('fs');
var util = require('util');
var db = require('../config/dbschema');

exports.account = function(req, res) {
  res.render('account', { user: req.user });
};

exports.getlogin = function(req, res) {
  res.render('login', { user: req.user, message: req.session.messages });
};

exports.userList = function(req, res) {

  	db.userModel.find(function (err, docs) {
		if (err) return next(err);
		console.log("Users read ="+docs.length);		
		res.send(docs);
	});
	
  //res.send('access granted admin!');
};

exports.register = function(req, res) {
  res.render('register',{ user: req.user });
};

// POST /login
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
//
//   curl -v -d "username=bob&password=secret" http://127.0.0.1:3000/login
//   
/***** This version has a problem with flash messages
app.post('/login', 
  passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }),
  function(req, res) {
    res.redirect('/');
  });
*/
  
// POST /login
//   This is an alternative implementation that uses a custom callback to
//   acheive the same functionality.
exports.postlogin = function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) { return next(err) }
    if (!user) {
      //req.session.messages =  [info.message];
	  return res.send({ result: 'error', message : [info.message] });
      //return res.redirect('/login')
    }
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      //return res.redirect('/');
	  res.send({ result: 'success', message : 'User Logged in'});
    });
  })(req, res, next);
};

exports.logout = function(req, res) {
  req.logout();
  res.redirect('/');
};


exports.changePassword = function(req, res, next) {
  	
	console.log("usename="+req.user.username+" pass="+req.body.password+" email="+req.body.confirm_password);
	
	//validate new password.	
	if (req.body.password != req.body.confirm_password){ 
		res.send({ result: 'error', message : 'Confirm password mismatch'});
		return;
	}if (req.body.password.length < 5){
		res.send({ result: 'error', message : 'Password must have at least 5 chars'});
		console.log({ result: 'error', message : 'Password must have at least 5 chars'});
		return;
	}
	
	//update password in DB
	db.userModel.findOne( { username: req.user.username }, function (err, user) {
		if (err) { 
			res.send({ result: 'error', message : 'Database error'});
			return next( err ); 
		}
		if (!user) { 
			res.send({ result: 'error', message: 'User not found: ' + req.user.username }); 
			return; 
		}
		
		console.log("db usename="+user.username);	
		user.set('password', req.body.password);
        user.save( function (err) {
			if (err){ 
				res.send({ result: 'error', message : 'error saving user'}); 
				return next( err ); 
			}
			res.send({ result: 'success', message : 'Password change sucssess'});
        });
		
    });
};

exports.cancelUser  = function (req, res, next) {

	var anUsername = req.user.username;
	console.log("cancel username="+anUsername);
	if(!anUsername) return next("username not present");
	
	//remove user from DB
	db.userModel.remove( { username: anUsername }, function (err, user) {
		if (err) { 
			res.send({ result: 'error', message : 'Database error'});
			return next( err ); 
		}
		if (!user) { 
			res.send({ result: 'error', message: 'User not found: ' + anUsername}); 
			return; 
		}
		res.send({ result: 'success', message: 'Deleted account for user ' + anUsername}); 
    });
	
}

exports.deleteUser  = function (req, res, next) {

	var anUsername = req.params.username;
	console.log("delete username="+anUsername);
	if(!anUsername) return next("username not present");
	
	//remove user from DB
	db.userModel.remove( { username: anUsername }, function (err, user) {
		if (err) { 
			res.send({ result: 'error', message : 'Database error'});
			return next( err ); 
		}
		if (!user) { 
			res.send({ result: 'error', message: 'User not found: ' + anUsername }); 
			return; 
		}
		db.userModel.find(function (err, docs) {
			if (err) return next(err);
			console.log("Users read ="+docs.length);		
			res.send(docs);
		})
    });
	
}

exports.changeUser = function(req, res, next) {
  	
	console.log("usename="+req.user+" pass="+req.body.username+" email="+req.body.email);
	
	//validate email format	
	
	if (!validateEmail(req.body.email)){ 
		res.send({ result: 'error', message : 'not a valid email format '});
		return;
	}if (req.body.username.length < 3){
		res.send({ result: 'error', message : 'Username must have at least 3 chars'});
		console.log({ result: 'error', message : 'Username must have at least 5 chars'});
		return;
	}
	
	//update password in DB
	db.userModel.findOne( { username: req.user.username }, function (err, user) {
		if (err) { 
			res.send({ result: 'error', message : 'Database error'});
			return next( err ); 
		}
		if (!user) { 
			res.send({ result: 'error', message: 'User not found: ' + req.user.username }); 
			return; 
		}
		
		console.log("db usename="+user.username);	
		user.set('username', req.body.username);
		user.set('email', req.body.email);
        user.save( function (err) {
			if (err){ 
				res.send({ result: 'error', message : 'error saving user'}); 
				return next( err ); 
			}
			res.send({ result: 'success', message : 'User updated with success'});
        });
		
    });


	
};

// POST /register

exports.postRegister = function(req, res, next) {
  	
	console.log("usename="+req.body.username+" pass="+req.body.password+" email="+req.body.email);
	
	db.userModel.findOne( { username: req.body.username }, function (err, existingUser) {
      if (err) { 
		res.send({ result: 'error', message : 'database error'}); 
		return;
		//return next( err ); 
	  }
      if (existingUser) {
		  res.send({ result: 'error', message : 'user already exists'}); 
		  console.log("user exits");
		  return;
      } else {
		var adm = false;
		adm = (adm === "true");
		var user = new db.userModel({ username: req.body.username
									, email: req.body.email
									, password: req.body.password
									, admin: adm
									, accessToken : 0 });

        user.save( function (err) {
          if (err) {
			res.send({ result: 'error', message : 'database error saving user'}); 
			//return next(err);
			return;
		}
		  processImage(req,req.body.username,next);
		  console.log('User created'+user.get('username'));
		  res.send({ result: 'success', message : 'User registered with success'});
        })
      }
	  
    });

};


function processImage(req,username,next){

	//console.log(util.inspect(req.files,false,null));
	if(req.files){
		var file = req.files.image;
		var tmp_path = file.path;
		var target_path = './uploads/image_'+username+'_'+ file.name;
		console.log('File uploaded to: ' + target_path + ' - ' + file.size + ' bytes');
		
		fs.rename(tmp_path, target_path, function(err) {
			if (err) return next(err);
			// delete the temporary file, so that the explicitly set temporary upload dir does not get filled with unwanted files
			fs.unlink(tmp_path, function() {
				//if (err) throw err;
				if (err) return next(err);
				console.log('File uploaded to: ' + target_path + ' - ' + file.size + ' bytes');
			});
		});
	}
}

function validateEmail(email) { 
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
} 