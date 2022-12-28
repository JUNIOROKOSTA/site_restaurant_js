const conn = require('./../inc/db')
var express = require('express');
var menus = require('./../inc/menus')
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {

  menus.getMenus().then(results =>{
    res.render('index', {
      title: 'Restaurant Saboroso!',
      menus: results,
      isHome: true,
    })
  });

});

router.get('/contacts',function(req, res, next){
  res.render('contact', {
    title: 'Restaurant Saboroso!',
    img: 'images/img_bg_3.jpg',
    text1: 'Feito por',
    h1: 'Diga um oi!',
    isHome: false,
  })
});

router.get('/menus',function(req, res, next){

  menus.getMenus().then(results =>{
    res.render('menu', {
      title: 'Restaurant Saboroso!',
      img: 'images/img_bg_1.jpg',
      text1: 'Feito por',
      h1: 'Saboreie nosso menu!',
      menus: results,
      isHome: false,
    })
  });
 
});

router.get('/reservations',function(req, res, next){
  res.render('reservation', {
    title: 'Restaurant Saboroso!',
    img: 'images/img_bg_2.jpg',
    text1: 'Feito por',
    h1: 'Reserve uma Mesa!',
    isHome: false,
  })
});

router.get('/services',function(req, res, next){
  res.render('services', {
    title: 'Restaurant Saboroso!',
    img: 'images/img_bg_1.jpg',
    text1: 'Feito por',
    h1: 'É um prazer poder servir!',
    isHome: false,
  })
});

module.exports = router;
