var express=require("express");
var router=express.Router();
var user = require("../models/user");
var passport = require("passport");

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
    var newuser=new user({username:req.body.username});
    user.register(newuser, req.body.password,function(error,user){
        if(error){
            console.log(error);
            return res.redirect("register");
        }
        passport.authenticate("local")(req,res,function(){
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
    failureRedirect: "/login"
    }),function(req,res){
});

//logout routes
router.get("/logout",function(req, res) {
    req.logout();
    res.redirect("/campgrounds");
});

//middleware
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;