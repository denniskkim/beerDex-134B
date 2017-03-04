var config = {
  apiKey: "AIzaSyDzjSixsprastrEyyrrGMrE5UiXa4JWW34",
  authDomain: "beerdex-384f9.firebaseapp.com",
  databaseURL: "https://beerdex-384f9.firebaseio.com",
  storageBucket: "beerdex-384f9.appspot.com",
  messagingSenderId: "728464289732"
};

firebase.initializeApp(config);

var userRef = firebase.database().ref('user');


var loginVM = new Vue({
  el: '#login-form',
  data: {
    user: {
      username: '',
      password: ''
    }
  },
  firebase : {
    userDB: userRef
  },
  methods : {
    checkUser : function(){
      var self = this;
      firebase.auth().signInWithEmailAndPassword(self.user.username, self.user.password)
      .then(function(user){
        console.log("Success");
        window.location = 'index.html';
      },
      function(error){
        console.log("Error");
      });
    }
  }
});
