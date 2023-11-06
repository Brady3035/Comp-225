// Initialize current date to January 1, 2023
let currentDate = new Date();

// Create an object to store tasks by date
const tasksByDate = {};

// Create a separate array to store tasks with no due date
const tasksWithoutDate = [];

// Initialize a unique task ID counter
let taskIdCounter = 0;

// Create a points variable
let points = 0;

// Create a task importance variable
let importance = 0;

// Create Max points for tasks
let max_points = 100;

// Redirect to another page
function redirectToPage(page) {
    window.location.href = page;
}

// Function to add points 
function updatePoints(newPoints, taskId) {
    points += newPoints;
    const pointsLabel = document.getElementById('points-label');
    pointsLabel.textContent = `Points: ${points}`; // update points label

    for (const date in tasksByDate) {
        tasksByDate[date] = tasksByDate[date].filter((t) => t.id !== taskId);  // search through tasks 
    }

    // Update the calendar
    updateCalendar();
}

// TODO: Function to calculate how many points the user gets.
function calculatePoints(){

}

// TODO: Function to clock in.
function clockIn(){

}

// TODO: Function to clock out.
function clockOut(){

}


// Function to update the calendar
function updateCalendar() {
    const calendarBody = document.getElementById('calendar-body');
    const currentWeek = document.getElementById('current-week');
    currentWeek.textContent = `Week of ${currentDate.toDateString()}`;

    // Clear previous calendar content
    calendarBody.innerHTML = '';

    // Loop through the days of the current week
    for (let i = 0; i < 7; i++) {
        const day = new Date(currentDate);
        day.setDate(currentDate.getDate() + i - currentDate.getDay());

        const cell = document.createElement('td');
        cell.textContent = day.getDate();

        cell.style.border = '1px solid #000';

        // Create a div for tasks
        const taskList = document.createElement('div');
        taskList.classList.add('task-list'); // Add a CSS class for styling

        // Get tasks for the current date and populate the task list
        const dateString = day.toISOString().split('T')[0];
        const tasksForDate = tasksByDate[dateString] || [];
        tasksForDate.forEach((task) => {
            const taskItem = document.createElement('div'); // Change from <li> to <div>
            taskItem.classList.add('task-box'); // Add a CSS class for styling
            taskItem.textContent = task.name;

            if (task.dueDate) {
                const dueDateText = document.createElement('span');
                dueDateText.textContent = `(Due: ${task.dueDate})`;
                taskItem.appendChild(dueDateText);
            }

            taskList.appendChild(taskItem);
            taskItem.addEventListener('click', () => {
                displayTaskInfo(task);
            });
        });

        cell.appendChild(taskList);
        calendarBody.appendChild(cell);
    }

    // Clear previous tasks without a date
    const tasksList = document.getElementById('tasksList');
    tasksList.innerHTML = '';

    // Populate the list of tasks without a date
    tasksWithoutDate.forEach((task) => {
        const taskItem = document.createElement('li');
        taskItem.innerHTML = task.name;
        tasksList.appendChild(taskItem);
    });
}

let activePopup = null; // Variable to track the active task popup

// Modify the displayTaskInfo function to show a popup
function displayTaskInfo(task) {
    // Create a div for the popup
    const popup = document.createElement('div');
    popup.classList.add('task-popup');

    // Create a close button for the popup
    const closeButton = document.createElement('span');
    closeButton.classList.add('close-button');
    closeButton.textContent = '✖';

    // Create a complete task button for the popup
    const completeButton = document.createElement('span');
    completeButton.classList.add('complete-button');
    completeButton.textContent = "Complete";

    // Event listener for removing a task
    completeButton.addEventListener('click', () => {
        popup.remove(); // Close the popup
        updatePoints(5, task.id); // Add 5 points to the points label
    });

    // Add a click event listener to the close button to close the popup
    closeButton.addEventListener('click', () => {
        popup.remove();
    });

    // Create a container for task information
    const taskInfoContainer = document.createElement('div');
    taskInfoContainer.classList.add('task-info-container');

    // Display task information in the popup
    const taskNameElement = document.createElement('p');
    taskNameElement.textContent = `Task: ${task.name}`;

    const dueDateElement = document.createElement('p');
    dueDateElement.textContent = task.dueDate ? `Due Date: ${task.dueDate}` : 'No Due Date';

    // Append elements to the popup
    taskInfoContainer.appendChild(taskNameElement);
    taskInfoContainer.appendChild(dueDateElement);
    popup.appendChild(completeButton);
    popup.appendChild(closeButton);
    popup.appendChild(taskInfoContainer);

    // Add the popup to the body
    document.body.appendChild(popup);
}

// Event listener for navigating through weeks
document.getElementById('prev-week').addEventListener('click', () => {
    currentDate.setDate(currentDate.getDate() - 7);
    updateCalendar();
});

document.getElementById('next-week').addEventListener('click', () => {
    currentDate.setDate(currentDate.getDate() + 7);
    updateCalendar();
});

// Event listener for adding tasks
document.getElementById('add-task').addEventListener('click', () => {
    const taskName = document.getElementById('task-name').value;
    const dueDate = document.getElementById('due-date').value;
    const addToDate = document.getElementById('add-to-date').value;

    if (taskName.trim() !== '') {
        if (addToDate !== "") {
            // If a due date is specified, add it to tasksByDate
            const task = {
                id: taskIdCounter++, // Assign a unique ID to the task
                name: taskName,
                dueDate: dueDate || null,
            };

            // Store the task under the selected date
            const selectedDate = new Date(addToDate);
            selectedDate.setDate(selectedDate.getDate()); // Add one day
            const dateString = selectedDate.toISOString().split('T')[0];

            if (!tasksByDate[dateString]) {
                tasksByDate[dateString] = [];
            }
            tasksByDate[dateString].push(task);
        } else {
            // If no due date is specified, add it to tasksWithoutDate
            const task = {
                id: taskIdCounter++, // Assign a unique ID to the task
                name: taskName,
            };
            tasksWithoutDate.push(task);
        }

        // Clear task input fields
        document.getElementById('task-name').value = '';
        document.getElementById('due-date').value = '';
        document.getElementById('add-to-date').value = '';

        // Update the calendar
        updateCalendar();
    }
});

// Initial calendar update
updateCalendar();
