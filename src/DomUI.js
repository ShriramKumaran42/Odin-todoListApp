import { Todo, Project, projects, saveToLocalStorage} from "./logic";
import { format, parseISO, isPast, formatRelative, differenceInDays } from 'date-fns';

let selectedProj = 0;

function displayProjects() {
    const projectContainer = document.getElementById("proj-list");
    if (!projectContainer) {
        console.error("Error: 'proj-list' element not found in DOM.");
        return;
    }

    projectContainer.innerHTML = "";
    projects.forEach((project, index) => {
        const projectElement = document.createElement("div");
        projectElement.classList.add("project-item");
        projectElement.textContent = project.name;

        if(index === selectedProj){
            projectElement.style.fontWeight = "bold";
        }

        projectElement.addEventListener("click", () => {
            selectedProj = index;
            displayProjects();
            displayTodos(index);
        });
        
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.classList.add("dlt-proj");
        deleteButton.addEventListener("click", (event) => {
            event.stopPropagation();
            projects.splice(index, 1);
            if(selectedProj >= projects.length) {
                selectedProj = projects.length -1;
            } 
            saveToLocalStorage();
            displayProjects();
            if(projects.length > 0) {
                displayTodos(selectedProj);
            }
            else {
                document.getElementById("todos").innerHTML = "No Projects Available";
            }
        })

        projectElement.appendChild(deleteButton);
        projectContainer.appendChild(projectElement);
    });
}

function displayTodos(projectIndex) {
    const todoContainer = document.getElementById("todos");
    todoContainer.innerHTML = "";
    const project = projects[projectIndex];

    if(!project) {
        todoContainer.textContent = "No Projects Created";
        return;
    }

    project.todos.forEach((todo, index) => {
        const todoCard = document.createElement("div");
        todoCard.classList.add("todo-card");
        todoCard.classList.add(todo.priority.toLowerCase());
        const formattedDate = format(todo.dueDate, 'MMM do, yyyy');
        const dueDateParsed = parseISO(todo.dueDate);
        const daysRemaining = differenceInDays(dueDateParsed, new Date());
        const formattedRelative = formatRelative(dueDateParsed, new Date());
        let daysDeadline = "";

        if(daysRemaining > 0) {
            daysDeadline = `Due in ${daysRemaining} days.`;
        }
        else if (isPast(dueDateParsed)){
            daysDeadline = `Overdue (${formattedRelative}).`;
        }
        else {
            daysDeadline = "Due by Today"
        }
        
        todoCard.innerHTML = `
            <h3>${todo.title}</h3>
            <p>${todo.description}</p>
            <p><strong>Due : </strong> ${formattedDate} </p>
            <p><strong> Deadline : </strong> ${daysDeadline}</p>
            <p><strong>Priority : </strong> ${todo.priority}</p>
            `;

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.classList.add("delete-todo-btn");
        deleteButton.addEventListener("click", () => {
            project.deleteTodo(index);
            saveToLocalStorage();
            displayTodos(projectIndex);
        });
        todoCard.appendChild(deleteButton);
        todoContainer.appendChild(todoCard);
    })
    const addTodoBtn = document.createElement("button");
    addTodoBtn.textContent = "Add Task";
    addTodoBtn.classList.add("add-task-btn");
    addTodoBtn.addEventListener("click", openTodo);
    todoContainer.appendChild(addTodoBtn);
}

function openTodo() {
    console.log("Add Task button clicked!");
    const formContainer = document.getElementById("todo-form-container");
    const overlay = document.getElementById("modal-overlay");

    if (formContainer && overlay) {
        formContainer.style.display = "block";
        overlay.style.display = "block";
    } else {
        console.error("todo-form-container not found in the DOM.");
    }
}

function closeTodo() {
    const formContainer = document.getElementById("todo-form-container");
    const overlay = document.getElementById("modal-overlay");
    if (formContainer && overlay) {
        formContainer.style.display = "none"; // Hide the form when closing
        overlay.style.display = "none";
    } 
}


function addTodo(event) {
    event.preventDefault();
    const titleInput = document.getElementById("todo-title");
    const descriptionInput = document.getElementById("todo-description");
    const dueDateInput = document.getElementById("todo-dueDate");
    const priorityInput = document.querySelector('input[name="priority"]:checked');

    if (!titleInput || !dueDateInput || !priorityInput) {
        console.error("One or more input fields missing");
        return;
    }

    const title = titleInput.value.trim();
    const description = descriptionInput.value.trim();
    const dueDate = dueDateInput.value;
    const priority = priorityInput.value;


    if(title && dueDate && priority) {
        const todo = new Todo(title, description, dueDate, priority);
        projects[selectedProj].addTodo(todo);
        saveToLocalStorage();
        displayTodos(selectedProj);
        closeTodo();
        document.getElementById("todo-form").reset();
    }
    else {
        alert("Please fill all required fields")
    }
}

function initializeApp() {
    if(projects.length === 0){
        projects.push(new Project("Default Project"));
    }
    displayProjects();
    displayTodos(selectedProj);
}

document.getElementById("pBtn").addEventListener("click", () => {
    const projectName = prompt("Enter Project Name : ");
    if(projectName) {
        projects.push(new Project(projectName));
        displayProjects();
    }
})

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("todo-form").addEventListener("submit", addTodo);
    document.getElementById("close-form-btn").addEventListener("click", closeTodo);
})



export { displayProjects, displayTodos, addTodo};