const Comment = require('../models/Comment');

exports.getComments = async (req, res) => {
  const comments = await Comment.find({ post: req.params.postId })
    .populate('author', 'username')
    .sort({ createdAt: -1 });
  res.json(comments);
};

exports.addComment = async (req, res) => {
  try {
    if (!req.body.text)
      return res.status(400).json({ message: 'Comment text required' });
    const comment = await Comment.create({
      text: req.body.text,
      post: req.params.postId,
      author: req.userId
    });
    await comment.populate('author', 'username');
    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteComment = async (req, res) => {
  const comment = await Comment.findById(req.params.id);
  if (!comment) return res.status(404).json({ message: 'Comment not found' });
  if (comment.author.toString() !== req.userId)
    return res.status(403).json({ message: 'Not allowed' });
  await comment.deleteOne();
  res.json({ message: 'Comment deleted' });
};
