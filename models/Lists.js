const mongoose = require('mongoose');

const ListSchema = new mongoose.Schema({
    listName:{
        type: String,
        required: [true, 'Please name your new list.'],
        trim:true,
        maxlength: 50,
    },
    importance:{
        type: String,
        enum: ['Low', 'Moderate', 'High'],
        default: 'Moderate',
    },
    createdBy:{
        type: mongoose.Types.ObjectId,
        ref:'User',
        required: [true, 'Please provide user.']
    }
},{timestamps:true})

module.exports = mongoose.model('List', ListSchema)