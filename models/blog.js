const mongoose = require('mongoose');

const BlogSchema = mongoose.Schema(
    {
        title:{
            type:String,
            required: [true, "Please add title"],
            maxlength: [50, 'Title must not be more than 50 characters']
        },

        description:{
            type:String,
            required: [true, "Please add Description"],
            maxlength: [50, 'Description must not b more than 5 characters']
        },

        author:{
            type:String,
            required: [true, "Please add Author"],
            maxlength: [50, 'Title must not be more than 50 characters']
        },

        age:{
            type:Number,
            required: [true, "Please add your Age"],
        },  

        state:{
            type:String,
            required: [true, "Please add your state"],
            maxlength: [50, 'Title must not be more than 50 characters']
        },

        gender:{
            type:String,
            required: [true, "Please add Gender"],
            enum: ['Male', 'Female', 'other']
        }
}
)

module.exports = mongoose.model("Blog", BlogSchema);