var User = require('../models/User.js');

exports.addUser = function(req, res, next){ 
	User.createNewUser(req.body.user, undefined, function(err){
		if (err) console.log(err);
		else res.redirect('/users/' + req.body.user);
	});
}

exports.logout = function(req,res,next){
	User.logout();
	res.redirect('/');
}

exports.addTweet = function(req, res, next){
	User.addTweet(req.params.user, req.body.tweet, function(err){
		if (err) console.log(err);
		else res.redirect('/users/' + req.params.user);
	});
}

exports.reTweet = function(req, res, next){ 
	User.reTweet(req.params.user, req.params.id, function(err){
		if (err) console.log(err);
		else res.redirect('/');
	});
}


exports.removeTweet = function(req, res, next){ 
	User.removeTweet(req.params.user, req.params.id, function(err){
		if (err) console.log(err);
		else res.redirect('/users/' + req.params.user);
	});
}