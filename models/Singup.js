const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const SignupSchema = new mongoose.Schema({
  fname: { type: String, required: true, unique: false },
  lname: { type: String, required: true, unique: false },
  email:{type: String, required: true, unique: true},
  password: { type: String, required: true, unique: false },
});

SignupSchema.pre('save', async function(next){
    if(!this.isModified('password')) return next();
    try{
        const saltRounds = 10;
        this.password = await bcrypt.hash(this.password, saltRounds);
        next();
    }catch(error){
        next(error);
    }
})

module.exports = mongoose.model("signup", SignupSchema);
