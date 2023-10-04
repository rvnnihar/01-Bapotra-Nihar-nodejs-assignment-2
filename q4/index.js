const express = require('express');
const mongoose = require('mongoose');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const UserController = require('./controller/UserController');
const User = require('./model/User');
const dotenv = require('dotenv').config() 
const bcrypt = require('bcrypt'); 
const { getStudents, addStudent, deleteStudent, editStudent, updateStudent } = require('./controller/StudentController');

const app = express();
const port = process.env.PORT || 3000;
const router =  express.Router();
// Connect to your MongoDB database
mongoose.connect('mongodb://localhost:27017/db_q4', { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.use(cookieParser());
app.use(session({ secret: process.env.JWT_SECRET, resave: true, saveUninitialized: true }));




function verifyToken(req,res,next){
  const token = req.session.token;

  if (!token) {
    return res.redirect("/");
  }

  // Verify the token
  jwt.verify(token, 'your-secret-key', (err, decoded) => {
    if (err) {
        return res.redirect("/");
    }
    next();
    
  });
}

app.get("/", async (req,res)=>{
  // const user =  new User({
  //   username : "admin",
  //   email : "admin@gmail.com",
  //   password : await bcrypt.hash("Admin@123", 10)
  // })
  // await user.save(); 
  res.render("login");
});
app.post("/login", UserController.login);

app.get("/students/add",verifyToken, (req,res)=>{
  res.render("add-student");
});
app.post("/students/add",verifyToken, addStudent);
app.get("/students",verifyToken, getStudents);
app.get("/students/edit/:id",verifyToken, editStudent);
app.post("/students/update/:id",verifyToken, updateStudent);
app.get("/students/delete/:id",verifyToken, deleteStudent);
app.get("/logout",verifyToken, UserController.logout);


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
