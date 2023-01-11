var conn = require('./db');
var moment = require('moment')
const Pagination = require('./paginador');

module.exports = {
    
     getReservations(req){

        return new Promise((resolve, reject)=>{

            let page = req.query.page;
            let dtStart = req.query.start;
            let dtEnd = req.query.end;

            if(!page) page = 1;

            let where = '';
            let params= [];
            if(dtStart && dtEnd){
                where = 'WHERE date BETWEEN ? AND ?'
                params.push(dtStart, dtEnd)
            };

            let pagina = new Pagination(
                `
                SELECT SQL_CALC_FOUND_ROWS * FROM tb_reservations 
                ${where}
                ORDER BY name LIMIT ?, ?
                `,
                params
            );

            pagina.getPage(page).then(data=>{
                resolve({
                    data,
                    links: pagina.getNavigation(req.query)
                })
            }).catch(err=>{reject(err)})
        
        });
        

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
    },

        //   SELECT CONCAT(YEAR(date), '-', MONTH(date)) AS dates,
        //     COUNT(*) AS total,
        //     SUM(people) / COUNT(*)  AS avg_people
        //     FROM tb_reservations
        //     WHERE date BETWEEN ? AND ? 
        //     GROUP BY YEAR(dates) DESC, MONTH(dates) DESC
        //     ORDER BY YEAR(dates) DESC, MONTH(dates) DESC;

    chart(req){
        return new Promise((resolve, reject)=>{


            conn.query(`
                    SELECT
                    YEAR(date) AS years,
                    MONTH(date) AS months,
                    COUNT(*) AS total,
                    SUM(people) / COUNT(*) AS avg_people
                    FROM saboroso.tb_reservations
                    WHERE
                    date BETWEEN ? AND ?
                    GROUP BY 1, 2
                    ORDER BY YEAR(date) ASC , MONTH(date) ASC;
                    `, 
            [req.query.start, req.query.end],
            (err, results)=>{
                if(err){
                    reject(err)
                } else{
                    let months = [];
                    let values = [];

                    results.forEach(result=>{
                        let date = `${result.years}-${result.months}`
                        months.push(moment(date).format("MMM YYYY"));
                        values.push(result.total)
                    });

                    resolve({
                        months,
                        values
                    })
                }
            })
        })
    },

    nrDB(){

        return new Promise((resolve, reject)=>{


            conn.query(`
                    select 
                    (select count(*) from tb_contacts) as nr_contacts,
                    (select count(*) from tb_reservations) as nr_reservations,
                    (select count(*) from tb_menus) as nr_menus,
                    (select count(*) from tb_users) as nr_users;
                    `, 
                (err, results)=>{
                    if(err){
                        reject(err)
                    } else{
                        resolve(results[0])
                    }
            })
        })

    }
}