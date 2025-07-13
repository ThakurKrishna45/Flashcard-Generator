const { flashgenPost, flashgenGet } = require('../Controller/flashcard');
const ensureAuth = require('../Middleware/auth');

const router= require('express').Router();

router.post('/',ensureAuth,flashgenPost);
router.get('/',ensureAuth,flashgenGet);

module.exports= router;