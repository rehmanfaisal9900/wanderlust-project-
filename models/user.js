const { required } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const  passportLocalMongoose  = require("passport-local-mongoose");



const userSchema = new Schema({
    email : {
        type : String,
        required : true
    },
});

const safePlugin = typeof passportLocalMongoose === "function" 
    ? passportLocalMongoose 
    : (passportLocalMongoose.default || passportLocalMongoose);

// userSchema.plugin(passportLocalMongoose);
userSchema.plugin(safePlugin);

module.exports = mongoose.model("User",userSchema);

