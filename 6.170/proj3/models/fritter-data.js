var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function(callback){
  console.log("database connected");
});

var userSchema = mongoose.Schema({
	username: String,
	password: String,
	tweets: [{type: Schema.Types.ObjectId, ref:'Tweet'}],
	following: [{type: Schema.Types.ObjectId, ref:'User'}]
});

var tweetSchema = mongoose.Schema({
	author: {type: Schema.Types.ObjectId, ref: 'User'},
	tweet: String
})

exports.Tweet = mongoose.model('Tweet', tweetSchema);
exports.User = mongoose.model('User', userSchema);