const productModel=require('../Model/product');
const CartModel=require('../Model/cart');
const OrderModel=require('../Model/order');


exports.getHome=(req,res)=>{
    if(req.query.srch){
        // const prod_srch=req.query.prod_srch;
        const regex = new RegExp(escapeRegex(req.query.srch), 'gi');
        productModel.find({$or:[{prod_name:regex},{prod_desc:regex}]}).then(result=>{
            res.render('Shop/home',{
                title:"Shop Home",
                products:result,
                path:'/'
            })
        }).catch(err=>{
            console.log("Data not inserted ",err);
        })  
    }else if(req.query.price_range){
        const price_range=req.query.price_range;
    let operation;
    if(price_range==="price_asc"){
        operation=productModel.find().sort({prod_price:1});
    }else if(price_range==="price_desc"){
        operation=productModel.find().sort({prod_price:-1});
    }else if(price_range==="name_asc"){
        operation=productModel.find().sort({prod_name:1});
    }else if(price_range==="name_desc"){
        operation=productModel.find().sort({prod_name:-1});
    }else{
        operation=productModel.find();
    }
    operation.then(result=>{
        res.render('Shop/home',{
            title:"Shop Home",
            products:result,
            path:'/'
        })
    }).catch(err=>{
        console.log("Data not inserted ",err);
    })
    }else{
        productModel.find().then(product=>{
        res.render('Shop/home',{
            title:"Shop Home",
            products:product,
            path:'/' 
            // <%=path === '/home' ? 'active' : ' '%>
        })
    }).catch(err=>{
        console.log(err);
    })
    }
    
}



exports.getDetails=(req,res)=>{
    const prod_id=req.params.p_id;
    console.log(prod_id);
    productModel.findById(prod_id).then(product=>{
        console.log(product);
    res.render('Shop/productdetail',{
        title:"Details",
        product:product,
        path:'/details/:p_id'
    })
}).catch(err=>{
    console.log(err);
})
}

exports.postCart=(req,res)=>{
    const prod_id=req.body.prod_id;
    const user_id=req.user._id;
    const prod=req.body.prod;
    const quantity=req.params.qty
    console.log(prod,quantity);
    if(quantity && prod){
        CartModel.findOneAndUpdate({user_id:user_id,product_id:prod},{quantity:quantity}).then(result=>{                
            console.log("Quantity update successfully done!!");
            return res.redirect('/cart')
        }).catch(err=>{
            console.log(err);
        })
    }else{
         CartModel.findOne({user_id:user_id,product_id:prod_id}).then(qty=>{
                    // console.log(qty);
                    if(qty){
                        CartModel.findOneAndUpdate({user_id:user_id,product_id:prod_id},{quantity:qty.quantity+1}).then(result=>{                
                            console.log("Quantity update successfully done!!");
                            return res.redirect('/cart')
                        }).catch(err=>{
                            console.log(err);
                        })
                    }else{
                        productModel.findById(prod_id).then(result=>{
                        const Data=new CartModel({
                            products:result,
                            product_id:prod_id,
                            quantity:1,
                            user_id:user_id
                        });
                        Data.save().then(result=>{
                            console.log("Product added successfully!!");
                            return res.redirect('/cart')
                        }).catch(err=>{
                            console.log(err);
                        })
                    })
                    }
                })   
        
    }
}

exports.getCart=(req,res)=>{
    CartModel.find({user_id:req.user._id}).then(result=>{
        res.render('Shop/cart',{
            title:"User Cart",
            path: '/cart',
            products:result
        })
    })
}

exports.postCartItemDelete=(req,res)=>{
    const p_id=req.body.prod_id;
    CartModel.findOneAndDelete({product_id:p_id,user_id:req.user._id}).then(result=>{
        console.log("Item Deleted from cart");
        return res.redirect('/cart');
    }).catch(err=>{
        console.log(err);
    })
}

exports.getCheckout=(req,res)=>{
    const total=req.query.total;
    CartModel.find({user_id:req.user._id}).then(result=>{
        res.render('Shop/checkout',{
            path:'/checkout',
            title:"Checkout",
            products:result,
            total:total
        })
    })
}



exports.postPlaceorder=(req,res)=>{
    const total=req.body.total;
    CartModel.find({user_id:req.user._id}).then(result=>{
        console.log("Order",result); 
        const products = result.map(i => {
            return { quantity: i.quantity, product: i.products };
          });
          console.log(products);
          console.log(new Date(Date.now()));
        const Data=new OrderModel({
            products:products,
            order_status:"Orderd",
            user: {
                email: req.user.email,
                userId: req.user._id
              },
              total:total,
              order_time: new Date(Date.now())
        });
        Data.save().then(result=>{
            console.log("Order successfully Done!!");
            return res.redirect('/')
        }).catch(err=>{
            console.log(err);
        })
    })
}

exports.pnf=(req,res)=>{
    res.render('pnf')
}

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
  };