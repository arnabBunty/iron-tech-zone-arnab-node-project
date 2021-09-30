module.exports=(req,res,next)=>{
    if(!req.session.isLogged){
        console.log("Signin First");
        res.redirect('/signin');
    }
    next();
}