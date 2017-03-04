var config = {
    apiKey: "",
    authDomain: "",
    databaseURL: ""
}

var firebaseApp = firebase.initializeApp(config);
var db = firebaseApp.database();
var collectionRef = db.ref('collection');

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


function initVue()
{
    var vm = new Vue({
        el: '#collection',
        firebase: {
            collectionRef: db.ref('collection'),
        }
        methods: {
            addBeerToCollection(){
                var user; 
                this.$firebaseRefs.collectionRef.child(user).push(this.beer);
            };
            deleteBeerFromCollection()
            {
                var user;
                this.$firebaseRefs.collectionRef.child(user).child(this.beer[key]).remove();
            };
            updateBeerToCollection()
            {
                var user;
                this.$firebaseRefs.collectionRef.child(user).child(this.beer[key]).update(this.beer);
            };
        }

    })
}

