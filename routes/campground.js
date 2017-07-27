var express=require("express");
var router=express.Router();
var campground = require("../models/campground");

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
   var author={
       id:req.user._id,
       username:req.user.username
   }
   campground.create({name:req.body.name, img: req.body.img, desc:req.body.desc,author:author},
       function(error,newcamp){
           if(error){
               console.log(error);
           }
           else{
               res.redirect("/campgrounds");
           }
        }
    );
   
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
router.get("/campgrounds/:id/edit",function(req,res){
    campground.findById(req.params.id,function(err,foundCamp){
        if(err){
            res.redirect("/campgrounds");
        }else{
            res.render("campgrounds/edit",{campgrounds:foundCamp});
        }
    });
   
});

//update camp
router.put("/campgrounds/:id/",function(req,res){
    //find and update
    //redirect
    campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,updated){
        if(err){
            res.redirect("/campgrounds");
        }else{
            res.redirect("/campgrounds/"+req.params.id);
        }
    })
});

//destory camp
router.delete("/campgrounds/:id",function(req,res){
    campground.findByIdAndRemove(req.params.id,function(err){
        if(err){
            res.redirect("/campgrounds");
        }else{
            res.redirect("/campgrounds");
        }
    })
});


//middleware
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;