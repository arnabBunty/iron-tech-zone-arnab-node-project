require('dotenv').config();
const exp=require('express');
const appServer=exp();
const userModel=require('./Model/user');
const CartModel=require('./Model/cart');

// 1st step for session
const Exp_Session=require('express-session'); //session package used to store info in memory but it has no infinite resource 
const mongodb_session=require('connect-mongodb-session')(Exp_Session); //used to store data in mongodb in a session package 
const csrf=require('csurf');
const csrf_protection=csrf();
const cookie=require('cookie-parser');
const flash=require('connect-flash');
const mongoose=require('mongoose');
let myDB="mongodb+srv://arnab1878:7278351878@mydatabase.bsoa3.mongodb.net/Product_Database2?retryWrites=true&w=majority";
const path=require('path');
const multer=require('multer'); //Multer is a middleware of nodejs for handling multipart/formdata which is primarily used for uploading file.
const adminRouter=require('./Router/adminRoute');
const shopRouter=require('./Router/shopRoute')
const authRouter=require('./Router/authRoute');


appServer.set('view engine','ejs');
appServer.set('views','Viewsdetail');

//Step 2 for session 
//to store data in mongodb session collection 
const storeValue=new mongodb_session({ 
    uri:'"mongodb+srv://arnab1878:7278351878@mydatabase.bsoa3.mongodb.net/Product_Database2',
    collection:'session-data' 
}) 

//step 3 for session 
appServer.use(Exp_Session({secret:'secret-key',resave:false,saveUninitialized:false,store:storeValue}));

/*Exsession is function here. to stop resaving, resave value false. to stop storing uninitialized value, saveUninitialized:false, secret key helps to generate id kind thing in session*/ 
appServer.use(exp.urlencoded());  //advance of body-parser
appServer.use(cookie());
appServer.use(flash());
appServer.use(exp.static(path.join(__dirname,'Public')));
appServer.use('/Upd_Images',exp.static(path.join(__dirname,'Upd_Images'))); //path setup
const fileStorage=multer.diskStorage({ //to store in Database
    destination:(req,file,cb)=>{
        cb(null,'Upd_Images')
    },
    filename:(req,file,cb)=>{
        cb(null,file.originalname)
    }
}); //storage setup

const fileFilter=(req, file, callback)=>{
    if(file.mimetype.includes ("png") || file.mimetype. includes("jpg") || file.mimetype.includes("jpeg") )
    {
    callback(null, true)
    }
    else
    callback(null, false)
    }; //filetype setup

    appServer.use(multer({storage: fileStorage, fileFilter:fileFilter,limits:{fieldSize:1024*1024*5}}).single('prod_img')); //file size setup


    appServer.use(csrf_protection);  //always after session and cookie

//step 4 for session 
appServer.use((req,res,next) => { 
    if(!req.session.user) 
{ 
    return next(); 
} 
userModel.findById(req.session.user._id) .then(userValue=>{ 
    req.user = userValue; 
    // console.log('app' + req.user) 
    next (); 
}).catch(err=> 
    console.log(err)); 

CartModel.find({user_id:req.session.user._id}).then(result=>{
    res.locals.cart=result;
    }).catch(err=> 
        console.log(err)); 
});



appServer.use((req,res,next)=>{
    res.locals.isAuthenticated=req.session.isLogged;
    res.locals.csrf=req.csrfToken();
    if(!req.session.isLogged){
        res.locals.utype=null;
        res.locals.name=null;
        res.locals.cart=null;
    }else{
        res.locals.utype=req.user.utype;
        res.locals.name=req.user.first_name;
    }
    // res.locals.csrfToken="hii";
    next();
})


appServer.use(adminRouter);
appServer.use(authRouter);
appServer.use(shopRouter);

mongoose.connect(process.env.DB_CONNECT,{useNewUrlParser:true,useUnifiedTopology:true})
    .then((clientValue)=>{
        appServer.listen(process.env.PORT || 7278,()=>{
            console.log('Server Connected to port no.'+process.env.PORT);
        })
    }).catch((err)=>{
        console.log("Error",err);
    })


//sendgrid: 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