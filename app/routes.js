var express = require('express');
var passport = require('./passport.js');
var controller = require('./controller.js');

var router = express.Router();

var isLoggedIn = controller.isLoggedIn;
var findUser = controller.findUser;
var viewAllUsers = controller.viewAllUsers;
var updateUser = controller.updateUser;
var deleteUser = controller.deleteUser;

router.use(passport.initialize());
router.use(passport.session());


router.get('/status', function(req, res){
  if (!req.isAuthenticated()) {//is authenticated if in session
		console.log('User is not authenticated back here on the server');
    return res.status(200).json({
      authenticated: false
    });
  }
	console.log('User is authenticated back here on the server');
  res.status(200).json({
    authenticated: true
  });
});


router.route('/user')
  .get(function (req, res, next) {
    return findUser(req, res, next);
  })
  .put(function (req, res, next) {
    return updateUser(req, res, next);
  })
  .delete(function (req, res, next) {
    return deleteUser(req, res, next);
  });

router.get('/profile', isLoggedIn, function (req, res, next) {
	var profile = req.user;
  var linkStatus = {
    local: null,
    linkedin: null,
    github: null
  }

  if(profile.local.email){
    linkStatus.local = true;
  } else {
    linkStatus.local = false;
  }
  if(profile.social.linkedin.firstName){
    linkStatus.linkedin = true;
  } else {
    linkStatus.linkedin = false;
  }
  if(profile.social.github.id){
    linkStatus.github = true;
  } else {
    linkStatus.github = false;
  }

	return res.status(200).json({
		profile: profile,
		linkStatus: linkStatus
	});
});



//Authorization==============================================
router.route('/signup')
.post(function(req, res, next) {
	passport.authenticate('local-signup', function(err, user, info){
		if(err){//what happens if there's an error looking up user in strategy logic
			return next(err);
		}
		if(!user){//user meaning what is returned from strategy - this means that the user was already found in the db and therefore shouldn't be signing up
			return res.status(409).json({message: info.errMsg})
		}
		//user has been created, log them in
		req.login(user, function(err){
			if(err){
				console.log('Error logging in user after registering: ', err);
				return next(err);
			}
			console.log('User logged in after signing up locally');
			return res.status(200).json({
				message: 'User logged in after signing up locally'
			});
		});
	})(req, res, next);
});

router.route('/login')
.post(function(req, res, next){
  passport.authenticate('local-login', function(err, user, info) {
    if (err) {//error checking if user is authenticated with passport
      return next(err);//500 status code
    }
    if (!user) {//user cannot be authenticated by passport
      return res.status(409).json({
        message: 'This combination of user and password does not exist',
        authenticated: false
      });
      //res.end();
    }
    req.logIn(user, function(err) {//user is authenticated, record session
      if (err) {
				console.log('Error logging in user locally: ', err);
        return next(err);
      }
      return res.status(200).json({//maybe use 302 and redirect
        message: 'Logged in successfully',
        authenticated: true
      });
    });
  })(req, res, next);
});

router.get('/auth/github', passport.authenticate('github'));

router.get('/auth/github/callback', passport.authenticate('github', {
  failureRedirect : '/app/#/login'
}), function(req, res){
	res.redirect('/app/#/profile');
});

router.get('/connect/github', passport.authorize('github'));

router.get('/connect/github/callback/connect', passport.authenticate('github', {
  failureRedirect : '/app/#/login'
}), function(req, res){
	res.redirect('/app/#/profile');
});


router.get('/auth/linkedin', passport.authenticate('linkedin'));
router.get('/auth/linkedin/callback', passport.authenticate('linkedin', {
  failureRedirect : '/app/#/login'
}), function(req, res){
  console.log('req.params from linkedin: ', req.params);
	res.redirect('/app/#/profile');
});

router.get('/connect/linkedin',
  passport.authorize('linkedin', {
		failureRedirect: '/app/#/login/linkedin' })
);
router.get('/connect/linkedin/callback',
  passport.authorize('linkedin', {
      successRedirect : '/app/#/profile',
      failureRedirect : '/app/#/login'
  })
);

router.get('/users', function(req, res, next){
  return viewAllUsers(req, res, next);
});
/*.get(function(req, res){
  Account.find(function(error, users){
    if(error){
      res.send('There was an error with the board get request');
    }
    else{
      res.send(users);
    }
  });*/

//should make this delete verb of /connect/linkedin route
router.get('/disconnect/linkedin', function(req, res, next){
  return controller.disconnectLinkedin(req, res, next);
});

router.get('/disconnect/github', function(req, res, next){
  return controller.disconnectGithub(req, res, next);
});


router.route('/connect/local')
  .get(function (req, res) {
    return res.status(200).render('pages/signup', {
      infoMsg: 'Create a local account to link to your profile'});
  })
  .post(function(req, res, next) {
    passport.authenticate('local-signup', function(err, user, info) {
      if (err) {
        return next(err); // will generate a 500 error
      }
      if (!user) {
        return res.status(409).render('pages/signup', {errMsg: info.errMsg});
      }
      req.login(user, function(err){
        if(err){
          console.error(err);
          return next(err);
        }
        return res.status(302).redirect('/dashboard');
      });
    })(req, res, next);
  });


router.route('/logout')
.get(function(req, res){
  req.logout();
	req.session.destroy();
  res.redirect('/app/#/login');
});



router.get('/api/users', function (req, res, next) {
  return viewAllUsers(req, res, next);
});



module.exports = router;
