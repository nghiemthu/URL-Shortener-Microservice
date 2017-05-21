var express = require("express");
var shortid = require("shortid");
var mongoose = require("mongoose");

var app = express();
app.set("view engine", "ejs");

mongoose.connect("mongodb://Thu:Thu12345@ds147821.mlab.com:47821/url-shorten");

var ulrSchema = new mongoose.Schema({
    original_url: String,
    short_url: String
});
var URL = mongoose.model("url", ulrSchema);

//Homepage
app.get("/home", function(req, res){
    res.render("index");
});

//Get id
app.get("/:id", function(req, res){
    
    var id = req.params.id;
    var shortUrl = "https://shorten-url-thunghiem.herokuapp.com/" + id;
    
    URL.find({short_url: shortUrl}, function(err, urls){
        if (err) throw err;
        else {
            if (urls.length > 0){
                res.redirect(urls[0].original_url);
            }
            else
                res.send({error: "URL not exist"});
        }
    });
});

//If the input is not id
app.get("/*", function(req, res){
    var url = req.originalUrl.substring(1);
    
    if (!isURL(url)){
        res.send({error: "Not valid url"});
    } else {
        URL.find({original_url: url}, function(err, urls){
            if (err) throw err;
            else {
                if (urls.length > 0){
                    res.send(urls[0]);
                } else {
                    // Else we create new short url and add to the database
                    var shortUrl = "https://api-project-freecodecamp-thunghiem.c9users.io/" + shortid.generate();
                    
                    //Save to database
                    URL.create({
                        original_url: url,
                        short_url: shortUrl
                    },function(err, url){
                        if (err) throw err;
                        else {
                            res.send(url);
                        }
                    });
                }
            }
        });
    }
});

//Function 
 function isURL(str) {
     var urlRegex = '^(?!mailto:)(?:(?:http|https|ftp)://)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?$';
     var url = new RegExp(urlRegex, 'i');
     return str.length < 2083 && url.test(str);
}


// Start server
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server stated!");
});