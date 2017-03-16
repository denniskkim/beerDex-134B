
var BEER_STYLES = ['Pale Ale', 'Lager', 'IPA', 'Wheat', 'Belgian', 'Porter', 'Stout', 'Sour', 'Other'];

/// checks user session
(function checkUserExists(){
  firebase.auth().onAuthStateChanged(function(user){
    if(!user){
      window.location = 'login.html';
    }
  })
})();



function grabFromBeerDB(target){
  var outputList = [];

  beerDatabaseRef.orderByChild("beerName").on("value",function(snapshot){
    snapshot.forEach(function(data){
      if(target == "brewery"){
        var idx = outputList.indexOf(data.val().breweryName);
        if(idx == -1){
          // console.log(data.val());
          outputList.push(data.val().breweryName);
        }
      }
      else if(target=="style"){
        var idx = outputList.indexOf(data.val().beerStyle);
        if(idx == -1){
          outputList.push(data.val().beerStyle);
        }
      }
    });
  });

  return outputList;
}


/**
 * Modal Vue component to display a form add a new beer that doesn't exist to the database
 */
if (document.getElementById("addBeerForm")) {
    var collectionForm = new Vue({
        el: "#addBeerForm",
        data: {
            errorMessage: "",
            image: "",
            breweryName: "",
            beerName: "",
            beerStyle: "",
            beerStyles: BEER_STYLES,
            ABV: 0.0,
            quantity: 0,
            rating: 0
        },
        firebase: {
            collection: collectionRef
        },
        methods: {
            onFileChange: function(e) {
                var files = e.target.files || e.dataTransfer.files;
                if (!files.length)
                    return;
                this.createImage(files[0]);
            },
            createImage: function(file) {
                var image = new Image();
                var reader = new FileReader();
                var vm = this;
                // file = resize(file);
                reader.onload = (e) => {
                    var beer_image = new Image();
                    beer_image.src = e.target.result;
                    vm.image = resize(beer_image);
                }

                reader.readAsDataURL(file);
            },
            removeImage: function(e) {
                this.image = '';
            },
            addBeerToCollection: function() {
                var beerToAdd = {
                    breweryName: this.breweryName,
                    beerName: this.beerName,
                    beerStyle: this.beerStyle,
                    quantity: parseInt(this.quantity),
                    ABV: parseFloat(this.ABV),
                    rating: parseInt(this.rating),
                    image: this.image
                };
                var tmpQuantity = beerToAdd.quantity;
                var valid = beerToAdd.breweryName.length &&
                    beerToAdd.beerStyle.length &&
                    beerToAdd.quantity &&
                    beerToAdd.image.length &&
                    beerToAdd.ABV &&
                    beerToAdd.rating;
                if (valid) {
                    beerToAdd.quantity = 1;
                    beerDatabaseRef.push(beerToAdd).then(function(snapshot) {
                        console.log(snapshot)
                        beerToAdd.beerID = snapshot.key;
                        beerToAdd.quantity = tmpQuantity;
                        collectionRef.child(firebase.auth().currentUser.uid).push(beerToAdd);
                        deactivateModal('addCollectionModal');
                        this.errorMessage = "";

                    });
                } else {
                    this.errorMessage = "Please fill out all fields.";
                }
            }
        }
    });
}

/**
 * Vue component to show all of the beers within the database and it has a filterable sidebar
 */
if (document.getElementById("databaseList")) {
  firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
          var collectionVM = new Vue({
              el: "#databaseList",
              data : {
                filterSwitch : true,
                currentUser : firebase.auth().currentUser,
                filterBeerObject : []
              },
              firebase: {
                  database: beerDatabaseRef
              },
              methods: {
                  addBeerToCollection: function (beer) {
                      var self = this;
                      // object wrapper for beer to be added to collection
                      var beerToAdd = {
                          UID: firebase.auth().currentUser.uid,
                          breweryName: beer.breweryName,
                          beerName: beer.beerName,
                          beerStyle: beer.beerStyle,
                          quantity: 1,
                          image: beer.image,
                          ABV: beer.ABV,
                          // beerID: beer[".key"]
                      };

                      var valid = beerToAdd.UID &&
                                  beerToAdd.breweryName.length &&
                                  beerToAdd.beerName &&
                                  beerToAdd.beerStyle.length &&
                                  beerToAdd.quantity &&
                                  beerToAdd.image.length &&
                                  beerToAdd.ABV;

                      if (valid) {
                          collectionRef.child(firebase.auth().currentUser.uid)
                              .once('value', function(parentSnapshot) {
                                  parentSnapshot.forEach(function(snapshot) {
                                      var snapVal = snapshot.val();
                                      // validity check to update user's quantity of beer in their collection
                                      if (snapVal.beerName === beerToAdd.beerName && snapVal.beerStyle === beerToAdd.beerStyle && snapVal.breweryName === beerToAdd.breweryName) {
                                          beerToAdd.quantity = snapVal.quantity + beerToAdd.quantity;
                                          collectionRef.child(firebase.auth().currentUser.uid).child(snapshot.key).remove();
                                      }
                                  })
                              })
                          .then(function() {
                              alert("You now have " + beerToAdd.quantity + " " + beerToAdd.beerName);
                              collectionRef.child(firebase.auth().currentUser.uid).push(beerToAdd);

                          });
                      } else {
                          console.log("Error");
                      }
                  },
                  addBeerToWishlist: function(beer) {
                      var beerToAdd = {
                          UID: firebase.auth().currentUser.uid,
                          breweryName: beer.breweryName,
                          beerName: beer.beerName,
                          beerStyle: beer.beerStyle,
                          image: beer.image,
                          ABV: beer.ABV,
                          // beerID: beer[".key"]
                      };

                      var valid = beerToAdd.UID &&
                          beerToAdd.breweryName.length &&
                          beerToAdd.beerName &&
                          beerToAdd.beerStyle.length &&
                          beerToAdd.image.length &&
                          beerToAdd.ABV;

                      if (valid) {
                          var seen = 0;
                          wishlistRef.child(firebase.auth().currentUser.uid)
                              .once('value', function(parentSnapshot) {
                                  parentSnapshot.forEach(function(snapshot) {
                                      var snapVal = snapshot.val();
                                      if (snapVal.beerName === beerToAdd.beerName && snapVal.beerStyle === beerToAdd.beerStyle && snapVal.breweryName === beerToAdd.breweryName) {
                                          seen += 1;
                                      }
                                  })
                              })
                              .then(function() {
                                  if (!seen) {
                                      alert("Added " + beerToAdd.beerName + " to your wishlist!");
                                      wishlistRef.child(firebase.auth().currentUser.uid).push(beerToAdd);
                                  }
                              });
                      } else {
                          console.log("Error");
                      }
                  }
              }
          });

          // vue instance for our filter bar
          var filterVM = new Vue({
            el: '#filter-bar',
            data : {
              breweryName : grabFromBeerDB("brewery"),
              beerStyle : grabFromBeerDB("style"),
              breweryFilter : [],
              styleFilter : [],
              computedFilter : []
            },
            firebase : {
              beerList: beerDatabaseRef
            },
            methods : {
              renderFiltered: function(){
                var tempList = []
                // checks to see if any filters for brewery were checked.
                if(this.breweryFilter.length > 0){
                  collectionVM.filterSwitch = false;
                  for(i = 0; i < this.breweryFilter.length; i++){
                    // queries the instance of fitlered brewery from database
                    beerDatabaseRef.orderByChild("breweryName").equalTo(this.breweryFilter[i]).on("value",function(snapshot){
                      snapshot.forEach(function(data){
                        // handles duplicate , need to be fixed
                        var idx = tempList.indexOf(data.val().beerName);
                        if(idx == -1){
                          tempList.push(data.val());
                        }
                      });
                    });
                  }
                }
                // checks to see if any filters for style was checked
                if(this.styleFilter.length > 0){
                  collectionVM.filterSwitch = false;
                  for(i = 0; i < this.styleFilter.length; i++){
                    // queries the instance of filtered style from Database
                    beerDatabaseRef.orderByChild("beerStyle").equalTo(this.styleFilter[i]).on("value",function(snapshot){
                      snapshot.forEach(function(data){
                        // handles duplicate , need to be fixed
                        var idx = tempList.indexOf(data.val().beerName);
                        if(idx == -1){
                          tempList.push(data.val());
                        }
                      });
                    });
                  }
                }
                // resets view if no filter is checked
                else if(this.styleFilter.length == 0 && this.breweryFilter.length == 0){
                  collectionVM.filterSwitch = true;
                }
                collectionVM.filterBeerObject = tempList;
              },

            }
          });
      }
  });
}

/**
 * Function to activate the Vue modal component
 * @param modalID id of the vue modal
 */
var activateModal = function(modalID) {
    var modal = document.getElementById(modalID);
    modal.className += " is-active";
};


/**
 * Function to deactivate the vue modal component when the form is submitted
 * @param modalID id of the vue modal
 */
var deactivateModal = function(modalID) {
    var modal = document.getElementById(modalID);
    modal.className = modal.className.replace(" is-active", "");
};
