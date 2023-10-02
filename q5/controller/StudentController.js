
const Student = require("../model/Student")
exports.addStudent = ( (req, res) => {
    const { name,semester,email,phone } = req.body;

    const newStudent = new Student({ name,email,phone,semester });

    newStudent.save().then((student) => {
       
            console.log('Student added:', student);
            res.json({success:true,data:null,message:"added succesfully"})

    }).catch(err=>{
        console.error(err);
        res.json({success:false,data:null,message:"Error occured"})
    });
});


exports.getStudents = ( (req, res) => {
    
    
    Student.find().then((students) => {
        
        res.json({success:true,data:{students:students},message:""})

        
    }).catch((err)=>{
        console.error(err);
        res.json({success:false,data:null,message:"Error occured"})
    });
});

exports.deleteStudent = ( (req, res) => {

    Student.findByIdAndDelete(req.params.id).then((students) => {
                    // res.json({success:true,data:null,message:"Deleted successfully"})

            res.redirect("/dashboard.html")

    }).catch((err)=>{
        console.error(err);
        res.json({success:false,data:null,message:"Error occured"})
    });
});

exports.editStudent = ( (req, res) => {
    Student.findById(req.params.id).then((student) => {
        if(student){
            res.json({success:true,data:{student:student},message:""})
        }
        else{
            res.json({success:false,data:null,message:"Error occured"})
        }
    }).catch((err)=>{
        console.error(err);
        res.json({success:false,data:null,message:"Error occured"})
    });
});

exports.updateStudent = ( (req, res) => {

    const { name,semester,email,phone } = req.body;
    console.log("===> id",req.params.id,req.body)
    Student.findByIdAndUpdate(req.params.id,{ name,email,phone,semester }).then((student) => {
        res.json({success:true,data:null,message:"updated successfully"})
    }).catch((err)=>{
        console.error(err);
        res.json({success:false,data:null,message:"Error occured"})
    });
});