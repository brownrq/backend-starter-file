const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");


const UserSchema = mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "Please add your firstname"],
    maxlength: [50, "Name  must not b more than 5 characters"],
  },

  lastName: {
    type: String,
    required: [true, "Please add your lastname"],
    maxlength: [50, "Name must not b more than 5 characters"],
  },

  email: {
    type: String,
    required: [true, "Please provide an email"],
    unique: [true, "User already exist"],
    match: [
      /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/,
      "Please add a valid email",
    ],
  },

  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: [8, "Password must be more than 8 character "],
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  lastPasswordReset: Date,
});
// to hide the password so it isnt visible to anyone even the developer in th database

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// to check and compare the password saved and the one enteered by user
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};
UserSchema.methods.getResetPasswordToken = function () {
// generate token
const resetToken = crypto.randomBytes(20).toString("hex");
   
try {
//Hash token and set to resetPasswordToken field
this.resetPasswordToken = crypto
     .createHash("sha256")
     .update(resetToken)
     .digest("hex")

     this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
     
     return resetToken;
} catch (error) {
    // handle error if any
    console.error("Error generating reset password token: ", error);
    throw new Error("failed to generate reset password token ");
}
};

module.exports = mongoose.model("User", UserSchema);
