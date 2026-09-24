const router = require('express').Router();
const auth = require('../middleware/auth');
const c = require('../controllers/commentController');

router.delete('/:id', auth, c.deleteComment);

module.exports = router;
