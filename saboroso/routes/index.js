const conn = require('./../inc/db')
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

  conn.query(
    `
    SELECT * FROM tb_menus ORDER BY title
    `, (err,results)=>{
      if(err){
        console.log('ERROR:> ' , err);
      }

      res.render('index', {
        title: 'Restaurant Saboroso!',
        menus: results
      })

    });

});

module.exports = router;
