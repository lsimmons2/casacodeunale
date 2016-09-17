var passport = require('passport');
var config = require('./_config');
var User = require('./userModel.js');


var LocalStrategy = require('passport-local').Strategy;

var LinkedInStrategy = require('passport-linkedin');
var linkedInKey = config.linkedin.clientID;
var linkedInSecret = config.linkedin.clientSecret;
var linkedInCbURL = config.linkedin.callbackURL;

var GitHubStrategy = require('passport-github');
var githubID = config.github.clientID;
var githubSecret = config.github.clientSecret;
var githubcbURL = config.github.callbackURL;

//var init = require('./init');

//Configuration and Settings

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    if(err) {
      console.error('There was an error accessing the records of' +
      ' user with id: ' + id);
      return done(err);
    }
    return done(null, user);
  })
});

//Strategies

//Local Strategy
passport.use('local-signup', new LocalStrategy({
  usernameField : 'email',
  passwordField : 'password',
  passReqToCallback : true
},
function(req, email, password, done) {
  console.log('local-signup email and pass: ', email, password);
  process.nextTick(function() {
    if(!req.user) {
      User.findOne({'local.email': email}, function(err, user) {
        if(err) {
          console.error(err);
          return done(err);
        }
        if(user) {
          //should tell user their email has already been used
          return done(null, false, {errMsg: 'email already exists'});
        }
        else {
          console.log('Registering new user');
          var newUser = new User();
          newUser.local.firstName = req.body.firstName;
          newUser.local.lastName = req.body.lastName;
          newUser.username = req.body.username;
          newUser.local.email = email;
          newUser.local.password = newUser.generateHash(password);
          newUser.skillsTO = req.body.skillsTO;
          newUser.skillsTL = req.body.skillsTL;
          newUser.bio = req.body.bio;
          newUser.save(function(err) {
            if(err) {
              console.log('Error saving new user: ', err);
              if(err.message == 'User validation failed') {
                return done(null, false, {errMsg: 'Please fill all fields'});
              }
                console.error('Error saving new user: ', err);
                return done(err);
            }
            return done(null, newUser);
          });
        }
      });
    }
    else {//user exists and is loggedin
      var user = req.user; // pull the user out of the session
      // update the current users local credentials
      user.username = req.body.username;
      user.local.email = email;
      user.local.password = user.generateHash(password);
      // save modifications to user
      user.save(function(err) {
        if (err) {
          console.error(err);
          return done(err);
        }
        return done(null, user);
      });
    }
  });
}));



passport.use('local-login', new LocalStrategy({
  usernameField : 'email',
  passwordField : 'password',
  passReqToCallback : true
},
function(req, email, password, done) {
  console.log('email and password in strategy: ', email, password);
  User.findOne({'local.email': email}, function(err, user) {
    console.log('AAA');
    if(err) {
      console.log('err finding user in local-login');
      return done(err);
    }
    console.log('BBB');
    if(!user) {
      console.log('user doesn\'t exist when trying to log in locally');
      return done(null, false);
    }
    console.log('CCC');
    /*if(!user.validPassword(password)) {
      console.log('invalid password brah');
      return done(null, false, {errMsg: 'Invalid password try again'});
    }*/
    console.log('found user here brah');
    return done(null, user);
  });
})
);

passport.use(new GitHubStrategy({
    clientID: githubID,
    clientSecret: githubSecret,
    callbackURL: githubcbURL,
    passReqToCallback : true
  },
  // linkedin sends back the tokens and profile info
  function(req, accessToken, refreshToken, profile, done) {
    console.log('accessToken, refreshToken: ', accessToken, refreshToken);
    process.nextTick(function() {
      if(!req.user) {//confirm that user not loggedin
        User.findOne({'social.github.id': profile.id}, function(err, user){
        if(err){
          console.log('There was an error accessing the db for linkedin auth: ', err);
          return done(err);
        }
        if (user){
          console.log('yepppp, github user already exists');
          return done(null, user);
        }
        else {
          console.log('nope, no github user yet!!!');
          var newUser = new User();
          newUser.social.github.id = profile.id;
          newUser.social.github.username = profile.username;
          newUser.social.github.token = accessToken;
          newUser.social.github.displayName = profile.displayName;
          newUser.social.github.email = profile.emails[0].value;
          newUser.social.github.photoURL = profile.photos[0].value || '';
          console.log('got to heree github');
          newUser.save(function(err) {
            console.log('got to here boiii github');
            if (err) {
              console.log('Error saving new github user!!', err);
              return done(err);
            }
            console.log('No error saving new github user!! Here they are: ', newUser);
            return done(null, newUser);
          });
        }
      });
    }
    else {//need to find out if linkedin account created separately
      User.findOne({'social.github.id': profile.id}, function(err, user){
        if(err){
          console.log('error finding github user: ', err);
        }
        if(user){
          console.log('nope nope nope, github account already created');
          var currentUser = req.user;
          currentUser.social.github.id = profile.id;
          currentUser.social.github.username = profile.username;
          currentUser.social.github.token = accessToken;
          currentUser.social.github.displayName = profile.displayName;
          currentUser.social.github.email = profile.emails[0].value;
          currentUser.social.github.photoURL = profile.photos[0].value || '';
          currentUser.save(function(err){
            if(err){
              console.log('err updating user: ', err);
              return done(err);
            }
            User.findOneAndRemove({'social.github.id': profile.id}, function(err, deletedUser){
              if(err){
                console.log('error deleting old user: ', err);
                return done(err);
              }
              console.log('deleted old linkedin user successfuly: ', deletedUser);
              return done(null, currentUser);
            })
          })
        }
        else {//no user created separately, update the users info with github info
          console.log('got here, supposed to be here', profile);
          var user = req.user; // pull the user out of the session
          // update the current users facebook credentials
          user.social.github.id = profile.id;
          user.social.github.username = profile.username;
          user.social.github.token = accessToken;
          user.social.github.displayName = profile.displayName;
          user.social.github.email = profile.emails[0].value;
          user.social.github.photoURL = profile.photos[0].value || '';
          // save modifications to user
          user.save(function(err) {
            if (err) {
              console.error(err);
              return done(err);
            }
            //console.log('user fb', user.social.fb.displayName);
            //console.log('user fb tokens',user.social.fb.token);
            return done(null, user);
          });
        }
      })

    }
  });
}));



passport.use(new LinkedInStrategy({
    consumerKey: linkedInKey,
    consumerSecret: linkedInSecret,
    callbackURL: linkedInCbURL,
    profileFields: ['id', 'first-name', 'last-name', 'email-address', 'summary', 'positions', 'picture-url', 'public-profile-url'],
    passReqToCallback : true
  },
  // linkedin sends back the tokens and profile info
  function(req, token, tokenSecret, profile, done) {
    console.log('profile: ', profile);
    process.nextTick(function() {
      if(!req.user) {//confirm that user not loggedin
        User.findOne({'social.linkedin.id': profile.id}, function(err, user){
        if(err){
          console.log('There was an error accessing the db for linkedin auth: ', err);
          return done(err);
        }
        if (user){
          console.log('yepppp, linkedin user already exists');
          return done(null, user);
        }
        else {//create new user b/c they don't exist yet
          console.log('nope, no linkedin user yet!!!');
          var newUser = new User();
          newUser.social.linkedin.id = profile.id;
          newUser.social.linkedin.token = token;
          newUser.social.linkedin.tokenSecret = tokenSecret;
          newUser.social.linkedin.firstName = profile.name.givenName;
          newUser.social.linkedin.lastName = profile.name.familyName;
          newUser.social.linkedin.email = profile.emails[0].value;
          newUser.social.linkedin.photoURL = profile._json.pictureUrl || '';
          console.log('got to heree');
          newUser.save(function(err) {
            console.log('got to here boiii');
            if (err) {
              console.log('Error saving new user!!', err);
              return done(err);
            }
            console.log('No error saving new user!! Here s/he is: ', newUser);
            return done(null, newUser);
          });
        }
      });
    }
    else {//need to find out if linkedin account created separately
      User.findOne({'social.linkedin.id': profile.id}, function(err, user){
        if(err){
          console.log('error finding linkedin user: ', err);
        }
        if(user){
          console.log('nope nope nope');
          var currentUser = req.user;
          currentUser.social.linkedin.id = profile.id;
          currentUser.social.linkedin.token = token;
          currentUser.social.linkedin.firstName = profile.name.givenName;
          currentUser.social.linkedin.lastName = profile.name.familyName;
          currentUser.social.linkedin.email = profile.emails[0].value;
          currentUser.social.linkedin.photoURL = profile._json.pictureUrl || '';
          currentUser.social.linkedin.summary = profile._json.summary;
          currentUser.save(function(err){
            if(err){
              console.log('err updating user: ', err);
              return done(err);
            }
            User.findOneAndRemove({'social.linkedin.id': profile.id}, function(err, deletedUser){
              if(err){
                console.log('error deleting old user: ', err);
                return done(err);
              }
              console.log('deleted old linkedin user successfuly: ', deletedUser);
              return done(null, currentUser);
            })
          })
        }
        else {//no user created separately, update the users info with linkedin info
          console.log('got here, supposed to be here', profile);
          var user = req.user; // pull the user out of the session
          // update the current users facebook credentials
          user.social.linkedin.id = profile.id;
          user.social.linkedin.token = token;
          user.social.linkedin.firstName = profile.name.givenName;
          user.social.linkedin.lastName = profile.name.familyName;
          user.social.linkedin.email = profile.emails[0].value;
          user.social.linkedin.photoURL = profile._json.pictureUrl || '';
          user.social.linkedin.summary = profile._json.summary;
          // save modifications to user
          user.save(function(err) {
            if (err) {
              console.error(err);
              return done(err);
            }
            //console.log('user fb', user.social.fb.displayName);
            //console.log('user fb tokens',user.social.fb.token);
            return done(null, user);
          });
        }
      })

    }
  });
}));


module.exports = passport;
