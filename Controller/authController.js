const userModel=require('../Model/user');
const bcrypt=require('bcryptjs');
const {validationResult}=require('express-validator');
const nodemailer=require('nodemailer');
const sendGrid=require('nodemailer-sendgrid-transport');
const user = require('../Model/user');

const createMailer=nodemailer.createTransport(sendGrid({
    auth:{
        api_key:'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'
    }
}));

exports.getSignup=(req,res)=>{
    if(req.session.isLogged){
        console.log("You already Signin");
        if(req.session.user.utype=='Admin'){
            return res.redirect('/admin/viewproduct'); 
        }else{
            return res.redirect('/');
        } 
    }
    res.render('Auth/signup',{
        title:'Sign Up',
        path:'/signup',
        error:[]
    })
}


exports.postSignup=(req,res)=>{
    const first_name=req.body.first_name;
    const last_name=req.body.last_name;
    const utype="User";
    const email=req.body.email;
    const phn=req.body.phn;
    const pass=req.body.pass;
    let err=validationResult(req);
    if(!err.isEmpty()){
        errResponse=validationResult(req).array();
        console.log(errResponse);
        res.render('Auth/signup',{
            title:'Sign Up',
            path:'/signup',
            error:errResponse
        })
    }else{
    userModel.findOne({email:email}).then(result=>{
        if(result){
            console.log("Email already exist");
          return  res.redirect('/signin');
        }else{
            return bcrypt.hash(pass,12).then(hashPass=>{
                const data=new userModel({
                    first_name:first_name,
                    last_name:last_name,
                    utype:utype,
                    email:email,
                    phn:phn,
                    pass:hashPass
                });
                data.save()
            }).then(result=>{
                console.log("Registation Done");
                createMailer.sendMail({
                    to:email,
                    from:"arnab.gupta1878@gmail.com",
                    subject:"Registration Successfull",
                    html:"<h1>Hello "+first_name+", You have Successfully register</h1>"
                })
                return res.redirect('/signin');
            }).catch(err=>{
                console.log(err);
            })
        }

    }).catch(err=>{

    })
}
    

}


exports.getSignin=(req,res)=>{
    if(req.session.isLogged){
        console.log("You already Signin");
        if(req.session.user.utype=='Admin'){
            return res.redirect('/admin/viewproduct'); 
        }else{
            return res.redirect('/');
        } 
    }
    let message=req.flash('err');
    if(message.length>0){
        message=message[0];
    }else{
        message=null
    }
    return res.render('Auth/signin',{
        title:'Sign In',
        message:message,
        cookiedata:req.cookies,
        path:'/signin'
    })
}


exports.postSignin=(req,res)=>{
    const user_email=req.body.email;
    const user_pass=req.body.pass;
    const checked=req.body.checked;
    // console.log(checked);
    userModel.findOne({email:user_email}).then(user=>{
        if(!user){
            console.log('Invalid email');
            req.flash('err','Invalid email');
            return res.redirect('/signin');
        }
        return bcrypt.compare(user_pass,user.pass).then(result=>{
            if(result){
            console.log("result",result);
            req.session.isLogged=true;
            req.session.user=user;
            return req.session.save(result=>{
                req.flash('success','Successfully Login!!');
                console.log('Successfully Login!!');
                if(checked){
                    const cookiedata={email:user.email,pass:user_pass};
                    res.cookie("cookiedata",cookiedata,{
                        expires: new Date(Date.now()+10000000000),
                        httpOnly:true
                    })
                }
                if(user.utype==="Admin"){
                    return res.redirect('/admin/viewproduct')
                }
                return res.redirect('/')
                
            })
            }
            req.flash('err','Password not match');
            res.redirect('/signin')
            console.log('Password not match');
        }).catch(err=>{
            console.log('Password not match');
        })
    }).catch(err=>{
        console.log(err);
    })

}

exports.forgot=(req,res)=>{ 
    console.log(req.query);
    const email=req.query.email
    if(email && !req.query.id){
        userModel.findOne({email:email}).then(user=>{
            if(!user){
                console.log('Invalid email');
                req.flash('err','Wrong Email or Signup First');
                let message=req.flash('err');
    if(message.length>0){
        message=message[0];
    }else{
        message=null
    }
                return res.render('Auth/forgot',{
                    title:'forgot',
                    after:false,
                    email:null,
                    success:null,
                    message:message,
                    id:null,
                    path:'/forgot'
                })
            }else{
                createMailer.sendMail({
                    to:email,
                    from:"arnab.gupta1878@gmail.com",
                    subject:"Reset Password",
                    html:`<h1>For reset password <a href="http://localhost:7278/forgot?email=${email}&id=${user._id}">click here!!</a></h1>`
                })
                req.flash('success','Reset mail sent to your mail id.');
                let success=req.flash('success');
                // console.log(success);
    if(success.length>0){
        success=success[0];
    }else{
        success=null
    }
                return res.render('Auth/forgot',{
                    title:'forgot',
                    after:false,
                    email:null,
                    success:success,
                    message:null,
                    id:null,
                    path:'/forgot'
                })
            }
        })
    }else if(email && req.query.id){
        let message=req.flash('err');
    if(message.length>0){
        message=message[0];
    }else{
        message=null
    }
        return res.render('Auth/forgot',{
            title:'forgot',
            after:true,
            email:email,
            success:null,
            message:message,
            id:req.query.id,
            path:'/forgot'
        })
    }else{
        let message=req.flash('err');
    if(message.length>0){
        message=message[0];
    }else{
        message=null
    }
    return res.render('Auth/forgot',{
            title:'forgot',
            after:false,
            email:null,
            success:null,
            message:message,
            id:null,
            path:'/forgot'
    })
    }
}

exports.postForgot=(req,res)=>{
    const email=req.body.email;
    const id=req.body.id;
    const pass1=req.body.pass1;
    const pass2=req.body.pass2;
    console.log(req.body);
    if(pass1!=pass2){
        // console.log('Password not match');
        req.flash('err','Confirm Password not match');
        let message=req.flash('err');
    if(message.length>0){
        message=message[0];
    }else{
        message=null
    }
        return res.render('Auth/forgot',{
            title:'forgot',
            after:true,
            email:email,
            success:null,
            message:message,
            id:id,
            path:'/forgot'
        })
    }else{
        bcrypt.hash(pass2,12).then(hashPass=>{
            userModel.findByIdAndUpdate(id,{
                pass:hashPass
            }).then(result=>{
                console.log("Password Changed");
                return res.redirect('/signin')
            }).catch(err=>{
                console.log(err);
            })
        })
    }

}


exports.logout=(req,res)=>{
    req.session.destroy();
    // req.flash('success','Session Expired, User Logged out');
    console.log("Session Expired, User Logged out");
    res.redirect('/signin');

}