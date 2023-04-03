const express = require("express");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const app = express();
app.use(express.json());

const dbPath = path.join(__dirname, "todoApplication.db");
let db = null;

const initializeDbAndServer = async () => {
  try {
    db = await open({ filename: dbPath, driver: sqlite3.Database });

    app.listen(3000, () => {
      console.log("Server running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`Server error is ${e.message}`);
    process.exit(1);
  }
};

initializeDbAndServer();

const hasPriorityAndStatus = (requestQuery) => {
  return (
    requestQuery.priority !== undefined && requestQuery.status !== undefined
  );
};

const hasPriority = (requestQuery) => {
  return requestQuery.priority !== undefined;
};

const hasStatus = (requestQuery) => {
  return requestQuery.status !== undefined;
};

app.get("/todos/", async (request, response) => {
  let data = null;
  let getTodosQuery = "";
  const { search_q = "", priority, status } = request.query;
  console.log(request.query);

  switch (true) {
    case hasPriorityAndStatus(request.query): //if this is true then below query is taken in the code
      getTodosQuery = `
        SELECT * FROM todo WHERE todo LIKE '%${search_q}%' AND
        priority = '${priority}' AND status = '${status}'`;
      console.log(getTodosQuery);
      break;

    case hasPriority(request.query):
      getTodosQuery = `
        SELECT * FROM todo WHERE todo LIKE '%${search_q}%' AND
        priority = '${priority}'`;
      console.log(getTodosQuery);
      break;

    case hasStatus(request.query):
      getTodosQuery = `
        SELECT * FROM todo WHERE todo LIKE '%${search_q}%' AND
        status = '${status}'`;
      console.log(getTodosQuery);
      break;

    default:
      getTodosQuery = `
     SELECT
      *
     FROM
      todo
     WHERE
      todo LIKE '%${search_q}%';
      `;
  }
  data = await db.all(getTodosQuery);
  console.log(data);
  response.send(data);
});

app.get("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  const getTodoId = `
    SELECT * FROM todo WHERE id = ${todoId}`;
  const myId = await db.get(getTodoId);
  response.send(myId);
});

app.post("/todos/", async (request, response) => {
  const { id, todo, priority, status } = request.body;
  const createTodoId = `
    INSERT INTO todo (id, todo, priority, status)
    VALUES  (${id},'${todo}','${priority}','${status}')`;
  const createId = await db.run(createTodoId);
  response.send("Todo Successfully Added");
});

app.put("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  let updatedColumn = "";
  const requestBody = request.body;

  switch (true) {
    case requestBody.status !== undefined:
      updatedColumn = "Status";
      break;

    case requestBody.priority !== undefined:
      updatedColumn = "Priority";
      break;

    case requestBody.todo !== undefined:
      updatedColumn = "Todo";
      break;
  }

  const previousTodoId = `
    SELECT * FROM todo WHERE id = ${todoId}`;
  console.log(previousTodoId); // SELECT * FROM todo WHERE id = 2
  const previousTodo = await db.get(previousTodoId);
  console.log(previousTodo);
  // { id: 2, todo: 'Some task', priority: 'HIGH', status: 'DONE' }
  const {
    todo = previousTodo.todo,
    status = previousTodo.status,
    priority = previousTodo.priority,
  } = request.body;

  const updateTodo = `
    UPDATE todo 
    SET todo = '${todo}',priority='${priority}',status='${status}'`;
  await db.run(updateTodo);
  response.send(`${updatedColumn} Updated`);
});

app.delete("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  const getTodoId = `
    DELETE FROM todo WHERE id = ${todoId}`;
  await db.run(getTodoId);
  response.send("Todo Deleted");
});

module.exports = app;
