const Auth = require('../controllers/auth');
// const passportService = require('../service/passport');
// const passport = require('passport');
const User = require('../db/sqldb');




// const requireAuth = passport.authenticate('jwt', {session: false});
// const requireSignin = passport.authenticate('local', {session: false});

module.exports = function(app){

	// app.get('/auth/facebook', passport.authenticate('facebook'));

	// app.get('/auth/facebook/callback',
	//   passport.authenticate('facebook',  {session: false}, {failureRedirect: '/signin' }), 
	//   function(req, res){
	//   	 res.writeHead(
	// 		   "204",
	// 		   "No Content",
	// 		   {
	// 		     "access-control-allow-origin": "*",
	// 		     "access-control-allow-methods": "GET, POST, OPTIONS",
	// 		     "access-control-allow-headers": "Origin, X-Requested-With, Content-Type, Accept",
	// 		     "content-length": 0
	// 		   }
	// 		 );
	//     res.json( { token: req.user.generateJWT() } )
	//     // res.redirect('/')
	//   });

	app.get('/',  function(req, res, next){
		res.send({message: "But it work tho"})
	});


	// local sign in and sign up routes
	app.post('/signin',  Auth.signin);

	app.post('/signup', (req, res) => {

		User.create(req.body)
			.then(user => {
				res.send(user)
			})
	})
	
};