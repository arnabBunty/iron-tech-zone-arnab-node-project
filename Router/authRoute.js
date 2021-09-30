const exp=require('express');
const routing=exp.Router();
const authController=require('../Controller/authController');
const isAuth=require('../MiddleWare/isAuth');
const {check,body}=require('express-validator');

routing.get('/signin',authController.getSignin);
routing.post('/signinValue',authController.postSignin);
routing.get('/signup',authController.getSignup);
routing.post('/signupValue',
[
body ('first_name','Valid  First name  here' ) .isLength( {min: 3}),
body ('last_name','Valid  Last name  here' ) .isLength( {min: 3}),
check ('email') .isEmail () .withMessage("input valid email"),
body ('pass','Enter valid password ' ) .isLength ({min : 3,max:6})
],
authController.postSignup);
routing.get('/logout',isAuth,authController.logout);
routing.get('/forgot',authController.forgot);
routing.post('/forgotvalue',authController.postForgot);


module.exports=routing;