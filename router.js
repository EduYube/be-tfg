const provincias = require('./endpoints/provincias')

module.exports = {
    main: (_, callback) => {
        callback(200, {message: 'Hola Mundo'})
    },
    notFound: (_, callback) => {
        callback(404, {message: 'No encontrado'})
    },
    provincias,
}