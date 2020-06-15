const router = require('express').Router();
const bcrypt = require('bcryptjs');
const gravatar = require('gravatar');
const jwt = require('jsonwebtoken');

const User = require('./../../models/User');
const keys = require('./../../config/keys');

// @route GET api/users/test
// @desc      Tests users route
// @access    Public
router.get('/test', (req, res) => res.json({ msg: "Users Work" }));

// @route POST api/users/register
// @desc       Create a new User
// @access     Public
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });

        if (existingUser) return res.status(400).json({ email: 'User already exists' });

        const salt = await bcrypt.genSalt(10);
        const bcryptPassword = await bcrypt.hash(password, salt);

        const avatar = gravatar.url(email, {
            s: '200', // size
            r: 'pg', // Rating
            d: 'mm' // Deafault
        })

        const newUser = await new User({
            name,
            email,
            password: bcryptPassword,
            avatar
        }).save();

        res.json({ success: 'Account created Succesfully!' });

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server error");
    }
});

// @route POST api/users/login
// @desc       login user / genrate JWT token
// @access     Public
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });

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
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;