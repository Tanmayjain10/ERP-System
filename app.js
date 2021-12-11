const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect("mongodb+srv://TanmayJain:admin_tanmay@cluster0.bbyth.mongodb.net/ERPdb", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Mongoose Schema
const userSchema = new mongoose.Schema({
  name: "String",
  phoneNo: "Number",
  email: "String",
  hobbies: "String"
});

const User = new mongoose.model('User', userSchema);

let msg = 0;
let msg2 = 0;

app.get("/", (req, res) => {

  // Reading data from the database
  User.find((err, data) => {
    if(err){
      console.log(err);
    } else {
      if(msg === 1) {
        if(msg2 === 1)
          res.render("dashboard", {peopleDataList: data, danger: "block", sentEmail: "block"});
        else
          res.render("dashboard", {peopleDataList: data, danger: "block", sentEmail: "none"});
        msg=0;
        msg2=0;
      } else {
        if(msg2 === 1)
          res.render("dashboard", {peopleDataList: data, danger: "none", sentEmail: "block"});
        else
          res.render("dashboard", {peopleDataList: data, danger: "none", sentEmail: "none"});
        msg=0;
        msg2=0;
      }
    }
  });
});

app.post("/add", (req, res) => {

  // Checking if email already exists
  User.findOne({email: req.body.email}, (err,foundDuplicate) => {
    if(err) {
      console.log(err);
    } else {
      if(foundDuplicate) {
        msg = 1;
        res.redirect("/");
      } else {

        //Creating user in database
        var newUser = new User({
          name: req.body.name,
          phoneNo: req.body.phoneNo,
          email: req.body.email,
          hobbies: req.body.hobbies
        });
        newUser.save( err => {
          if(err){
            console.log(err);
          } else {
            res.redirect("/");
          }
        });
      }
    }
  });
});

app.post("/update", (req, res) => {

  //Updating the existing user
  User.updateOne({email: req.body.email}, {"$set" : {
    name: req.body.name,
    phoneNo: req.body.phoneNo,
    email: req.body.email,
    hobbies: req.body.hobbies
  }}, (err) => {
    if(err)
      console.log(err);
    else
      res.redirect("/");
  });
});

app.post("/delete", (req, res) => {
  let email = req.body.delete;
  console.log(email);
  User.deleteOne({ email : email}, (err)=> {
    if(err) {
      console.log(err);
    } else {
      res.redirect("/");
    }
  });
});

app.post("/sendEmail", (req, res) => {

  let text;
  let temp = [];
  let result = [];
  text = req.body.sendEmail;
  temp = text.split(",");
  for(var i=0;i<temp.length;i++) {
    result = result + temp[i] + "\n";
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'tjsg1022@gmail.com',
      pass: process.env.PASSWORD
    }
  });

  const mailOptions = {
    from: 'tjsg1022@gmail.com',
    to: 'jain2015tanmay@gmail.com',
    subject: 'ERP System',
    text: result
  };

  if(result) {
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        msg2=1;
        console.log('Email sent: ' + info.response);
      }
    });
  }

  setTimeout(function(){ res.redirect("/"); }, 5000);

});

app.listen(5000, () => {
  console.log("Server started at port 5000.");
});
