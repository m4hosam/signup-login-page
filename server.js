const express = require("express");
const app = express();
const bodyParser = require("body-parser")

const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/signup", { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Conneccted To DataBase')
    })
    .catch(er => {
        console.log('Connection Error To DataBase')
    });

// next line to enable views directory
app.set('view engine', 'ejs');
// important to make bodyParser work effieciently
app.use(bodyParser.urlencoded({ extended: true }));
// access any other files withen ejs(css js images) to public directory
app.use(express.static("public"))

const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
})


const User = mongoose.model("User", UserSchema);


app.get("/", function (req, res) {
    res.render("index");
})

app.post("/signup", function (req, res) {
    const new_user = new User({
        name: req.body.username,
        email: req.body.email,
        password: req.body.password
    })
    new_user.save()
    res.render("success")
})

app.post("/login", async function (req, res) {
    User.find({ email: req.body.email, password: req.body.password }, function (err, data) {
        if (err)
            console.log(err)
        else if (data.length != 0) {
            res.render("login", { docs: data[0] });
        }
        else
            res.render("failure")
    });
})

app.get("/data", async function (req, res) {
    User.find({}, function (err, data) {
        if (err)
            console.log(err)
        else if (data.length != 0) {
            res.render("data", { data: data });
        }
        else
            res.render("failure")
    });
})


app.listen(3000, function () {
    console.log("Connected To The Server");
})