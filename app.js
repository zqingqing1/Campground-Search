var express      =require("express"),
    app          =express(),
    bodyparser   =require("body-parser"),
    mongoose     =require("mongoose"),
    campground   =require("./models/campground"),
    comment      =require("./models/comment"),
    user         =require("./models/user"),
    seedDB       =require("./seeds"),
    passport     =require("passport"),
    LocalStrategy=require("passport-local"),
    methodOverride = require("method-override");
//Routes
var commentRoutes = require("./routes/comments"),
    campRoutes=require("./routes/campground"),
    authRoutes=require("./routes/index");


mongoose.connect("mongodb://localhost/camp_search");
app.use(bodyparser.urlencoded({extended: true}));
app.set("view engine","ejs");
app.use(express.static(__dirname+"/public"));
app.use(methodOverride("_method"));
seedDB();

//passpost config
app.use(require("express-session")({
    secret:"secret",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

app.use(function(req,res,next){
    res.locals.currentUser=req.user;
    next();
});

app.use(authRoutes);
app.use(campRoutes);
app.use(commentRoutes);

app.listen(process.env.PORT,process.env.IP,function(){
    console.log("Camp Search app Just started");
});

