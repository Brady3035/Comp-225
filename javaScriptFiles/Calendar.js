// Constants
const MAX_POINTS = 100;

// State variables
let currentDate = new Date();
let tasksByDate = {};
let tasksWithoutDate = [];
let taskIdCounter = 0;
let points = 0;

// Functions

// Redirect to another page
function redirectToPage(page) {
    window.location.href = page;
}

// Update points and refresh UI
function updatePoints(newPoints, taskId) {
    points += newPoints;
    updatePointsLabel();
    updateTasksByDate(taskId);
    updateCalendar();
}

// Update the displayed points label
function updatePointsLabel() {
    const pointsLabel = document.getElementById('points-label');
    pointsLabel.textContent = `Points: ${points}`;
}

// Filter out completed task and update tasksByDate
function updateTasksByDate(taskId) {
    for (const date in tasksByDate) {
        tasksByDate[date] = tasksByDate[date].filter((t) => t.id !== taskId);
    }
}

// Placeholder for future implementation
function calculatePoints(timeSpentInMinutes, importance, currentDate, dueDate) {
    const totalPoints = MAX_POINTS;
    // Calculate the difference between the due date and the current date in milliseconds
    const timeRemaining = Math.max(dueDate - currentDate, 0);
    // Convert time remaining to minutes
    const timeRemainingInMinutes = timeRemaining / (1000 * 60);
    // Calculate the percentage of time remaining relative to the total allowed time
    const percentageRemaining = timeRemainingInMinutes / (dueDate - currentDate) / 60;
    // Calculate points based on time spent, importance, and time remaining
    const pointsEarned = Math.round((timeSpentInMinutes / totalPoints) * importance * percentageRemaining * totalPoints);

    return pointsEarned;
}

// Placeholder for future implementation
function clockIn() {
    // TODO: Implement clock-in functionality
}

// Placeholder for future implementation
function clockOut() {
    // TODO: Implement clock-out functionality
}

// Update the calendar UI
function updateCalendar() {
    const calendarBody = document.getElementById('calendar-body');
    const currentWeek = document.getElementById('current-week');
    currentWeek.textContent = `Week of ${currentDate.toDateString()}`;

    clearCalendarContent(calendarBody);

    for (let i = 0; i < 7; i++) {
        const day = new Date(currentDate);
        day.setDate(currentDate.getDate() + i - currentDate.getDay());
        const cell = createCalendarCell(day);
        calendarBody.appendChild(cell);
    }

    //clearTasksWithoutDate();
    populateTasksWithoutDate();
}

// Remove previous calendar content
function clearCalendarContent(calendarBody) {
    calendarBody.innerHTML = '';
}

// Create a table cell for a given day
function createCalendarCell(day) {
    const cell = document.createElement('td');
    cell.textContent = day.getDate();
    cell.style.border = '1px solid #000';

    const taskList = createTaskList(day);
    cell.appendChild(taskList);

    return cell;
}

// Create a task list for a given day
function createTaskList(day) {
    const taskList = document.createElement('div');
    taskList.classList.add('task-list');

    const dateString = day.toISOString().split('T')[0];
    const tasksForDate = tasksByDate[dateString] || [];
    
    tasksForDate.forEach((task) => {
        const taskItem = createTaskItem(task);
        taskList.appendChild(taskItem);
    });

    return taskList;
}

// Create a task item for a given task
function createTaskItem(task) {
    const taskItem = document.createElement('div');
    taskItem.classList.add('task-box');
    taskItem.textContent = task.name;

    if (task.dueDate) {
        const dueDateText = document.createElement('span');
        dueDateText.textContent = `(Due: ${task.dueDate})`;
        taskItem.appendChild(dueDateText);
    }

    taskItem.addEventListener('click', () => {
        displayTaskInfo(task);
    });

    return taskItem;
}

// Remove previous tasks without a date
function clearTasksWithoutDate() {
    const tasksList = document.getElementById('tasksList');
    tasksList.innerHTML = '';
}

// Populate the list of tasks without a date
function populateTasksWithoutDate() {
    const tasksList = document.getElementById('tasksList');
    tasksWithoutDate.forEach((task) => {
        const taskItem = document.createElement('li');
        taskItem.innerHTML = task.name;
        tasksList.appendChild(taskItem);
    });
}

// Display task information in a popup
function displayTaskInfo(task) {
    const popup = createTaskPopup(task);
    document.body.appendChild(popup);
}

// Create a popup for a given task
function createTaskPopup(task) {
    const popup = document.createElement('div');
    popup.classList.add('task-popup');

    const closeButton = createPopupButton('✖', () => popup.remove());
    const completeButton = createPopupButton('Complete', () => {
        popup.remove();
        updatePoints(calculatePoints(30,task.importance,task.date,task.dueDate), task.id);
    });

    const taskInfoContainer = createTaskInfoContainer(task);

    popup.appendChild(completeButton);
    popup.appendChild(closeButton);
    popup.appendChild(taskInfoContainer);

    return popup;
}

// Create a button for a popup
function createPopupButton(text, clickHandler) {
    const button = document.createElement('span');
    button.textContent = text;
    button.addEventListener('click', clickHandler);
    return button;
}

// Create a container for task information in a popup
function createTaskInfoContainer(task) {
    const taskInfoContainer = document.createElement('div');
    taskInfoContainer.classList.add('task-info-container');

    const taskNameElement = createTaskInfoElement(`Task: ${task.name}`);
    const dueDateElement = createTaskInfoElement(task.dueDate ? `Due Date: ${task.dueDate}` : 'No Due Date');

    taskInfoContainer.appendChild(taskNameElement);
    taskInfoContainer.appendChild(dueDateElement);

    return taskInfoContainer;
}

// Create an element for task information in a popup
function createTaskInfoElement(text) {
    const element = document.createElement('p');
    element.textContent = text;
    return element;
}

// Event listeners

// Update calendar for the previous week
document.getElementById('prev-week').addEventListener('click', () => {
    currentDate.setDate(currentDate.getDate() - 7);
    updateCalendar();
});

// Update calendar for the next week
document.getElementById('next-week').addEventListener('click', () => {
    currentDate.setDate(currentDate.getDate() + 7);
    updateCalendar();
});

// Add a task
document.getElementById('add-task').addEventListener('click', () => {
    addTask();
});

// Add task function
function addTask() {
    const taskName = document.getElementById('task-name').value;
    const dueDate = document.getElementById('due-date').value;
    const addToDate = document.getElementById('add-to-date').value;
    const importance = document.getElementById('importance').value;

    if (taskName.trim() !== '') {
        if (addToDate !== "") {
            const task = {
                id: taskIdCounter++,
                name: taskName,
                dueDate: dueDate || null,
            };

            const selectedDate = new Date(addToDate);
            selectedDate.setDate(selectedDate.getDate() + 1); // Add one day
            const dateString = selectedDate.toISOString().split('T')[0];

            if (!tasksByDate[dateString]) {
                tasksByDate[dateString] = [];
            }
            tasksByDate[dateString].push(task);
        } else {
            const task = {
                id: taskIdCounter++,
                name: taskName,
            };
            tasksWithoutDate.push(task);
        }

        document.getElementById('task-name').value = '';
        document.getElementById('due-date').value = '';
        document.getElementById('add-to-date').value = '';
        document.getElementById('task-importance').value = '';

        updateCalendar();
    }
}

function validateImportanceInput() {
    var taskImportanceInput = document.getElementById('task-importance');
    var importanceValue = taskImportanceInput.value;
    if (isNaN(importanceValue) || importanceValue < 1) {
        taskImportanceInput.value = 1;
    } else if (importanceValue > 10) {
        taskImportanceInput.value = 10;
    }
}

// Validate importance input
var taskImportanceInput = document.getElementById('task-importance');
taskImportanceInput.addEventListener('input', validateImportanceInput);

// Initial setup
updateCalendar();
