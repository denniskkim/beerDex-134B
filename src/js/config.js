/**
 * Created by gmr on 3/6/17.
 */
var config = {
    apiKey: "AIzaSyDzjSixsprastrEyyrrGMrE5UiXa4JWW34",
    authDomain: "beerdex-384f9.firebaseapp.com",
    databaseURL: "https://beerdex-384f9.firebaseio.com",
    storageBucket: "beerdex-384f9.appspot.com",
    messagingSenderId: "728464289732"
};


var firebaseApp = firebase.initializeApp(config);
var db = firebaseApp.database();
var collectionRef = db.ref('collections');
var userRef = db.ref('user');
var beerDatabaseRef = db.ref('beers');