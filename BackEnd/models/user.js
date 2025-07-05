const mongoose = require("mongoose");

const schema= mongoose.Schema;

const uniqueValidator = require("mongoose-unique-validator");

const UserSchema = new schema(
    {
        name:{type:String , reqired:true},
        email:{type:String , required:true , unique:true},
        password:{type:String , required:true , minlength:6},
        image:{type:String , required:true},
        places:[{type:mongoose.Types.ObjectId , required:true , ref:'Place'}]//as users can have have multiple places so id of these places is added over here 
    }
)

UserSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User" , UserSchema);