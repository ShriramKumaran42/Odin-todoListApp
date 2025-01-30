class Todo {
    constructor(title, description, dueDate, priority) {
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
        this.completed = false;
    }
}

class Project {
    constructor(name) {
        this.name = name;
        this.todos = [];
    }

    addTodo(todo) {
        this.todos.push(todo);
        saveToLocalStorage();
    }
    deleteTodo(index) {
            this.todos.splice(index, 1);
            saveToLocalStorage();
    }
}

const projects = loadFromLocalStorage() || [new Project("Default Project")]; 

function saveToLocalStorage() {
    localStorage.setItem("projects", JSON.stringify(projects));
}

function loadFromLocalStorage() {
    const storedProjects = localStorage.getItem("projects");
    if (!storedProjects) return null; // Prevents crash

    const parsedProjects = JSON.parse(storedProjects);
    return parsedProjects.map(proj => {
        const project = new Project(proj.name);
        project.todos = proj.todos.map(todo => new Todo(todo.title, todo.description, todo.dueDate, todo.priority));
        return project;
    });
}



export { Todo, Project, projects, saveToLocalStorage};
