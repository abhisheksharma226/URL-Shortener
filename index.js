const express = require("express");
const path = require("path");
const { connectToMongoDB} = require("./connect");
const cookieParser = require('cookie-parser');
const { restrictToLoggedInUserOnly , checkAuth } = require('./middleware/auth');

const URL = require("./model/url")

const urlRoute = require("./routes/url");
const staticRouter = require("./routes/staticRouter");
const userRoute = require("./routes/user");

const app = express();
const PORT = 8000;

connectToMongoDB("mongodb://127.0.0.1:27017/short-url")
.then(() => console.log("mongodb connected"));


app.set("view engine" , "ejs");
app.set("views" , path.resolve("./views"));


app.use(express.json());
app.use(express.urlencoded({ extended : false }))
app.use(cookieParser());



app.get("/test" , async (req , res) => {
    const allUrls = await URL.find({});
    return res.render('home' , {
        urls : allUrls,
        
    });
})



app.use("/url" , restrictToLoggedInUserOnly, urlRoute);
app.use("/user" ,  userRoute);
app.use("/" , checkAuth , staticRouter);

app.get("/url/:shortId" , async(req , res) => {
    const shortId = req.params.shortId;
     const entry = await URL.findOneAndUpdate({
        shortId
    } , {$push : {
        visitHistory : {
            timestamp : Date.now(),
        }
    }})

    res.redirect(entry.redirectURL)
})

app.listen(PORT  , ()=> {
    console.log(`Server Started at ${PORT}`);
})