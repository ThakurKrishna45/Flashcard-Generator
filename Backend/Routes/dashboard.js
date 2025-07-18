const { flashgenPost, flashgenGet, titleChange, flashGetAll, flashDelete } = require('../Controller/flashcard');
const ensureAuth = require('../Middleware/auth');

const router= require('express').Router();

router.post('/generate',ensureAuth,flashgenPost);
router.get('/getOne',ensureAuth,flashgenGet);
router.put('/generate',ensureAuth,titleChange);
router.get('/all',ensureAuth,flashGetAll)
router.delete('/delete/:id',ensureAuth,flashDelete)
module.exports= router;