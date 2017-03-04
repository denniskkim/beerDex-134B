var config = {
  apiKey: "AIzaSyCoNBix4jgEGBRPIEve6fV999PyqrEAQJY",
  authDomain: "cse134-beerdex-hw2.firebaseapp.com",
  databaseURL: "https://cse134-beerdex-hw2.firebaseio.com",
  storageBucket: "cse134-beerdex-hw2.appspot.com",
  messagingSenderId: "981656805275"
};

// firebase.initializeApp(config);

var userRef = firebase.database().ref('user');

var signUpVM = new Vue({
  el:'#signup-container',
  data: {
    newUser: {
      firstName : '',
      lastName : '',
      email : '',
      password: '',
      birth : {
          month: '',
          day: '',
          year: ''
      }
    },
    confirmEmail : '',
    validEmail : false,
    validAge : false
  },
  methods: {
    createUser : function(){
      var self = this;
      console.log(self.validEmail);
      console.log(self.validAge);
      if(!self.validEmail && !self.validAge){
        firebase.auth().createUserWithEmailAndPassword(self.newUser.email,self.newUser.password)
        .then(function(user){
          console.log("Success");
          console.log("What is user");
          console.log(user);
          console.log("this is the current user");
          console.log(firebase.auth().currentUser);
        },
        function(error){
          console.log("Failure");
        });
      }
      console.log("Sign Up successful");
    },
    emailConfirm : function(){
      var self = this;
      if(self.newUser.email != self.confirmEmail){
        self.validEmail = true;
      }
      else {
        self.validEmail = false;
      }
    },
    validateAge : function(){
      var self = this;
      var birthday = getAge(self.newUser.birth.month, self.newUser.birth.day, self.newUser.birth.year);
      if(birthday < 21){
        self.validAge = true;
      }
      else{
        self.validAge = false;
      }
    }
  }
});

function getAge(mon, day, year)
{
    var today = new Date();
    var dateString = mon + "/" + day + "/" + year;
    var birthDate = new Date(dateString);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate()))
    {
        age--;
    }
    return age;
}
