var express=require("express");
var router=express.Router();
var campground = require("../models/campground");
var geocoder = require("geocoder");

//campgound route

//show all campground
router.get("/campgrounds",function(req,res){
    campground.find({},function(error,allcampgrounds){
        if(error){
            console.log(error);
        }
        else{
            res.render("campgrounds/index",{campground: allcampgrounds});
        }
    });
});

// add new camp route
router.get("/campgrounds/new",isLoggedIn, function(req,res){
    res.render("campgrounds/new");
});

//campground created
router.post("/campgrounds",isLoggedIn,function(req,res){
    //get data from form and add to campground array
    //   campground.push({name:req.body.name, img: req.body.img});
    var name = req.body.name
    var img =req.body.img
    var desc = req.body.desc
    var price = req.body.price
    var author={
        id:req.user._id,
        username:req.user.username
    }
   
   geocoder.geocode(req.body.location, function(err,data){
       var lat=data.results[0].geometry.location.lat;
       var lng=data.results[0].geometry.location.lng;
       var location = data.results[0].formatted_address;
       var newC = {name:name, img:img, desc:desc,author:author,location:location,lat:lat,lng:lng,price:price};
       campground.create(newC, function(error,newcamp){
           if(error){
               console.log(error);
           }
           else{
               console.log(newC);
               res.redirect("/campgrounds");
           }
        });
   });
});



//show particular camp
router.get("/campgrounds/:id",function(req,res){
    campground.findById(req.params.id).populate("comments").exec(function(error,cp){
        if(error){
            console.log(error);
        }
        else{
            res.render("campgrounds/show",{campground:cp});
        }
        
    });

});


//Edit camp
router.get("/campgrounds/:id/edit",checkOwnership,function(req,res){
        campground.findById(req.params.id,function(foundCamp){
            res.render("campgrounds/edit",{campgrounds:foundCamp})
        });
});

//update camp
router.put("/campgrounds/:id/",checkOwnership,function(req,res){
    //find and update
    //redirect
    geocoder.geocode(req.body.location, function(err,data){
       var lat=data.results[0].geometry.location.lat;
       var lng=data.results[0].geometry.location.lng;
       var location = data.results[0].formatted_address;
       var newC = {name:req.body.name, img:req.body.img, desc:req.body.desc,location:location,lat:lat,lng:lng,price:req.body.price};
        campground.findByIdAndUpdate(req.params.id,{$set:newC},function(err,updated){
            if(err){
                req.flash("error",err.message);
                res.redirect("/campgrounds");
            }else{
                req.flash("success","Successfully updated!");
                res.redirect("/campgrounds/"+req.params.id);
            }
        });
    });
});

//destory camp
router.delete("/campgrounds/:id",checkOwnership,function(req,res){
    campground.findByIdAndRemove(req.params.id,function(err){
        if(err){
             req.flash("error",err.message);
            res.redirect("/campgrounds");
        }else{
            req.flash("success","Successfully deleted!");
            res.redirect("/campgrounds");
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
        campground.findById(req.params.id,function(err,foundCamp){
        if(err){
            req.flash("error","Campground not found!");
            res.redirect("back");
        }else{
            //does user own the camp?
            if(foundCamp.author.id.equals(req.user._id)||req.user.isAdmin){
                next();
            }else{
                req.flash("error","You don't have the permission to do that!");
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