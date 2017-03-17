/**
 * Created by gmr on 3/16/17.
 */

/**
 * Responsible for getting information and building Vue Components for the stats page
 */


/**
 * Gets data from firebase to get all the beers stored by users with a rating and sum the avergae
 * rating and display that into a table
 */
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


/**
 * Goes through all of the beers store on wishlists and keeps track of the most
 * wished for beers and displays on a table
 */
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