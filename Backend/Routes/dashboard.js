const express = require('express');
const router = express.Router();
const flashController = require('../Controller/flashcard');
const ensureAuth = require('../Middleware/auth');

// helper to wrap async route handlers and forward errors to next()
const asyncHandler = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

router.post('/generate', ensureAuth, asyncHandler(flashController.flashgenPost));

router.get('/getOne', ensureAuth, flashController.flashgenGet);
router.put('/generate', ensureAuth, flashController.titleChange);
router.get('/all', ensureAuth, flashController.flashGetAll);
router.delete('/delete/:id', ensureAuth, flashController.flashDelete);
module.exports = router;