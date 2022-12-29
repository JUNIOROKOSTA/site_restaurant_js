const conn = require('./../inc/db');
var express = require('express');
var menus = require('./../inc/menus');
var reservations = require('./../inc/reservations');
var contacts = require('./../inc/contacts');
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
  contacts.render(req, res)
});

router.post('/contacts',function(req, res, next){
  console.log(req.body)
  if(!req.body.name){
    contacts.render(req, res, "Digite o Nome!");
  } else if(!req.body.email){
    contacts.render(req, res, "Digite o Email!");
  } else if(!req.body.message){
    contacts.render(req, res, "Digite a Mensagem!");
  } else {
    contacts.save(req.body).then(results=>{
      req.body = {};

      contacts.render(req, res, null, "Contato registrado!");
    }).catch(err=>{
      contacts.render(req, res, err.message);
    })

  }
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
  reservations.render(req, res);
});

// {"name":"junior","email":"juniorkosta2013@gmail.com","people":"3","date":"29/12/2022","time":"11:35"}

router.post('/reservations',function(req, res, next){
  if(!req.body.name){
    reservations.render(req, res, "Digite o Nome!");
  } else if(!req.body.email){
    reservations.render(req, res, "Digite o Email!");
  } else if(!req.body.people){
    reservations.render(req, res, "Digite o Número de pessoas!");
  } else if(!req.body.date){
    reservations.render(req, res, "Digite o Data que deseja reservar!");
  } else if(!req.body.time){
    reservations.render(req, res, "Digite o Horario que deseja reservar!");
  } else{
    reservations.save(req.body).then(results=>{

      req.body = {};

      reservations.render(req, res, null, "Reserva relizada com sucesso!")
    }).catch(err=>{
      reservations.render(req, res, err.message)
    });
  };

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
