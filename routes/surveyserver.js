var surveydb = require('../config/surveyschema');
var userdb = require('../config/dbschema');

exports.manage = function(req, res) {
  res.render('survey/manage', { user: req.user });
};


exports.create = function(req, res) {
  res.render('survey/create', { user: req.user });
};

exports.postCreate = function(req, res, next) {
  	
	console.log("Create Survey. title="+req.body.title+" user="+req.user.username);
	
	userdb.userModel.findOne( { username: req.user.username }, function (err, existingUser) {
      if (err) { 
		res.send({ result: 'error', message : 'database error'}); 
		return;
		//return next( err ); 
	  }
      if (!existingUser) {
		  res.send({ result: 'error', message : 'user does not exists'}); 
		  console.log("Create Survey: user does not exits");
		  return;
      } else {
		  var newSurvey = new surveydb.surveyModel({ title: req.body.title
									, description: req.body.description
									, active: false });
          
          newSurvey.save( function (err) {
              if (err) {
                  console.log("Error:"+err);
			     res.send({ result: 'error', message : 'database error saving new survey'}); 
			     //return next(err);
                return;
		      }
		      console.log('Survey created: '+newSurvey.get('title'));
		      res.send({ result: 'success', message : 'New Survey created with success'});
          })
      }
	  
    });

};