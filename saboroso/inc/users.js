var conn = require('./db')

module.exports = {

    render(req, res, err){
        res.render('admin/login',{
            body: req.body,
            error: err
        });
    },

    login(email, password) {
        return new Promise((resolve, reject) => {
            conn.query(`
            SELECT * FROM tb_users WHERE email = ?
            `, [
                email
            ], (err, results) => {
                if(err){
                    reject(err)
                } else{
                    if(!results.length > 0){
                        reject('Usuário ou senha incorretos.')
                    } else{
                        let row = results[0];
                        if(row.password !== password){
                            reject('Usuário ou senha inválidos.')
                        } else {
                            resolve(row)
                        }
                    }
                }
                

            })
        })
    },

    getUsers(){
        return new Promise((resolve, reject)=>{

            conn.query(
                        `
                SELECT * FROM tb_users ORDER BY name
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
                DELETE FROM tb_users WHERE id = ?
            `,[id],(err, results)=>{
                if(err){
                    reject(err)
                } else {
                    resolve(results)
                }
            })
        })
    },

    save(fields, files){
        return new Promise((resolve, reject)=>{

            let query, params = [
                fields.name, 
                fields.email,  
                ];

            if(parseInt(fields.id) > 0){

                params.push(fields.id)
                query = `
                    UPDATE tb_users
                    SET name = ?, 
                    email = ?
                    WHERE id = ?
                `;
            }else{
                query = `
                INSERT INTO tb_users (name, email, password)
                VALUES (?, ?, ?)
            `;
                params.push(fields.password)
            }



            conn.query(query, params, (err, results)=>{
                if(err){
                    reject(err);
                } else{
                    resolve(results)
                }
            })
        })
    },

    passwordChange(req){
        return new Promise((resolve, reject)=>{
//&& req.fields.password !== req.fields.passwordConfirm
            if(!req.fields.password){
                reject("Preencha os campos de Senha.")
            } else if(req.fields.password !== req.fields.passwordConfirm){
                 reject("Preencha corretamente os dois campos de Senha.")
            } else{
                let query = `
                    UPDATE tb_users
                    SET password = ?
                    WHERE id = ?
                `;

                let params = [
                    req.fields.password, 
                    req.fields.id,  
                    ];

                conn.query(query, params, (err, results)=>{
                    if(err){
                        reject(err.message);
                    } else{
                        resolve(results)
                    }
                })
            }

        })
    }
}