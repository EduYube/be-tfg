const provincias = require('./endpoints/provincias')
const ciudades = require('./endpoints/ciudades')

module.exports = {
    main: (_, callback) => {
        callback(200, {message: 'Hola Mundo'})
    },
    notFound: (_, callback) => {
        callback(404, {message: 'No encontrado'})
    },
    provincias,
    ciudades,
}