var express = require('express');
var router = express.Router();
var User = require('../models/User');

/* GET home page. */
router.post('/', function(req, res, next) {
	User.verifyPassword(req.body.user, req.body.password, function(err, match){
		if (match){
			User.setUser(req.body.user, function(err) { if (err) console.log(err)});
			res.redirect('/users/'+req.body.user);
		}
		else {
			res.render('login', {title:'Fritter', err:1});
		}
	})
});

module.exports = router;
