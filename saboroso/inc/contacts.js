var conn = require('./db');

module.exports = {
    render(req, res, alertError, alertSuccess){

        res.render('contact', {
            title: 'Restaurant Saboroso!',
            img: 'images/img_bg_3.jpg',
            text1: 'Feito por',
            h1: 'Diga um oi!',
            isHome: false,
            body: req.body,
            error: alertError,
            confirmed: alertSuccess, 
          })

    },

    save(fields){
        return new Promise((resolve, reject)=>{
            conn.query(`
            INSERT INTO tb_contacts (name, email, message)
            VALUES (?, ?, ?);
        `, 
        [fields.name, fields.email, fields.message], 
        (err, result)=>{
            if(err){
                reject(err);
            } else {
                resolve(result)
            };
        });
        });
    },

    getContacts(){
        return new Promise((resolve, reject)=>{

            conn.query(
                        `
                SELECT * FROM tb_contacts ORDER BY name
                `, (err,results)=>{
                if(err){
                    reject(err);
                };
                resolve(results);
    
        })});
        
    },

    delete(id){
        return new Promise((resolve, reject)=>{
            conn.query(`
                DELETE FROM tb_contacts WHERE id = ?
            `,[id],(err, results)=>{
                if(err){
                    reject(err)
                } else {
                    resolve(results)
                }
            })
        })
    },
}