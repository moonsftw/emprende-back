require('dotenv').config();
const express = require('express');
const { CLIENT_RENEG_LIMIT } = require('tls');
const app = express()
const port = process.env.PORT
const mongoose = require('mongoose')
const Schema = mongoose.Schema

mongoose
    .connect(process.env.MONGODB_URL)
    .then( () => 
        console.log("Conextión exitosa con la base de datos"))
    .catch((err) => 
        console.log("Hubo un error al conectarse con la base de datos", {err})
    )

const taskSchema = new Schema({
    name: String,
    done: Boolean,
    // createBy: 
})

//creando un objeto model
const Task = mongoose.model("Task", taskSchema, "Tasks")
//middleware de archivos estáticos
app.use(express.static("public"));

//Middleware para parsear el body de las request
app.use(express.json())
//  Middleware  (preprocesamiento de requests)
// son SIEMPRE => FUNCIONES

//A) Pasamos una función anónima
//app.use((req, res, next) => {
//    console.log("No especificamos cómo debe ser el inicio de la ruta")
//    console.log("Middleware 1")
//    next()
//})

// B) pasamos una función RETORNADA por OTRA FUNCIÓN/MÉTODO

//objeto logger
const logger = {
    //método: logThis
    //parámetro: whatToLog
    logThis: (whatToLog) => {
        return (req, res, next) => {
            console.log("Middleware 2: ", whatToLog)
            next()
        }
    },
}


//Configuar rutas
app.get('/', (req, res) => {
    res.send("Hello world")
})
app.get('/users', (req, res) => {
    res.send([{name: "Martin"},{name: "Lucía"}])
})

app.get("/api/tasks", function(req, res) {
    Task.find().then((tasks) => {
        res.status(200).json({ ok: true, data: tasks })
    }).catch((err) => {
        res.status(400).json({ ok: false, message: "Hubo un problema al obtener las tareas"})
    })
})

//Middleware para parsear BODY de la REQUEST (es como el caso C)
app.post("/api/tasks", function(req, res) {
    const body = req.body;
    console.log({ body })
    Task.create({
        name: body.text,
        done: false,
    }).then((createdTask) => {
        res.status(201).json({ ok: true, message: "Tarea creada con éxito", data: createdTask })
    }).catch((err) => {
        res.status(400).json({ ok: false, message: "Error al crear la tarea"})
    })
})

app.put("/api/tasks/:id", function(req, res) {
    const body = req.body;
    const id = req.params.id

    Task.findByIdAndUpdate(id, {
        name: body.text
    }).then((updatedTask) => {
        res.status(200).json({ ok: true, message: "Tarea editada con éxito", data: updatedTask })
    }).catch((err) => {
        res.status(400).json({ ok: false, message: "Error al editar la tarea"})
    })
})

//shift + alt + flecha abajo para duplicar cod igo
app.delete("/api/tasks/:id", function(req, res) {
    const id = req.params.id
    Task.findByIdAndDelete(id).then((deletedTask) => {
        res.status(200).json({ ok: true, data: deletedTask})
    }).catch(() => {
        res.status(400).json({ ok:false, message: "Hubo un error al eliminar la tarea" })
    })
})

//Pone a escuchar la app en un puerto
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})