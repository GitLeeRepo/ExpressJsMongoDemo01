/* This code is base on the Express Crash Course YouTube video
 * https://www.youtube.com/watch?v=gnsO8-xJ8rs
 * By Traversy Media
 */

var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var expressValidator = require('express-validator');
var mongojs = require('mongojs');

var app = express();
var db = mongojs('customerapp', ['users']);
var ObjectId = mongojs.ObjectId;


/* ===== Middleware ===== */

// custom middleware
var logger = function(req, res, next) {
    console.log('Logging...');
    next();
}
app.use(logger);

// body-parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

// static folder middleware
app.use(express.static(path.join(__dirname, 'public')));

// set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Global Var middleware for Express Validator
app.use(function(req, res, next){
    // define errors to be globally accessible through res
    res.locals.errors = null; 
    next();
});

// Exress validator middleware
app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.')
        , root    = namespace.shift()
        , formParam = root;
  
      while(namespace.length) {
        formParam += '[' + namespace.shift() + ']';
      }
      return {
        param : formParam,
        msg   : msg,
        value : value
      };
    }
  }));


/* ===== Route handlers ===== */

// handling GET requests to document root, 
// you would use post for POST requests
app.get('/', function(req, res){
    db.users.find(function (err, docs) {
        res.render('index', { title:"Users",
            users: docs });
    });

})

app.post('/users/add', function(req, res) {

    req.checkBody('first_name', 'First Name is required').notEmpty();
    req.checkBody('last_name', 'Last Name is required').notEmpty();
    req.checkBody('email', 'Email is required').notEmpty();

    var errors = req.validationErrors();

    if (errors) {
        console.log('ERRORS');
        res.render('index', 
        { 
            title:"Users",
            users: users,
            errors: errors 
        }); 
    }
    else {
        var newUser = {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email
        }
        db.users.insert(newUser, function(err, result){
            if (err) {
                console.log(err);
            }
            res.redirect('/');
        });
        console.log('SUCCESS');        
    }
})

app.delete('/users/delete/:id', function(req, res){
    db.users.remove({ _id: ObjectId(req.params.id)}, function(err, result){
        if (err){
            console.log(err);
        }
    });
    res.redirect('/');
    console.log(req.params.id);
})

/* ----- Listener ----- */

app.listen(3000, function() {
    console.log('Server started on port 3000');
})

// Initial Test data - not used after connecting to MongoDB
var users = [
    { 
      id: 1,
      first_name: 'John',
      last_name: 'Doe',
      email: 'jdoe@example.com'
    },
    { 
        id: 2,
        first_name: 'Bill',
        last_name: 'Will',
        email: 'bwill@example.com'
      },
      { 
        id: 3,
        first_name: 'Megan',
        last_name: 'Flower',
        email: 'mflower@example.com'
      }
];
