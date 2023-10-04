
const Student = require("../model/Student")
exports.addStudent = ( (req, res) => {
    const { name,semester,email,phone } = req.body;

    const newStudent = new Student({ name,email,phone,semester });

    newStudent.save().then((student) => {
       
            console.log('Student added:', student);
            res.redirect('/students'); 
        
    }).catch(err=>{
        console.error(err);
        res.redirect('/students/add'); 
    });
});


exports.getStudents = ( (req, res) => {
    
    
    Student.find().then((students) => {
        
            res.render("dashboard",{students:students})

        
    }).catch((err)=>{
        res.send(err.message)
    });
});

exports.deleteStudent = ( (req, res) => {

    Student.findByIdAndDelete(req.params.id).then((students) => {
            res.redirect("/students");
    }).catch((err)=>{
        res.redirect("/students");
    });
});

exports.editStudent = ( (req, res) => {
    Student.findById(req.params.id).then((student) => {
        if(student){
            res.render("edit-student",{student:student});
        }
        else{
            res.redirect("/students");
        }
    }).catch((err)=>{
        res.redirect("/students");
    });
});

exports.updateStudent = ( (req, res) => {
    const { name,semester,email,phone } = req.body;
    Student.findByIdAndUpdate(req.params.id,{ name,email,phone,semester }).then((student) => {
        res.redirect("/students");
    }).catch((err)=>{
        res.redirect("/students");
    });
});