const passport = require('passport');
const bcrypt = require('bcrypt-nodejs');
const config = require('../../config');
const Oauth = require('../../Oauth');
const models = require('../../db/models');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const LocalStrategy = require('passport-local');
const authAddToDB = require('../../db/dbWorker/authdbWorker');

const ROOT_URL = 'http://localhost:3090';
// const ROOT_URL = 'http://shoponceserver.herokuapp.com';
const localOptions = { usernameField: 'email' };

const localLogin = new LocalStrategy(localOptions, (email, password, done) => {
  models.Clients.findOne({ where: { clientEmail: email } })
    .then(user => {
      bcrypt.compare(password, user.dataValues.clientPassword, (err, match) => {
        if (err) { return done(err); }
        if (!match) { return done(null, false); }
        done(null, user);
      });
    })
    .catch(err => done(err));
});

const jwtOptions = {
	jwtFromRequest: ExtractJwt.fromHeader('authorization'),
	secretOrKey: process.env.SECRET || config.SECRET
};

const jwtLogin = new JwtStrategy(jwtOptions, (payload, done) => {
	// find a user in the database by id.
	models.Clients.findOne({ where: { client_id: payload.id } })
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
   (accessToken, refreshToken, profile, done) => {
    process.nextTick(() => {
      // add user to database
      const data = {
        done,
        id: profile.id,
        label: 'Facebook_id',
        first_name: profile._json.first_name,
        last_name: profile._json.last_name,
        email: profile._json.email
      };
      authAddToDB(data, 'socialLogin');
    });
});

passport.serializeUser((user, done) => {
  done(null, user);
});
// deserialize the data
passport.deserializeUser((user, done) => {
  done(null, user);
});

const googleLogin = new GoogleStrategy({
    clientID: /*process.env.GOOGLE_CLIENT_ID,*/ Oauth.Google.ENTER_CLIENT_ID,
    clientSecret: /*process.env.GOOGLE_CLIENT_SECRET,*/ Oauth.Google.ENTER_CLIENT_SECRET,
    callbackURL: `${ROOT_URL}/auth/google/callback`
  },
  (token, refreshToken, profile, done) => {
    // asynchronous verification, for effect...
    console.log("GOOOGLE PROFILE!!!!!!!!!!!", profile)
    process.nextTick(() => {
      // add user to database
      const data = {
        done,
        id: profile.id,
        label: 'Google_id',
        first_name: profile.name.givenName,
        last_name: profile.name.familyName,
        email: profile.emails[0].value
      };
      authAddToDB(data, 'socialLogin');
    });
  }
);

passport.use(googleLogin);
passport.use(localLogin);
passport.use(jwtLogin);
passport.use(facebookLogin);
