const tasks = []
let time = 0
let timer = null
let timerBreak = null
let current = null;
let statusApp = "stop"

const bAdd = document.querySelector('#bAdd');
const itTask = document.querySelector('#itTask');
const form = document.querySelector('#form');
const taskName = document.querySelectorAll('#time #taskName')

renderTasks()
renderTime()

//dice que se dispare una fucnion cuando se eejecute el submit
form.addEventListener('submit',(e) =>{
    //con esta primera linea anulamos el comportamiento por defecto del submit
    e.preventDefault();
    if(itTask.value !== ""){
        createTask(itTask.value);
        itTask.value = '';
        renderTasks()
    }
})

function createTask(value){
    const newTask = {
        id: (Math.random()*100).toString(36).slice(2),
        title: value,
        completed: false,
    };

    tasks.unshift(newTask);
}

function renderTasks(){
    const html = tasks.map((task) =>{
        //regresa arreglo de strings
        return `
            <div class = "task">
                <div class = "completed">${ 
                    task.completed 
                    ? `<span class="done"> Done </span>` 
                    : ` <button class="start-button" data-id="${task.id}"> Start </button>`
                }
                </div>
                <div class = "title">${task.title}</div>
            </div>`
    })

    const tasksContainer = document.querySelector('#tasks');
    //unimos arreglo de strings
    tasksContainer.innerHTML = html.join('')

    const startButtons = document.querySelectorAll('.task .start-button');

    startButtons.forEach(button =>{
        button.addEventListener('click', () =>{
            if(!timer){
                //capturo el id del boton
                const id = button.getAttribute('data-id')
                startButtonHandler(id);
                button.textContent ='En progreso'
            }
        })
    })
}

function startButtonHandler(id){
    time = 25*60;
    current = id;
    const taskIndex = tasks.findIndex(task => task.id == id)
    document.querySelectorAll('#time #taskName').textContent = tasks[taskIndex].title;

    timer = setInterval(() => {
        timerHandler(id)
    },1000)
}

function timerHandler(id){
    time--;
    renderTime();

    if (time === 0){
        //detinee el timer
        clearInterval(timer);
        markCompleted(id);
        timer = null;
        renderTasks();
        startBreak();
    }
}

function markCompleted(id) {
    const taskIndex = tasks.findIndex(task => task.id == id);
    tasks[taskIndex].completed = true;
}

function startBreak(){
    time = 5 * 60;
    document.querySelectorAll('#time #taskName').textContent = 'Break';
    timerBreak = setInterval( () =>{
        timerBreakHandler()
    },1000) 
}

function  timerBreakHandler(){
    time--;

    renderTime();

    if (time === 0){
        //detinee el timer
        clearInterval(timerBreak);
        current = null;
        timerBreak = null;
        document.querySelectorAll('#time #taskName').textContent = '';
        renderTasks();
    }
}

function renderTime(){
    const timeDiv = document.querySelector("#time #value")
    const minutes = parseInt(time/60)
    const seconds = parseInt(time%60)

    timeDiv.textContent = `
    ${minutes < 10 ? "0": ""}${minutes} 
    :
    ${seconds < 10 ? "0": ""}${seconds} 
    `
}

