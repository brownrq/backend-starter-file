const express = require('express');
const {create, updateBlog, deleteBlog, getBlogs} = require('../controller/authblog');

const router = express.Router();

router.post('/create', create);
router.put('/:id', updateBlog);
router.delete('/:id', deleteBlog);
router.get('/get', getBlogs);

module.exports = router;