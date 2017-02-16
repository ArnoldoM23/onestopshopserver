const cluster = require('cluster');

if (cluster.isMaster) {
	const cpuCount = require('os').cpus().length;

	for (let i = 0; i < cpuCount; i++) {
		cluster.fork();
	}

	cluster.on('exit', (worker) => {
		console.log('Worker has die, Now being replace', worker.id);
		cluster.fork();
	});
} else {
	const express = require('express');
	const morgan = require('morgan');
	const bodyParser = require('body-parser');
	const cors = require('cors');
	const router = require('./routes/routes');
	const passport = require('passport');
	const models = require('./db/models');
	const paypal = require('paypal-rest-sdk');
	const config = require('./config');

	const app = express();
	const PORT = process.env.PORT || 3090;

	const pg = require('pg');
	// UNCOMMENT FOR DEPLOY AND CONNECT TO HEROKU DATABASE
	// pg.defaults.ssl = true;



	// invoiceID 'INV2-G73B-MWMD-HJ9N-M8AC'

// 	paypal.configure({
// 	  mode: 'sandbox', //sandbox or live
// 	  client_id: process.env.PAYPAL_CLIENT_ID,
// 	  client_secret: process.env.PAYPAL_SECRET 
// 	});


// 	paypal.invoice.send('INV2-NBVF-KEH5-SHLW-JZJU', function (error, rv) {
//     if (error) {
//         console.log(error.response);
//         throw error;
//     } else {
//         console.log("Send Invoice Response");
//         console.log(rv);
//     }
// });

// 	var create_invoice_json = {
//     "merchant_info": {
//         "email": "arnoldomunoz23-facilitator@gmail.com",
//         "first_name": "Charlie",
//         "last_name": "Woof",
//         "business_name": "Shop Once, LLC",
//         "phone": {
//             "country_code": "401",
//             "national_number": "1234567"
//         },
//         "address": {
//             "line1": "1234 Main St.",
//             "city": "Portland",
//             "state": "OR",
//             "postal_code": "97217",
//             "country_code": "US"
//         }
//     },
//     "billing_info": [{
//         "email": "arnoldomunoz23-buyer@gmail.com"
//     }],
//     "items": [{
//         "name": "Flowers",
//         "quantity": 1,
//         "unit_price": {
//             "currency": "USD",
//             "value": 1
//         }
//     }],
//     "note": "Venue for Wedding Jul, 2013 PST",
//     "shipping_info": {
//         "first_name": "Amy",
//         "last_name": "Burke",
//         "business_name": "Not applicable",
//         "phone": {
//             "country_code": "510",
//             "national_number": "1234567"
//         },
//         "address": {
//             "line1": "1234 Broad St.",
//             "city": "Portland",
//             "state": "OR",
//             "postal_code": "97216",
//             "country_code": "US"
//         }
//     },
//     "tax_inclusive": false,
//     "total_amount": {
//         "currency": "USD",
//         "value": "1.00"
//     }
// };

	// paypal.invoice.create(create_invoice_json, function (error, invoice) {
	//     if (error) {
	//         throw error;
	//     } else {
	//         console.log("Create Invoice Response");
	//         console.log(invoice);
	//     }
	// });















	app.all('/*', (req, res, next) => {
		res.header('Access-Control-Allow-Origin', '*');
		res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
		res.header('Access-Control-Allow-Methods', 'GET', 'POST', 'PUT');
		next();
	});

	app.use(morgan('combined'));
	app.use(bodyParser.json());
	app.use(passport.initialize());
	app.use(cors());

	router(app);

	models.sequelize.sync({ force: false }).then(() => {
		app.listen(PORT, () => console.log('listening on port', PORT));
	});
} 

