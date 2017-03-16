/**
 * Created by gmr on 3/16/17.
 */

/**
 * Builds the Vue component to show all of the beers stored by a user in their collection
 */
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
                    },
                    tradeBeerFromCollection: function(modalID,beer) {
                        var select = document.getElementById('explicitTradeFrom')
                        select.options[0].innerHTML = beer.beerName
                        select.options[0].value = beer.beerNameiko
                        select.value = beer.beerName
                        activateModal(modalID)

                    }
                }

            });
        }
    });

}
