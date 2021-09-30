const mongoose=require('mongoose');
const SchemaVariable=mongoose.Schema;
const CartSchema=new SchemaVariable({
    products:{
            type: Object,
            required: true 
    },
    product_id:{
        type:String,
        required:true
    },
    quantity: { 
        type: Number, 
        required: true 
    },
    user_id:{
        type:String,
        required:true
    }
})

module.exports=mongoose.model('Carts',CartSchema);
