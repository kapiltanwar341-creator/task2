
let tasks = [];
let currentFilter = 'all';

const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const tasksList = document.getElementById('tasksList');
const filterBtns = document.querySelectorAll('.filter-btn');
const totalTasksEl = document.getElementById('totalTasks');
const activeTasksEl = document.getElementById('activeTasks');
const completedTasksEl = document.getElementById('completedTasks');

function formatTime(date) {
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);
    
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
}

function addTask() {
    const taskText = taskInput.value.trim();
    
    if (taskText === '') {
        taskInput.focus();
        taskInput.style.borderColor = '#ef4444';
        setTimeout(() => {
            taskInput.style.borderColor = '#e5e7eb';
        }, 500);
        return;
    }

    const task = {
        id: Date.now(),
        text: taskText,
        completed: false,
        createdAt: new Date()
    };

    tasks.unshift(task);
    taskInput.value = '';
    taskInput.focus();
    
    renderTasks();
    updateStats();
}

function toggleTask(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        renderTasks();
        updateStats();
    }
}

function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    renderTasks();
    updateStats();
}

function clearCompleted() {
    tasks = tasks.filter(t => !t.completed);
    renderTasks();
    updateStats();
}

function renderTasks() {
    const filteredTasks = tasks.filter(task => {
        if (currentFilter === 'active') return !task.completed;
        if (currentFilter === 'completed') return task.completed;
        return true;
    });

    if (filteredTasks.length === 0) {
        const emptyMessage = currentFilter === 'completed' 
            ? 'No completed tasks yet' 
            : currentFilter === 'active' 
            ? 'No active tasks' 
            : 'No tasks yet';
        
        const emptyIcon = currentFilter === 'completed' ? '✅' : currentFilter === 'active' ? '⚡' : '📝';

        tasksList.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">${emptyIcon}</div>
                <h3>${emptyMessage}</h3>
                <p>${currentFilter === 'all' ? 'Add a task above to get started!' : ''}</p>
            </div>
        `;
    } else {
        tasksList.innerHTML = filteredTasks.map(task => `
            <div class="task-item ${task.completed ? 'completed' : ''}" data-id="${task.id}">
                <div class="checkbox" onclick="toggleTask(${task.id})"></div>
                <div class="task-text">${escapeHtml(task.text)}</div>
                <div class="task-time">${formatTime(task.createdAt)}</div>
                <button class="delete-btn" onclick="deleteTask(${task.id})">Delete</button>
            </div>
        `).join('');

        if (tasks.some(t => t.completed) && currentFilter !== 'active') {
            tasksList.innerHTML += `
                <button class="clear-completed" onclick="clearCompleted()">
                    🗑️ Clear Completed Tasks
                </button>
            `;
        }
    }
}

function updateStats() {
    const total = tasks.length;
    const active = tasks.filter(t => !t.completed).length;
    const completed = tasks.filter(t => t.completed).length;

    totalTasksEl.textContent = total;
    activeTasksEl.textContent = active;
    completedTasksEl.textContent = completed;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.filter;
        renderTasks();
    });
});

addBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTask();
    }
});

setInterval(() => {
    if (tasks.length > 0) {
        renderTasks();
    }
}, 60000);

renderTasks();
updateStats();
taskInput.focus();