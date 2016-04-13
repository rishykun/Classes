var express = require('express');
var router = express.Router();

var users = require('../controllers/users');
var User = require('../models/User');

router.post('/:user/addTweet', users.addTweet);

router.post('/:user/addTweet/:id', users.reTweet);

router.post('/:user/removeTweet/:id', users.removeTweet);

router.post('/logout', users.logout);

router.post('/:user/follow/:following', function(req,res,next){
	User.addFollowing(User.currentUser(), req.params.following, function(err) {
		if(err) console.log(err);
		else res.redirect('/');
	});
});

router.get('/:user/feed', function(req,res,next){
	User.getFollowedUsersData(User.currentUser(), function(err,followedQuery){
		if (err) console.log(err);
		else res.render('feed', {title: 'Fritter', currentUser: User.currentUser(), followedUsers: followedQuery});	
	});
});

router.get('/:user', function(req, res, next) {
	User.getTweets(req.params.user, function(err, tweetsQuery){
		res.render('user', 
		{ 
			title: 'Fritter', 
			user: req.params.user, 
			tweets: tweetsQuery,
			currentUser: User.currentUser()
		});
	});
});

module.exports = router;