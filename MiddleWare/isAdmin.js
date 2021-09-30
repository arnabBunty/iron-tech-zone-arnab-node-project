module.exports=(req,res,next)=>{
        if(res.locals.utype!=="Admin"){
            console.log("Not access to Admin panel");
            return res.redirect('/signin');
        }
    next();
}