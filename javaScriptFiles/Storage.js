/*
 *
 * This file contains the script for the client-side database that 
 * will hold the users tasks and point value
 * 
 * Code modified from Mozilla's IndexedDB examples and guides
 * 
 */

// Create db instance
let db;

// Open/create our database
const openRequest = window.indexedDB.open("tasks_db", 1);

// Error/success handlers
openRequest.addEventListener("error", () => console.error("Database failed to open"), );
openRequest.addEventListener("success", () => {
  console.log("Database opened successfully");

  // Store the opened database object in db
  db = openRequest.result;
  console.log(openRequest.result);

  // Run updateCalendar() - display the notes already in IDB
  updateCalendar();
});

// Set up the database tables upon creation
openRequest.addEventListener("upgradeneeded", (e) => {
    db = e.target.result;     // Grab a reference to the opened database
    console.log("Database grabbed");

    // Create an objectStore in database to store notes and auto-incrementing key
    const objectStore = db.createObjectStore("tasks_db", { keyPath: 'taskTitle' });
  
    // Define what data items objectStore will contain
    objectStore.createIndex('taskTitle', 'taskTitle', { unique: false });
    objectStore.createIndex('dueDate', 'dueDate', { unique: false });
    objectStore.createIndex('onDate', 'onDate', { unique: false });
    objectStore.createIndex('importance', 'importance', { unique: false });
  
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
    const importance = document.getElementById('task-importance');

    // Grab values, store them in an object to be inserted into DB
    const newItem = { taskTitle: title.value, dueDate: dueDate.value, onDate: onDate.value, importance: importance.value};

    // Open a read/write db transaction
    const transaction = db.transaction(["tasks_db"], "readwrite");
  
    // Call object store that's already been added
    const objectStore = transaction.objectStore("tasks_db");
  
    // Add newTaskList object to object store
    const addRequest = objectStore.add(newItem);
  
    // Success report
    transaction.addEventListener("complete", () => {
      console.log("Transaction completed: database modification finished.");
  
      // update the calendar
      updateCalendar();
    });
  
    transaction.addEventListener("error", () =>
      console.log("Transaction not opened due to error"),
    );
  }

  
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
  