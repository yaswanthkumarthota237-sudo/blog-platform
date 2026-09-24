const Post = require('../models/Post');
const Comment = require('../models/Comment');

exports.getPosts = async (req, res) => {
  const posts = await Post.find()
    .populate('author', 'username')
    .sort({ createdAt: -1 });
  res.json(posts);
};

exports.getMyPosts = async (req, res) => {
  const posts = await Post.find({ author: req.userId })
    .populate('author', 'username')
    .sort({ createdAt: -1 });
  res.json(posts);
};

exports.getPost = async (req, res) => {
  const post = await Post.findById(req.params.id).populate('author', 'username');
  if (!post) return res.status(404).json({ message: 'Post not found' });
  res.json(post);
};

exports.createPost = async (req, res) => {
  try {
    const { title, description, tags } = req.body;
    if (!title || !description)
      return res.status(400).json({ message: 'Title and description required' });
    const post = await Post.create({
      title,
      description,
      tags: tags ? tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
      image: req.file ? '/uploads/' + req.file.filename : '',
      author: req.userId
    });
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (post.author.toString() !== req.userId)
      return res.status(403).json({ message: 'Not allowed' });
    const { title, description, tags } = req.body;
    if (title) post.title = title;
    if (description) post.description = description;
    if (tags !== undefined)
      post.tags = tags.split(',').map((t) => t.trim()).filter(Boolean);
    if (req.file) post.image = '/uploads/' + req.file.filename;
    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deletePost = async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ message: 'Post not found' });
  if (post.author.toString() !== req.userId)
    return res.status(403).json({ message: 'Not allowed' });
  await Comment.deleteMany({ post: post._id });
  await post.deleteOne();
  res.json({ message: 'Post deleted' });
};
