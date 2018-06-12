// Require the Express Module
var express = require('express');
// Create an Express App
var app = express();
//WE GOT MONGOOSE UP IN DIS BITCH
var mongoose = require('mongoose');
// Require body-parser (to receive post data from clients)
// This is how we connect to the mongodb database using mongoose -- "basic_mongoose" is the name of
//   our db in mongodb -- this should match the name of the db you are going to use for your project.
mongoose.connect('mongodb://localhost/quoting_dojo');
var QuoteSchema = new mongoose.Schema({
    name:  { type: String, required: true, minlength: 2},
    content: { type: String, min: 1, max: 300 },
}, {timestamps: true });
   mongoose.model('Quote', QuoteSchema); 
   var Quote = mongoose.model('Quote') 
mongoose.Promise = global.Promise;
//SESSION
var session = require('express-session');
app.use(session({
    secret: 'keyboardkitteh',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 },
  }))
  //BODY PARSER
var bodyParser = require('body-parser');
const flash = require('express-flash');
app.use(flash());
// Integrate body-parser with our App
app.use(bodyParser.urlencoded({ extended: true }));
// Require path
var path = require('path');
// Setting our Static Folder Directory
app.use(express.static(path.join(__dirname, './static')));
// Setting our Views Folder Directory
app.set('views', path.join(__dirname, './views'));
// Setting our View Engine set to EJS
app.set('view engine', 'ejs');
// Routes
// Root Request

app.get('/', function(req, res) {
    // This is where we will retrieve the users from the database and include them in the view page we will be rendering.
  
        res.render('index');
    })

app.post('/quotes', function(req, res){
    console.log("POST DATA", req.body);
    var quote = new Quote({
        name: req.body.name,
        content: req.body.quote
    });
    quote.save(function(err){
        if(err){
            console.log('ERROR');
            for(var key in err.errors){
                req.flash('quote addition', err.errors[key].message);
            }
            console.log(err);
            res.redirect('/')
        }
        else{
            console.log('successfully added quote');
            var quotes;
            Quote.find({}, function(err,quotes){
                if(err){
                    console.log('Error Importing Quotes')
                }
                else{
                    quotes = quotes;
                    console.log(quotes);
                }
                res.render('quotes', {quotes:quotes});
            })
        }
    })
})

app.get('/quotes', function(req, res) {
    var quotes;
            Quote.find({}, function(err,quotes){
                if(err){
                    console.log('Error Importing Quotes')
                }
                else{
                    quotes = quotes;
                    console.log(quotes);
                }
                res.render('quotes', {quotes:quotes});
            })
    })


app.listen(8000, function() {
    console.log("listening on port 8000");
})
    