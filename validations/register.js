const { check, validationResult } = require('express-validator');

module.exports = {
    userValidator: [
        check('name')
            .trim()
            .not()
            .isEmpty()
            .withMessage('Name is required')
            .isLength({ min: 2, max: 20 })
            .withMessage('Name must be between 3 to 20 characters long')
            .escape(),
        check('email')
            .trim()
            .not()
            .isEmpty()
            .withMessage('Email is required')
            .isEmail()
            .withMessage('Please provide a valid email')
            .normalizeEmail(),
        check('password')
            .trim()
            .not()
            .isEmpty()
            .withMessage('Password is required')
            .isLength({ min: 6 })
            .withMessage('Password must be 6 characters long')
    ],
    userValidationResult: (req, res, next) => {
        try {
            const result = validationResult(req);
            if (!result.isEmpty()) {
                const error = result.array()[0].msg;
                return res.status(422).json({ error });
            };
        } catch (err) {
            console.error(err.message)
        };
        next();
    }
};