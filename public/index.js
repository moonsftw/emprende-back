//const { get } = require("mongoose");

// console.log("Este JS va a ser interpretado por el NAVEGADOR");

//OBTENER ELEMENTOS DEL HTML Y GUARDARLOS EN CONSTANTES
//const button = document.querySelector("button");
//console.log({ button });
// const getBtn = document.querySelector('#get-tasks')

const createEditBtn = document.querySelector('#create-tasks')
const input = document.querySelector('#task-name')
const taskDiv = document.querySelector('#tasks')

const baseBackendUrl = "http://localhost:4000/api"

let TASK_TO_EDIT = null
//nutrir de funcionalidad a los botones
//getBtn.addEventListener("click", function () {
//    console.log("Get tareas");
//   fetch("http://localhost:4000/api/tasks")
//});

createEditBtn.addEventListener("click", function () {
    
    const creating = !TASK_TO_EDIT
    const path = creating ? "tasks" : `tasks/${TASK_TO_EDIT._id}`
    const method = creating ? "POST" : "PUT"
    
    fetch(`${baseBackendUrl}/${path}`, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: input.value }),
    }).then((res) => {
        getTasks()
        input.value = ""
        createEditBtn.innerText = "Crear tarea"
        return res.json()
    }).then((resJSON) => {
        console.log({ resJSON })
    })
})

function getTasks() {
    taskDiv.innerHTML = null
    fetch(`${baseBackendUrl}/tasks`)
    .then((res) => {
        return res.json()
    })
    .then((resJSON) => {
        const tasks = resJSON.data
        for(const task of tasks) {
            const taskParagraph = document.createElement('p')
            const deleteTaskBtn = document.createElement('button')
            const taskContainerDiv = document.createElement('div')
            taskParagraph.innerText = task.name
            deleteTaskBtn.innerText = "Borrar"
            deleteTaskBtn.setAttribute('id', task._id)
            deleteTaskBtn.addEventListener("click", (e) => {
                const taskId = e.target.id
                fetch(`${baseBackendUrl}/tasks/${taskId}`, {
                    method: "DELETE",
                }).then(() => {
                    const taskDiv = deleteTaskBtn.parentElement
                    taskDiv.remove()
                })
            })
            taskParagraph.addEventListener("click", (e) => {
                input.value = task.name
                createEditBtn.innerText = "Editar tarea"
                TASK_TO_EDIT = task
                console.log({TASK_TO_EDIT})
            })
            taskContainerDiv.appendChild(taskParagraph)
            taskContainerDiv.appendChild(deleteTaskBtn)
            taskDiv.appendChild(taskContainerDiv)

        }
    })

}

getTasks()