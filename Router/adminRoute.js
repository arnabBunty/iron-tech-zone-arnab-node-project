const exp=require('express');
const routing=exp.Router();
const adminController=require('../Controller/adminController');
const isAdmin=require('../MiddleWare/isAdmin');


routing.get('/admin/addproduct',isAdmin,adminController.getAddproduct);
routing.post('/addproduct',isAdmin,adminController.postAddproduct);
routing.get('/admin/editproduct/:p_id',isAdmin,adminController.getEditproduct);
routing.post('/editproduct',isAdmin,adminController.postEditproduct);
routing.get('/deleteproduct/:p_id',isAdmin,adminController.getDeleteproduct);
// routing.post('/deleteproduct',adminController.postDeleteproduct);
routing.get('/admin/viewproduct',isAdmin,adminController.getProdview);





module.exports=routing;