var express = require('express');
var router = express.Router();
var sellerHelper = require('../helpers/seller-helper');



const verifyLogin=(req,res,next)=>{
  let sellerData = req.session.seller
  // req.session.seller={
  //   "name": "Aiswarya Designers",
  //   "email": "aiswarya@gmail.com",
  //   "phone": "9847887293",
  //   "address": "PK complex , Neravath, Ozhukur PO, mongam (via),Malappuram (Dist) - 673642",
  //   "password": "$2b$10$jPA1rJmdGkHgw9hAf2hD3u6zcqUBacfuVyyA8zqnh70BrDXc0DifK",
  //   "balance": 0,
  //   "categories": [
  //     "Grocery"
  //   ]
  // }

  if(sellerData){
    next()
  }else{
    res.redirect('/seller/login')
  }
}

/* GET home page */
router.get('/',verifyLogin, function(req, res, next) {
  let sellerData = req.session.seller
  if(sellerData){
    res.render('seller/seller-products',{seller:true, sellerData})
  }else{
    res.redirect('/seller/login')
  }
});

/* GET login page */
router.get('/login', function(req, res, next) {
  let sellerData = req.session.seller
  res.render('seller/login', { seller:true ,sellerData});
});

/* GET log-our page */
router.get('/log-out',(req,res)=>{
  req.session.destroy()     //destroy session
  res.redirect('/seller')
})

/* GET signup page */
router.get('/signup',(req,res)=>{
  res.render('seller/signup',{ seller:true })
})

/* GET all-orders page */
router.get('/all-orders',verifyLogin,(req,res)=>{
  let sellerData = req.session.seller
  res.render('seller/seller-all-orders',{ seller:true ,sellerData})
})

/* GET profile page */
router.get('/profile',verifyLogin,(req,res)=>{
  let sellerData = req.session.seller
  sellerHelper.getSellerDetails(sellerData.email).then((response)=>{
    req.session.seller = response
    let sellerData = response
    res.render('seller/seller-profile',{ seller:true ,sellerData})
  })
})

/* GET add product page */
router.get('/add-product',verifyLogin,(req,res)=>{
  let sellerData = req.session.seller
  res.render('seller/seller-addproduct',{ seller:true ,sellerData})
})



// POST methods

router.post('/signup',(req,res)=>{
  var sellerData = req.body
  sellerHelper.doSignUp(sellerData).then((response)=>{
    res.redirect('/seller/login')
  })
})

router.post('/login',(req,res)=>{
  const sellerData = req.body
  sellerHelper.doLogin(sellerData).then((response)=>{
    if(response.status){
      req.session.seller = response.seller
      res.redirect('/seller')
    }else{
      res.render('seller/login',{seller:true, error:response.error})
    }
  })
})


router.post('/add-product',(req,res)=>{
  let product = req.body
  sellerHelper.addProduct(product).then(()=>{
    
  })


})

//add category 
router.post('/add-category',(req,res)=>{
  let category = req.body.category
  let sellerEmail = req.session.seller.email
  sellerHelper.addCategory(category, sellerEmail).then(()=>{
    res.redirect('/seller/profile')
  })
})

//remove category from database
router.get('/remove-category/:category',(req,res)=>{
  let sellerEmail = req.session.seller.email
  let category = req.params.category
  sellerHelper.removeCategory(category, sellerEmail).then(()=>{
    res.redirect('/seller/profile')
  })
})






module.exports = router;
