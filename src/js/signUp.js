
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
        signUpOption : ''
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
                            window.location = 'index.html';
                        },
                        function(error){
                            var errorCode = error.code;
                            var errorMessage = error.message;
                            if (errorCode == 'auth/weak-password') {
                              alert('The password is too weak.');
                            }
                            else {
                              alert(errorMessage);
                            }
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
        },
        changeSignUpView : function(){
          if(this.signUpFlag){
            this.signUpFlag = false;
          }
          else{
            this.signUpFlag = true;
          }
        },
        googleLogin : function(){
          var self = this;
          var loginSuccess = false;
          var provider = new firebase.auth.GoogleAuthProvider();

          firebase.auth().signInWithRedirect(provider);
        }
    }
});

firebase.auth().onAuthStateChanged(function(user){
  if(user) {
    window.location = 'index.html';
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
