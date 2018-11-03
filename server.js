 var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");

var db = require("./models");

var PORT = 3000;
var app = express();
serveStatic = require('serve-static');


// Connect to the Mongo DB
mongoose.Promise = Promise;
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
mongoose.connect(MONGODB_URI);

// Handlebars
var handlebars = require("handlebars");
var exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars")
handlebars.registerHelper("json", context => JSON.stringify(context));
app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Routes
app.get("/scrape", function(req, res) {
  
    axios.get("https://www.nytimes.com/section/sports/basketball").then(function(response) {
    var $ = cheerio.load(response.data);
      $(".story-body").each(function(i, element) {
      var result = []

      result.title = $(element).find("h2.headline").text()
      result.story = $(element).find("p.summary").text()
      result.link = $(element).children("a").attr("href");

    //  console.log(result.title)
    //  console.log(result.body);
    //  console.log(result.link)
    // console.log(result)
      db.Article.create(result)
        .then(function(dbArticle) {
          // console.log(dbArticle)
        })
        .catch(function(err) {
                return res.json(err);
        });
      });
    });
    res.redirect("/");
});

app.get("/", function(req, res) {

  db.Article.find({saved: false}, function(err, result){
    if(err){
    } 
    else{
      var object = {
        data: result
      };
      // console.log(data[0])
      res.render("index", object)
    }
  }) 
});

app.get("/saved", function(req, res) {
  
  db.Article.find({saved: true}, function(err, result){
    if(err){
    } 
    else{
      var object = {
        data: result
      };
      // console.log(data[0])
      res.render("save", object)
    }
  }) 
});

app.delete("/deletearticles/:id", function (req, res) {

  db.Article.findOneAndRemove({ _id: req.params.id })
    .then(function (result) {
      res.json(result);
    })
    .catch(function (err) {
      res.json(err);
    });
});


app.put("/savedarticles/:id", function (req, res) {
  
  db.Article.findOneAndUpdate({ _id: req.params.id }, { saved: true })
  .then(function (result) {
    res.json(result);
  })
  .catch(function (err) {
    res.json(err);
  });
})

app.put("/unsavedarticles/:id", function (req, res) {

  db.Article.findOneAndUpdate({ _id: req.params.id }, { saved: false })
    .then(function (result) {
      res.json(result);
    })
    .catch(function (err) {
      res.json(err);
    });
});


app.get("/articles/:id", function(req, res) {

  db.Article.findOne({ _id: req.params.id })
    .populate("note")
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {

      res.json(err);
    });
});

app.post("/articles/:id", function(req, res) {

  db.Note.create(req.body)
    .then(function(dbNote) {
      return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
    })
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

// app.use(serveStatic("../angularjs"));

app.listen(process.env.PORT || 5000), function() {
  console.log("App running on port " + PORT + "!");
};

// app.listen(8180);
// app.listen(5000);
