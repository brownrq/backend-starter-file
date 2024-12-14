const User  = require("../models/user");
const sendEmail = require("../utils/sendEmail");

const register = async (req, res) => {
    const {firstName, lastName, email, password} = req.body;

    try {
        if(!firstName || !lastName || !email ||!password) {
         return
         res.status(404)
        .json({successs: false, message: "Please input all fields"});
        } 

        // Check for user POST
        const existingUser = await User.findOne({email});
    
        if (existingUser){
            return res.status(409)
            .json({successs: false, message: "User already exist"});
        }

        // create user
       const user = await User.create({
           email, 
           firstName,
           lastName, 
           password
       });
      

       const options = {
           email: email,
           subject: "Welcome to our application", 
           emailBody: "Welcome to our Backend app"
       }

       await sendEmail(options);
      
      
        const token = user.getSignedJwtToken();
       
       return res.status(201)
            .json({successs: true, message: "user created successfully", token});
        
    } catch(err) {
        console.error("something went wrong:", err);
        res.status(500).json({error:"something went wrong"});
    }
}


// to authenticate the login parameters the users inputs

 const login = async (req, res) => {
    const {email, password} = req.body

    if (!email) {
         return res.status (400)
         .json ({success: false, message: "Please input an email"})
    }

    if (!password) {
        return res.status (400)
        .json ({success: false, message: "Please input your password"})
   }
 
//  to check if it is correct
 const user = await User.findOne({email})
 if (!user) {
    return res.status (401)
    .json ({success: false, message: "User does not exist"})
}
 

// to check if it tallies with the user password stored in the database

const compareMatch = await user.matchPassword(password)
if (!compareMatch) {
    return res.status (422)
    .json ({success: false, message: "Password Invalid", user})
}
//   jwt token to encrypt user details
      const token = user.getSignedJwtToken();
    return res.status (200)
   .json ({success: false, message: "Login successful", token}) 

}


// using the HTTP PUT method to update details of users
const updateDetails = async (req, res) =>{ 
    const inputsToUpdate = {
        firstName: req.body.firstName,
        lastName: req.body.lastName 
    };

    const user = await User.findByIdAndUpdate(
        req.params.id, inputsToUpdate, {
            new: true,
            runValidators: true,
        });
    return res.status(200)
    .json({success: true, message: "User Details updated successfully", user})

    }

    const updatePassword = async  (req, res) =>{
        const user = await User.findById(req.params.id).select("+password")

        // to check current password
        if(!(await user.matchPassword(req.body.currentPassword))){
            return res.status(401)
            .json({success: false, message: "Password is incorrect"})
        }

        user.password = req.body.newPassword;
        await user.save();

        res.status(200).json({success: true, message: 'Password updated'})
    }
    // delete user
    const deleteUser = async(req, res) =>{ 
        const user = await User.findByIdAndDelete(req.params.id);
         res.status(200)
        .json({success: true, message: "User deleted"}) 
}

// get user

const getUser = async(req, res) =>{ 
    const user = await User.findById(req.params.id);
   
    res.status(200)
    .json({success: true, message: "User details retrieved", user}) 
}

 
// to fetch all users details

const getUsers = async(req,res) =>{ 
    const users = await User.find();
   
    res.status(200)
    .json({success: true, message: "Users details retrieved", users}) 
}

// to reset password and send to user's email
const forgotPassword = async (req, res)=> {
    const user = await User.findOne({email: req.body.email});

    if(!user){
        return res.status(404)
        .json({success: false, message: "User not found"

        });
}

const resetToken = user.getResetPasswordToken();

await user.save({validateBeforeSave: false });
 
const resetUrl = `${req.protocol}://${req.get("host")}/api/v1/auth/resetpassword/${resetToken}`;


const message = `You are receiving this email beecause  you or someone else has requested the reset of a password Please make a request to : n \n ${resetUrl}`

const options = {
    email: user.email,
    subject: "Reset Password",
    emailBody: message,   
}
try {
   await sendEmail(options) ;
   return res.status(200).json({success: true, message: "Email sent" });
} catch (error) {
    console.log(error)
    user.getRestPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false})

    return res.status(500)
              .json({ success: false, message: "Something wemt wrong"})

    
   }
};
module.exports = { 
    register, login, updateDetails, deleteUser, getUser, getUsers, updatePassword, forgotPassword
}