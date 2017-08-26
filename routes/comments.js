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
                    req.flash("success","Successfully created new comment!");
                    res.redirect("/campgrounds/"+campground._id);
                }
            });
        }
    });
});

//edit comment
router.get("/campgrounds/:id/comments/:comment_id/edit",checkOwnership,function(req,res){
        comment.findById(req.params.comment_id,function(err,foundComment){
            if(err){
                req.flash("error",err.message);
                res.redirect("back");
            }else
                res.render("comments/edit",{campground_id:req.params.id, comment:foundComment})
        });
});

//update comment
router.put("/campgrounds/:id/comments/:comment_id/",checkOwnership,function(req,res){
    comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,newComment){
        if(err){
            req.flash("error",err.message);
            res.redirect("back");
        }else{
            req.flash("success","Successfully edited comments!");
            res.redirect("/campgrounds/"+req.params.id);
        }
    });
});

//destory comment
router.delete("/campgrounds/:id/comments/:comment_id/",checkOwnership,function(req,res){
    comment.findByIdAndRemove(req.params.comment_id,function(err){
        if(err){
            req.flash("error",err.message);
            res.redirect("/campgrounds/"+req.params.id);
        }else{
            req.flash("success","Successfully deleted comments!");
            res.redirect("/campgrounds/"+req.params.id);
        }
    })
});
//middleware
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error","Hi there, please login first!");
    res.redirect("/login");
}


function checkOwnership(req,res,next){
    //user login?
    if(req.isAuthenticated()){
        comment.findById(req.params.comment_id,function(err,foundcomment){
        if(err){
            req.flash("error","Comment not found!");
            res.redirect("back");
        }else{
            //does user own the camp?
            if(foundcomment.author.id.equals(req.user._id)||req.user.isAdmin){
                next();
            }else{
                req.flash("error","You don't have the permission to edit comment!");
                res.redirect("back");
            }
        }
    });
    }else{
        req.flash("error","Hi there, please login first!");
        res.redirect("/login");
    }
};

module.exports = router;