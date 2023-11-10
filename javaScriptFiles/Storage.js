/*
 *
 * This file contains the script for the client-side database that 
 * will hold the users tasks and point value
 * 
 */

// Create constants
const list = document.querySelector('ul');

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
    const objectStore = db.createObjectStore("tasks_db", {
      keyPath: "id",
      autoIncrement: true,
    });
  
    // Define what data items objectStore will contain
    objectStore.createIndex("tasksByDate", "tasksByDate", { unique: false });
  
    console.log("Database setup complete");
  });
  
// Create event handler so that when a task is added the addData() function is run
document.getElementById("add-task").addEventListener("click", addData);

// Define the addData() function
function addData(e) {
    e.preventDefault();
  
    // grab the values in the task list and store them in an object to be inserted into the DB
    const newTaskList = { tasksByDate: tasksByDate.value };
  
    // open a read/write db transaction to add the data
    const transaction = db.transaction(["tasks_db"], "readwrite");
  
    // call object store that's already been added to the database
    const objectStore = transaction.objectStore("tasks_db");
  
    // Make request to add newTaskList object to object store
    const addRequest = objectStore.add(newTaskList);
  
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
function displayData() {

    // Open our object store and get a cursor - iterates through different data items in store
    const objectStore = db.transaction("tasks_db").objectStore("tasks_db");
    objectStore.openCursor().addEventListener("success", (e) => {
      const cursor = e.target.result;      // Get a reference to the cursor
  
      // If there is another item to iterate through, keep running
      if (cursor) {
        
        const listItem = document.createElement("li");
        // Store the ID of the data item inside an attribute on the listItem, so we know
        // which item it corresponds to. This will be useful later when we want to delete items
        listItem.setAttribute("data-note-id", cursor.value.id);
  
  
        // Iterate to the next item in the cursor
        cursor.continue();
      } else {
        // Again, if list item is empty, display a 'No notes stored' message
        if (!list.firstChild) {
          const listItem = document.createElement("li");
          console.log("No notes stored.");
          list.appendChild(listItem);
        }
        // if there are no more cursor items to iterate through, say so
        console.log("Notes all displayed");
      }
    });
  }
  
// Define the deleteItem() function
function deleteItem(e) {
    // retrieve the name of the task we want to delete. We need
    // to convert it to a number before trying to use it with IDB; IDB key
    // values are type-sensitive.
    const noteId = Number(e.target.parentNode.getAttribute("data-note-id"));
  
    // open a database transaction and delete the task, finding it using the id we retrieved above
    const transaction = db.transaction(["tasks_db"], "readwrite");
    const objectStore = transaction.objectStore("tasks_db");
    const deleteRequest = objectStore.delete(noteId);
  
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
  