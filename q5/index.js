const express = require('express');
const mongoose = require('mongoose');
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

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(express.static(__dirname + '/public'));




function verifyToken(req,res,next){
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(401).json({message:"unauthorized"});
  }

  // Verify the token
  jwt.verify(token, 'your-secret-key', (err, decoded) => {
    if (err) {
       return res.status(401).json({message:"unauthorized"});
    }
    next();
    
  });
}


app.post("/login", UserController.login);

app.get("/students/add",verifyToken, (req,res)=>{
  res.sendFile(__dirname + '/add-student.html');
});
app.post("/students/add",verifyToken, addStudent);
app.get("/students",verifyToken, getStudents);
app.get("/students/edit/:id",verifyToken, editStudent);
app.post("/students/update/:id",verifyToken, updateStudent);
app.get("/students/delete/:id", deleteStudent);


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
