const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

var {google} = require('googleapis');
var people = google.people('v1');

exports.contacts = functions.https.onRequest((request, response) => {
  admin.database().ref('/settings/contacts/credentials/serviceAccount').once("value", function(data) {
    var authClient = new google.auth.JWT(
      data.child('clientEmail').val(),
      null,
      data.child('privateKey').val(),
      ['https://www.googleapis.com/auth/contacts'],
      null
    );

    authClient.authorize(function (err, tokens) {
      if (err) {
        console.error(err);
        response.end();
        return;
      }

      // Make an authorized request to list contacts.
      people.people.connections.list({auth: authClient, resourceName: 'people/me'}, function(err, resp) {
        if (err) {
          console.error(err);
          response.end();
          return;
        }

        console.log("Success");
        console.log(resp);
        response.send(resp);
      });
    });
  });
});
