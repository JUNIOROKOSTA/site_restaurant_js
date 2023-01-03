var connect = require('./db')

module.exports = {

    render(req, res, err){
        res.render('admin/login',{
            body: req.body,
            error: err
        });
    },

    login(email, password) {
        return new Promise((resolve, reject) => {
            connect.query(`
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
    }
}