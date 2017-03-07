// var db = firebaseApp.database();
// var collectionRef = db.ref('collections');
// var userRef = db.ref('user');
// var beerDatabaseRef = db.ref('beers');

// var scoresRef = firebase.database().ref("scores");
// scoresRef.orderByValue().limitToLast(3).on("value", function(snapshot) {
//   snapshot.forEach(function(data) {
//     console.log("The " + data.key + " score is " + data.val());
//   });
// });

// if we want to extract nay more data
function grabFromBeerDB(target){
  var outputList = [];
  var beerDatabaseRef = db.ref('beers');
  // var beerName = beerDatabaseRef.orderByChild("beerName")
  beerDatabaseRef.orderByChild("beerName").on("value",function(snapshot){
    snapshot.forEach(function(data){
      if(target == "brewery"){
        outputList.push(data.val().breweryName);
      }
      else if(target=="style"){
        outputList.push(data.val().beerStyle);
      }

    });
  });

  return outputList;
}



var filterVM = new Vue({
  el: '#filter-bar',
  data : {
    breweryName : grabFromBeerDB("brewery"),
    beerStyle : grabFromBeerDB("style")
  },
  firebase : {
    beerList: beerDatabaseRef
  }
});
