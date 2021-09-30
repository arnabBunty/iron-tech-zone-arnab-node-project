const exp=require('express');
const routing=exp.Router();
const shopController=require('../Controller/shopController');
const isAuth=require('../MiddleWare/isAuth');


routing.get('/',shopController.getHome);
routing.get('/details/:p_id',shopController.getDetails);
routing.post('/postcart/:qty',isAuth,shopController.postCart);
routing.get('/cart',isAuth,shopController.getCart);
routing.post('/cart-delete-item',isAuth,shopController.postCartItemDelete);
routing.get('/checkout',isAuth,shopController.getCheckout);
routing.post('/place-order',isAuth,shopController.postPlaceorder);
routing.get('*',shopController.pnf);



module.exports=routing;