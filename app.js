const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const nodemailer = require("nodemailer");

const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect("mongodb://localhost:27017/ERPdb", {
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

app.get("/", (req, res) => {

  // Reading data from the database
  User.find((err, data) => {
    if(err){
      console.log(err);
    } else {
      if(msg === 1) {
        res.render("dashboard", {peopleDataList: data, danger: "block"});
        msg=0;
      } else {
        res.render("dashboard", {peopleDataList: data, danger: "none"});
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
  let temp1 = [];
  let result = [];
  text = req.body.sendEmail;
  if(Array.isArray(text)) {
    text.forEach((item,index) => {
      temp = temp + "," + item.split(",");
    });
    temp1=temp.split(",");
    for(var i=1;i<temp1.length;i++) {
      result = result + temp1[i] + "\n";
    }
  } else {
    result = text;
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'tjsg1022@gmail.com',
      pass: '2201gsjt'
    }
  });

  const mailOptions = {
    from: 'tjsg1022@gmail.com',
    to: 'jain2015tanmay@gmail.com',
    subject: 'ERP System',
    text: result
  };

  // if(result) {
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  // }

  res.redirect("/");

});

app.listen(5000, () => {
  console.log("Server started at port 5000.");
});
