Part 1: https://cse134-beerdex-hw2.firebaseapp.com/ 

Part 2: https://cse134-beerdex-hw2.firebaseapp.com/supplmentary.html 

Part 3: https://cse134-beerdex-hw2.firebaseapp.com/team.html 


# Project Structure
**supplementary.html** contains all of the tags not used in wireframe html

**team.html** contains our team page

**static/** contains of all our resources for team and supplementary

**img/** contains the images used for the wireframes


## Reasons for Certain Validation Errors for Supplementary.html
- Element marquee not allowed as child of element body in this context.
    - marquee isn't supported in HTML5 so this is unavoidable
    - Source https://www.w3.org/TR/css3-marquee/

- The keygen element is obsolete.
    - keygen isn't supported in HTML5 so this is unavoidable 

- The applet element is obsolete. Use the object element instead.
    - applet isn't supported in HTML5 so this is unavoidable 

- The bdi element is not supported in all browsers. Please be sure to test, and consider using a polyfill.
    - Although it's just a warning, we needed to use the BDI tag so we have to disregard the warning
