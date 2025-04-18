const connection = require('./connection');

function checkError(err) {
    if(err){
        callback(500, {message: 'Error en la base de datos'})
        return;
    }
}

module.exports = {
    get: (data, callback) => {
        const {id} = data;
        connection.query('SELECT c.id, c.nombre, p.nombre AS provincia FROM provincias p INNER JOIN ciudades c ON p.id = c.provinciaId ORDER BY c.id', (err, rows) => {
            checkError(err);
            if(id){
                if(isNaN(parseInt(id))){
                    callback(400, {message: 'El id debe ser un número'});
                    return;
                } else {
                    let city;
                    rows.filter((ciudad) => {
                        if(ciudad.id == id){connection.query('SELECT c.nombre, p.nombre FROM provincias p INNER JOIN ciudades c ON p.id = c.provinciaId WHERE c.id = ?', ciudad.id, (err, rows) => {
                            checkError(err);
                            city = {
                                id: ciudad.id,
                                nombre: ciudad.nombre,
                                provincia: rows[0].nombre
                            }
                            if(city){
                                return callback (200, city)
                            } else {
                                return callback (404, {message:'Ciudad no encontrada'})
                            }
                        });
                        }
                    })         
                }
            } else {
                return callback(200, rows);
            }
        })
    },
    post: (data, callback) => {
        const {nombre, provinciaId} = data.payload;
        if(!nombre){
            callback(400, {message: 'El nombre de la ciudad no puede ser nulos'});
            return;
        }
        connection.query('INSERT INTO ciudades (nombre, provinciaId) VALUES (?, (SELECT id FROM provincias WHERE nombre = ?))', [nombre, provinciaId], (err) => {
            checkError(err);
            callback(201, {message: 'Ciudad creada correctamente'});
        })
    },
    put: (data, callback) => {
        const {nombre} = data.payload;
        const id = data.id;
        if(!nombre || !id){
            callback(400, {message: 'Asegurate de que el nombre o el id no son nulos'});
            return;
        }
        connection.query('UPDATE ciudades SET nombre = ? WHERE id = ?', [nombre, id], (err) => {
            checkError(err);
            callback(200, {message: 'Ciudad actualizada correctamente'});
        })
    },
    delete: (data, callback) => {
        const id = data.id;
        if(id){
            if(isNaN(parseInt(id))){
                callback(400, {message: 'El id debe ser un número'});
                return;
            } else {
                connection.query('DELETE FROM ciudades WHERE id = ?', [id], (err) => {
                    checkError(err);
                    callback(200, {message: 'Ciudad eliminada correctamente'});
                })
            }
        }
    }
}