var express = require('express');
var router = express.Router();

var User= require('../models/User.js');

router.get('/', function(req, res, next) {
	res.render('signup', { title: 'Fritter', err: 0});
});

router.post('/', function(req, res, next){
	User.createNewUser(req.body.user, req.body.password, function(err){
		if (err) res.render('signup', { title: 'Fritter', err: 1});
		else {
			User.setUser(req.body.user, function(err){ 
				if(err) console.log(err);
				else res.redirect('/users/' + req.body.user);
			});
		}
	});
});

module.exports = router;