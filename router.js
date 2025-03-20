const provincias = require('./endpoints/provincias')
const ciudades = require('./endpoints/ciudades')
const comentarios = require('./endpoints/comentarios')

module.exports = {
    main: (_, callback) => {
        callback(200, {message: 'Hola Mundo'})
    },
    notFound: (_, callback) => {
        callback(404, {message: 'No encontrado'})
    },
    provincias,
    ciudades,
    comentarios
}