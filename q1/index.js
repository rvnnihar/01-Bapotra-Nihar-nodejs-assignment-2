const express = require('express');
const path = require('path')
var mysql = require('mysql');
const multer = require('multer');


const app = express();
app.use(express.static(path.join(__dirname, 'public')))
// app.use(express.json());
app.use(express.urlencoded({ extended: true }));

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database:"sem_7_ass_2"
});

con.connect(function(err) {
    if (err) throw "Connection refused";
    else     console.log("Connected!");
});

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/uploads/')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, uniqueSuffix +"-" + file.originalname + '-'+ path.extname(file.originalname))
    }
  })
  
  const upload = multer({ storage: storage });


app.post("/registration",
    upload.fields([{
        name: 'profile', maxCount: 1
    }, {
        name: 'certificates', maxCount: 5
    }]),
    (req,res)=>{
        if (Object.keys(req.files['certificates']).length > 2) {
            return res.json({"success":false,message:"Too many files selected. Maximum allowed is 2."});
        }
    

    con.query(`Select user_id from users where email="${req.body.email}"`,function(err,result,fields){
        // console.log(result.length)
        if(err){
            res.json({"success":false,message:"Error Accur :"+ err?.message});
        }
        else{
            if(result.length){
                res.json({"success":false,message:"Email already exists"});
            }
            else{
                con.query(`insert into users(name,email,password,state,profile) values ("${req.body.name}","${req.body.email}","${req.body.password}","${req.body.state}","${req.files['profile'][0].filename}")`,function(err,result,fields){
                    if(err){
                        console.log(err)
                        res.json({"success":false,message:"Error Accur :"+ err?.message});
                    }
                    else{
                        if(result.insertId){
                            req.files['certificates'].forEach((data)=>{
                                con.query(`INSERT INTO certificates (user_id, file_name) VALUES (${result.insertId},"${data.filename}")`)
                            })
                            res.json({"success":true,message:"Done"});
                        }
                    }
                })
            }
        }
        
    });
    
    
})
app.listen(3000,()=>{

    
    console.log("app listen on port 3000");
})

