const mysql = require('mysql');
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'admin'
});

connection.connect((err) => {
    if(err){
        console.log('Error al conectar a la base de datos', err);
        return;
    }
    connection.query('CREATE DATABASE IF NOT EXISTS lvdl', (err) => {
        if(err){
            console.log('Error al crear la base de datos', err);
            return;
        }
    });
    connection.changeUser({database: 'lvdl'}, (err) => {
        if(err){
            console.log('Error al seleccionar la base de datos', err);
            return;
        }
    });
    connection.query('CREATE TABLE IF NOT EXISTS provincias (id INT AUTO_INCREMENT PRIMARY KEY, nombre VARCHAR(50))', (err) => {
        if(err){
            console.log('Error al crear la tabla provncias', err);
            return;
        }
    });
    connection.query('CREATE TABLE IF NOT EXISTS ciudades (id INT AUTO_INCREMENT PRIMARY KEY, nombre VARCHAR(50), provinciaId INT, CONSTRAINT FK_ProvinciaCiudad FOREIGN KEY (provinciaId) REFERENCES provincias(id))', (err) => {
        if(err){
            console.log('Error al crear la tabla ciudades', err);
            return;
        }
    });
    connection.query('CREATE TABLE IF NOT EXISTS comentarios (id INT AUTO_INCREMENT PRIMARY KEY, texto VARCHAR(200))', (err) => {
        if(err){
            console.log('Error al crear la tabla comentarios', err);
            return;
        }
    });
    connection.query('CREATE TABLE IF NOT EXISTS usuarios (nick VARCHAR(25) PRIMARY KEY, password VARCHAR(25), admin BOOLEAN, guardadoId INT, CONSTRAINT FK_GuardadoUsuario FOREIGN KEY (guardadoId) REFERENCES guardados(publicacionId))', (err) => {
        if(err){
            return
        }
    });
    connection.query('CREATE TABLE IF NOT EXISTS publicaciones (id INT AUTO_INCREMENT PRIMARY KEY, img VARCHAR(200), text VARCHAR(200), provinciaId INT, ciudadId INT, favorito BOOLEAN, guardado BOOLEAN, comentarioId INT, CONSTRAINT FK_ProvinciaPublicacion FOREIGN KEY (provinciaId) REFERENCES provincias(id), CONSTRAINT FK_CiudadPublicacion FOREIGN KEY (ciudadId) REFERENCES ciudades(id), CONSTRAINT FK_ComentarioPublicacion FOREIGN KEY (comentarioId) REFERENCES comentarios(id))', (err) => {
        if(err){
            return
        }
    });
    console.log('Conectado a la base de datos');
});

module.exports = connection;