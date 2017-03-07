var config = {
    apiKey: "AIzaSyDzjSixsprastrEyyrrGMrE5UiXa4JWW34",
    authDomain: "beerdex-384f9.firebaseapp.com",
    databaseURL: "https://beerdex-384f9.firebaseio.com",
    storageBucket: "beerdex-384f9.appspot.com",
    messagingSenderId: "728464289732"
};


var firebaseApp = firebase.initializeApp(config);
var db = firebaseApp.database();
var collectionRef = db.ref('collections');
var userRef = db.ref('user');
var beerDatabaseRef = db.ref('beers');

var BEER_STYLES = ['Pale Ale', 'Lager', 'IPA', 'Wheat', 'Belgian', 'Porter', 'Stout', 'Sour', 'Other'];

function setImgURL() 
{
    console.log("Setting img")
    var imgs = document.getElementsByTagName("img");
    for (var i = 0; i < imgs.length; i++) {
        console.log(i);
        var bucketref = firebase.storage().ref().child('public/img/' + String(imgs[i].src).replace(/^.*[\\\/]/, ''));
        bucketref.getDownloadURL().then(function(url) {
            var images = document.getElementsByTagName("img");
            for (var i = images.length - 1; i >= 0; i--) {
                if (String(url).includes(String(images[i].src).replace(/^.*[\\\/]/, ''))) {
                    images[i].src = String(url);
                }
            }
        }).catch(function(err)
        {
            switch (err.code) {
                case 'storage/object_not_found':
                    console.log("404 File image not found")
                    break; // File doesn't exist

                case 'storage/unauthorized': // User doesn't have permission to access the object
                    console.log("403 Permission Denied for file image")
                    break;

                case 'storage/canceled':
                    console.log("400 Client Side error for file image")
                    break; // User canceled the upload

                case 'storage/unknown':
                    console.log("500 Server error for file image")
                    break; // Unknown error occurred, inspect the server response
                default:
                    console.log("ERROR occured " + err )
                    break;
            }
        });
    }
    // Check that return_URL is not null 
}
var max_width = 200
var max_height = 307 
function resize(img) {

  var canvas = document.createElement('canvas');

  var width = img.width;
  var height = img.height;

  // calculate the width and height, constraining the proportions
  if (width > height) {
    if (width > max_width) {
      //height *= max_width / width;
      height = Math.round(height *= max_width / width);
      width = max_width;
    }
  } else {
    if (height > max_height) {
      //width *= max_height / height;
      width = Math.round(width *= max_height / height);
      height = max_height;
    }
  }
  
  // resize the canvas and draw the image data into it
  canvas.width = width;
  canvas.height = height;
  var ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0, width, height);
  
  return canvas.toDataURL("image/png",0.7); // get the data from canvas as 70% JPG (can be also PNG, etc.)

}

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        var collectionList = new Vue({
            el: '#collectionList',
            firebase : {
                collection: collectionRef.child(firebase.auth().currentUser.uid)
            },
            methods: {
                deleteBeerFromCollection: function(beer)
                {
                    // var user;
                    this.$firebaseRefs.collection.child(beer[".key"]).remove();
                },
                updateBeerToCollection: function()
                {
                    // var user;
                    this.$firebaseRefs.collection.child(this.beer[key]).update(this.beer);
                }
            }

        });
    }
})



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
        quantity: 0
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
            file = resize(file);

            reader.onload = (e) => {
                vm.image = e.target.result;
            }

            reader.readAsDataURL(file);
        },
        removeImage: function (e) {
            this.image = '';
        },
        addBeerToCollection: function() {
            var beerToAdd = {
                breweryName: this.breweryName,
                beerName: this.beerName,
                beerStyle: this.beerStyle,
                quantity: parseInt(this.quantity),
                ABV: parseFloat(this.ABV),
                image: this.image
            };
            var tmpQuantity = beerToAdd.quantity;
            var valid = beerToAdd.breweryName.length &&
                        beerToAdd.beerStyle.length &&
                        beerToAdd.quantity &&
                        beerToAdd.image.length;
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

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        var databaseItem = new Vue({
            el: "#databaseList",
            firebase: {
                database: beerDatabaseRef
            },
            methods: {
                addBeerToCollection: function (beer) {
                    var beerToAdd = {
                        UID: firebase.auth().currentUser.uid,
                        breweryName: beer.breweryName,
                        beerName: beer.beerName,
                        beerStyle: beer.beerStyle,
                        quantity: 1,
                        image: beer.image,
                        ABV: beer.ABV,
                        beerID: beer[".key"]
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
                                    if (snapVal.beerID === beerToAdd.beerID) {
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
                }
            }
        })
    }
});


Vue.component('modal', {
    template: '#modal-template'
})

// start app
new Vue({
    el: '#app',
    data: {
        showModal: false
    }
})

var activateModal = function(modalID) {
    var modal = document.getElementById(modalID);
    modal.className += " is-active";
};

var deactivateModal = function(modalID) {
    var modal = document.getElementById(modalID);
    modal.className = modal.className.replace(" is-active", "");
}
