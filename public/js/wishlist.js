document.getElementById("wishlistList")&&firebase.auth().onAuthStateChanged(function(e){if(e){new Vue({el:"#wishlistList",data:{noedit:!0,rating:0},firebase:{wishlist:wishlistRef.child(firebase.auth().currentUser.uid)},methods:{deleteBeerFromWishlist:function(e){this.$firebaseRefs.wishlist.child(e[".key"]).remove()},tradeBeerFromCollection:function(e,i){var t=document.getElementById("explicitTradeFor");t.options[0].innerHTML=i.beerName,t.options[0].value=i.beerName,t.value=i.beerName,activateModal(e)},addBeerToCollection:function(e){var i={breweryName:e.breweryName,beerName:e.beerName,beerStyle:e.beerStyle,ABV:e.ABV,rating:3,quantity:1,image:e.image},t=0;collectionRef.child(firebase.auth().currentUser.uid).once("value",function(e){e.forEach(function(e){var r=e.val();r.beerID===i.beerID&&(t+=1)})}).then(function(){t||(alert("Added "+i.beerName+" to your collection!"),collectionRef.child(firebase.auth().currentUser.uid).push(i))}),wishlistRef.child(firebase.auth().currentUser.uid).child(e[".key"]).remove()}}})}});