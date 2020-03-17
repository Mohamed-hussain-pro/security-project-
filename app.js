//jshint esversion:6
require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
var encrypt = require('mongoose-encryption');


const app = express()

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
    extended: true
    
}));

mongoose.connect("mongodb://localhost:27017",{useNewUrlParser: true,useUnifiedTopology: true});

const userSchema =new mongoose.Schema({
    email: String,
    password: String
});



userSchema.plugin(encrypt, {secret:process.env.SECRET, encryptedFields: ['password']  });
// This adds _ct and _ac fields to the schema, as well as pre 'init' and pre 'save' middleware,
// and encrypt, decrypt, sign, and authenticate instance methods

const User = new mongoose.model("User", userSchema)

app.get("/", (req, res) => {
    res.render("home")
})
app.get("/login", (req, res) => {
    res.render("login")
})
app.get("/register", (req, res) => {
    res.render("register")
})

app.post("/register", (req,res)=>{
    const NewUser =new User({
        email:req.body.username,
        password:req.body.password
    })
    
    NewUser.save((err)=>{
        if(!err){
            res.render("secrets")
            
        }else{
            console.log(err)
        }
    })
});

app.post("/login", (req,res)=> {
    const userName = req.body.username;
    const password = req.body.password;
    User.findOne({
        email:userName
    }, (err, foundUser)=> {
        if(err){
            res.send("errororororororrrrooo")
            
        }else{
            if(foundUser){
                if(foundUser.password === password ){
                    res.render("secrets")
                }
            }
            
        }
    })
});

app.listen(3000, (req, res) => {
    console.log("Server started on port 3000.")
})
