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
