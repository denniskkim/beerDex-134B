/**
 * Created by gmr on 3/16/17.
 */

/**
 * Builds the Vue component for all the users wishlists
 */
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
                    tradeBeerFromCollection: function(modalID,beer) {
                      var select = document.getElementById('explicitTradeFor')
                      select.options[0].innerHTML = beer.beerName
                      select.options[0].value = beer.beerName
                      select.value = beer.beerName
                      activateModal(modalID)

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