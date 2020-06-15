const router = require('express').Router();


// @route GET api/profile/test
// @desc      Tests profile route
// @access    Public
router.get('/test', (req, res) => res.json({msg: "Profile Work"}));

module.exports = router;