const { flashgenPost, flashgenGet, titleChange, flashGetAll } = require('../Controller/flashcard');
const ensureAuth = require('../Middleware/auth');

const router= require('express').Router();

router.post('/generate',ensureAuth,flashgenPost);
router.get('/getOne',ensureAuth,flashgenGet);
router.put('/generate',ensureAuth,titleChange);
router.get('/all',ensureAuth,flashGetAll)
module.exports= router;