const mongoose = require('mongoose');
const { Schema } = mongoose;


const trackerSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    sizes: [{
        type: String,
        required: true
    }],
    url: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    active: {
        type: Boolean,
        required: true
    },
    user: { type: Schema.Types.ObjectId, ref: 'User' }
});

mongoose.model('Tracker', trackerSchema);