var loginVM = new Vue({
    el: '#login-form',
    data: {
        user: {
            username: '',
            password: ''
        }
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

                 });
        }

    }
});
