const express = require('express');
const app = express();
require('dotenv').config();
const mongoose = require('mongoose');
const dbConnect = require('./dbConnect');
const jwt = require('jsonwebtoken');
const cors = require('cors');

dbConnect();
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors());

const User = require('./models/User');
const Classroom = require('./models/Classroom');
const Student = require('./models/Students');
const Timetable = require('./models/Timetable');

const PORT = 8080;
app.listen(PORT,()=>{
    console.log(`server is listening at http://localhost:${PORT}`);
})

const BASE_URL = process.env.BASE_URL;
if(BASE_URL){ 
    console.log(`Backend running at ${BASE_URL}`);
}

app.post('/signup', async (req, res) => {
    const { email, password, role } = req.body;

    // Trim the input data to remove any leading/trailing whitespace
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    const trimmedRole = role.trim();

    const user = new User({
        email: trimmedEmail,
        password: trimmedPassword,
        role: trimmedRole
    });

    try {
        await user.save();
        res.status(200).send({
            message: `User created successfully`,
            user
        });
    } catch (error) {
        res.status(500).send({
            message: `Email not created`,
            error: error.message
        });
    }
});

app.post('/login', async (req, res) => {
    const { email, password, role } = req.body;

    // Trim the input data to remove any leading/trailing whitespace
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    const trimmedRole = role.trim();

    console.log(req.body);

    try {
        const user = await User.findOne({ email: trimmedEmail });
        console.log(user);

        if (!user) {
            return res.status(400).json({ msg: 'User Not found' });
        }

        if (user.password !== trimmedPassword) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        return res.status(200).send({
            message: `User Present`,
            user:user
        });
    } catch (error) {
        res.status(500).send({
            message: `Not verified`,
            error: error.message
        });
    }
});

app.get('/view/teachers', async (req, res) => {
    try {
        // Find all teachers and populate the 'classroom' field with the classroom's 'name'
        const teachers = await User.find({ role: "teacher" }).populate('classroom', 'name');

        return res.status(200).send({
            message: 'Teachers are present',
            teachers: teachers
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: 'Failed to retrieve teachers',
            error: error.message
        });
    }
});


app.put('/update/teacher/:id',async (req,res)=>{
    try{
        const teacherId = req.params.id;
        const updatedData = req.body;
        const updatedTeacher = await User.findByIdAndUpdate(teacherId,updatedData,{new:true});
        res.json(updatedTeacher);
    }catch(err){
        res.status(500).json({message:"failed to update teacher"});
    }
})

app.delete('/delete/teacher/:id', async (req, res) => {
    try {
        const teacherId = req.params.id;

        // Find classrooms associated with the teacher and remove teacher reference
        const updatedClassrooms = await Classroom.updateMany(
            { teacher: teacherId },
            { teacher: null }
        );

        // Find students associated with the teacher and remove teacher reference
        const updatedTeachers = await Student.updateMany(
            { teacher: teacherId },
            { teacher: null }
        );

        // Delete the teacher
        const deletedTeacher = await User.findByIdAndDelete(teacherId);

        if (!deletedTeacher) {
            return res.status(404).json({ message: "Teacher not found" });
        }

        res.json({
            message: "Teacher deleted successfully, references removed from classrooms and students",
            updatedClassrooms: updatedClassrooms.nModified,
            updatedTeachers: updatedTeachers.nModified
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete teacher", error: error.message });
    }
});


app.post('/add/classroom', async (req, res) => {
    const { name, startTime, endTime, days, teacher } = req.body;

    // Trim the input data to remove any leading/trailing whitespace
    const trimmedName = name.trim();
    const trimmedStartTime = startTime.trim();
    const trimmedEndTime = endTime.trim();
    const trimmedTeacher = teacher.trim();
    const trimmedDays = Array.isArray(days) ? days.map(day => day.trim()) : [];

    if (!trimmedName || !trimmedStartTime || !trimmedEndTime || !trimmedDays.length || !trimmedTeacher) {
        return res.status(400).json({ message: "All fields are required" });
    }

    // Create a new Classroom document
    const classroom = new Classroom({
        name: trimmedName,
        startTime: trimmedStartTime,
        endTime: trimmedEndTime,
        days: trimmedDays,
        teacher: trimmedTeacher
    });

    try {
        // Save the classroom to the database
        const savedClassroom = await classroom.save();

        // Update the teacher's classroom field with the new classroom's ID
        const updatedTeacher = await User.findByIdAndUpdate(
            trimmedTeacher,
            { classroom: savedClassroom._id },
            { new: true }
        );

        if (!updatedTeacher) {
            return res.status(404).json({ message: "Teacher not found" });
        }

        // Update all students assigned to this teacher to also have the new classroom
        const updatedTeachers = await Student.updateMany(
            { teacher: trimmedTeacher },
            { classroom: savedClassroom._id }
        );

        res.status(201).json({
            message: "Classroom added successfully, teacher and students updated",
            classroom: savedClassroom,
            teacher: updatedTeacher,
            studentsUpdated: updatedTeachers.nModified
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to add classroom",
            error: error.message
        });
    }
});



app.get('/view/classrooms',async(req,res)=>{
    try {
        const classrooms = await Classroom.find().populate('teacher', 'email');
        console.log(classrooms);
        return res.status(200).send({
            message:'classrooms are present',
            classrooms: classrooms
        })  
    } catch (error) {
        console.log(error)
    }
})

app.put('/update/classroom/:id', async (req, res) => {
    try {
        const classroomId = req.params.id;
        const updatedData = req.body;

        const updatedClassroom = await Classroom.findByIdAndUpdate(classroomId, updatedData, { new: true });

        if (!updatedClassroom) {
            return res.status(404).json({ message: 'Classroom not found' });
        }

        res.json({
            message: "Classroom updated successfully",
            updatedClassroom
        });
    } catch (err) {
        res.status(500).json({
            message: "Failed to update classroom",
            error: err.message
        });
    }
});

app.delete('/delete/classroom/:id', async (req, res) => {
    try {
        const classroomId = req.params.id;

        const classroom = await Classroom.findById(classroomId);
        if (!classroom) {
            return res.status(404).json({ message: 'Classroom not found' });
        }

        const updatedTeacher = await User.findByIdAndUpdate(
            classroom.teacher,
            { classroom: null },
            { new: true }
        );

        const updatedTeachers = await Student.updateMany(
            { classroom: classroomId },
            { classroom: null }
        );

        await Classroom.findByIdAndDelete(classroomId);

        res.json({
            message: "Classroom deleted successfully, teacher and students updated",
            teacher: updatedTeacher,
            studentsUpdated: updatedTeachers.nModified
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete classroom", error: error.message });
    }
});


app.post('/student/create', async (req, res) => {
    const { email, password, role, teacher } = req.body;
    console.log(req.body)

    // Trim the input data to remove any leading/trailing whitespace
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    const trimmedRole = role.trim();
    
    let classroomId = null;

    try {
        if (teacher) {
            const teacherExists = await User.findById(teacher).populate('classroom');
            if (teacherExists && teacherExists.classroom) {
                classroomId = teacherExists.classroom._id;
            } else {
                // Handle case where teacher is not found or has no classroom
                return res.status(404).send({ message: 'Teacher not found or teacher has no assigned classroom' });
            }
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: 'Error fetching teacher data', error: error.message });
    }

    const student = new Student({
        email: trimmedEmail,
        password: trimmedPassword,
        role: trimmedRole,
        teacher: teacher || null,
        classroom: classroomId || null
    });
    console.log(student);

    try {
        await student.save();
        res.status(200).send({
            message: 'Student created successfully',
            student
        });
    } catch (error) {
        res.status(500).send({
            message: 'Failed to create student',
            error: error.message
        });
    }
});

app.post('/student/login', async (req, res) => {
    const { email, password, role } = req.body;

    // Trim the input data to remove any leading/trailing whitespace
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    const trimmedRole = role.trim();

    console.log(trimmedEmail);

    try {
        const user = await Student.findOne({ email: trimmedEmail });
        console.log(user);

        if (!user) {
            return res.status(400).json({ msg: 'User Not found' });
        }

        if (user.password !== trimmedPassword) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        return res.status(200).send({
            message: `User Present`,
            user:user
        });
    } catch (error) {
        res.status(500).send({
            message: `Not verified`,
            error: error.message
        });
    }
});

app.get('/view/students', async (req, res) => {
    try {
        // Populate teacher and classroom details
        const students = await Student.find()
            .populate('teacher', 'email') // Populate teacher's email
            .populate('classroom', 'name'); // Populate classroom's name

        res.status(200).send({
            message: 'Students are present',
            students: students
        });
    } catch (error) {
        res.status(500).send({
            message: 'Failed to retrieve students',
            error: error.message
        });
    }
});


// Update student details
app.put('/update/student/:id', async (req, res) => {
    try {
        const studentId = req.params.id;
        const updatedData = req.body;

        const updatedTeacher = await Student.findByIdAndUpdate(studentId, updatedData, { new: true });

        if (!updatedTeacher) {
            return res.status(404).json({ message: 'Student not found' });
        }

        res.json({
            message: "Student updated successfully",
            updatedTeacher
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to update student",
            error: error.message
        });
    }
});

// Delete a student
app.delete('/delete/student/:id', async (req, res) => {
    try {
        const studentId = req.params.id;

        // Find the student by ID
        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        // Delete the student
        await Student.findByIdAndDelete(studentId);

        res.json({
            message: "Student deleted successfully"
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete student", error: error.message });
    }
});

app.put('/assign/student', async (req, res) => {
    const { student, teacher, classroom } = req.body; // Updated to match request body
    console.log("requested body", req.body)

    try {
        // Find the student by ID and update their classroom and teacher
        const updatedTeacher = await Student.findByIdAndUpdate(
            student,
            { classroom, teacher }, // Shortened syntax, matches the destructured variables
            { new: true }
        );
        console.log(updatedTeacher);

        if (!updatedTeacher) {
            return res.status(404).json({ message: 'Student not found' });
        }

        res.json({
            message: "Student assigned to classroom and teacher successfully",
            student: updatedTeacher
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to assign student to classroom and teacher", error: error.message });
    }
});

app.put('/assign/teacher', async (req, res) => {
    const { teacher, classroom } = req.body; // Updated to match request body
    console.log("requested body", req.body)

    try {
        // Find the student by ID and update their classroom and teacher
        const updatedTeacher = await User.findByIdAndUpdate(
            teacher,
            { classroom }, // Shortened syntax, matches the destructured variables
            { new: true }
        );
        console.log(updatedTeacher);

        if (!updatedTeacher) {
            return res.status(404).json({ message: 'Teacher not found' });
        }

        // Update the classroom with the teacher's ID
        const updatedClassroom = await Classroom.findByIdAndUpdate(
            classroom,
            { $set: { teacher: updatedTeacher._id } }, // Add the teacher ID to the classroom
            { new: true }
        );
        console.log("Updated Classroom:", updatedClassroom);

        if (!updatedClassroom) {
            return res.status(404).json({ message: 'Classroom not found' });
        }

        res.json({
            message: "Teacher assigned to classroom successfully",
            teacher: updatedTeacher,
            classroom: updatedClassroom
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to assign teacher to classroom", error: error.message });
    }
});

// Create a timetable entry
app.post('/create/timetable', async (req, res) => {
    const { classroom, teacher, subject, period, day, startTime, endTime } = req.body;
    console.log("create", req.body);

    try {
        const timetable = new Timetable({
            classroom: classroom,
            teacher: teacher,
            subject: subject,
            period: period,
            day: day,
            startTime: startTime,
            endTime: endTime
        });

        const savedTimetable = await timetable.save();

        // Update Classroom with the new timetable reference
        await Classroom.findByIdAndUpdate(
            classroom,
            { $push: { timeTable: savedTimetable._id } },
            { new: true }
        );

        console.log("saved");
        res.status(200).json({
            message: 'Timetable created successfully',
            timetable: savedTimetable
        });
    } catch (error) {
        res.status(500).json({
            message: 'Failed to create timetable',
            error: error.message
        });
    }
});


app.put('/update/timetable/:id', async (req, res) => {
    const timetableId = req.params.id;
    const updatedData = req.body;
    console.log("update");

    try {
        const updatedTimetable = await Timetable.findByIdAndUpdate(timetableId, updatedData, { new: true });

        if (!updatedTimetable) {
            return res.status(404).json({ message: 'Timetable not found' });
        }

        res.json({
            message: 'Timetable updated successfully',
            timetable: updatedTimetable
        });
    } catch (error) {
        res.status(500).json({
            message: 'Failed to update timetable',
            error: error.message
        });
    }
});

// Delete a timetable entry
app.delete('/delete/timetable/:id', async (req, res) => {
    const timetableId = req.params.id;

    try {
        // Find the timetable to get the classroom reference
        const timetable = await Timetable.findById(timetableId);
        if (!timetable) {
            return res.status(404).json({ message: 'Timetable not found' });
        }

        // Remove the timetable reference from the classroom
        await Classroom.updateOne(
            { timeTable: timetableId },
            { $pull: { timeTable: timetableId } }
        );

        // Delete the timetable
        const deletedTimetable = await Timetable.findByIdAndDelete(timetableId);

        if (!deletedTimetable) {
            return res.status(404).json({ message: 'Timetable not found' });
        }

        res.json({
            message: 'Timetable deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            message: 'Failed to delete timetable',
            error: error.message
        });
    }
});

// Get timetable by teacherId and classroomId
app.get('/view/timetable/:teacherId/:classroomId', async (req, res) => {
    const { teacherId, classroomId } = req.params;

    try {
        const timetables = await Timetable.find({ teacher: teacherId, classroom: classroomId });
        res.status(200).json({
            message: 'Timetables retrieved successfully',
            timetables
        });
    } catch (error) {
        res.status(500).json({
            message: 'Failed to retrieve timetables',
            error: error.message
        });
    }
});

app.get('/classrooms/timetables', async (req, res) => {
    try {
        // Fetch all classrooms and populate the timetable field
        const classrooms = await Classroom.find()
            .populate('timeTable')  // Populate the timetable reference
            .exec();

        if (!classrooms.length) {
            return res.status(404).json({ message: 'No classrooms found' });
        }

        res.json(classrooms);
    } catch (error) {
        res.status(500).json({
            message: 'Failed to fetch classrooms and timetables',
            error: error.message
        });
    }
});


