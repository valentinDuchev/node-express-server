const { register, login } = require('../controllers/userController');
const { generateAccessToken, isGuest, isUser } = require('../middlewares/auth');

const router = require('express').Router();

router.post('/users/register', isGuest, async (req, res) => {

    try {
        if (req.body.password != req.body.repass) {
            throw new Error('Passwords do not match');
        }

        if (req.body.password.length < 8) {
            throw new Error('Password must be at least 3 characters long')
        }

        const reqData = {
            firstName: req.body.firstName, 
            lastName: req.body.lastName, 
            password: req.body.password, 
            gender: req.body.gender, 
            email: req.body.email, 
            seqQuestion: req.body.seqQuestion, 
            seqAnswer: req.body.seqAnswer, 
        }

        const user = await register(reqData);

        const token = generateAccessToken(req.body.email, user.firstName, user.lastName, user.gender);

        
        return res.cookie("access_token", token, {
            httpOnly: true, 
            // secure: process.env.NODE_ENV === "production"
        })
        
        .status(200)
        .json({ message: "Registered in Successfully", user, token });

    } catch (err) {
        console.log(err);
    }
    
});

router.post('/users/login', isGuest, async (req, res) => {
    try {
        const user = await login(req.body.email, req.body.password);
        const token = generateAccessToken(req.body.email, user.firstName, user.lastName, user.gender);

        return res.cookie("access_token", token, {
            httpOnly: true, 
            // secure: process.env.NODE_ENV === "production"
        })
        
        .status(200)
        .json({ message: "Logged in Successfully", user, token });
    } catch (err) {
        console.log(err);
    }
});

router.get('/users/logout', isUser, (req, res) => {
    try {
        return res.clearCookie("access_token")
        .status(200)
        .json({ message: 'Successfully logged out.' });
    } catch (err) {
        console.log(err)
    }
})

module.exports = router;