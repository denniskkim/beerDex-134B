var beer_toggle=function(){var e=document.getElementsByClassName("nav-menu")[0];e.className="nav-right nav-menu"==e.className?"nav-right nav-menu is-active":"nav-right nav-menu"};document.getElementsByClassName("nav-toggle")[0].addEventListener("click",beer_toggle),!function(){firebase.auth().onAuthStateChanged(function(e){e||(window.location="login.html")})}();
function grabFromBeerDB(e){var r=[];return beerDatabaseRef.orderByChild("beerName").on("value",function(a){a.forEach(function(a){if("brewery"==e){var t=r.indexOf(a.val().breweryName);-1==t&&r.push(a.val().breweryName)}else if("style"==e){var t=r.indexOf(a.val().beerStyle);-1==t&&r.push(a.val().beerStyle)}})}),r}var BEER_STYLES=["Pale Ale","Lager","IPA","Wheat","Belgian","Porter","Stout","Sour","Other"];!function(){firebase.auth().onAuthStateChanged(function(e){e||(window.location="login.html")})}();

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
document.getElementById("databaseList")&&firebase.auth().onAuthStateChanged(function(e){if(e){var r=new Vue({el:"#databaseList",data:{filterSwitch:!0,currentUser:firebase.auth().currentUser,filterBeerObject:[]},firebase:{database:beerDatabaseRef},methods:{addBeerToCollection:function(e){var r={UID:firebase.auth().currentUser.uid,breweryName:e.breweryName,beerName:e.beerName,beerStyle:e.beerStyle,quantity:1,image:e.image,ABV:e.ABV},t=r.UID&&r.breweryName.length&&r.beerName&&r.beerStyle.length&&r.quantity&&r.image.length&&r.ABV;t?collectionRef.child(firebase.auth().currentUser.uid).once("value",function(e){e.forEach(function(e){var t=e.val();t.beerName===r.beerName&&t.beerStyle===r.beerStyle&&t.breweryName===r.breweryName&&(r.quantity=t.quantity+r.quantity,collectionRef.child(firebase.auth().currentUser.uid).child(e.key).remove())})}).then(function(){alert("You now have "+r.quantity+" "+r.beerName),collectionRef.child(firebase.auth().currentUser.uid).push(r)}):console.log("Error")},addBeerToWishlist:function(e){var r={UID:firebase.auth().currentUser.uid,breweryName:e.breweryName,beerName:e.beerName,beerStyle:e.beerStyle,image:e.image,ABV:e.ABV},t=r.UID&&r.breweryName.length&&r.beerName&&r.beerStyle.length&&r.image.length&&r.ABV;if(t){var a=0;wishlistRef.child(firebase.auth().currentUser.uid).once("value",function(e){e.forEach(function(e){var t=e.val();t.beerName===r.beerName&&t.beerStyle===r.beerStyle&&t.breweryName===r.breweryName&&(a+=1)})}).then(function(){a||(alert("Added "+r.beerName+" to your wishlist!"),wishlistRef.child(firebase.auth().currentUser.uid).push(r))})}else console.log("Error")}}});new Vue({el:"#filter-bar",data:{breweryName:grabFromBeerDB("brewery"),beerStyle:grabFromBeerDB("style"),breweryFilter:[],styleFilter:[],computedFilter:[]},firebase:{beerList:beerDatabaseRef},methods:{renderFiltered:function(){var e=[];if(this.breweryFilter.length>0)for(r.filterSwitch=!1,i=0;i<this.breweryFilter.length;i++)beerDatabaseRef.orderByChild("breweryName").equalTo(this.breweryFilter[i]).on("value",function(r){r.forEach(function(r){var t=e.indexOf(r.val().beerName);-1==t&&e.push(r.val())})});if(this.styleFilter.length>0)for(r.filterSwitch=!1,i=0;i<this.styleFilter.length;i++)beerDatabaseRef.orderByChild("beerStyle").equalTo(this.styleFilter[i]).on("value",function(r){r.forEach(function(r){var t=e.indexOf(r.val().beerName);-1==t&&e.push(r.val())})});else 0==this.styleFilter.length&&0==this.breweryFilter.length&&(r.filterSwitch=!0);r.filterBeerObject=e}}})}});var activateModal=function(e){var r=document.getElementById(e);r.className+=" is-active"},deactivateModal=function(e){var r=document.getElementById(e);r.className=r.className.replace(" is-active","")};