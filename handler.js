const url = require('url');
const stringDecoder = require('string_decoder').StringDecoder;

module.exports = (req,res) => {

    const urlGross = req.url;
    const urlParsed = url.parse(urlGross, true);

    const path = urlParsed.pathname;
    const pathClean = path.replace(/^\/+|\/+$/g, '');
    const decoder = new stringDecoder('utf-8');
    let buffer ='';

    req.on('data', (data) => {
        buffer += decoder.write(data);
    })
    req.on('end', () => { 
        buffer += decoder.end();
        if(buffer){
            buffer = JSON.parse(buffer);
        }
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Request-Methods", "*");
        res.setHeader("Access-Control-Allow-Headers", "*");
        res.setHeader("Access-Control-Allow-Methods", "*");
        if(req.method.toLowerCase() === 'options'){
            res.writeHead(200);
            res.end();
            return;
        }
        const data = {
            path: pathClean, 
            method: req.method.toLowerCase(),
            query: urlParsed.query,
            header: req.headers,
            payload: buffer,
        }

        const router = {
            main: (data, callback) => {
                callback(200, {message: 'Hola Mundo'})
            },
            notFound: (data, callback) => {
                callback(404, {message: 'No encontrado'})
            },
        }

        let handler;
        if(pathClean === '') {
            handler = router.main;
        } else if(pathClean && router[pathClean]){
            handler = router[mainPath]
        } else {
            handler = router.notFound;
        }
        console.log(data.payload)
        if(typeof handler==='function'){
            handler(data, callback = (statusCode = 200, payload = {})=> {
             const payloadClean = JSON.stringify(payload);
             res.setHeader('content-type', 'application/json');
             res.writeHead(statusCode);
             res.end(payloadClean);
             return
            })
        }
    } )
}