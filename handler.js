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
    const method = req.method.toLowerCase()

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
            path: pathClean, 
            method: method,
            query: urlParsed.query,
            header: req.headers,
            payload: buffer,
        }

        let handler;
        if(pathClean === '') {
            handler = router.main;
        } else if(pathClean && router[pathClean][method]){
            handler = router[mainPath][method];
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