var config = {
    apiKey: "AIzaSyDzjSixsprastrEyyrrGMrE5UiXa4JWW34",
    authDomain: "beerdex-384f9.firebaseapp.com",
    databaseURL: "https://beerdex-384f9.firebaseio.com",
    storageBucket: "beerdex-384f9.appspot.com",
    messagingSenderId: "728464289732"
};

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
                            window.location = 'index.html';
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