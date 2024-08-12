const mongoose = require('mongoose');

const ClassroomSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    startTime: {
        type: String,
        required: true
    },
    endTime: {
        type: String,
        required: true
    },
    days: [{
        type: String,
        required: true
    }],
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    timeTable: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Timetable'
    }]
});

module.exports = mongoose.model('Classroom', ClassroomSchema);
