/**
 * Created by Urriel.
 */

var express    = require('express');
var controller = require('./controller');
var router     = express.Router();

/**
 * /api/spotify routing
 */

router.get('/', controller.index);

module.exports = router;