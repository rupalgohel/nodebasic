var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var Signup = require('../models/signup');

router.get('/', function(req, res, next) {
    res.send('respond with a resource');
  });
  router.get('/create', function(req, res, next) {
    res.render('signup', {'title': 'Register'});
  });
router.post('/create', function(req, res, next) {
    var name = req.body.name;
    var email = req.body.email;
    var password = req.body.password;
    req.checkBody('name', 'Name is required').notEmpty();
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('email', 'Email is not valid').isEmail();
    req.checkBody('password', 'Password is required').notEmpty();

    var errors = req.validationErrors();
    if(errors){
        res.render('signup', {
            errors:errors,
            name: name,
            email: email,
            password: password
        });
    }
    else{
        var newUser = new Signup({
            name: name,
            email: email,
            password: password,
        });

        // Create User
        Signup.createUser(newUser, function(err, user){
            if(err)throw err;
            console.log(user);
        });
        req.flash('success', 'You are now registered and may log in');

        res.location('/');
        res.redirect('/');
    }
});

passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    Signup.getUserById(id, function(err, user) {
      done(err, user);
    });
  });

passport.use(new LocalStrategy(
    function(username, password, done){
        Signup.getUserByUsername(username, function(err, user){
            if(err) throw err;
            if(!user){
                console.log('Unknown User');
                return done(null, false, {message: 'Unknown User'});
            }

            Signup.comparePassword(password, user.password, function(err, isMatch){
                if(err) throw err;
                if(isMatch){
                    return done(null, user);
                } else {
                    console.log('Invalid Password');
                    return done(null, false, {message: 'Invalid Password'});
                }
            });
        });
    }
));
module.exports = router;