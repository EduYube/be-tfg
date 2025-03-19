const connection = require('./connection');

module.exports = {
    get: (data, callback) => {
        connection.query('SELECT * FROM provincias', (err, rows) => {
            if(err){
                callback(500, {message: 'Error en la base de datos'})
                return;
            }
            callback(200, rows);
        })
    }
}