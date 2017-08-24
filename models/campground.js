var mongoose=require("mongoose");

var campSchema=new mongoose.Schema({
    name: String,
    price:String,
    img: String,
    desc: String,
    cost:Number,
    location:String,
    lat:Number,
    lng:Number,
    createdAt:{type:Date,default:Date.now},
    author:{
        id:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"user"
        },
        username:String
    },
    comments:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"comment"
        }
    ]
});

module.exports = mongoose.model("Compground",campSchema);