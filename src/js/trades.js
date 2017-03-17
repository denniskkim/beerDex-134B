(function checkUserExists() {
    firebase.auth().onAuthStateChanged(function(user) {
        if (!user) {
            window.location = 'login.html';
        }
    })
})();
var tradeRef = db.ref('trades')
var tradeListRef = db.ref('tradesList')
firebase.auth().onAuthStateChanged(function(user) {
    if (user && document.getElementById('tradeList')) {
        var tradeList = new Vue({
            el: '#tradeList',
            data: {
                noedit: true,
                rating: 0,
                listings: false
            },
            firebase: {
                trade: tradeRef,
                tradesListings: tradeListRef.child(firebase.auth().currentUser.uid),
                database: beerDatabaseRef
            },
            methods: {
                deleteBeerFromTrades: function(req) {
                    tradeRef.child(req["tradeID"]).remove();
                    tradeListRef.child(firebase.auth().currentUser.uid).child(req[".key"]).remove();
                },
                getURL: function(user)
                {
                    window.location = "mailto:" + String(user)
                }
            }
        });
    }

    if (user && document.getElementById('addTradeForm')) {
        var tradeForm = new Vue({
            el: "#addTradeForm",
            data: {
                errorMessage: "",
                image: "",
                user: "",
                tradeFor: "",
                tradeFrom: ""

            },
            firebase: {
                trade: tradeRef,
                database: beerDatabaseRef
            },
            methods: {

                createTradeRequest: function() {
                    var tradeRequest = {
                        UID: firebase.auth().currentUser.uid,
                        user: firebase.auth().currentUser.email,
                        tradeFor:this.tradeFor,
                        tradeFrom:this.tradeFrom,
                    };
                    var valid = tradeRequest.tradeFor.length && tradeRequest.tradeFrom.length &&
                                tradeRequest.UID.length && tradeRequest.user.length;

                    // Checking to make sure form is filled out
                    if (valid) {
                        beerDatabaseRef.orderByChild("beerName").equalTo(tradeRequest.tradeFor).on("child_added",function(snap)
                        {
                            tradeRequest.image = snap.child("image").val();
                            tradeRequest.forBrewery = snap.child("breweryName").val();

                            beerDatabaseRef.orderByChild("beerName").equalTo(tradeRequest.tradeFrom).on("child_added",function(snap)
                            {
                            tradeRequest.fromBrewery = snap.child("breweryName").val();
                            tradeRef.push(tradeRequest).then(function(snapshot) {
                                tradeRequest.tradeID = snapshot.key;
                                tradeListRef.child(firebase.auth().currentUser.uid).push(tradeRequest);
                                deactivateModal('addTradeModal');
                                this.errorMessage = "";
                            });
                            });
                        });
                        deactivateModal('addTradeModal')
                    } else {
                        this.errorMessage = "Please fill out all fields.";
                    }
                }
            }
        });

    }
});



Vue.component('modal', {
    template: '#modal-template'
})

var activateModal = function(modalID) {
    var modal = document.getElementById(modalID);
    modal.className += " is-active";
};

var deactivateModal = function(modalID) {
    var modal = document.getElementById(modalID);
    modal.className = modal.className.replace(" is-active", "");
};