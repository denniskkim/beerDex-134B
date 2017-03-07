

var navBarVm = new Vue({
  el : '#logout-div',
  data : {

  },
  methods: {
    logOut : function(){
      firebase.auth().signOut().then(function() {
        window.location = "login.html";
        console.log("Successfully log out");
      }, function(error) {
        console.log("There was an error wile trying to log out");
      });
    }
  }
});
