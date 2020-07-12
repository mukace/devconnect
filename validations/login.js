const { check, validationResult } = require('express-validator');

module.exports = {
    loginValidator: [
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
    loginValidationResult: (req, res, next) => {
        try {
            const result = validationResult(req);
            if (!result.isEmpty()) {
                const error = result.array()[0].msg;
                return res.status(422).json({ error });
            };
        } catch (error) {
            console.error(error.message)
        };
        next();
    }
};