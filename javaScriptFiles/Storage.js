/*
 *
 * File contains the script for setting up the client-side
 * database that will hold the users tasks and point value
 * 
 * Code modified from Mozilla's IndexedDB examples and guides, as well
 * as Raymond Camden's blog post: Issues with IndexedDB and Chrome
 * 
 */

// Create db instance
let db;
let db_Points;

// Open/create databases
const openRequest = window.indexedDB.open("tasks_db", 1);
const openRequestPoints = window.indexedDB.open("points_db", 1);

// Error/success handlers db
openRequest.addEventListener("error", () => console.error("Database failed to open"), );
openRequest.addEventListener("success", () => {
  console.log("Database opened successfully");

  // Store open database object in db
  db = openRequest.result;
  console.log(openRequest.result);

  // Run updateCalendar()
  updateCalendar();
});

// Error/success handlers db_Points
openRequestPoints.addEventListener("error", () => console.error("Points database failed to open"), );
openRequestPoints.addEventListener("success", () => {
  console.log("Points database opened successfully");

  // Store open database object in db
  db_Points = openRequestPoints.result;
  console.log(openRequestPoints.result);
  console.log(getPointsFromDB());

  updatePointsLabel();

});

// Database (db) creation
openRequest.addEventListener("upgradeneeded", (e) => {
  db = e.target.result;
  console.log("Database grabbed");

  const objectStore = db.createObjectStore("tasks_db", { keyPath: 'id' });

  objectStore.createIndex('id', 'id', { unique: false });
  objectStore.createIndex('name', 'name', { unique: false });
  objectStore.createIndex('addToDate', 'addToDate', { unique: false });
  objectStore.createIndex('dueDate', 'dueDate', { unique: false });
  objectStore.createIndex('importance', 'importance', { unique: false });
  objectStore.createIndex('clockInTime', 'clockInTime', { unique: false });
  objectStore.createIndex('timeSpent', 'timeSpent', { unique: false });
  objectStore.createIndex('timeSpentInterval', 'timeSpentInterval', { unique: false });

  console.log("Database setup complete");
});

// Database (points) creation
openRequestPoints.addEventListener("upgradeneeded", (ev) => {
  db_Points = ev.target.result;
  console.log("Points db grabbed");

  const objectStorePoints = db_Points.createObjectStore("points_db", { keyPath: 'label' });

  objectStorePoints.createIndex('points', 'points', {unique: false});
  
  console.log("Points database setup complete");

});

// Define deleteItem() function

function deleteTask(identification) {

    // open db transaction, delete task using given id
    const transaction = db.transaction(["tasks_db"], "readwrite");
    const request = transaction.objectStore("tasks_db").delete(identification);
    
    // confirm task has been deleted
    transaction.addEventListener("complete", () => {
      console.log(`Task deleted`);

    });
  }
  