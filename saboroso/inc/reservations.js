var conn = require('./db')

module.exports = {
    render(req, res, alertError, alertSuccess){
        res.render('reservation', {
            title: 'Restaurant Saboroso!',
            img: 'images/img_bg_2.jpg',
            text1: 'Feito por',
            h1: 'Reserve uma Mesa!',
            isHome: false,
            body: req.body,
            error: alertError,
            confirmed: alertSuccess, 
          })
    },
    save(fields){
        return new Promise((resolve, reject)=>{
            let date = fields.date.split('/');
            fields.date = `${date[2]}-${date[1]}-${date[0]}`

            conn.query(`
            INSERT INTO tb_reservations (name, email, people, date, time)
            VALUES(?, ?, ?, ?, ?)
        `, [
            fields.name, fields.email, 
            fields.people, fields.date, fields.time
        ], (err, result)=>{
            if(err){
                reject(err);
            } else {
                resolve(result)
            }
        });
        })
    }
}