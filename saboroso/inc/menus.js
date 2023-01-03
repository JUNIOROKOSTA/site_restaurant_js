var conn = require('./db');

module.exports = ({
    getMenus(){
        return new Promise((resolve, reject)=>{

            conn.query(
                        `
                SELECT * FROM tb_menus ORDER BY title
                `, (err,results)=>{
                if(err){
                    reject(err);
                };
                resolve(results);
    
        })});
        
    },

    save(fields, files){
        return new Promise((resolve, reject)=>{

            fields.photo = `images/${files.photo.newFilename}`;

            let query, queryPhoto = '', params = [
                fields.title, 
                fields.description, 
                fields.price, 
                ];

            if(files.photo.name){
                queryPhoto = ',photo = ?';
                params.push(fields.photo)
            }

            if(parseInt(fields.id) > 0){

                params.push(fields.id)
                query = `
                    UPDATE tb_menus
                    SET title = ?, 
                    description = ?, 
                    price = ? 
                    ${queryPhoto}
                    WHERE id = ?
                `;
            }else{
                if(!files.photo.name){
                    reject("Foto do prato é Obrigatório")
                }
                query = `
                INSERT INTO tb_menus (title, description, price, photo)
                VALUES (?, ?, ?, ?)
            `;
            }



            conn.query(query, params, (err, results)=>{
                if(err){
                    reject(err);
                } else{
                    resolve(results)
                }
            })
        })
    }
});