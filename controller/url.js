const shortid = require("shortid");
const URL = require('../model/url');


async function handleGenerateNewShortURL(req , res){
    const body = req.body;
    if(!body.url) return res.status(400).json({ error : 'Url is Required' });
    const shortId = shortid();


    await URL.create({
        shortId : shortId ,
        redirectURL : body.url, 
        visitHistory : [] ,
        createdBy : req.user._id,
        
    });

    return res.render("home" , {
        id: shortId,
    })
   
} 

async function handleGetAnalytics(req , res){
        const shortId = req.params.shortId;
        const result = await URL.findOne({ shortId });
        return res.json({
            totalClicks : result.visitHistory.length,
            analytics : result.visitHistory,
        })
    }




module.exports = {
    handleGenerateNewShortURL,
    handleGetAnalytics ,
}