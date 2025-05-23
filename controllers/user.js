const User = require("../models/user.js");

// Sign up Form 

        function renderSignUpForm (req,res) {
            res.render("users/signup.ejs");
        };

// // Sign up 

        async function signup (req,res) {
            
            try{
                let {username, email, password}= req.body;
                const newUser =  new User ({email, username});
                const registerUser = await User.register(newUser, password);
                // console.log(registerUser);
                req.login(registerUser, (err) =>{
                    if(err){
                        return next(err);
                    }
                req.flash("success", "Welcome to wanderlust");
                res.redirect("/listings");
                })
                
            }catch(err){
                req.flash("error", err.message);
                res.redirect("/signup");
            }

        };


// login form

function renderLogInFrom (req,res) {
    res.render("users/login.ejs");
};



// LogIn 

async function afterLogin (req, res) {
    req.flash("success","Welcome back to wanderlust! You are logged in ");
    let redirectUrl = res.locals.redirectUrl || "/listings"
    res.redirect(redirectUrl);
};


// logout 

function logoutUser(req,res,next) {
    req.logout((err) =>{
        if(err){
            return next(err);
        }
        req.flash("success", "you are logged out!");
        res.redirect("/listings");
    })
};





// async function signup (req, res, next) {
//     try {
//         let { username, email, password } = req.body;

//         // 🛡️ Validate that no field is an array
//         if ([username, email, password].some(field => Array.isArray(field))) {
//             req.flash("error", "Invalid input: fields must not be arrays.");
//             return res.redirect("/signup");
//         }

//         const newUser = new User({ email, username });
//         const registerUser = await User.register(newUser, password);

//         req.login(registerUser, (err) => {
//             if (err) {
//                 return next(err);
//             }
//             req.flash("success", "Welcome to wanderlust");
//             res.redirect("/listings");
//         });

//     } catch (err) {
//         req.flash("error", err.message);
//         res.redirect("/signup");
//     }
// }

module.exports={renderSignUpForm, signup, renderLogInFrom, afterLogin, logoutUser};