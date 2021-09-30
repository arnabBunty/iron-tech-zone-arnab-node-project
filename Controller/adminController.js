// const arr=[];
const ProductModel=require("../Model/product");



exports.getAddproduct=(req,res)=>{
    res.render('Admin/addProduct',{
        title:"Add product",
        path:'/admin/addproduct'
    })
}
exports.postAddproduct=(req,res)=>{
    const p_name=req.body.prod_name;
    const p_price=req.body.prod_price;
    const p_qty=req.body.prod_qty;
    const p_img=req.file;
    
    const p_cat=req.body.prod_cat;
    const p_desc=req.body.prod_desc;
    const prod_img=p_img.path; 
    console.log(p_img);   
    const Data=new ProductModel({
        prod_name:p_name,
        prod_price:p_price,
        prod_qty:p_qty,
        prod_img:prod_img,
        prod_cat:p_cat,
        prod_desc:p_desc
    });
    Data.save().then(result=>{
        console.log("Successfully Inserted");
    }).catch(err=>{
        console.log("Data not inserted ",err);
    })
    res.redirect('/admin/viewproduct');
}



exports.getEditproduct=(req,res)=>{
    const prod_id=req.params.p_id;
    ProductModel.findById(prod_id).then(product=>{
    res.render('Admin/editProduct',{
        title:"Edit product",
        productValue:product,
        path:'/admin/editproduct/:p_id'
    })
}).catch(err=>{
    console.log(err);
})
}

exports.postEditproduct=(req,res)=>{
    const p_id=req.body.prod_id
    const p_qty=req.body.prod_qty;
    const p_img=req.file;
    const p_name=req.body.prod_name;
    const p_price=req.body.prod_price;
    const p_cat=req.body.prod_cat;
    const p_desc=req.body.prod_desc;
    const prod_img=p_img.path;  
    ProductModel.findByIdAndUpdate(p_id,{
        prod_name:p_name,
        prod_price:p_price,
        prod_qty:p_qty,
        prod_img:prod_img,
        prod_cat:p_cat,
        prod_desc:p_desc
    }).then(result=>{
        console.log("Successfully Inserted");
        res.redirect('/admin/viewproduct');
    }).catch(err=>{
        console.log("Data not inserted ",err);
    })
    
}


exports.getDeleteproduct=(req,res)=>{
    const prod_id=req.params.p_id;
    ProductModel.findByIdAndDelete(prod_id).then(result=>{
        res.send("<center><h1>Product Deleted</h1><br><a href='/admin/viewproduct'><button>BACK</button></a></center>")
    }).catch(err=>{
        console.log("Data not deleted ",err);
    })
}

// exports.postDeleteproduct=(req,res)=>{
//     const prod_id=req.body.p_id;
//     ProductModel.findByIdAndDelete(prod_id).then(result=>{
//         res.send("<center><h1>Product Deleted</h1><br><a href='/admin/viewproduct'><button>BACK</button></a></center>")
//     }).catch(err=>{
//         console.log("Data not inserted ",err);
//     })
// }


exports.getProdview=(req,res)=>{
    if(req.query.srch){
        const regex = new RegExp(escapeRegex(req.query.srch), 'gi');
        ProductModel.find({$or:[{prod_name:regex},{prod_desc:regex}]}).then(result=>{
            res.render('Admin/viewProduct',{
                title:'View Product',
                products:result,
                path:'/admin/viewproduct'
            })
        }).catch(err=>{
            console.log("Data not inserted ",err);
        })  
    }else if(req.query.sort){
        const sorting=req.query.sort;
    let operation;
    if(sorting==="asc"){
        operation=ProductModel.find().sort({prod_name:1});
    }else if(sorting==="desc"){
        operation=ProductModel.find().sort({prod_name:-1});
    }else{
        operation=ProductModel.find();
    }
    operation.then(result=>{
        res.render('Admin/viewProduct',{
            title:'View Product',
            products:result,
            path:'/admin/viewproduct'
        })
    }).catch(err=>{
        console.log("Data not inserted ",err);
    })
    }else{
    ProductModel.find().then(product=>{
        // console.log(product);
    res.render('Admin/viewProduct',{
        title:'View Product',
        products:product,
        path:'/admin/viewproduct'
    })
}).catch(err=>{
    console.log(err);
})
}
}


function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
  };