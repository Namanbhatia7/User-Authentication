//jshint esversion:6
require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');

const app = express();

app.set('view engine','ejs')

app.use(express.static('public'));
app.use(bodyParser.urlencoded({
    extended: true
}))

app.use(session({
    secret: 'My business not yours',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true})
mongoose.set('useCreateIndex', true);

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

userSchema.plugin(passportLocalMongoose);

const User = new mongoose.model("User", userSchema);

passport.use(User.createStategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get('/', (req,res) =>{
    res.render("home")
})

app.get('/login', (req,res) =>{
    res.render("login")
})

app.get('/register', (req,res) =>{
    res.render("register")
})

app.post("/register", (req,res) => {
    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
        const newUser = new User({
            email: req.body.username,
            password: hash
        });
    
        newUser.save(function(err){
            if(!err){
                res.render("secrets");
            }
        })
    });
    
});

app.post("/login", (req,res) =>{
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({email:username}, (err,foundUser) => {
        if(err){
            console.log(err)
        }else{
            if(foundUser){
                bcrypt.compare(password, foundUser.password, function(err, result) {
                    if(result === true){
                        res.render("secrets")
                    }
                });  
            }
        }
    });
})

app.listen(3000,() => {
    console.log("Server running on port 3000")
})


