var conn = require('./db');

module.exports = {
    render(req, res, err){
        res.render('admin/emails',{
            body: req.body,
            error: err
        });
    },


    save(fields){
        return new Promise((resolve, reject)=>{
            conn.query(`
            INSERT INTO tb_emails (email)
            VALUES (?);
        `, 
        [fields.email], 
        (err, result)=>{
            if(err){
                reject(err);
            } else {
                resolve(result)
            };
        });
        });
    },

    getEmails(){
        return new Promise((resolve, reject)=>{

            conn.query(
                        `
                SELECT * FROM tb_emails ORDER BY register
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
                DELETE FROM tb_emails WHERE id = ?
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