        // Initialize current date to January 1, 2023
        let currentDate = new Date();

        // Create an object to store tasks by date
        const tasksByDate = {};

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

                // Create an unordered list for tasks
                const taskList = document.createElement('ul');
                taskList.classList.add('task-list');

                // Get tasks for the current date and populate the task list
                const dateString = day.toISOString().split('T')[0];
                const tasksForDate = tasksByDate[dateString] || [];
                tasksForDate.forEach((task) => {
                    const taskItem = document.createElement('li');
                    taskItem.innerHTML = '<br>' + task.name + (task.dueDate ? '<br>(Due: ' + task.dueDate + ')' : '');
                    taskList.appendChild(taskItem);
                });

                cell.appendChild(taskList);
                calendarBody.appendChild(cell);
            }
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

            if (taskName.trim() !== '' && addToDate) {
                const task = {
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

                // Update the calendar
                updateCalendar();

                // Clear task input fields
                document.getElementById('task-name').value = '';
                document.getElementById('due-date').value = '';
                document.getElementById('add-to-date').value = '';
            }
        });

        // Initial calendar update
        updateCalendar();