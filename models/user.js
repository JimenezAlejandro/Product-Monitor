const mongoose = require('mongoose');
const validator = require('validator');
const uniqueValidator = require('mongoose-unique-validator');
const bcrypt = require('bcrypt');
const { Schema } = mongoose;

const saltRounds = 10;

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        uniqueCaseInsensitive: true,
        validate: (value) => {
            return validator.isEmail(value);
        }
    },
    password: {
        type: String,
        required: true,
        set: (value) => {
            return bcrypt.hashSync(value, saltRounds);
        }
    },
    phone: {
        type: String,
        required: true,
        validate: (value) => {
            let digits = validator.whitelist(value, '0123456789');
            return validator.isLength(digits, { min: 10, max: 10 }) && validator.isMobilePhone(digits, 'en-US');
        },
        set: (value) => {
            return validator.whitelist(value, '0123456789');
        }
    },
    tracking: [{ type: Schema.Types.ObjectId, ref: 'Tracker' }]
});

userSchema.plugin(uniqueValidator);

userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

mongoose.model('User', userSchema);