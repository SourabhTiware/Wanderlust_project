if(process.env.MODE_ENV != "production")
{
    require('dotenv').config();
}


const express = require("express");
const app = express();
const mongoose = require("mongoose");
const port = process.env.PORT;
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const mongoStore = require("connect-mongo");



const listingsRouter = require("./routes/listings.js");
const ReviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({extended : true}));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());


        // const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
        
        const dbUrl = process.env.ATLASDB_URL;
        async function main()
        {
            await mongoose.connect(dbUrl);
        }

    
        main()
            .then(()=>{
                console.log("Connect to the DB");
            })
            .catch((err) =>{
                console.log(err);
                console.log("Some error in connection");
            });
    
            const store = mongoStore.create({
                        mongoUrl: dbUrl,
                        touchAfter: 24 * 3600, // optional: time period in seconds
                    });

                    store.on(("error"), (err) =>{
                        console.log("ERROR IN SESSION STORE ", err)
                    })

                const sesstionOptions = {
                    store,                  // store : store
                    secret: process.env.SECRET,
                    resave: false,
                    saveUninitialized: true,
                    cookie: {
                        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
                        maxAge: 7 * 24 * 60 * 60 * 1000,
                        httpOnly: true,
                    },
                };


            // app.get("/", (req,res) =>
            //     {
            //         res.send("Hi I'm root");
            //     });

app.use(session(sesstionOptions));
app.use(flash());

// passport method write after the session. because of passport method use the sesssion to track the user movement on session. 
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate())); // authenticate the user from LocalStrategy method. 

// both method to track the user movement if user logged then it is travel one route the another route that time it is check user is
// logged or logged-out. 
passport.serializeUser(User.serializeUser());

// this method track the use movement when logout time. if user logged-out then it deserialize the user from session.   
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
    // console.log("req.user", req.user);
    res.locals.success = req.flash("success");
    // console.log(res.locals.success);
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
})
       //Routes listing and reviews
    app.use("/listings", listingsRouter);
    app.use("/listings/:id/reviews", ReviewsRouter);
    app.use('/', userRouter);



    // app.get("/", (req,res) =>{
    //     res.render("home");
    // });

    app.all("*", (req,res,next)=>
        {
            next(new ExpressError(404,"Page Not Found"));
        });

    app.use((err, req,res,next) =>
        {
            let {status = 500, message = "Something went wrong"} = err;

            res.status(status).render("error.ejs", {message});
            // res.send("something went wrong");
        });

    app.listen(port, ()=>
        {
            console.log(`server is listing to the port ${port}`);
        });