/**
 * Created by Urriel.
 */

var express = require('express');
var router  = express.Router();

/**
 * /api routing
 */

router.use('/spotify', require('./spotify'));

module.exports = router;