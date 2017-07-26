var express=require("express");
var router=express.Router();
var campground = require("../models/campground");
var comment = require("../models/comment");

//comment route
//add new comment to particular camp
router.get("/campgrounds/:id/comments/new",isLoggedIn,function(req,res){
    campground.findById(req.params.id,function(error,campground){
        if(error) console.log(error);
        else{
            res.render("comments/new",{campground:campground});
        }
    })
});

//new comment to particular camp created
router.post("/campgrounds/:id/comments",isLoggedIn,function(req, res) {
    campground.findById(req.params.id,function(error, campground) {
        if(error){
            console.log(error);
            res.redirect("/campgrounds");
        }
        else{
            comment.create(req.body.comment,function(error,comment){
                if(error){
                    console.log(error);
                }
                else{
                    //add username and id to comment
                    comment.author.id=req.user._id;
                    comment.author.username=req.user.username;
                    //save comment
                    comment.save();
                    
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect("/campgrounds/"+campground._id);
                }
            });
        }
    });
});

//middleware
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;