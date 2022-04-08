const jwt = require('jsonwebtoken');

const secret = process.env.SECRET;

function authenticateToken (req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader;

    console.log(token)

    if (token == null) {
        return res.status(401).send('Access Denied');
    }

    jwt.verify(token, secret, (err, user) => {
        if (err) {
            return res.sendStatus(403);
        }

        req.user = user;
        next();
    })
}

function generateAccessToken (email, firstName, lastName, gender) {
    return jwt.sign({ email, firstName, lastName, gender }, secret, {
        expiresIn: "1h"
    });
}

module.exports = {
    authenticateToken,
    generateAccessToken
}