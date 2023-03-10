const express = require("express");
const app = express();
const connection = require("./db.config");
const db = connection.promise();

app.use(express.json());

//READ STUDENTS
app.get("/students", async (req, res) => {
  const [data] = await db.query("SELECT * FROM students");
  // console.log(data);
  return res.json(data);
});

//CRAETE STUDENT
app.post("/student", async (req, res) => {
  await db.query("INSERT INTO students   set name=?", [req.body.name]);

  const [data] = await db.query("SELECT * FROM students where name=?", [
    req.body.name,
  ]);
  //console.log(data)
  return res.json(data[0]);
});

//UPDATE STUDENT BY ID
app.put("/student/:id", async (req, res) => {
  await db.query("UPDATE students SET name=? WHERE id=? ", [
    req.body.name,
    req.params.id,
  ]);
  const [data] = await db.query("SELECT * FROM students where name=?", [
    req.body.name,
  ]);
  //console.log(data)
  return res.json(data[0]);
});

//DELETE STUDENT BY ID
app.delete("/student/:id", async (req, res) => {
  const [data] = await db.query("DELETE FROM students WHERE id=?", [
    req.params.id,
  ]);
  return res.json({ message: "Deleted" });
});

module.exports = app;
