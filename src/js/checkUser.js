/**
 * Checks if user exists, else redirects to login
 */
(function checkUserExists(){
  firebase.auth().onAuthStateChanged(function(user){
    if(!user){
      window.location = 'login.html';
    }
  })
}());
