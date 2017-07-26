var mongoose = require("mongoose"),
    campground=require("./models/campground"),
    comment=require("./models/comment");
    
var data= [
    {
        name:"BigSur Campground",
        img: "http://www.yellowstonenationalparklodges.com/wp-content/gallery/madison-campground/madison-campground-9.jpg",
        desc: "Big Sur Campground & Cabins offers camping and lodging with the emphasis on Family. Enjoy tent and RV camping on the forest floor as you watch the kids inner tube by in the cool water. Or pamper your family in one of several styles of cabins, from rustic camping cabins to fully equipped cabins with kitchens and fireplaces."
    },
    {
        name:"Madsion Campground",
        img:"http://www.yellowstonenationalparklodges.com/wp-content/gallery/madison-campground/madison-campground-11.jpg",
        des:"There are over 270 individual sites and 3 group sites. The campground can accommodate RVs and tents. Campsites for hikers and cyclists are also available. Each site includes a picnic table and fire grate. Access to water is nearby the sites."
    },
    {
        name:"Toyon Campground",
        img:"http://www.yellowstonenationalparklodges.com/wp-content/gallery/madison-campground/madison-campground-3.jpg",
        des:"By reservation only, this camping area accommodates 50 people and is open from the 2nd Sunday in May to the 3rd Sunday in October. Campfires require a permit. Site has 16 picnic tables, 7 BBQ's, water faucet and fountain, and has nearby restrooms."
    },
    {
        name:"Del Valle Regional Park",
        img:"http://www.yellowstonenationalparklodges.com/wp-content/gallery/madison-campground/madison-campground-17.jpg",
        des:"Deep in a valley framed by oak-covered hills, with sailboats and sailboards skimming over its waters, Del Valle is like a lakeside resort only 10 miles south of Livermore."
    }
    
]

function seedDB(){
    campground.remove({},function(error){
        if(error) console.log(error);
        data.forEach(function(seed){
            campground.create(seed,function(error,cp){
                if(error) console.log(error);
                else{
                    console.log("create a new camp");
                    // comment.create({
                    //     text:"really great place",
                    //     author: "qing"
                    // }, function(error,comment){
                    //     if(error) console.log(error);
                    //     else{
                    //         cp.comments.push(comment);
                    //         cp.save();
                    //         console.log("new comment");
                    //     }
                    // });
                }
            });
        });
    });
}

module.exports=seedDB;