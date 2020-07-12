const router = require('express').Router();
const mongoose = require('mongoose');
const passport = require('passport');

const ProfileModel = require('./../../models/Profile');
const UserModel = require('./../../models/User');

// @route GET api/profile
// @desc      get the loggedin user profile
// @access    Private
router.get('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
    const loggedInUserId = req.user._id;

    try {
        const loggedInUserProfile = await ProfileModel.findOne({ user: loggedInUserId });

        if (!loggedInUserProfile) return res.status(404).json(
            { profile: 'You dont have a profile' }
        );

        res.json(loggedInUserProfile);
    } catch (err) {
        console.error(err.message);
        res.status(500).json('Server Error')
    }
});

// @route POST api/profile
// @desc       Create or edit the loggedin user profile
// @access     Private
router.post('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
    const loggedInUserId = req.user._id;
    const {
        handle,
        company,
        website,
        location,
        status,
        skills,
        bio,
        githubusername,
        youtube,
        twitter,
        facebook,
        linkedin,
        instagram
    } = req.body;

    try {
        const profileFields = {};

        if (handle) profileFields.handle = handle;
        if (company) profileFields.company = company;
        if (website) profileFields.website = website;
        if (location) profileFields.location = location;
        if (status) profileFields.status = status;
        if (bio) profileFields.bio = bio;
        if (githubusername) profileFields.githubusername = githubusername;
        // Skills (csv to array)
        if (typeof skills !== 'undefined') {
            profileFields.skills = skills.split(',');
        };
        // Social (Object)
        profileFields.social = {};
        if (youtube) profileFields.social.youtube = youtube;
        if (twitter) profileFields.social.twitter = twitter;
        if (facebook) profileFields.social.facebook = facebook;
        if (linkedin) profileFields.social.linkedin = linkedin;
        if (instagram) profileFields.social.instagram = instagram;

        const existingProfile = await ProfileModel.findOne({ userid: loggedInUserId });

        if (existingProfile) {
            // Update
            await ProfileModel.findOneAndUpdate(
                { userid: loggedInUserId },
                { $set: profileFields },
                { new: true }
            );
            res.json({ success: 'Account Updated !!' });
        } else {
            // Create

            // Check for unique handles
            const existingHandle = await ProfileModel.find(
                { handle: profileFields.handle }
            );

            if (existingHandle) return res.status(400).json(
                { handle: 'handle already taken!' }
            );

            await ProfileModel(profileFields).save();

            res.json({ success: 'Profile created!!' });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;