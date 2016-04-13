var exportDB = require("../models/fritter-data");

var UserDB = exportDB.User;
var TweetDB = exportDB.Tweet;

var User = (function User() {

	var that = Object.create(User.prototype);

	var currentUser = undefined;

	//Returns current logged in user
	that.currentUser = function(){
		return currentUser;
	}

	//Returns if a user is currently loggedin
	that.isLoggedIn = function(){
		return currentUser !== undefined;
	}

	//Sets the current logged in user
	that.setUser = function(user, callback){
		UserDB.find({username: user}, function(err, result){
			if (err) console.log(err);
			else if (result.length !== 0){
				currentUser = user;
				callback(null);
			}
			else callback({ msg : 'No such user!' });
		});
	}

	//Logs out a user
	that.logout = function(){
		currentUser = undefined;
	}

	//Gets the tweets of user
	that.getTweets = function (user, callback) {
		UserDB.find({username: user}, function(err, user){
			if (err) console.log(err);
			else if (user.length !== 0){
				UserDB.populate(user, {path: "tweets"}, function(err, result){
					if (err) console.log(err);
					else {
						UserDB.populate(result[0].tweets, {path: "author"}, function(err, result){
							callback(null, result);
						})
					}
				})
			}
			else callback({ msg : 'No such user!' });
		});
	}

	//Gets all registered users
	that.getAllUsers = function(callback){
		UserDB.find({}, function(err, allUsers){
			if (err) console.log(err);
			else UserDB.populate(allUsers, {path: 'tweets'}, function(err, result){
				if (err) console.log(err);
				else {
					UserDB.populate(result, {path: 'tweets.author', model: 'User'}, function(err, result){
						if (err) console.log(err);
						else callback(null, result);
					})
				}
			})
		});
	}

	//Gets the data of the users who user follows
	that.getFollowedUsersData = function (user, callback) {
		UserDB.find({username: user}, function(err, user){
			if (err) console.log(err);
			else if (user.length !== 0){
				UserDB.populate(user, {path: 'following'}, function(err, result){
					if (err) console.log(err);
					else {
						UserDB.populate(result, {path: 'following.tweets', model: 'Tweet'}, function(err, result){
							if (err) console.log(err);
							else UserDB.populate(result, {path: 'following.tweets.author', model: 'User'}, function(err, result) {
								if (err) console.log(err);
								else callback(null, result[0].following);
							});
						});
					}
				});
			}
			else callback({ msg : 'No such user!' });
		});
	}

	//Returns a list of names of the users who user follows
	that.getNamesOfFollowedUsers = function(user, callback) {
		UserDB.find({username: user}, function(err, user){
			if (err) console.log(err);
			else if (user.length !== 0){
				UserDB.populate(user, {path: 'following'}, function(err, result){
					if (err) console.log(err);
					else {
						var nameList = result[0].following.map(function(followedUser){
							return followedUser.username;
						});
						callback(null, nameList);
					}
				});
			}
			else callback({ msg : 'No such user!' });
		});
	}

	//Verifies the password of user with candidatepw
	that.verifyPassword = function(user, candidatepw, callback) {
		UserDB.find({username: user}, function(err, user){
			if (err) console.log(err);
			else if (user.length !== 0){
				if (candidatepw === user[0].password) callback(null, true);
				else callback(null, false);
			}
			else callback({ msg : 'No such user!' });
		});
	}

	//Creates a new user with the corresponding password into the database
	that.createNewUser = function (user, password, callback) {
		UserDB.find({username: user}, function(err, userQuery){
			if (err) console.log(err);
			else if (userQuery.length == 0){
				UserDB.create({
					'username' : user,
					'password' : password,
					'tweets' : [],
					'following': []}, function(err, user) {
						if (err) console.log(err);
					});
				callback(null);
			}
			else callback({ taken: true });
		});
	};

	//Adds a tweet under user into the database
	that.addTweet = function(user, tweet, callback){
		UserDB.find({username: user}, function(err, user){
			if (err) console.log(err);
			else if (user.length != 0){
				TweetDB.create({
					'author': user[0]['_id'],
					'tweet': tweet
				}, function(err, tweet){
					if (err) console.log(err);
					else {
						UserDB.update(user[0],{$push: {'tweets':tweet}},{upsert:true},function(err){
							if(err) console.log(err);
							else callback(null, tweet);
						});
					}
				});
			}
			else callback({msg : 'Invalid user!'});
		});
	}

	//Retweets a tweet with the corresponding Id under user
	that.reTweet = function(user, tweetId, callback){
		UserDB.find({username: user}, function(err, user){
			if (err) console.log(err);
			else if (user.length != 0){
				if (user[0].tweets.indexOf(tweetId) < 0){
					UserDB.update(user[0],{$push: {'tweets':tweetId}},{upsert:true},function(err){
						if(err) console.log(err);
						else callback(null);
					});
				}
			else callback(null);
			}
			else callback({msg : 'Invalid user!'});
		});
	}

	//Removes a tweet with the corresponding Id under user
	that.removeTweet = function(user, tweetId, callback){
		UserDB.find({username: user}, function(err, user){
			if (err) console.log(err);
			else if (user.length != 0){
				TweetDB.find({'_id': tweetId}, function(err, tweet){
					if (err) console.log(err);
					else if (tweet.length != 0) {
						UserDB.update(user[0],{$pull: {'tweets': tweetId}},{upsert:true},function(err){
							if(err) console.log(err);
							else {
								if (user[0].id === tweet[0].author){
									TweetDB.remove({'_id' : tweetId}, function(err, result){
										if (err) console.log(err);
										else callback(null);
									});
								}
								else callback(null);
							}
						});
					}
					else callback({msg: 'Invalid tweet!'});
				});
			}
			else callback({msg : 'Invalid user!'});
		});
	}

	//Adds follow as someone who user is following into the database
	that.addFollowing = function(user, follow, callback){
		UserDB.find({username: user}, function(err, user){
			if (err) console.log(err);
			else if (user.length != 0){
				UserDB.find({username:follow}, function(err, follow){
					if (err) console.log(err);
					else if (follow.length != 0){
						UserDB.update(user[0],{$push: {'following':follow[0]['_id']}},{upsert:true},function(err){
							if(err) console.log(err);
							else callback(null);
						});
					}
					else callback({msg : 'Invalid user!'});
				});
			}
			else callback({msg : 'Invalid user!'});
		});
	}

	//Finds if user exists in database - USED ONLY FOR TESTING
	that.isUser = function(user, callback){
		UserDB.find({username: user}, function(err, result){
			if (err) callback(false);
			else callback(result.length > 0);
		});
	}

	//Finds if tweet exists in database - USED ONLY FOR TESTING
	that.verifyTweet = function(user, tweetId, callback){
		UserDB.find({username: user}, function(err, user){
			if (err) callback(false);
			else {
				TweetDB.find({'_id': tweetId}, function(err, tweet){
					if (err) callback(false);
					else if (user.length == 0 || tweet.length == 0) callback(false);
					else callback(user[0].tweets.indexOf(tweet[0].id) > -1);
				});
			}
		});
	}

	//Reset databases - USED ONLY FOR TESTING
	that.resetData = function(){
		UserDB.remove({}, function(err){
			if (err) console.log(err);
			TweetDB.remove({}, function(err){
				if (err) console.log(err);
			});
		});
	}

	Object.freeze(that);
	return that;

})();

module.exports = User;