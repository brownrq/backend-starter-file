const Blog  = require("../models/blog")


const create = async (req, res) => {
    const {title, description, author, age, state, gender} = req.body;

       const blog = await Blog.create({
        title, 
        description, 
        author, 
        age, 
        state,
        gender
       });
  
       res.status(201).json({ success: true, message: 'Blog created successfully', blog})
  
}

const updateBlog = async (req, res) =>{ 
    const inputsToUpdate = {
        author: req.body.author,
        title: req.body.title 
    };

    const blog = await Blog.findByIdAndUpdate(
        req.params.id, inputsToUpdate, {
            new: true,
            runValidators: true,
        });
    return res.status(200)
    .json({success: true, message: "Blog Details updated successfully", blog})
  
}

const deleteBlog = async(req, res) =>{ 
    const blog = await Blog.findByIdAndDelete(req.params.id);
     res.status(200)
    .json({success: true, message: "Blog deleted"}) 
}


const getBlogs = async(req, res) =>{ 
    const blog = await Blog.find();
   
    res.status(200)
    .json({success: true, message: "Blogs details retrieved", blog}) 
}

module.exports = { 
    create, updateBlog, deleteBlog, getBlogs
}