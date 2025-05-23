const connection= require('./connection')

function checkError(err) {
    if(err){
        callback(500, {message: 'Error en la base de datos'})
        return;
    }
}

module.exports = {
    get: (_, callback) => {
        connection.query('SELECT * FROM usuarios', (err, rows) => {
            checkError(err);
            const result = rows.filter((usuario) => {
                if(usuario.deleted != 1){
                    return usuario;
                }
            })
            return callback(200, result);
        })
    },
    post: (data, callback) => {
        connection.query('SELECT * FROM usuarios', (err,rows) => {
            checkError(err);
            if(data.payload.creation){
                const user = {nick: data.payload.nick, password: data.payload.password}
                connection.query('INSERT INTO usuarios SET ?', user, (err, _rows) =>{
                    if(err){
                        callback(500, {message: 'La conexion ha fallado'})
                        return
                    }else{ 
                        callback(201, {message: 'Se ha insertado el usuario'} )
                    }
                })
            } else if(data.payload) {
                let find = false;
                rows.filter((usuario) => { 
                    const user = {nick: data.payload.nick, password: data.payload.password}
                    if (usuario.nick == user.nick && usuario.password == data.payload.password) {
                        find = true;
                        callback (200,  usuario)
                        return;
                    } 
                })
                if(!find){
                    callback (404, {message:'Usuario no encontrado'})
                    return
                }
            } else {
                callback(400, {message: 'Algo ha fallado'})
                return
            }
        })
       
    },
    put: (data, callback) => {
        const user = {nick: data.payload.nick, password: data.payload.password, admin: data.payload.admin}
        const oldNick = data.payload.oldNick;
        connection.query('UPDATE usuarios SET ? WHERE nick = ?', [user, oldNick], (err, _rows) => {
            if (err){
                callback (500, {message: 'La conexion ha fallado'})
                return
            }else{
                callback(204, {message:'Se ha actualizado el usuario'})
            }
        })
    },
    delete: (data, callback) =>{
        const {nick} = data.payload;
        connection.query('UPDATE usuarios SET deleted = 1 WHERE nick = ?', nick, (err, _rows) => {
            checkError(err);
            callback (200, {message: 'Se ha eliminado el usuario'})
        })
    }
}