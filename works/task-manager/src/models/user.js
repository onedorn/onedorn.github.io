const mongoose = require('mongoose');
const validator = require('validator');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('This is not a valid email!')
            }
        }
    },
    age: {
        type: Number,
        default: 18,
        validate(value) {
            if (value < 0) {
                throw new Error('Age must be a positive number!')
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 6,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Should not contain "password"!')
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true,
        }
    }]
});

userSchema.methods.generateAuthWebToken = async function () {
  const user = this;
  const token = await jwt.sign({_id: user._id}, process.env.JWT_SECRET);

  user.tokens = user.tokens.concat({ token });
  await user.save();

  return token
};

// Login user
userSchema.static('getByCredentials', async (email, password) => {
    const user = await User.findOne({email});

    if (!user) {
        throw new Error('Unable to login!')
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw new Error('Unable to login!')
    }

    return user
});

// Hash plain text user password
userSchema.pre('save', async function(next) {
    const user = this;

   if (user.isModified('password')) {
       user.password = await bcrypt.hash(user.password, 8);
   }

    next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;