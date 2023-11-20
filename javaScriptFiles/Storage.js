/*
 *
 * This file contains the script for the client-side database that 
 * will hold the users tasks and point value
 * 
 */

// Create constants
// const title = document.getElementById('task-name');
// const dueDate = document.getElementById('due-date');
// const onDate = document.getElementById('add-to-date');
// const importance = document.getElementById('importance');
// console.log(title.value, dueDate.value, onDate.value);
// console.log(tasksByDate)


// Create an instance of a db object to store the open database in
let db;

// Open our database; created if it doesn't exist
const openRequest = window.indexedDB.open("tasks_db", 1);

// error handler - database didn't open successfully
openRequest.addEventListener("error", () => console.error("Database failed to open"), );

// success handler - database opened successfully
openRequest.addEventListener("success", () => {
  console.log("Database opened successfully");

  // Store the opened database object in the db variable
  db = openRequest.result;
  console.log(openRequest.result);

  // Run the displayData() - display the notes already in the IDB
  displayData();
});

// Set up the database tables
openRequest.addEventListener("upgradeneeded", (e) => {
    db = e.target.result;     // Grab a reference to the opened database
    console.log("Database grabbed");

    // Create an objectStore in database to store notes and auto-incrementing key
    const objectStore = db.createObjectStore("tasks_db", { keyPath: 'taskTitle' });
  
    // Define what data items objectStore will contain
    objectStore.createIndex('taskTitle', 'taskTitle', { unique: false });
    objectStore.createIndex('dueDate', 'dueDate', { unique: false });
    objectStore.createIndex('onDate', 'onDate', { unique: false });
    // objectStore.createIndex('importance', 'importance', { unique: false });
  
    console.log("Database setup complete");
  });
  
// Create event handler so that when a task is added the addData() function is run
document.getElementById("add-task").addEventListener("click", addData);

// Define the addData() function
function addData(e) {
    e.preventDefault();

    const title = document.getElementById('task-name');
    const dueDate = document.getElementById('due-date');
    const onDate = document.getElementById('add-to-date');
    // grab the values and store them in an object to be inserted into the DB
    const newItem = { taskTitle: title.value, dueDate: dueDate.value, onDate: onDate.value};
    console.log(title.value, dueDate.value, onDate.value);
    console.log(newItem.taskTitle, newItem.dueDate, newItem.onDate);


    // open a read/write db transaction to add the data
    const transaction = db.transaction(["tasks_db"], "readwrite");
  
    // call object store that's already been added to the database
    const objectStore = transaction.objectStore("tasks_db");
  
    // Make request to add newTaskList object to object store
    const addRequest = objectStore.add(newItem);
  
    // Report on the success of the transaction completing
    transaction.addEventListener("complete", () => {
      console.log("Transaction completed: database modification finished.");
  
      // update the display, showing new item
      displayData();
    });
  
    transaction.addEventListener("error", () =>
      console.log("Transaction not opened due to error"),
    );
  }
  // Define the displayData() function
// function displayData() {
//     // clear content of the task list to avoid duplicates
//     while (tasksByDate.firstChild) {
//       tasksByDate.removeChild(tasksByDate.lastChild);
//     }

//     // Open our object store and get a cursor - iterates through different data items in store
//     const objectStore = db.transaction("tasks_db").objectStore("tasks_db");
//     objectStore.openCursor().addEventListener("success", (e) => {
//       const cursor = e.target.result;      // Get a reference to the cursor
  
//       // If there is another item to iterate through, keep running
//       if (cursor) {
        
//         const listItem = document.createElement("li");
//         // Store the ID of the data item inside an attribute on the listItem, so we know
//         // which item it corresponds to. This will be useful later when we want to delete items
//         listItem.setAttribute("data-note-id", cursor.value.id);
  
  
//         // Iterate to the next item in the cursor
//         cursor.continue();
//       } else {
//         // Again, if list item is empty, display a 'No notes stored' message
//         if (!tasksByDate.firstChild) {
//           const listItem = document.createElement("li");
//           console.log("No notes stored");
//           tasksByDate.appendChild(listItem);
//         }
//         // if there are no more cursor items to iterate through, say so
//         console.log("Notes all displayed");
//       }
//     });
//   }


// change this to essentially add the structure of populateTasksWithoutDate function in this
function displayData() {
  // First clear the content of the task list so that you don't get a huge long list of duplicate stuff each time
  // the display is updated.
  // while (document.body.firstChild) {
  //   document.body.removeChild(document.body.lastChild);
  // }

  // Open our object store and then get a cursor list of all the different data items in the IDB to iterate through
  const objectStore = db.transaction('tasks_db').objectStore('tasks_db');
  objectStore.openCursor().onsuccess = (event) => {
    const cursor = event.target.result;

    // Check if there are no (more) cursor items to iterate through
    if (!cursor) {
      // No more items to iterate through, we quit.
      console.log("All items displayed")
      return;
    }
    
    // Check which suffix the deadline day of the month needs
    const { onDate, dueDate, taskTitle } = cursor.value;
    console.log(onDate, dueDate, taskTitle)

    // Build the to-do list entry and put it into the list item.
    // const toDoText = `${title} — ${hours}:${minutes}, ${month} ${ordDay} ${year}.`;
    // const listItem = ;

    // Put the item item inside the task list
    // document.body.appendChild(listItem);

    // continue on to the next item in the cursor
    cursor.continue();
  };
};
  
// Define the deleteItem() function

// function deleteItem(e) {
//     // retrieve the name of the task we want to delete. We need
//     // to convert it to a number before trying to use it with IDB; IDB key
//     // values are type-sensitive.
//     const noteId = Number(e.target.parentNode.getAttribute("data-note-id"));
  
//     // open a database transaction and delete the task, finding it using the id we retrieved above
//     const transaction = db.transaction(["tasks_db"], "readwrite");
//     const objectStore = transaction.objectStore("tasks_db");
//     const deleteRequest = objectStore.delete(noteId);
  
//     // report that the data item has been deleted
//     transaction.addEventListener("complete", () => {
//       // delete the parent of the button
//       // which is the list item, so it is no longer displayed
//       e.target.parentNode.parentNode.removeChild(e.target.parentNode);
//       console.log(`Note ${noteId} deleted.`);
  
//       // Again, if list item is empty, display a 'No notes stored' message
//       if (!list.firstChild) {
//         const listItem = document.createElement("li");
//         listItem.textContent = "No notes stored.";
//         list.appendChild(listItem);
//       }
//     });
//   }
  