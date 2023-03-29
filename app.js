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
      console.log("Server running at http://localhost3000/");
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

  //   switch(true){
  //       case hasPriorityAndStatus(request.query); //if this is true then below query is taken in the code
  //       getTodosQuery = `
  //       SELECT * FROM todo WHERE todo LIKE '%${search_q}%' AND
  //       priority = ${priority} AND status = ${status}`;
  //      break;

  //     case hasPriority(request.query);
  //     getTodosQuery = `
  //       SELECT * FROM todo WHERE todo LIKE '%${search_q}%' AND
  //       priority = ${priority}` ;
  //      break;

  //      case hasStatus(request.query);
  //       getTodosQuery = `
  //       SELECT * FROM todo WHERE todo LIKE '%${search_q}%' AND
  //       status = ${status}`;
  //      break;

  //        default:
  //    getTodosQuery = `
  //    SELECT
  //     *
  //    FROM
  //     todo
  //    WHERE
  //     todo LIKE '%${search_q}%';`;
  //   }
  //   data  = await db.all(getTodosQuery);
  //   response.send(data);
});
