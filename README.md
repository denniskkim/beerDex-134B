# BeerDex
# Available At: https://beerdex-384f9.firebaseapp.com/

BeerDex is a web application that allows users, who are beer enthusiasts or occasional drinkers, to diversify themselves in the world of beer. Users can store a diary of their own collectable collections and are able to trade amongst other members in the community. User can also search amongst the many beers in our database to enlighten themselves with beers they never knew existed. 

![ScreenShot of HomePage](/src/img/home-page-ss.png)

# Application Overview
* Frontend: HTML5 / CSS (Bulma)  / JS (VueJS)
* Backend: Firebase
* Services Used: Firebase, VueFire


# Architecure 
We used Vue to structure each of the main components of our app and connect them to our Firebase. VueFire made this relatively easy and allowed for us to have two-way data binding. It minimized the number of edge cases we had to account for and any rendering issues. We tried to separate out components into their own JS files based on their features, with a few utility files to handle firebase initialize that needs to be repeated across different files. We also separated all of our CSS and JS into their own folders and kept the HTML in the root. We ended up not going with a SPA architecture because we felt that it would require too much setup for our limited time constraints.

* ### Bulma: 
  * This was our main CSS framework which we used to create the layout, provide fonts, and provide various components like tables and cards. Bulma was not as feature rich as something like Bootstrap, but we felt that it was light weight enough and provided UI that we felt better fit the target audience. We were also able to selectively include parts of the library to minimize including unneeded CSS. 

* ### Vue: 
  * 

* ### Firebase: 
  *

# Progressive Web Application (PWA)
Our main focus for moving towards as progressive web app was adding a manifest.json file to make the web app more mobile friendly. We made sure to include the specified icons and theme colors to handle the UX on a mobile device

# Known Issues, Bugs, & Limitations
* Firebase Limitations : We struggled to optimize Firebase to perform as quickly as we would like, especially when it came to dynamically rendering the user's collection and wishlist view.
* Rendering of list view objects : Because we were dynamically rendering the list view by fetching data from the Firebase database, the rendering time of these list view took longer than we would want. And because of the slow loading time, it would falsely dispay that a user's collection is empty when it is not.  

# Future Work
* Messaging system: Ideally, we would have a complex messaging system to allow users to do trades within the app, but we felt it was a little out of the scope of the requirements of the application.
* Integration of a routing tool (vue-router) and build tools (webpack): a SPA design using vue-router and webpack would definitely make the end experience for the user better as they won’t have to navigate through a bunch of URLs. 
* Integration of third party database: it would be nice to be able to scrap a huge database of beers to have something prepopulated to minimize the user’s need to add beers to the database would definitely improve the UX. 


## Developers 
*Gabe Maze-Rogers* 

*Dennis Kim* 

*Clarence Nguyen* 

