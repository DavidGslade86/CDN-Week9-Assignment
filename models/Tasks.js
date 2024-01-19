const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    taskName:{
        type: String,
        required: [true, 'Please provide a value.'],
    },
    completed:{
        type: Boolean,
        default: false,
    },
    dateCompleted:{
        type: Date,
    },
    completeBy:{
        type: Date,
    },
    notes:{
        type: String,
    },
    createdBy:{
        type: mongoose.Types.ObjectId,
        ref:'User',
        required: [true, 'Please provide user.']
    }
},{timestamps:true})

module.exports = mongoose.model('Task', TaskSchema)