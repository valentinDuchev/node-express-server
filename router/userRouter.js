const { register, login } = require('../controllers/userController');
const { generateAccessToken } = require('../middlewares/auth');

const router = require('express').Router();

router.post('/users/register', async (req, res) => {

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

        const token = generateAccessToken(req.body.email);

        
        res.header('authorization', token);

        res.json ({ message: 'Registered successfully', user: user, token: token});
    } catch (err) {
        console.log(err);
    }
    
});

router.post('/users/login', async (req, res) => {
    try {
        const user = await login(req.body.email, req.body.password);
        const token = generateAccessToken(req.body.email);
        res.header('authorization', token);

        res.json({ message: 'Logged in successfully', user: user, token: token })
    } catch (err) {
        console.log(err);
    }
})

module.exports = router;