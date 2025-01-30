import './style.css';
import { displayProjects, displayTodos } from './DomUI';
import { Project, projects } from './logic';

if(projects.length === 0){
    projects.push(new Project("Default Project"));
}

document.addEventListener("DOMContentLoaded", () => {
    displayProjects();
    displayTodos(0);
});
