const conn = require('./../inc/db')
var express = require('express');
var router = express.Router();


module.exports = function(io){
/* GET users listing. */
router.get('/', function(req, res, next) {
  conn.query('SELECT * FROM tb_users ORDER BY name', (err, result)=>{
    if(err){ res.send(err); } else { res.send(result);};

  })
});


  return router
};
