var express = require('express');
var router = express.Router();
var User = require('../models/User');

router.get('/', function(req, res, next) {
	if (User.isLoggedIn()){
		User.getAllUsers(function(err, allUsers){
			if (err) console.log(err);
			else {
				User.getNamesOfFollowedUsers(User.currentUser(), function(err, following){
					if (err) console.log(err);
					else res.render('home', {title: 'Fritter', currentUser: User.currentUser(), registeredUsers: allUsers, followedUsers: following});
				});	
			}	
		});
	}
	else res.render('login', { title: 'Fritter', err: 0});
});

module.exports = router;
