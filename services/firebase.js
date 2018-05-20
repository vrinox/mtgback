const firebase_init = function(){
  //firebase
  var firebase = require("firebase-admin");
  var serviceAccount = require("./config/firebase_secret.json");
  firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount),
    databaseURL: "https://direct-subset-204118.firebaseio.com"
  });
  return firebase;
}
module.exports = firebase_init;
