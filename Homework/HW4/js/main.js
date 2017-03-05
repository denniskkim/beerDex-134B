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


var signUpVM = new Vue({
    el:'#signup-container',
    data: {
        newUser: {
            firstName : '',
            lastName : '',
            email : '',
            password: '',
            birth : {
                month: '',
                day: '',
                year: ''
            }
        },
        confirmEmail : '',
        validEmail : false,
        validAge : false
    },
    methods: {
        createUser : function(){
            var self = this;
            console.log(self.validEmail);
            console.log(self.validAge);
            if(!self.validEmail && !self.validAge){
                firebase.auth().createUserWithEmailAndPassword(self.newUser.email,self.newUser.password)
                    .then(function(user){
                            console.log("Success");
                            window.location = 'index.html';
                        },
                        function(error){
                            console.log("Failure");
                        });
            }
            console.log("Sign Up successful");
        },
        emailConfirm : function(){
            var self = this;
            if(self.newUser.email != self.confirmEmail){
                self.validEmail = true;
            }
            else {
                self.validEmail = false;
            }
        },
        validateAge : function(){
            var self = this;
            var birthday = getAge(self.newUser.birth.month, self.newUser.birth.day, self.newUser.birth.year);
            if(birthday < 21){
                self.validAge = true;
            }
            else{
                self.validAge = false;
            }
        }
    }
});

function getAge(mon, day, year)
{
    var today = new Date();
    var dateString = mon + "/" + day + "/" + year;
    var birthDate = new Date(dateString);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate()))
    {
        age--;
    }
    return age;
}

function getImgURL(imgName) 
{
    var bucketref = firebase.storage().ref().child('public/img/' + imgName);
    var return_URL = null;
    bucketref.getDownloadURL().then(function(url) {
        return_URL = url;
    }).catch(function(err)
    {
        switch (error.code) {
            case 'storage/object_not_found':
                break; // File doesn't exist

            case 'storage/unauthorized': // User doesn't have permission to access the object
                break;

            case 'storage/canceled':
                break; // User canceled the upload

            case 'storage/unknown':
                break; // Unknown error occurred, inspect the server response
        }
    });
    // Check that return_URL is not null 
    return return_URL;
}

var loginVM = new Vue({
    el: '#login-form', data: {
        user: {
            username: '',
            password: ''
        }
    },
    firebase : {
        userDB: userRef
    },
    methods : {
        checkUser : function(){
            var self = this;
            firebase.auth().signInWithEmailAndPassword(self.user.username, self.user.password)
                .then(function(user){
                        console.log("Success");
                        window.location = 'index.html';
                    },
                    function(error){
                        console.log("Error");
                    });
        }
    }
});

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        var collectionList = new Vue({
            el: '#collectionList',
            firebase : {
                collection: collectionRef.orderByChild("UID").equalTo(firebase.auth().currentUser != null ? firebase.auth().currentUser.uid : "")
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
                UID: firebase.auth().currentUser.uid,
                breweryName: this.breweryName,
                beerName: this.beerName,
                beerStyle: this.beerStyle,
                quantity: parseInt(this.quantity),
                image: this.image
            };
            var valid = beerToAdd.UID.length && beerToAdd.breweryName.length &&
                beerToAdd.beerStyle.length && beerToAdd.quantity && beerToAdd.image.length;
            if (valid) {
                beerDatabaseRef.push(beerToAdd).then(function(snapshot) {
                    console.log(snapshot)
                    beerToAdd.beerID = snapshot.key;
                    collectionRef.push(beerToAdd);
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
                        beerID: beer[".key"]
                    }
                    var valid = beerToAdd.UID.length && beerToAdd.breweryName.length &&
                        beerToAdd.beerStyle.length && beerToAdd.quantity && beerToAdd.image.length;
                    if (valid) {
                        collectionRef.orderByChild("beerID").equalTo(beerToAdd.beerID).once('value', function(snapshot) {
                            var snapVal = snapshot.val();
                            for (var property in snapVal) {
                                if (snapVal.hasOwnProperty(property)) {
                                    beerToAdd.quantity = snapVal[property].quantity + beerToAdd.quantity;
                                    collectionRef.child(property).remove();
                                }
                            }
                        }).then(function() {
                            console.log(beerToAdd);
                            collectionRef.push(beerToAdd);
                        });
                    } else {
                        console.log("Error")
                    }
                }
            }
        })
    }
})

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

