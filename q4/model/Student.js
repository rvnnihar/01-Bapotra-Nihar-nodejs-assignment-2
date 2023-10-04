const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: String,
  semester: Number,
  phone: String,
  email: String,

});

const Student = mongoose.model('student', studentSchema);

module.exports = Student;