var loginVM = new Vue({
    el: '#login-form',
    data: {
        user: {
            username: '',
            password: ''
        }
    },
    methods : {
       // validates user credentials when creating new user.
        checkUser : function(){
            var self = this;
            // user authentication with email and password
            firebase.auth().signInWithEmailAndPassword(self.user.username, self.user.password)
                .then(function(user){
                        console.log("Success");
                        window.location = 'index.html';
                 },
                 function(error){
                   var errorCode = error.code;
                   var errorMessage = error.message;
                   if (errorCode == 'auth/invalid-email') {
                      alert('Invalid email, Please try again.');
                    }
                    else if(errorCode == 'auth/user-not-found'){
                      alert('User not found! Please Sign Up or Try Again.');
                    }
                    else if(errorCode == 'auth/wrong-password'){
                      alert('Wrong Password, Please Try Again!')
                    }
                    else{
                      alert(errorMessage);
                    }
                 });
        }

    }
});



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
        validAge : false,
        signUpFlag : true,
        ageClear : false,
        signUpOption : ''
    },
    methods: {
        createUser : function(){
            var self = this;
            console.log(self.validEmail);
            console.log(self.validAge);
            // makes sure that email match and age is appropriate
            if(!self.validEmail && self.ageClear){
                firebase.auth().createUserWithEmailAndPassword(self.newUser.email,self.newUser.password)
                    .then(function(user){
                            console.log("Success");
                            window.location = 'index.html';
                        },
                        function(error){
                            var errorCode = error.code;
                            var errorMessage = error.message;
                            if (errorCode == 'auth/weak-password') {
                               alert('The password is too weak.');
                             }
                             else if(errorCode == 'auth/email-already-in-use'){
                               alert('Email is already in use! Please try to login');
                             }
                             else{
                               alert(errorMessage);
                             }
                        });
            }
            else if(!self.clearAge){
              alert("Sorry you need to be 21+ to access this page" );
            }
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
        // validates age : need to be 21+
        validateAge : function(){
            var self = this;
            var birthday = getAge(self.newUser.birth.month, self.newUser.birth.day, self.newUser.birth.year);
            // not old enough
            if(birthday < 21){
                self.validAge = true;
                self.ageClear = false;
            }
            // valid user age
            else if(birthday >= 21 && this.newUser.birth.month && this.newUser.birth.day && this.newUser.birth.year){
                self.validAge = false;
                self.ageClear = true;
            }
        },
        changeSignUpView : function(){
          if(this.signUpFlag){
            this.signUpFlag = false;
          }
          else{
            this.signUpFlag = true;
          }
        },
        // google login portal
        googleLogin : function(){
          var self = this;
          var loginSuccess = false;
          var provider = new firebase.auth.GoogleAuthProvider();

          firebase.auth().signInWithRedirect(provider);
        }
    }
});

// redirect user to homepage if signed in
firebase.auth().onAuthStateChanged(function(user){
  if(user) {
    window.location = 'index.html';
  }
});


// parses age from user input
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
