const passport = require('passport');
const bcrypt = require('bcrypt-nodejs');
const config = require('../../config');
const Oauth = require('../../Oauth');
const models = require('../../db/models');
const jwt = require('jwt-simple');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const LocalStrategy = require('passport-local');
const authAddToDB = require('../../db/dbWorker/authdbWorker');

const ROOT_URL = 'http://localhost:3090';
// const ROOT_URL = 'http://shoponceserver.herokuapp.com';
const localOptions = { usernameField: 'email'};

const localLogin = new LocalStrategy(localOptions, function(email, password, done){
  models.Clients.findOne( { where: { clientEmail: email } } )
    .then(user => {
      bcrypt.compare(password, user.dataValues.clientPassword, function(err, match){
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
	models.Clients.findOne( { where: { client_id: payload.id} } )
    .then(user => {
  		return user ? done(null, user) : done(null, false);
  	})
    .catch(err => done(err));
});

const facebookLogin = new FacebookStrategy({
    // 'ENTER_CLIENT_ID'
    clientID: /*process.env.CLIENT_ID,*/  Oauth.Facebook.ENTER_CLIENT_ID,
    //  'ENTER_CLIENT_SECRET'
    clientSecret: /*process.env.CLIENT_SECRET,*/  Oauth.Facebook.ENTER_CLIENT_SECRET,
    // Make sure that the name you give your callback matches the callback on the server.
    callbackURL: `${ROOT_URL}/auth/facebook/callback`,
    profileFields: ['id', 'displayName', 'name', 'emails']
  },
  function(accessToken, refreshToken, profile, done) {
    process.nextTick(function(){
      profile.done = done;
      profile.label = 'Facebook_id';
      // add user to database
      authAddToDB(profile, 'socialLogin')
    });
});

passport.serializeUser(function(user, done) {
  done(null, user);
});
// deserialize the data
passport.deserializeUser(function(user, done) {
  done(null, user);
});

const googleLogin = new GoogleStrategy({
    clientID: /*process.env.GOOGLE_CLIENT_ID,*/ Oauth.Google.ENTER_CLIENT_ID,
    clientSecret: /*process.env.GOOGLE_CLIENT_SECRET,*/ Oauth.Google.ENTER_CLIENT_SECRET,
    callbackURL: `${ROOT_URL}/auth/google/callback`
  },
  function(token, refreshToken, profile, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {
      profile.done = done;
      profile.label = 'Google_id';
      // add user to database
      authAddToDB(profile, 'socialLogin')
    });
  }
);

passport.use(localLogin);
passport.use(jwtLogin);
passport.use(facebookLogin)
passport.use(googleLogin)

function tokenForUser(user){
  const today = new Date();
  const exp = new Date(today);
  exp.setDate(today.getDate() + 60);
  const timestamp = parseInt(exp.getTime() / 1000);
  return jwt.encode({ id: user.client_id, iat: timestamp }, config.SECRET )
}

module.exports = { getToken: tokenForUser };