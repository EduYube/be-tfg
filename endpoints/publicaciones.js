const connection = require ('./connection')


function checkError(err) {
    if(err){
        callback(500, {message: 'Error en la base de datos'})
        return;
    }
}

module.exports = {
        get:(data, callback) => {
            const {id} = data;
          connection.query('SELECT * FROM publicaciones', (err, rows) => {
                checkError(err);
                if(!isNaN(parseInt(id))){
                    rows.filter( (publicacion) => {
                        if (publicacion.id == id) {
                            return callback (200, publicacion)
                        }
                    })
                    return callback (404, {message:'Publicacion no encontrada'})
                }else{
                    callback (200, rows)
                }
          })
        },
        post:(data, callback) => {
            const {texto, ciudad, provincia, img} = data.payload;
            connection.query('INSERT INTO publicaciones SET text = ?, '+
                'ciudadId = (SELECT id FROM ciudades WHERE nombre = ? LIMIT 1), '+
                'provinciaId = (SELECT id FROM provincias WHERE nombre = ? LIMIT 1), img = ?', 
                [texto, ciudad, provincia, img],
                (err, _) => {
                    checkError(err);
                    callback (201, {message: 'Se ha posteado la publicacion'})
            })
        },
        put:(data, callback) => {
            const {id} = data;
            if(isNaN(parseInt(id))){
                callback(400, {message: 'El id debe ser un número'});
                return;
            } else {
            connection.query('UPDATE publicaciones SET ? WHERE id = ?', [data.payload, id], (err, _rows) => {
                    checkError(err);
                    callback (204, {message: 'Se ha actualizado la publicacion'})  
                })
            }
        },
        delete:(data, callback) => {
            const {id} = data;
            if(isNaN(parseInt(id))){
                callback(400, {message: 'El id debe ser un número'});
                return;
            } else {
                connection.query('DELETE FROM publicaciones WHERE id = ?', id, (err, _rows) => {
                    checkError(err);
                    callback (200, {message: 'Se ha eliminado la publicacion'}) 
                })
            }
        },
    }