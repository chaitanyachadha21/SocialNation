const mongoose = require("mongoose");

const schema = mongoose.Schema;

const PlacesSchema = new schema(
    {
        title:{type:String , required :true},
        description:{type:String , required :true},
        image:{type:String , required :true},
        address:{type:String , required :true},
        location:{
            lat:{type:Number , required:true},
            lng:{type:Number , required:true}
        },
        creator:{type:mongoose.Types.ObjectId , required:true , ref:'User'} // stores the objectid of the user(one user can have multiple)

    }

)
module.exports = mongoose.model("Place",PlacesSchema);