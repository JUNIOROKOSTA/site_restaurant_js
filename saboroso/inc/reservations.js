var conn = require('./db');
const Pagination = require('./paginador');

module.exports = {

     getReservations(page){
        if(!page) page = 1;

        let pagina = new Pagination(
            `
            SELECT SQL_CALC_FOUND_ROWS * FROM tb_reservations ORDER BY name LIMIT ?, ?
            `
        );

        return pagina.getPage(page);

        // return new Promise((resolve, reject)=>{

        //     conn.query(
        //                 `
        //         SELECT * FROM tb_reservations ORDER BY date DESC
        //         `, (err,results)=>{
        //         if(err){
        //             reject(err);
        //         };
        //         resolve(results);
    
        // })});
        
    },

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

    delete(id){
        return new Promise((resolve, reject)=>{
            conn.query(`
                DELETE FROM tb_reservations WHERE id = ?
            `,[id],(err, results)=>{
                if(err){
                    reject(err)
                } else {
                    resolve(results)
                }
            })
        })
    },

    save(fields){
        return new Promise((resolve, reject)=>{
            if(fields.date.indexOf('/') > -1){
                let date = fields.date.split('/');
                fields.date = `${date[2]}-${date[1]}-${date[0]}`;
            }
            

            let query, params;

            if(parseInt(fields.id)> 0){
                // if id > 0 ==> Update
                query = `UPDATE tb_reservations 
                SET
                    name = ?,
                    email = ?,
                    people = ?,
                    date = ?,
                    time = ?
                WHERE id = ? `;

                 params =  [fields.name, fields.email, 
                            fields.people, fields.date, 
                            fields.time, fields.id]
            } else {
                // if id < 0 ==> Insert

                query = `INSERT INTO tb_reservations 
                (name, email, people, date, time)
                VALUES(?, ?, ?, ?, ?)`;
                
                params =  [fields.name, fields.email, 
                            fields.people, fields.date, 
                            fields.time ]
            }

            conn.query(query, params, (err, result)=>{
            if(err){
                reject(err);
            } else {
                resolve(result)
            }
        });
        })
    }
}