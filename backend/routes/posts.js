const router = require('express').Router();
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const p = require('../controllers/postController');
const c = require('../controllers/commentController');

router.get('/', p.getPosts);
router.get('/mine', auth, p.getMyPosts);
router.get('/:id', p.getPost);
router.post('/', auth, upload.single('image'), p.createPost);
router.put('/:id', auth, upload.single('image'), p.updatePost);
router.delete('/:id', auth, p.deletePost);

router.get('/:postId/comments', c.getComments);
router.post('/:postId/comments', auth, c.addComment);

module.exports = router;
