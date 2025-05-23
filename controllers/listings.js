const Listing = require("../models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

// Index route
        async function index (req,res) {
            const allListing =  await Listing.find({});
            res.render("listings/index.ejs", {allListing});
        }


// New Route
        function newRoute (req,res) {
            res.render("listings/new.ejs");
        }


// Show Route
        async function show (req,res) {
            let {id} = req.params;
            const listing = await Listing.findById(id)
                .populate({
                    path: "reviews",    // nested populate. har 1 review ke sath uaska author bhi aay jayega form db. 
                    populate:{
                        path: "author",
                },
            })
                .populate("owner"); 
            // console.log(listing.image.url);
            if(!listing)
            {
                req.flash("error", "Listings you requested for does not exist");
                res.redirect("/listings");
            }
            // console.log(listing);
            console.log("server map token", process.env.MAP_TOKEN);
            res.render("listings/show.ejs", {listing});
            }


// Create Route 

        async function create (req,res,next) {

            let response = await geocodingClient
            .forwardGeocode({
                query: req.body.listing.location,
                limit: 1,
                })
                .send()

            // let {title,description,image,price,country,location} = req.body;  // to access data from the req.body and data is larger quantity then we can add collection or object into the ejs file and here access from following line. 
            // let listing = req.body.listing;  // access the data using collection and pass to the "listing" variable

            let url = req.file.path;
            let fileName = req.file.filename;
            // console.log(url, "..", fileName);
            
                const newListing = new Listing(req.body.listing); // it's create a instance of Listing. 
                newListing.owner = req.user._id;
                newListing.image = {url, fileName};

                newListing.country = newListing.country.trim().toLowerCase();
                // console.log(newListing.country);
                
                newListing.geometry = response.body.features[0].geometry;
                let savedListing = await newListing.save();
                req.flash("success", "New listing Created");
                res.redirect("/listings");

            }


// edit route 

        async function edit (req,res) {
            let {id} = req.params;
            const listing = await Listing.findById(id);
            if(!listing)
                {
                    req.flash("error", "Listings you requested for does not exist");
                    res.redirect("/listings");
                }
            // console.log(listing);
            originalImage = listing.image.url;

            originalImage = originalImage.replace("/upload", "/upload/h_250/w_250/bo_5px_solid_lightblue");

                        // console.log(originalImage);

            
            res.render("listings/edit.ejs", {listing});
        }


// update route 

        async function update (req,res) {


            let response = await geocodingClient
            .forwardGeocode({
                query: req.body.listing.location,
                limit: 1,
                })
                .send()



            let {id} = req.params;
            // let location = req.params;



             let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing});
            listing.country = listing.country.trim().toLowerCase();
            //  console.log(listing.country);

            listing.geometry = response.body.features[0].geometry

            // console.log(listing.geometry);
            await listing.save();
            /* { ...req.body.listing }
            Spread operator to unpack the listing object sent from the form (req.body.listing contains all the form data like title, description, image, etc.).
            Example of req.body.listing:
        {
        "title": "Updated Title",
        "description": "Updated description",
        "price": 2000
        }

            */

            if(typeof(req.file) !== "undefined"){
                let url = req.file.path;
                let fileName = req.file.filename;
        
                
                listing.image = {url, fileName};

                await listing.save();
            }



        req.flash("success", "Listing updated");
                res.redirect(`/listings/${id}`);
            }

// Delete route OR -  Destroy 

        async function deleteroute (req,res) {

            let {id} = req.params;
            // console.log(id);
            let deletedListing = await Listing.findByIdAndDelete(id);
            // console.log(deletedListing);
            req.flash("success", "listing deleteed ");
            res.redirect("/listings");
            }

// search route 

// async function serachfind(req,res) {
//     let { searchTerm } = req.query.search ? req.query.search.trim().toLowerCase() : ""; // ✅ Get 'search' from query string

//     console.log(searchTerm);
//     try {
//             if(searchTerm === "")
//             {
//                 res.redirect("/listings")
//             }
//         const allListing = await Listing.find({ country: searchTerm }); // ✅ Use .find not .findBy
//         // search = "";
//         res.render("listings/index.ejs", { allListing });
//     } catch (err) {
//         console.error("Search error:", err);
//         res.status(500).send("Internal Server Error");
//     }

// }

async function serachfind(req, res) {
    try {
        // console.log("Raw query:", req.query);

        let searchTerm = req.query.search ? req.query.search.trim().toLowerCase() : "";
        
        // console.log("Search term:", searchTerm);

        if (!searchTerm) {
            return res.redirect("/listings");
        }

        const allListing = await Listing.find({ country: searchTerm });
        res.render("listings/index.ejs", { allListing });

    } catch (err) {
        console.error("Search error:", err);
        res.status(500).send("Internal Server Error");
    }
}


// find particular listing

// async function particularListing(req, res) {
//     try {
//         let iconValue = req.query.iconValue?.trim().toLowerCase();
//         // console.log("Searching for category:", iconValue);

//         if (!iconValue) {
//             return res.redirect("/listings");
//         }

//         const allListing = await Listing.find({ category: iconValue });
//         // console.log(allListing);
//         // console.log("Found listings:", allListing.length);

//         res.render("listings/index.ejs", { allListing });
//     } catch (err) {
//         console.error("Particular Listing Error:", err);
//         res.status(500).send("Server Error");
//     }
// }

// category 

    async function findCategory (req,res){
        const category = req.params.category;

            try {
                    const listings = await Listing.find({ category: category });
                    // console.log("Fetched listings for category:", category);
                    //console.log(listings); // ✅ check if it’s an empty array or populated

    
                    res.render('listings/category', {
                    category: category,
                    listings: listings,
                });
            } catch (err) {
                console.error("Error fetching listings:", err);
                res.status(500).send("Server Error");
        }
    };

// toggle tax 

async function toggleTax (req, res) {
    const allListing = await Listing.find({}); // Adjust as per your DB setup
    const data = allListing.map(listing => ({
        id: listing._id,
        priceWithGST: Math.round(listing.price * 1.18).toLocaleString("en-IN"),
    }));
    res.json(data);
};


module.exports = {index, newRoute, show, create, edit, update, deleteroute, serachfind, findCategory, toggleTax};