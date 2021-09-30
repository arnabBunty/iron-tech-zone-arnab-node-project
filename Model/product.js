const mongoose=require('mongoose');
const SchemaVariable=mongoose.Schema;
const ProductSchema=new SchemaVariable({
    prod_name:{
        type:String,
        required:true
    },
    prod_price:{
        type:Number,
        required:true
    },
    prod_qty:{
        type:Number,
        required:true
    },
    prod_img:{
        type:String,
        required:true
    },
    prod_cat:{
        type:String,
        required:true
    },
    prod_desc:{
        type:String,
        required:true
    }
})

module.exports=mongoose.model('Products',ProductSchema);
