var assert = require("assert");
var User = require("../models/User.js");

//WARNING, RUNNING THE TESTS CLEARS THE DATABASE!!!
//THIS CAN BE AVOIDED BY MAKING TEST DATABASES BUT
//I'M ONLY OFFICIALLY STARTING THE SERVER AFTER
//THE TESTS PASS SO IT'S OKAY FOR THE PURPOSE OF THIS ASSIGNMENT

User.resetData();

var storedTweet;

describe('Fritter Model', function() {

  describe('User', function () {

    it('should not have someone logged in originally', function (done) {
      assert(!User.isLoggedIn());
      done();
    });

    it('should add a new user', function (done) {
      User.createNewUser("A", "a", function(err){
        User.isUser("A", function(result){
          assert(result);
          done();
        });
      });
    });

    it('should log in a user', function (done) {
      User.setUser("A", function(err){
        assert(User.isLoggedIn());
        done();
      });
    });

    it('should add multiple users', function(done) {
      User.createNewUser("B", "b", function(err){
        User.isUser("B", function(result){
          assert(result);
          User.isUser("A", function(result){
            assert(result);
            done();
          });
        });
      });
    });

    it('should be case sensitive', function(done) {
      User.createNewUser("a", "a", function(err){
        User.isUser("a", function(result){
          assert(result);
          User.isUser("A", function(result){
            assert(result);
            done();
          });
        });
      });
    });    

    it('should not add an existing user', function(done) {
      User.createNewUser("a", "a", function(result){
        assert(result);
        done();
      });
    });

    it('should verify passwords', function(done) {
      User.verifyPassword("a", "a", function(err, result){
        assert(result);
        done();
      });
    });

    it('should change users', function(done) {
      User.setUser("a", function(err){
        assert(User.isLoggedIn());
        assert(User.currentUser() === "a");
        done();
      });
    });

    it('should allow someone to follow', function(done) {
      User.addFollowing("A", "B", function(err){
        User.getNamesOfFollowedUsers("A", function(err, nameList){
          assert(nameList.indexOf("B") > -1);
          done();
        });
      });
    });

  });

  describe('Tweet', function() {

    it('should add one tweet', function(done) {
      User.createNewUser("c", "c", function(err){
        User.addTweet("c", "hi", function(err, tweet){
          storedTweet = tweet.id;
          User.verifyTweet("c", storedTweet, function(result){
            assert(result);
            done();
          });
        });
      });
    });

    it('should add multiple tweets', function(done) {
      User.addTweet("c", "bye", function(err, tweet){
        User.verifyTweet("c", storedTweet, function(result){
          storedTweet = tweet.id;
          User.verifyTweet("c", storedTweet, function(result){
            assert(result);
            done();
          });
        });
      });
    });

    it('should allow retweets', function(done) {
      User.reTweet("a", storedTweet, function(err){
        User.verifyTweet("a", storedTweet, function(result){
          assert(result);
          done();
        });
      });
    });

    it('should allow removal of a retweet', function(done) {
      User.removeTweet("a", storedTweet, function(err){
        User.verifyTweet("a", storedTweet, function(result){
          assert(!result);
          User.verifyTweet("c", storedTweet, function(result){
            assert(result);
            done();
          });
        });
      });
    });

    it('should allow removal of a tweet', function(done) {
      User.reTweet("b", storedTweet, function(err){
        User.removeTweet("c", storedTweet, function(err){
          User.verifyTweet("c", storedTweet, function(result){
            assert(!result);
            User.verifyTweet("b", storedTweet, function(result){
              assert(!result);
              done();
            });
          });
        });
      });
    });

  });

});

User.resetData();