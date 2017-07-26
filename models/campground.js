var mongoose=require("mongoose");

var campSchema=new mongoose.Schema({
    name: String,
    img: String,
    desc: String,
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