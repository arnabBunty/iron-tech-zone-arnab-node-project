const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const orderSchema = new Schema({
  products: [
    {
      product: { 
          type: Object, 
          required: true 
        },
      quantity: { 
          type: Number, 
          required: true 
        }
    }
  ],
  order_status:{
    type:String,
    required:true
  },
  user: {
    email: {
      type: String,
      required: true
    },
    userId: {
      type: String,
      required: true
    },
    userDetails_id:{
      type: String,
      required: true
    }
  },
  total:{
    type:Number,
    required:true
  },
  order_time:{
      type:Date,
      required:true
  }
});


module.exports = mongoose.model('Orders', orderSchema);