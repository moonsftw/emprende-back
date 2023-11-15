//const importadoDeAnother = require("./another");

const http = require("http");


//console.log({importadoDeAnother})

function requestController() {
   // console.log("Hola mundo")
}

const server = http.createServer(requestController);

//server.listen(4000);
const PORT = process.env.PORT
server.listen(PORT)