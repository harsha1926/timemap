const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.test = functions.https.onRequest((request, response) => {
  response.send("Hello World!");
});
