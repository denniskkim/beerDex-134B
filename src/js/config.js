/**
 * Created by gmr and clarence on 3/6/17.
 */
var config = {
    apiKey: "AIzaSyA0EyXyzCgS9eBwleLHFmbYSlupKA4xXnY",
    authDomain: "final-beerdex.firebaseapp.com",
    databaseURL: "https://final-beerdex.firebaseio.com",
    storageBucket: "final-beerdex.appspot.com",
    messagingSenderId: "227954939284"
  };

var firebaseApp = firebase.initializeApp(config);
var db = firebaseApp.database();
var collectionRef = db.ref('collections');
var userRef = db.ref('user');
var beerDatabaseRef = db.ref('beers');
var wishlistRef = db.ref('wishlist');

if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('sw.js').then(function(registration) {
            // Registration was successful
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
        }).catch(function(err) {
            // registration failed :(
            console.log('ServiceWorker registration failed: ', err);
        });
    });
}