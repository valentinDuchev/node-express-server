const req = require('express/lib/request');
const res = require('express/lib/response');
const jwt = require('jsonwebtoken');

const secret = process.env.SECRET;

function generateAccessToken (email, firstName, lastName, gender) {
    return jwt.sign({ email, firstName, lastName, gender }, secret, {
        expiresIn: "1h"
    });
};

function isUser (req, res, next) {
    const token = req.cookies.access_token;

    if (!token) {
        throw new Error('Access Denied')
    } 
    
    try {
        const data = jwt.verify(token, secret);
        console.log(data)
        req.email =  data.email;
        req.firstName = data.firstName;
        req.lastName = data.lastName;
        req.gender = data.gender;
        next();
    } catch (err) {
        return res.status(401).send("Access Denied");
    }
}

function isGuest (req, res, next) {
    const token = req.cookies.access_token;

    if (token) {
        throw new Error ('You have already logged in / There is already an user in the session');
    }

    try {
        next()

    } catch (err) {
        return res.status(401).send(err.message);
    }

}

module.exports = {
    // authenticateToken,
    generateAccessToken, 
    isUser, 
    isGuest

}