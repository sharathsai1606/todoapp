// Select elements
const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const searchInput = document.getElementById("searchInput");
const showAllBtn = document.getElementById("showAll");
const showCompletedBtn = document.getElementById("showCompleted");
const showIncompleteBtn = document.getElementById("showIncomplete");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Render tasks based on the filter
function renderTasks(filter = "all") {
  taskList.innerHTML = "";
  let filteredTasks = tasks;

  if (filter === "completed") {
    filteredTasks = tasks.filter((task) => task.completed);
  } else if (filter === "incomplete") {
    filteredTasks = tasks.filter((task) => !task.completed);
  }

  if (filteredTasks.length === 0) {
    taskList.innerHTML = '<li class="empty-message">No tasks available</li>';
  } else {
    filteredTasks.forEach((task) => createTaskElement(task));
  }
}

// Create a task element
function createTaskElement(task) {
  const taskItem = document.createElement("li");
  taskItem.className = "task-item";
  taskItem.draggable = true;
  taskItem.dataset.id = task.id;

  const taskText = document.createElement("span");
  taskText.textContent = task.text;
  taskText.className = task.completed ? "task-completed" : "";

  const editBtn = document.createElement("button");
  editBtn.textContent = "Edit";
  editBtn.className = "edit-btn";
  editBtn.onclick = () => editTask(task.id);

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Delete";
  deleteBtn.className = "delete-btn";
  deleteBtn.onclick = () => deleteTask(task.id);

  const completeBtn = document.createElement("button");
  completeBtn.textContent = task.completed ? "Undo" : "Complete";
  completeBtn.className = "complete-btn";
  completeBtn.onclick = () => toggleComplete(task.id);

  taskItem.append(taskText, editBtn, deleteBtn, completeBtn);
  taskList.appendChild(taskItem);

  // Drag-and-drop event listeners
  taskItem.addEventListener("dragstart", dragStart);
  taskItem.addEventListener("dragover", dragOver);
  taskItem.addEventListener("drop", drop);
}

// Add a new task
addTaskBtn.onclick = () => {
  const text = taskInput.value.trim();
  if (text) {
    const task = { id: Date.now(), text, completed: false };
    tasks.push(task);
    taskInput.value = "";
    saveTasks();
    renderTasks();
  }
};

// Edit a task
function editTask(id) {
  const task = tasks.find((task) => task.id === id);
  const newText = prompt("Edit task:", task.text);
  if (newText && newText.trim()) {
    task.text = newText.trim();
    saveTasks();
    renderTasks();
  }
}

// Delete a task
function deleteTask(id) {
  tasks = tasks.filter((task) => task.id !== id);
  saveTasks();
  renderTasks();
}

// Toggle task completion
function toggleComplete(id) {
  const task = tasks.find((task) => task.id === id);
  task.completed = !task.completed;
  saveTasks();
  renderTasks();
}

// Save tasks to localStorage
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Filter tasks
showAllBtn.onclick = () => {
  renderTasks("all");
};

showCompletedBtn.onclick = () => {
  renderTasks("completed");
};

showIncompleteBtn.onclick = () => {
  renderTasks("incomplete");
};

// Search tasks in real-time
searchInput.oninput = () => {
  const searchText = searchInput.value.toLowerCase();
  const filteredTasks = tasks.filter((task) =>
    task.text.toLowerCase().includes(searchText)
  );
  taskList.innerHTML = "";

  if (filteredTasks.length === 0) {
    taskList.innerHTML =
      '<li class="empty-message">No tasks match your search</li>';
  } else {
    filteredTasks.forEach((task) => createTaskElement(task));
  }
};

// Drag-and-drop functions
let draggedTaskId = null;

function dragStart(event) {
  draggedTaskId = event.target.dataset.id;
}

function dragOver(event) {
  event.preventDefault();
}

function drop(event) {
  event.preventDefault();
  const dropTargetId = event.target.closest(".task-item").dataset.id;
  const draggedTaskIndex = tasks.findIndex(
    (task) => task.id === parseInt(draggedTaskId)
  );
  const dropTargetIndex = tasks.findIndex(
    (task) => task.id === parseInt(dropTargetId)
  );

  // Swap tasks
  [tasks[draggedTaskIndex], tasks[dropTargetIndex]] = [
    tasks[dropTargetIndex],
    tasks[draggedTaskIndex],
  ];
  saveTasks();
  renderTasks();
}

// Load tasks from localStorage on page load
document.addEventListener("DOMContentLoaded", () => {
  renderTasks();
});
