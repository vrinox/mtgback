var firebase = require("firebase-admin");

const firebase_init = function(){
  //firebase
  var serviceAccount = require("../config/firebase_secret.json");
  firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount),
    databaseURL: "https://direct-subset-204118.firebaseio.com",
    storageBucket:"gs://direct-subset-204118.appspot.com/"
  });
  return firebase;
}
const storage = function(){
  let firebase = firebase_init();
  return firebase.storage();
}
module.exports.storage = storage;
