const Listing = require("../models/listing.js");
const Reviews = require("../models/review.js");




async function postReview (req,res) {

    let listing = await Listing.findById(req.params.id);
    let newReview = new Reviews(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);
console.log(newReview);
    await newReview.save()
    await listing.save();
    req.flash("success", "New Review Created");
    res.redirect(`/listings/${listing._id}`);

};


async function destroyReview (req,res) {

    let {id, reviewId} = req.params;

    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}}); // $pull = is a MongoDB operator that removes a specific value from an array.
    await Reviews.findByIdAndDelete(reviewId); 
    
                                        // when findByIdAndDelete method call that call "findOneAndDelete" mongoose middleware call. 
                                        // and this middleware write into a listing.js
    req.flash("success", "Review deleted successfully");
    res.redirect(`/listings/${id}`);
}




module.exports={postReview, destroyReview};