// Constants
const MAX_POINTS = 100;

// State variables
let currentDate = new Date();
let tasksByDate = {};
let tasksWithoutDate = [];
let taskIdCounter = calculateIDCounter();
let points = 0;

// Boolean variables
let clockedIn = 0;
let clockedOut = 0;
let loaded = false;

// Functions
function calculateIDCounter(){
const myIndex = objectStore.index("id");
const getAllKeysRequest = myIndex.getAllKeys();
var constArray = [];
getAllKeysRequest.onsuccess = () => {
    constArray = getAllKeysRequest.result;

}
console.log(constArray[-1]);
return constArray[-1];
}
// Redirect to another page
function redirectToPage(page) {
    window.location.href = page;
}

// Update points and refresh UI
function updatePoints(newPoints, taskId) {
    points += newPoints;
    updatePointsInDB(points);
    updatePointsLabel();
    updateTasks(taskId);
    updateCalendar();
    updateUndatedTasks();

}
// Update tasksByDate and tasksWithoutDate
function updateTasks(taskId) {
    for (const date in tasksByDate) {
        tasksByDate[date] = tasksByDate[date].filter((t) => t.id !== taskId);
    }

    tasksWithoutDate = tasksWithoutDate.filter((t) => t.id !== taskId);
}

// Update the displayed points label
function updatePointsLabel() {
    const pointsLabel = document.getElementById('points-label');
    pointsLabel.textContent = `Points: ${Math.round(points)}`;
}

function dateToUnixTimestamp(dateString) {
    // Create a new Date object from the date string
    var dateObject = new Date(dateString);

    // Get the Unix timestamp in seconds
    var unixTimestamp = Math.floor(dateObject.getTime() / 1000);

    return unixTimestamp;
}

function calculatePoints(timeSpentInMinutes, importance, currentDate, dueDate) {
    var pointsEarned = 0;
    const totalPoints = MAX_POINTS;
    // Calculate the difference between the due date and the current date in milliseconds
    const timeRemaining = dateToUnixTimestamp(dueDate) - dateToUnixTimestamp(currentDate);
    // Convert time remaining to minutes
    const timeRemainingInMinutes = timeRemaining / (1000 * 60);
    
    if (timeRemaining == 0 || timeRemaining == null){
        return Math.round(timeSpentInMinutes * importance)/100000;
    }
    // Calculate points based on time spent, importance, and time remaining
    pointsEarned = Math.round((timeSpentInMinutes * timeRemainingInMinutes) * importance  * totalPoints);

    return pointsEarned/10000000;
}

// Start updating time spent when clocking in
function startUpdatingTimeSpent(task) {
    const transaction = db.transaction(['tasks_db'], 'readwrite');
    const objectStore = transaction.objectStore("tasks_db");
    const request = objectStore.get(task.id);
    
    request.addEventListener("success", () => {
        const curTask = request.result;
        task.timeSpent = curTask.timeSpent;

        if (curTask.timeSpent === 0) {
            task.clockInTime = new Date(); // Set the clock in time only if time spent is zero
        }
    
        task.timeSpentInterval = setInterval(() => {
            task.timeSpent = task.timeSpent + 1000;
            updateTaskPopupTimeSpent(task);
        }, 1000);

        console.log(curTask.timeSpent);
        curTask.timeSpent = task.timeSpent;
        console.log(curTask.timeSpent);
        console.log(task.timeSpent);
        objectStore.put(curTask);
    });
}

// Stop updating time spent on clock out and update time spent in db
function stopUpdatingTimeSpent(task) {

    const transaction = db.transaction(['tasks_db'], 'readwrite');
    const objectStore = transaction.objectStore("tasks_db");

    const key = task.id;
    console.log(task.id);
    const getRequest = objectStore.get(key);

    getRequest.addEventListener("success", () => {
        const existingTask = getRequest.result;

        if(existingTask) {
            existingTask.timeSpent = task.timeSpent;
            const putRequest = objectStore.put(existingTask);

            putRequest.addEventListener("success", () => {
                console.log(`Time spent updated for task with ID ${key}, new time spent: ${task.timeSpent}`);
            });

            putRequest.addEventListener("error", (event) => {
                console.error("Error updating time spent:", event.target.error);
            });

        } else {
            console.error(`Task with ID ${key} not found.`);
        }
    });

    getRequest.addEventListener("error", (event) => {
        console.error("Error retrieving task:", event.target.error);
});

    clearInterval(task.timeSpentInterval);

}


function formatTime(milliseconds) {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
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

    if (!loaded){
        console.log("loading from database");
        populate_database_cal();
    }
    

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
    const tasksList = document.getElementById('undated-tasks');
    tasksList.innerHTML = '';
}

// Populate the list of tasks without a date
function populateTasksWithoutDate() {
    const tasksList = document.getElementById('undated-tasks');
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

function updateUndatedTasks() {
    const undatedTasksBox = document.getElementById('undated-tasks');
    undatedTasksBox.innerHTML = '';
   
    tasksWithoutDate.forEach((task) => {
        const taskButton = document.createElement('button');
        taskButton.innerHTML = task.name;
        taskButton.addEventListener('click', () => {
            // Display the task details
            displayTaskInfo(task);
        });
        undatedTasksBox.appendChild(taskButton);
    });
}
   
function populate_database_cal(){
    const objectStore = db.transaction('tasks_db').objectStore('tasks_db');
    objectStore.openCursor().onsuccess = (event) => {
        const cursor = event.target.result;
        
        if (!cursor) {
            console.log("All items displayed")
            
            }

        else{
            addTask(cursor.value);
            cursor.continue();
        }
           
    }
    loaded = true;
}

// Create a popup for a given task
function createTaskPopup(task) {
    const popup = document.createElement('div');
    popup.classList.add('task-popup');

    const closeButton = createPopupButton('✖', () => popup.remove());
    closeButton.classList.add('popup-button');
    
    const clockInButton = createPopupButton('Clock In', () => {
        if (clockedIn == 0) {
            task.clockInTime = new Date();
            startUpdatingTimeSpent(task);
            clockedOut = 0;
            clockedIn = 1;
        }
    });
    clockInButton.classList.add('popup-button');

    const clockOutButton = createPopupButton('Clock Out', () => {
        if (clockedOut == 0) {
            stopUpdatingTimeSpent(task);
            clockedOut = 1;
            clockedIn = 0;
        }
    });

    clockOutButton.classList.add('popup-button');

    const completeButton = createPopupButton('Complete', () => {
        if (clockedOut == 0) {
            stopUpdatingTimeSpent(task);
            clockedOut = 1;
            clockedIn = 0;
        }
        popup.remove();
        deleteTask(task.id);
        updatePoints(calculatePoints(task.timeSpent,task.importance,task.addToDate,task.dueDate), task.id);
    });

    completeButton.classList.add('popup-button');

    const taskInfoContainer = createTaskInfoContainer(task);
    const timeSpentDisplay = createTaskInfoElement(`Time Spent: ${formatTime(task.timeSpent)}`);
    timeSpentDisplay.classList.add('time-spent'); // Add a class to uniquely identify the time spent display


    const dawgGif = document.createElement('img');
    dawgGif.src = 'Pictures/DancingDawg.gif'; // Replace with the actual path to your GIF file
    dawgGif.classList.add('popup-gif'); // Add a class for styling if needed

    // Append the GIF image to the popup
    popup.appendChild(clockInButton);
    popup.appendChild(clockOutButton);
    popup.appendChild(completeButton);
    popup.appendChild(closeButton);
    popup.appendChild(taskInfoContainer);
    popup.appendChild(dawgGif);
    popup.appendChild(timeSpentDisplay);
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
    const clockInTimeElement = createTaskInfoElement(task.clockInTime ? `Clock In Time: ${task.clockInTime.toLocaleTimeString()}` : '');

    taskInfoContainer.appendChild(taskNameElement);
    taskInfoContainer.appendChild(dueDateElement);
    taskInfoContainer.appendChild(clockInTimeElement);

    return taskInfoContainer;
}

// Displays the timer while clocked in
function updateTaskPopupTimeSpent(task) {
    const timeSpentDisplay = document.querySelector('.task-popup .time-spent');
    timeSpentDisplay.textContent = `Time Spent: ${formatTime(task.timeSpent)}`;

}

// Create an element for task information in a popup
function createTaskInfoElement(text) {
    const element = document.createElement('p');
    element.textContent = text;
    return element;
}

// Get points from points db
function getPointsFromDB() {
    const request = db_Points.transaction('points_db').objectStore('points_db').get('points');

    request.onsuccess = ()=> {
        const pts = request.result;
        return pts;
    }
}

// Set points in db to be current points
function updatePointsInDB(pts) {
    const transaction = db_Points.transaction(['points_db'], 'readwrite');
    const objectStore = transaction.objectStore("points_db");
    const request = objectStore.get("points");

    request.addEventListener("success", () => {
        const updatePointsRequest = objectStore.put(pts, "points");
        console.log(`Points updated, points: ${pts}`);
      });
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
function addTask(task1) {
    var transaction = null;
    var objectStore = null;
        if (task1){
            var taskName = task1.name;
            var dueDate = task1.dueDate;
            var addToDate = task1.addToDate;
            var importance = task1.importance;
            var timespent = task1.timeSpent
        }
        
    else {
        taskName = document.getElementById('task-name').value;
        dueDate = document.getElementById('due-date').value;
        addToDate = document.getElementById('add-to-date').value;
        importance = validateImportanceInput();
        transaction = db.transaction(["tasks_db"], "readwrite");
        objectStore = transaction.objectStore("tasks_db");
        timespent = 0;
    }

    


    if (taskName.trim() !== '') {
        if (addToDate !== "" && addToDate !== null) {  
            const task = {
                name: taskName,
                addToDate: addToDate,
                dueDate: dueDate || null,
                importance: importance || null,
                clockInTime: null,
                timeSpent: 0,
                timeSpentInterval: null,
            };
            if (task.id == null){
                task.id = taskIdCounter++;
            }
        
            
            console.log(transaction);
            if (transaction !== null){
                objectStore.add(task);
                
            }
            var selectedDate = new Date(addToDate);
            selectedDate.setDate(selectedDate.getDate());
            const dateString = selectedDate.toISOString().split('T')[0];

            if (!tasksByDate[dateString]) {
                tasksByDate[dateString] = [];
            }
            tasksByDate[dateString].push(task);
        } 
        else {
            console.log("shouldbehere");
            //console.log(task1.id);
            const task = {
                name: taskName,
                addToDate: addToDate || null,
                dueDate: dueDate || null,
                importance: importance || null,
                clockInTime: null,
                timeSpent: timespent,
                timeSpentInterval: null,
            };
            
            if (task1 == undefined){
                task.id = taskIdCounter++;
            }
            else{
                task.id = task1.id;
            }
            tasksWithoutDate.push(task);
            updateUndatedTasks();
            if (transaction !== null){
                const addRequest = objectStore.add(task);
            }
            

        }

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
    return importanceValue;
}

// Validate importance input
var taskImportanceInput = document.getElementById('task-importance');
taskImportanceInput.addEventListener('input', validateImportanceInput);

// Initial setup
updateCalendar();
