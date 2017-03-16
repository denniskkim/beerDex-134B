if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/sw.js').then(function(registration) {
      // Registration was successful
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
    }).catch(function(err) {
      // registration failed :(
      console.log('ServiceWorker registration failed: ', err);
    });
  });
}


var BEER_STYLES = ['Pale Ale', 'Lager', 'IPA', 'Wheat', 'Belgian', 'Porter', 'Stout', 'Sour', 'Other'];
(function checkUserExists() {
    firebase.auth().onAuthStateChanged(function(user) {
        if (!user) {
            window.location = 'login.html';
        }
    })
})();


if (document.getElementById("collectionList")) {
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            var collectionList = new Vue({
                el: '#collectionList',
                data: {
                    noedit: true,
                    rating: 0
                },
                firebase: {
                    collection: collectionRef.child(firebase.auth().currentUser.uid)
                },
                methods: {
                    deleteBeerFromCollection: function(beer) {
                        // var user;
                        this.$firebaseRefs.collection.child(beer[".key"]).remove();
                    },
                    updateBeerInCollection: function(beer) {
                        // TODO Change this to only show one dropdown when edit is pressed
                        this.$firebaseRefs.collection.child(beer[".key"]).update({
                            rating: beer.rating,
                            quantity: beer.quantity
                        });
                        this.noedit = true;
                    }
                }

            });
        }
    });

}

if (document.getElementById("wishlistList")) {
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            var wishlistList = new Vue({
                el: '#wishlistList',
                data: {
                    noedit: true,
                    rating: 0
                },
                firebase: {
                    wishlist: wishlistRef.child(firebase.auth().currentUser.uid)
                },
                methods: {
                    deleteBeerFromWishlist: function(beer) {
                        // var user;
                        this.$firebaseRefs.wishlist.child(beer[".key"]).remove();
                    },
                    addBeerToCollection: function(beer) {
                        var beerToAdd = {
                            breweryName: beer.breweryName,
                            beerName: beer.beerName,
                            beerStyle: beer.beerStyle,
                            ABV: beer.ABV,
                            rating: 3,
                            quantity: 1,
                            image: beer.image
                        };
                        // Need to check if it's already in the collectionRef

                        var seen = 0;
                        collectionRef.child(firebase.auth().currentUser.uid)
                            .once('value', function(parentSnapshot) {
                                parentSnapshot.forEach(function(snapshot) {
                                    var snapVal = snapshot.val();
                                    if (snapVal.beerID === beerToAdd.beerID) {
                                        seen += 1;
                                    }
                                })
                            })
                            .then(function() {
                                if (!seen) {
                                    alert("Added " + beerToAdd.beerName + " to your collection!");
                                    collectionRef.child(firebase.auth().currentUser.uid).push(beerToAdd);
                                }
                            });
                        wishlistRef.child(firebase.auth().currentUser.uid).child(beer[".key"]).remove();
                    }
                }

            });
        }
    });
}




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


if (document.getElementById("databaseList")) {
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            var databaseItem = new Vue({
                el: "#databaseList",
                firebase: {
                    database: beerDatabaseRef
                },
                methods: {
                    addBeerToCollection: function(beer) {
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
                    },
                    addBeerToWishlist: function(beer) {
                        var beerToAdd = {
                            UID: firebase.auth().currentUser.uid,
                            breweryName: beer.breweryName,
                            beerName: beer.beerName,
                            beerStyle: beer.beerStyle,
                            image: beer.image,
                            ABV: beer.ABV,
                            beerID: beer[".key"]
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
                                        if (snapVal.beerID === beerToAdd.beerID) {
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
            })
        }
    });
}


if (document.getElementById("topRated")) {
    var getTopRatedBeers = function() {
        var beerIdWithRating = [];
        collectionRef.once('value', function(parentSnapshot) {
            parentSnapshot.forEach(function(childSnapshot) {
                var beerIDs = Object.keys(childSnapshot.val());
                var parentObj = childSnapshot.val();
                for (var i in beerIDs) {
                    var beerID = beerIDs[i];
                    var beerObjectID = parentObj[beerID].beerID;
                    if (parentObj[beerID].rating) {
                        if (beerIdWithRating[beerObjectID]) {
                            beerIdWithRating[beerObjectID].push(parentObj[beerID].rating)
                        } else {
                            beerIdWithRating[beerObjectID] = [parentObj[beerID].rating]
                        }
                    }
                }
            });
        }).then(function() {
            var idWithRatingAvg = []
            for (var id in beerIdWithRating) {
                var ratingArray = beerIdWithRating[id];
                var sum = 0;
                for (var i in ratingArray) {
                    sum += parseInt(ratingArray[i]);
                }
                idWithRatingAvg[id] = sum / ratingArray.length;
            }

            var beersWithRating = [];
            beerDatabaseRef.once('value', function(snapshot) {
                var snapVal = snapshot.val();
                var keys = Object.keys(snapVal);
                for (var i in keys) {
                    var beerID = keys[i];
                    if (idWithRatingAvg[beerID]) {
                        snapVal[beerID].rating = idWithRatingAvg[beerID];
                        beersWithRating.push(snapVal[beerID]);
                    }
                }
                beersWithRating.sort(function(a, b) {
                    return parseFloat(b.rating) - parseFloat(a.rating);
                });
            }).then(function() {
                var topRated = new Vue({
                    el: "#topRated",
                    data: {
                        beers: beersWithRating
                    }
                });
            });
        });
    };

    getTopRatedBeers();
}


if (document.getElementById("mostWished")) {
    var getMostWishedForBeers = function() {
        var beerCounts = [];
        wishlistRef.once('value', function(parentSnapshot) {
            parentSnapshot.forEach(function(childSnapshot) {
                var beerIDs = Object.keys(childSnapshot.val());
                var parentObj = childSnapshot.val();
                for (var i in beerIDs) {
                    var beerID = beerIDs[i];
                    var beerObjectID = parentObj[beerID].beerID;
                    if (beerCounts[beerObjectID]) {
                        beerCounts[beerObjectID] += 1;
                    } else {
                        beerCounts[beerObjectID] = 1;
                    }
                }
            })
        }).then(function() {
            var beersWithCounts = [];
            beerDatabaseRef.once('value', function(snapshot) {
                var snapVal = snapshot.val();
                var keys = Object.keys(snapVal);
                for (var i in keys) {
                    var beerID = keys[i];
                    if (beerCounts[beerID]) {
                        snapVal[beerID].count = beerCounts[beerID];
                        beersWithCounts.push(snapVal[beerID]);
                    }
                }
                beersWithCounts.sort(function(a, b) {
                    return parseFloat(b.rating) - parseFloat(a.rating);
                });
            }).then(function() {
                var mostWished = new Vue({
                    el: "#mostWished",
                    data: {
                        beers: beersWithCounts
                    }
                });
            });
        });
    };
    getMostWishedForBeers();
}



// Vue.component('modal', {
//     template: '#modal-template'
// })

// // start app
// new Vue({
//     el: '#app',
//     data: {
//         showModal: false
//     }
// });

var activateModal = function(modalID) {
    var modal = document.getElementById(modalID);
    modal.className += " is-active";
};

var deactivateModal = function(modalID) {
    var modal = document.getElementById(modalID);
    modal.className = modal.className.replace(" is-active", "");
};