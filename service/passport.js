// const passport = require('passport');
// const config = require('../config');
// const User = require('../db/mongodb');
// const JwtStrategy = require('passport-jwt').Strategy;
// const ExtractJwt = require('passport-jwt').ExtractJwt;
// const FacebookStrategy = require('passport-facebook').Strategy;
// const GitHubStrategy = require('passport-github2').Strategy;
// const LocalStrategy = require('passport-local');


// const localOptions = { usernameField: 'email'};

// const localLogin = new LocalStrategy(localOptions, function(email, password, done){
// 	// look for user by email 
// 	User.findOne({email: email}, function(err, user){
// 		// handle errors
// 		if (err) { return done(err); }
// 		if (!user) { return done(null, false); }
// // compare passords
// 		user.comparePassword(password, function(err, match){
// 			if (err) { return done(err); }
// 			if (!match) { return done(null, false); }
// 			return done(null, user) 
// 		});
// 	});
// });

// const jwtOptions = {
// 	jwtFromRequest: ExtractJwt.fromHeader('authorization'),
// 	secretOrKey: config.secret
// };

// const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done){
// 	// find a user in the database by id.
// 	User.findById(payload._id, function(err, user){
// 		if (err) { return done(errr);}

// 		return user ? done(null, user) : done(null, false)
// 	});
// });

// const facebookLogin = new FacebookStrategy({
//     clientID: '334626160209344',
//     clientSecret: 'f9eed647008c5b6495f56bc70951ae21',
//     // Make sure that the name you give your callback matches the callback on the server.
//     callbackURL: "http://localhost:3090/auth/facebook/callback"
//   },
//   function(accessToken, refreshToken, profile, cb) {
//     process.nextTick(function(){
//       // look for user in the database.
//       User.findOne({facebook_id: profile.id}, function(err, user){
//         if(err){ return cb(err)}
//         if (user) {
//           return cb(null, user)
//         } else{
          
//           var newUser = new User();
//           newUser.facebook_id = profile.id;
//           newUser.name = profile.displayName;
//           newUser.email = profile.displayName.split(' ')[0];

//           newUser.save(function(err){
//             if (err) { throw err } 
//           })
//           return cb(null, newUser); 
//         }
//       });
//     });
// });

// passport.serializeUser(function(user, cb) {
//   console.log('serializeUser',user);
//   cb(null, user);
// });
// // deserialize the data
// passport.deserializeUser(function(user, cb) {
//   console.log('deserializeUser',user);
//   cb(null, user);
// });


// passport.use(localLogin);
// passport.use(jwtLogin);
// passport.use(facebookLogin)