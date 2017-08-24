var express=require("express");
var router=express.Router();
var user = require("../models/user");
var passport = require("passport");
var campground = require("../models/campground");

//index route
router.get("/",function(req,res){
    res.render("landing");
});

//AUTH routes
//show register from
router.get("/register",function(req,res){
    res.render("register");
} );

//create new user
router.post("/register", function(req,res){
    var newuser=new user({
        username:req.body.username,
        firstName:req.body.firstName,
        lastName:req.body.lastName,
        email:req.body.email,
        image:req.body.image
    });
    if(req.body.AdminCode==='secretcode'){
        newuser.isAdmin=true;
    }
    //console.log(newuser.isAdmin);
    user.register(newuser, req.body.password,function(error,user){
        if(error){
            //req.flash("error",error.message);
            return res.redirect("register",{error:error.message});
        }
        passport.authenticate("local")(req,res,function(){
            req.flash("success","Welcome to WeCamp, "+newuser.username);
            res.redirect("/campgrounds");
        });
    });
});

// login route
router.get("/login",function(req,res){
    res.render("login");
})

//logined
router.post("/login", passport.authenticate("local",{
    successRedirect: "/campgrounds",
    failureRedirect: "/login",
    failureFalsh:true,
    successFlash:'Welcome to WeCamp!'
    }),function(req,res){
});

//logout routes
router.get("/logout",function(req, res) {
    req.logout();
    req.flash("success","You logged out successfully");
    res.redirect("/campgrounds");
});


//user profile
router.get("/users/:id",function(req,res){
    user.findById(req.params.id,function(err,founduser){
        if(err){
            req.flash("error","Something went wrong!!");
            req.redirect("/");
        }
        campground.find().where('author.id').equals(founduser._id).exec(function(err,campgrounds){
           if(err){
                req.flash("error","Something went wrong!!");
                req.redirect("/");
            } 
            res.render("users/show",{user:founduser,campgrounds:campgrounds});
        })
        
    });
});


//middleware
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error","Please login first!");
    res.redirect("/login");
}

module.exports = router;