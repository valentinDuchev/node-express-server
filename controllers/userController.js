const User = require('../models/User');
const { compare, hash } = require('bcrypt');


async function register(reqData) {
    const existing = await User.findOne({email: reqData.email});

    if (existing) {
        console.log('reqData', reqData)
        console.log(existing)
        throw new Error ('Email is taken.')
    }

    const hashedPassword = await hash(reqData.password, 10);

    const user = new User({
        firstName: reqData.firstName,
        lastName: reqData.lastName,
        hashedPassword,
        gender: reqData.gender,
        email: reqData.email,
        seqQuestion: reqData.seqQuestion,
        seqAnswer: reqData.seqAnswer,
    });

    await user.save();

    return user;
};

async function login (email, password) {
    const user = await User.findOne({ email: email});
    
    if (!user) {
        throw new Error('Incorrect username or password');
    }

    const hasMatch = await compare(password, user.hashedPassword);

    if (!hasMatch) {
        throw new Error ('Incorrect username or password');
    }

    return user;
}

module.exports = {
    register,
    login

}