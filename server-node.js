//const importadoDeAnother = require("./another");
require('dotenv').config()
const http = require("http");
const fs = require("fs");


//console.log({importadoDeAnother})

function requestController(req, res) {
    const url = req.url;
    const method = req.method;
    console.log({ url, method });

    if (method === "GET" && url === "/") {
        res.setHeader("Content-type", "text/html; charset=utf-8");
        fs.readFile('./public/index.html', function (err, file) {
            if(err){
                console.log("Hubo un error");
            }

            res.write(file);
            res.end()
        })
        return
    }
    if (method === "GET" && url === "/about") {
        res.setHeader("Content-type", "text/html; charset=utf-8");
        fs.readFile('./public/about.html', function (err, file) {
            if(err){
                console.log("Hubo un error");
            }
        
            res.write(file);
            res.end()
        })
        return
    }
    res.setHeader("Content-type", "text/html; charset=utf-8");
    res.write("<h1>Página no encontrada :(</h1>");
    res.end()
}

const server = http.createServer(requestController);

//server.listen(4000);
const PORT = process.env.PORT
server.listen(PORT, function () {
    console.log("Aplicación corriendo en el puerto: " + PORT);
})