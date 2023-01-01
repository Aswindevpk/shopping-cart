var express = require('express');
var router = express.Router();
var sellerHelper = require('../helpers/seller-helper');



/* GET home page */
router.get('/', function(req, res, next) {
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
router.get('/all-orders',(req,res)=>{
  res.render('seller/seller-all-orders',{ seller:true })
})

/* GET profile page */
router.get('/profile',(req,res)=>{
  res.render('seller/seller-profile',{ seller:true })
})



// POST methods

router.post('/signup',(req,res)=>{
  var sellerData = req.body
  sellerHelper.doSignUp(sellerData).then((response)=>{

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

module.exports = router;
