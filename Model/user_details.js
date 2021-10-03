const { ObjectId } = require('bson');
const mongoose=require('mongoose');
const SchemaVariable=mongoose.Schema;
const UserDetailSchema=new SchemaVariable({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    phn:{
        type:Number,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    user_id:{
        type:String,
        required:true
    }
})

module.exports=mongoose.model('User_Details',UserDetailSchema);
