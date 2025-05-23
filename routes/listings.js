const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn, isOwner,validationListing} = require("../middleware.js");
const listingControllers = require("../controllers/listings.js");

const multer  = require('multer'); // parse the multi-data from the form. 
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage}); // and store into the uploads folder. 

// router.route a express method to combine a same route in single route to add effeciency in a code. 

// Index Route. 
// Create Route

   router.route("")
   .get(wrapAsync(listingControllers.index))
   .post(isLoggedIn, upload.single("listing[image][url]"), validationListing, wrapAsync( listingControllers.create));


// New Route


       router.get("/new", isLoggedIn, listingControllers.newRoute);

       //  New Route write above the show route because of while user or client visit on new route but "JS run as top - down approch". first add to show route and then add new route but 
       // on screen new route is avaiable is first and then second show route is avaliable \
       // but i bulid logic of show route and then bulid logic of new route.


// search route

   router.get("/search", wrapAsync(listingControllers.serachfind) );

// find particular listing route
   router.get("/particular", wrapAsync(listingControllers.particularListing));

// show router
// update router
// delete route

   router.route("/:id")
   .get(wrapAsync(listingControllers.show))
   .put(isLoggedIn, isOwner, upload.single("listing[image][url]"), validationListing, wrapAsync(listingControllers.update))
   .delete(isLoggedIn,isOwner, wrapAsync(listingControllers.deleteroute));

   
    // Edit Route
    router.get("/:id/edit",isLoggedIn, isOwner, wrapAsync(listingControllers.edit ));





    module.exports= router;