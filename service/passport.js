const passport = require('passport');
const bcrypt = require('bcrypt-nodejs');
const config = require('../config');
// const Oauth = require('../Oauth');
const models = require('../db/models');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const LocalStrategy = require('passport-local');

// const ROOT_URL = 'http://localhost:3000';
const ROOT_URL = 'http://shoponceserver.herokuapp.com';

const localOptions = { usernameField: 'email'};

const localLogin = new LocalStrategy(localOptions, function(email, password, done){
  models.Clients.findOne( { where: { email: email } } )
    .then(user => {
      bcrypt.compare(password, user.dataValues.password, function(err, match){
        if(err){ return done(err); }
        if (!match) { return done(null, false); }
        done(null, user);
      });
    })
    .catch(err => done(err) );
});

const jwtOptions = {
	jwtFromRequest: ExtractJwt.fromHeader('authorization'),
	secretOrKey: process.env.SECRET || config.SECRET
};

const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done){
	// find a user in the database by id.
	models.Clients.findOne( { where: {user_id: payload.id} } )
    .then(user => {
  		return user ? done(null, user) : done(null, false);
  	})
    .catch(err => done(err));
});

const facebookLogin = new FacebookStrategy({
    // 'ENTER_CLIENT_ID'
    clientID: process.env.CLIENT_ID ||// Oauth.Facebook.ENTER_CLIENT_ID,
    //  'ENTER_CLIENT_SECRET'
    clientSecret: process.env.CLIENT_SECRET || //Oauth.Facebook.ENTER_CLIENT_SECRET,
    // Make sure that the name you give your callback matches the callback on the server.
    callbackURL: `${ROOT_URL}/auth/facebook/callback`
  },
  function(accessToken, refreshToken, profile, cb) {
    process.nextTick(function(){
      // look for user in the database.
      models.Clients.findOne( { where: {facebook_id: profile.id} })
        .then(user => {
          if (user) {
            return cb(null, user)
          } else{
            models.Clients.create({ facebook_id: profile.id, name: profile.displayName, email: profile.displayName.split(' ')[0] })
                .then(user =>  { cb(null, user) })
                .catch(err => cb(err));
          }
        })
        .catch(err => cb(err));
    });
});

passport.serializeUser(function(user, cb) {
  console.log('serializeUser',user);
  cb(null, user);
});
// deserialize the data
passport.deserializeUser(function(user, cb) {
  console.log('deserializeUser',user);
  cb(null, user);
});

const googleLogin = new GoogleStrategy({
    clientID: process.env.CLIENT_ID || //Oauth.Google.ENTER_CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET || //Oauth.Google.ENTER_CLIENT_SECRET,
    callbackURL: `${ROOT_URL}/auth/google/callback`
  },
  function(token, refreshToken, profile, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {
      models.Clients.findOne( { where: {google_id: profile.id} })
        .then(user => {
          if (user) {
            return done(null, user)
          } else{
            models.Clients.create({ google_id: profile.id, name: profile.displayName, email: profile.email })
                .then(user =>  { done(null, user) })
                .catch(err => done(err));
          }
        })
        .catch(err => done(err));
    });
  }
);

passport.use(localLogin);
passport.use(jwtLogin);
passport.use(facebookLogin)
passport.use(googleLogin)