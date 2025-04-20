const url = require('url');
const stringDecoder = require('string_decoder').StringDecoder;
const router = require('./router');

module.exports = (req,res) => {

    const urlGross = req.url;
    const urlParsed = url.parse(urlGross, true);

    const path = urlParsed.pathname;
    const pathClean = path.replace(/^\/+|\/+$/g, '');
    const decoder = new stringDecoder('utf-8');
    let buffer ='';
    let id = null;
    let mainPath = pathClean;
    const method = req.method.toLowerCase()

    if(pathClean.indexOf('/') > -1){ 
        id = pathClean.split('/') [1];
        mainPath = pathClean.split('/') [0];
    }

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
        if(method === 'options'){
            res.writeHead(200);
            res.end();
            return;
        }
        const data = {
            id: id,
            path: mainPath, 
            method: method,
            query: urlParsed.query,
            header: req.headers,
            payload: buffer,
        }

        let handler;
        if(mainPath === '') {
            handler = router.main;
        } else if(mainPath && router[mainPath][method]){
            handler = router[mainPath][method];
        } else {
            handler = router.notFound;
        }

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