'use strict';
const paypal = require('paypal-rest-sdk');
const config = require('../../config');

console.log('paypal', process.env.PAYPAL_CLIENT_ID);

paypal.configure({
  mode: 'sandbox', //sandbox or live
  client_id: process.env.PAYPAL_CLIENT_ID,
  client_secret: process.env.PAYPAL_SECRET 
});
