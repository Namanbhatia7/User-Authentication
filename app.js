//jshint esversion:6

const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');

const app = express();

app.set('view engine','ejs')

app.use(express.static('public'));
app.use(bodyParser.urlencoded({
    extended: true
}))

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true})

app.get('/', (req,res) =>{
    res.render("Home")
})

app.get('/login', (req,res) =>{
    res.render("Login")
})

app.get('/register', (req,res) =>{
    res.render("Register")
})

app.listen(3000,() => {
    console.log("Server running on port 3000")
})


