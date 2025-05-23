const Joi = require("joi")


// const listingSchema = Joi.object({
//     listing: Joi.object({
//         title: Joi.string().required(),
//         description: Joi.string().required(),
//         location: Joi.string().required(),
//         country: Joi.string().required(),
//         price: Joi.number().required().min(0),
//         image:Joi.string().uri().allow("", null),
//     }).required()
// });

// module.exports = listingSchema;


const listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        location: Joi.string().required(),
        country: Joi.string().required(),
        price: Joi.number().required().min(0),
        image: Joi.object({
            url: Joi.string().uri().allow("", null),  // URL must be a valid URI, allows empty or null values
            filename: Joi.string().allow("", null)   // Filename is optional
        }).optional(), // The entire image object is optional
        category: Joi.string()
            .valid("trending", "rooms", "iconic-cities", "mountains", "castles", "camping", "farms", "arctic", "domes", "boat").required()

    }).required()
});

// module.exports = listingSchema;

const reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().min(1).max(5).required(),
        comment: Joi.string().required(),
    }).required(),
});

module.exports = { listingSchema, reviewSchema }; 