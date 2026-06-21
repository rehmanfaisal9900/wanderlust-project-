if(process.env.NODE_ENV !="production"){
  require("dotenv").config();
};

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utills/ExpressError.js");
const { send } = require("process");
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const session = require("express-session");
const {MongoStore} = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const user = require("./models/user.js");
const userRouter = require("./routes/user.js");


const dbUrl = process.env.ATLASDB_URL;
main().then(res =>{
    console.log("connection succesful");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect(dbUrl);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));



const store = new MongoStore({
  mongoUrl : dbUrl,
  crypto : {
    secret : process.env.SECRET,
  touchAfter : 24 * 3600,
  }
});


store.on("error" , () => {
   console.log("session error",error);
})

  const sessionOptions= {
    store,
   secret : process.env.SECRET,
   resave : false,
   saveUninitialized : true,
   cookie : {
    expires : Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge : 7 * 24 * 60 * 60 * 1000,
    httpOnly :true
   }
  }


// flash
app.use(session(sessionOptions));
app.use(flash());

// passport 

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(user.authenticate()));

passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());


app.use((req,res,next) =>{
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
})


// routers 
app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);

// middlewares
app.use((req, res, next) => {
    next(new ExpressError(404, "page not found!"));
});

app.use((err, req, res, next)=>{
    let {statusCode=500, message = "something went wrong "} = err ; // 505 ko standard 500 kar diya
    res.status(statusCode).render("error.ejs",{message});
});

app.listen(8080,()=>{
    console.log("port is listening on 8080");
});