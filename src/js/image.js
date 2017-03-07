/**
 * Created by gmr on 3/6/17.
 */

var max_height = 307;
var max_height = 200;

var setImgURL = function() {
    console.log("Setting img")
    var imgs = document.getElementsByTagName("img");
    for (var i = 0; i < imgs.length; i++) {
        console.log(i);
        var bucketref = firebase.storage().ref().child('public/img/' + String(imgs[i].src).replace(/^.*[\\\/]/, ''));
        bucketref.getDownloadURL().then(function(url) {
            var images = document.getElementsByTagName("img");
            for (var i = images.length - 1; i >= 0; i--) {
                if (String(url).includes(String(images[i].src).replace(/^.*[\\\/]/, ''))) {
                    images[i].src = String(url);
                }
            }
        }).catch(function(err)
        {
            switch (err.code) {
                case 'storage/object_not_found':
                    console.log("404 File image not found")
                    break; // File doesn't exist

                case 'storage/unauthorized': // User doesn't have permission to access the object
                    console.log("403 Permission Denied for file image")
                    break;

                case 'storage/canceled':
                    console.log("400 Client Side error for file image")
                    break; // User canceled the upload

                case 'storage/unknown':
                    console.log("500 Server error for file image")
                    break; // Unknown error occurred, inspect the server response
                default:
                    console.log("ERROR occured " + err )
                    break;
            }
        });
    }
    // Check that return_URL is not null
};

var resize = function(img) {

    var canvas = document.createElement('canvas');

    var width = img.width;
    var height = img.height;

    // calculate the width and height, constraining the proportions
    if (width > height) {
        if (width > max_width) {
            //height *= max_width / width;
            height = Math.round(height *= max_width / width);
            width = max_width;
        }
    } else {
        if (height > max_height) {
            //width *= max_height / height;
            width = Math.round(width *= max_height / height);
            height = max_height;
        }
    }

    // resize the canvas and draw the image data into it
    canvas.width = width;
    canvas.height = height;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, width, height);

    return canvas.toDataURL("image/png",0.7); // get the data from canvas as 70% JPG (can be also PNG, etc.)

};
