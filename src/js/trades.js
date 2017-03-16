var BEER_STYLES = ['Pale Ale', 'Lager', 'IPA', 'Wheat', 'Belgian', 'Porter', 'Stout', 'Sour', 'Other'];
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
    if (user) {
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
            }
        });
    }
});


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
            console.log("Running createTradeRequest")
            var tradeRequest = {
                UID: firebase.auth().currentUser.uid,
                user: firebase.auth().currentUser.email,
                tradeFor:this.tradeFor,
                tradeFrom:this.tradeFrom,
            };
            console.log("tradeRequest.tradeFor: " + tradeRequest.tradeFor)
            console.log("tradeRequest.tradeFrom: " + tradeRequest.tradeFrom)
                            
            var valid = tradeRequest.tradeFor.length && tradeRequest.tradeFrom.length 
            console.log("Running createTradeRequest 2 ")
            if (valid) {
                beerDatabaseRef.orderByChild("beerName").equalTo(tradeRequest.tradeFor).on("child_added",function(snap)
                {
                    tradeRequest.image = snap.child("image").val()
                    tradeRef.push(tradeRequest).then(function(snapshot) {
                        console.log(snapshot)
                        tradeRequest.tradeID = snapshot.key;
                        tradeListRef.child(firebase.auth().currentUser.uid).push(tradeRequest);
                        deactivateModal('addTradeModal');
                        this.errorMessage = "";
                    });
                });
                deactivateModal('addTradeModal')
            } else {
                 console.log("Running createTradeRequest 4 ")                           
                this.errorMessage = "Please fill out all fields.";
            }
        }
    }
});

Vue.component('modal', {
    template: '#modal-template'
})

// start app
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