var config = {
  apiKey: "AIzaSyCoNBix4jgEGBRPIEve6fV999PyqrEAQJY",
  authDomain: "cse134-beerdex-hw2.firebaseapp.com",
  databaseURL: "https://cse134-beerdex-hw2.firebaseio.com",
  storageBucket: "cse134-beerdex-hw2.appspot.com",
  messagingSenderId: "981656805275"
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

    }
  }
});


// addUser: function(){
//   var self = this;
//   userRef.push(self.user);
//   this.newUser.username = '';
//   this.newUser.password = '';
// }
