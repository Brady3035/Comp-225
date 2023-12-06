/*
 *
 * This file contains the script for setting up the client-side
 * database that will hold the users tasks and point value
 * 
 * Code modified from Mozilla's IndexedDB examples and guides, as well
 * as Raymond Camden's blog post: Issues with IndexedDB and Chrome
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

// FireFox database creation
openRequest.addEventListener("upgradeneeded", (e) => {
    db = e.target.result;     // Grab a reference to the opened database
    console.log("Database grabbed");
 
    // This gets run by FireFox
    if(!db.objectStoreNames.contains("tasks_db")){
      console.log("Need to create objectStore");
      var objectStore = db.createObjectStore("tasks_db", { keyPath: 'id', autoIncrement: true });
      objectStore.createIndex('id', 'id', { unique: false });
      objectStore.createIndex('name', 'name', { unique: false });
      objectStore.createIndex('addToDate', 'addToDate', { unique: false });
      objectStore.createIndex('dueDate', 'dueDate', { unique: false });
      objectStore.createIndex('importance', 'importance', { unique: false });
      objectStore.createIndex('clockInTime', 'clockInTime', { unique: false });
      objectStore.createIndex('timeSpent', 'timeSpent', { unique: false });
      objectStore.createIndex('timeSpentInterval', 'timeSpentInterval', { unique: false });
    }

    console.log("Database setup complete");

});

// Chrome database creation
openRequest.addEventListener("success", (e) => {
  db = e.target.result;
  console.log("Database grabbed");

  if(!db.objectStoreNames.contains("tasks_db")) {
    var versionRequest = db.setVersion("1");
    versionRequest.addEventListener("success", (e) => {
      var objectStore = db.createObjectStore("tasks_db", { keyPath: 'id', autoIncrement: true });
      objectStore.createIndex('id', 'id', { unique: false });
      objectStore.createIndex('name', 'name', { unique: false });
      objectStore.createIndex('addToDate', 'addToDate', { unique: false });
      objectStore.createIndex('dueDate', 'dueDate', { unique: false });
      objectStore.createIndex('importance', 'importance', { unique: false });
      objectStore.createIndex('clockInTime', 'clockInTime', { unique: false });
      objectStore.createIndex('timeSpent', 'timeSpent', { unique: false });
      objectStore.createIndex('timeSpentInterval', 'timeSpentInterval', { unique: false });
    });
  }

  console.log("Database setup complete");

});
  
  
// Define the deleteItem() function

function deleteItem(e) {
    // retrieve the name of the task we want to delete. We need
    // to convert it to a number before trying to use it with IDB; IDB key
    // values are type-sensitive.
    const taskId = Number(e.target.parentNode.getAttribute("id"));
  
    // open a database transaction and delete the task, finding it using the id we retrieved above
    const transaction = db.transaction(["tasks_db"], "readwrite");
    const objectStore = transaction.objectStore("tasks_db");
    const deleteRequest = objectStore.delete(taskId);
  
    // report that the data item has been deleted
    transaction.addEventListener("complete", () => {
      // delete the parent of the button
      // which is the list item, so it is no longer displayed
      e.target.parentNode.parentNode.removeChild(e.target.parentNode);
      console.log(`Note ${noteId} deleted.`);
  
      // Again, if list item is empty, display a 'No notes stored' message
      if (!list.firstChild) {
        const listItem = document.createElement("li");
        listItem.textContent = "No notes stored.";
        list.appendChild(listItem);
      }
    });
  }
  