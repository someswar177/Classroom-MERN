const mongoose = require('mongoose');

const TimetableSchema = new mongoose.Schema({
    classroom: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Classroom',
        required: true
    },
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Assuming you are using 'User' model for teachers
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    period: {
        type: String,
        required: true
    },
    day: {
        type: String,
        required: true
    },
    startTime: {
        type: String,
        required: true
    },
    endTime: {
        type: String, 
        required: true
    }
});

module.exports = mongoose.model('Timetable', TimetableSchema);
