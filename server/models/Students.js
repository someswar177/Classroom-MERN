const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        // enum: ['principal', 'teacher', 'student'],
        required:true
    },
    teacher:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    classroom:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Classroom'
    }
});

module.exports = mongoose.model("Student",StudentSchema);