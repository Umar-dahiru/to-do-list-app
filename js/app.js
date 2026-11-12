const STORAGE_KEY = "daylist.tasks.v1";
const form = document.querySelector("#add-form");
const input = document.querySelector("#task-input");
const list = document.querySelector("#task-list");
const emptyState = document.querySelector("#empty-state");
const remainingCount = document.querySelector("#remaining-count");
const completedCount = document.querySelector("#completed-count");
const clearCompletedButton = document.querySelector("#clear-completed");
const filters = document.querySelector(".filters");
const todayLabel = document.querySelector("#today");
const editDialog = document.querySelector("#edit-dialog");
const editForm = document.querySelector("#edit-form");
const editInput = document.querySelector("#edit-input");
const cancelEditButton = document.querySelector("#cancel-edit");

let tasks = loadTasks();
let activeFilter = "all";
let editingTaskId = null;

todayLabel.textContent = new Intl.DateTimeFormat(undefined, { weekday: "short", month: "short", day: "numeric" }).format(new Date());

function loadTasks() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(saved) ? saved.filter(task => task && typeof task.id === "string" && typeof task.text === "string" && typeof task.completed === "boolean") : [];
  } catch {
    return [];
  }
}

function saveTasks() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch {
    alert("Your browser could not save this list. Check your storage settings.");
  }
}

function createId() {
  return globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function addTask(text) {
  const cleanText = text.trim();
  if (!cleanText) return;
  tasks.unshift({ id: createId(), text: cleanText, completed: false, createdAt: Date.now() });
  saveTasks();
  render();
}

function updateTask(id, changes) {
  tasks = tasks.map(task => task.id === id ? { ...task, ...changes } : task);
  saveTasks();
  render();
}

function makeButton(label, className, symbol, onClick) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = className;
  button.textContent = symbol;
  button.setAttribute("aria-label", label);
  button.addEventListener("click", onClick);
  return button;
}

function render() {
  const visibleTasks = tasks.filter(task => activeFilter === "all" || (activeFilter === "active" ? !task.completed : task.completed));
  const remaining = tasks.filter(task => !task.completed).length;
  const completed = tasks.length - remaining;

  remainingCount.textContent = remaining;
  completedCount.textContent = `${completed} completed`;
  clearCompletedButton.disabled = completed === 0;
  clearCompletedButton.style.opacity = completed === 0 ? ".4" : "1";
  list.replaceChildren();

  visibleTasks.forEach(task => {
    const item = document.createElement("li");
    item.className = `task-item${task.completed ? " done" : ""}`;

    const check = makeButton(task.completed ? "Mark task as active" : "Mark task as completed", "check-button", task.completed ? "✓" : "", () => updateTask(task.id, { completed: !task.completed }));
    const text = document.createElement("span");
    text.className = "task-text";
    text.textContent = task.text;

    const actions = document.createElement("div");
    actions.className = "task-actions";
    actions.append(
      makeButton("Edit task", "icon-button", "✎", () => openEditor(task)),
      makeButton("Delete task", "icon-button delete", "×", () => {
        tasks = tasks.filter(entry => entry.id !== task.id);
        saveTasks();
        render();
      })
    );

    item.append(check, text, actions);
    list.append(item);
  });

  emptyState.hidden = visibleTasks.length !== 0;
  list.hidden = visibleTasks.length === 0;
}

function openEditor(task) {
  editingTaskId = task.id;
  editInput.value = task.text;
  editDialog.showModal();
  editInput.focus();
}

form.addEventListener("submit", event => {
  event.preventDefault();
  addTask(input.value);
  input.value = "";
  input.focus();
});

filters.addEventListener("click", event => {
  const button = event.target.closest("button[data-filter]");
  if (!button) return;
  activeFilter = button.dataset.filter;
  filters.querySelectorAll("button").forEach(filter => {
    const selected = filter === button;
    filter.classList.toggle("active", selected);
    filter.setAttribute("aria-pressed", String(selected));
  });
  render();
});

clearCompletedButton.addEventListener("click", () => {
  tasks = tasks.filter(task => !task.completed);
  saveTasks();
  render();
});

editForm.addEventListener("submit", event => {
  event.preventDefault();
  const text = editInput.value.trim();
  if (text && editingTaskId) updateTask(editingTaskId, { text });
  editingTaskId = null;
  editDialog.close();
});

cancelEditButton.addEventListener("click", () => {
  editingTaskId = null;
  editDialog.close();
});

editDialog.addEventListener("click", event => {
  if (event.target === editDialog) editDialog.close();
});

render();