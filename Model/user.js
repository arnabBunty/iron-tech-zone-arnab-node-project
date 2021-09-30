const mongoose=require('mongoose');
const SchemaVariable=mongoose.Schema;
const UserSchema=new SchemaVariable({
    first_name:{
        type:String,
        required:true
    },
    last_name:{
        type:String,
        required:true
    },
    utype:{
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
    pass:{
        type:String,
        required:true
    }
})

module.exports=mongoose.model('Users',UserSchema);
