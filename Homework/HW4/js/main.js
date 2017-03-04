var config = {
    apiKey: "AIzaSyDzjSixsprastrEyyrrGMrE5UiXa4JWW34",
    authDomain: "beerdex-384f9.firebaseapp.com",
    databaseURL: "https://beerdex-384f9.firebaseio.com"
}

var firebaseApp = firebase.initializeApp(config);
var db = firebaseApp.database();
var collectionRef = db.ref('collections');

function getImgURL(imgName) 
{
    var storageRef = firebaseApp.storage();
    var starsRef = storageRef.child('img/' + imgName);
    var return_URL = null;
    starsRef.getDownloadURL().then(function(url) {
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

// Create
function addBeerToCollection(userID,beerObject)
{
    collectionRef.child(userID).push(beerKey,beerObject);
}

// Read
function getCollection(userID)
{
    return collectionRef.child(userID);
}

// Delete 
function deleteBeerFromCollection(userID,beerKey,beerObject)
{
    collectionRef.child(userID).child(beerObject['key']).remove();
}

// Update
function updateBeerToCollection(userID,beerKey,beerObject)
{
    collectionRef.child(userID).child(beerKey).update(beerObject);
}

function refreshCollectionView()
{

}


var collectionList = new Vue({
    el: '#collectionList',
    firebase : {
        collection: db.ref('collections')
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

var collectionForm = new Vue({
    el: "#collectionForm",
    firebase: {
        collection: db.ref('collection')
    },
    methods: {
        addBeerToCollection: function(beer)
        {
            this.$firebaseRefs.collection.push(beer);
        }
    }
})