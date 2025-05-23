const Listing = require("./models/listing.js");
const { listingSchema }= require("./schema.js");
const ExpressError = require("./utils/ExpressError.js");
const { reviewSchema }= require("./schema.js");
const Review = require("./models/review.js");

function isLoggedIn(req, res, next) {
    // console.log(req.path, "  ", req.originalUrl); // to cross verify print the info of user. 
    if (!req.isAuthenticated()) {

        // redirect URL // req object mde session object asto 

        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in to create a listing.");
        return res.redirect("/login");
    }
    next();
}

function saveRedirectUrl (req,res,next){
    if(req.session.redirectUrl)
    {
        res.locals.redirectUrl = req.session.redirectUrl
    }
    next();
};

async function  isOwner (req,res,next){
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error", "You are not a Owner of this listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

const validationListing = (req,res,next) =>
                {
                    let {error} = listingSchema.validate(req.body);
                    // console.log(error.details);
    
                    if(error)
                        {
                            let errMsg = error.details.map((el) => el.message).join(",");
                            throw new ExpressError(400,errMsg);
                        }
                        else
                        {
    
                            return next();
                        }
                };
 
const validateReview = (req,res,next) =>
    {
        let {error} = reviewSchema.validate(req.body);

        if(error)
            {
                let errMsg = error.details.map((el) => el.message).join(",");
                throw new ExpressError(400,errMsg);
            }
            else
            {
                return next();
            }
};



async function  isReviewAuthor (req,res,next){
    let {id, reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error", "You are not a Author of this review");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports = {isLoggedIn,saveRedirectUrl, isOwner, validationListing, validateReview, isReviewAuthor};