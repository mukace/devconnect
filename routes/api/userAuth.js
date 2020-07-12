const router = require('express').Router();
const bcrypt = require('bcryptjs');
const gravatar = require('gravatar');
const jwt = require('jsonwebtoken');
const passport = require('passport');

const UserModel = require('./../../models/User');

const keys = require('./../../config/keys');

const { userValidator, userValidationResult } = require('../../validations/register');
const { loginValidator, loginValidationResult } = require('../../validations/login');


// @route POST api/users/register
// @desc       Create a new User
// @access     Public
router.post('/register', userValidator, userValidationResult, async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const existingUser = await UserModel.findOne({ email });

        if (existingUser) return res.status(400).json({ email: 'User already exists' });

        const salt = await bcrypt.genSalt(10);

        const bcryptPassword = await bcrypt.hash(password, salt);

        const avatar = gravatar.url(email, {
            s: '200', // size
            r: 'pg', // Rating
            d: 'mm' // Deafault
        });

        const newUser = await new UserModel({
            name,
            email,
            password: bcryptPassword,
            avatar
        }).save();

        res.json({ success: 'Account created Succesfully!' });

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

// @route POST api/users/login
// @desc       login user / genrate JWT token
// @access     Public
router.post('/login', loginValidator, loginValidationResult, async (req, res) => {
    const { email, password } = req.body;

    try {
        const existingUser = await UserModel.findOne({ email });

        if (!existingUser) return res.status(404).json({ email: 'User not found' });

        const validPassord = await bcrypt.compare(password, existingUser.password);

        if (!validPassord) return res.status(400).json({ password: 'password Inccorect' });

        const jwtPayload = {
            id: existingUser.id,
            name: existingUser.name,
            avatar: existingUser.avatar
        };

        const jwtToken = jwt.sign(jwtPayload, keys.secretOrKey, { expiresIn: "1h" });

        res.json({ success: true, token: `Bearer ${jwtToken}` });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route GET api/users/current
// @desc       Return Current User
// @access     Private
router.get('/current', passport.authenticate('jwt', { session: false }), async (req, res) => {
    res.json(req.user._id);
});

module.exports = router;