var express = require('express');
var users = require('./../inc/users')
var admin = require('./../inc/admin')
var menus = require('./../inc/menus');
var reservations = require('./../inc/reservations')
var contacts = require('./../inc/contacts')
var emails = require('./../inc/emails')
const { promise } = require('../inc/db');
var moment = require("moment");
var router = express.Router();

moment.locale("pt-BR")

router.use(function(req, res, next){
    if(['/login'].indexOf(req.url) === -1 && !req.session.user){
        res.redirect('/admin/login')
    }  else{
        next()
    }

});;

router.use(function(req, res, next){
    req.menus = admin.getMenus(req)

    next();
});;

router.get('/logout', function(req, res, next){
    delete req.session.user;

    res.redirect('/admin/login')
});;

router.get('/', function(req, res, next) {

    admin.dashboard().then(results=>{
        res.render('admin/index', admin.getParams(req, {data: results}));
    }).catch(err=>{
        console.error(err)
    })

    

});;

router.get('/contacts', function(req, res, next) {

    contacts.getContacts().then(data=>{
        res.render('admin/contacts', admin.getParams(req, 
            {
                date: {},
                data: data,
            }));
    })

});;

router.delete('/contacts/:id', function(req, res, next){
    contacts.delete(req.params.id).then(promise=>{
        res.send(promise)
    }).catch(err=>{console.log(err)})
});;

router.get('/emails', function(req, res, next) {
        emails.getEmails().then(data=>{
        res.render('admin/emails', admin.getParams(req, 
            {
                date: {},
                data: data,
            }));
    })
});;

router.delete('/emails/:id', function(req, res, next){
    emails.delete(req.params.id).then(promise=>{
        res.send(promise)
    }).catch(err=>{console.log(err)})
});;

router.post('/login', function(req, res, next) {
    if(!req.body.email){
        users.render(req, res, "Preencha o campo e-mail!")
    } else if(!req.body.password){
        users.render(req, res, "Preencha o campo senha!")
    } else{
        users.login(req.body.email, req.body.password).then(user=>{

            req.session.user = user;
            res.redirect('/admin'); 
        }).catch(err=>{
            users.render(req,res, err.message || err);
        })
    }
});;

router.get('/login', function(req, res, next) {
    users.render(req, res, null);

});;

router.get('/menus', function(req, res, next) {
    menus.getMenus().then(data=>{
        res.render('admin/menus', admin.getParams(req, {
        data: data
        }));

    }).catch(err=>{console.log(err)})
});;

router.post('/menus',function(req, res, next){
    // res.send(req.files);
    menus.save(req.fields, req.files).then(promise=>{
        res.send(promise);
    }).catch(err=>{res.send(err)})
});;

router.delete('/menus/:id', function(req, res, next){
    menus.delete(req.params.id).then(promise=>{
        res.send(promise)
    }).catch(err=>{console.log(err)})
});;

router.get('/reservations', function(req, res, next) {

    reservations.getReservations().then(data=>{
        res.render('admin/reservations', admin.getParams(req, 
            {
                date: {},
                data: data,
                moment
            }));
    })

    

});;

router.post('/reservations',function(req, res, next){
    // res.send(req.files);
    reservations.save(req.fields, req.files).then(promise=>{
        res.send(promise);
    }).catch(err=>{res.send(err)})
});;

router.delete('/reservations/:id', function(req, res, next){
    reservations.delete(req.params.id).then(promise=>{
        res.send(promise)
    }).catch(err=>{console.log(err)})
});;

router.get('/users', function(req, res, next) {

    users.getUsers().then(data=>{
        res.render('admin/users', admin.getParams(req, 
            {
                date: {},
                data: data,
            }));
    })

});;

router.post('/users',function(req, res, next){
    // res.send(req.files);
    users.save(req.fields, req.files).then(promise=>{
        res.send(promise);
    }).catch(err=>{res.send(err)})
});;

router.post('/users/password-change',function(req, res, next){
    // res.send(req.files);
    users.passwordChange(req).then(promise=>{
        res.send(promise);
    }).catch(err=>{res.send({error: err})})
});;

router.delete('/users/:id', function(req, res, next){
    users.delete(req.params.id).then(promise=>{
        res.send(promise)
    }).catch(err=>{console.log(err)})
});;


module.exports = router;