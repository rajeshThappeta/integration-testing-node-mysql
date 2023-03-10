//process.env.NODE_ENV = "test";
const connection = require("../db.config");
const request = require("supertest");
const app = require("../server");

const db = connection.promise();
//let s= db.query('select * from users')
//console.log("s is ",s)

beforeAll(async () => {
  console.log("before all");
  await db.query(
    "CREATE TABLE students (id int PRIMARY KEY auto_increment, name varchar(200))"
  );
});

beforeEach(async () => {
  // seed with some data
  await db.query("INSERT INTO students(name)  VALUES ('Ravi'), ('Kiran')");
});

afterEach(async () => {
  await db.query("DELETE FROM students");
});

afterAll(async () => {
  await db.query("DROP TABLE students");
  db.end();
});

//get students
test("It responds with an array of students", async () => {
  const response = await request(app).get("/students");
  //console.log(response.body);
  expect(response.body.length).toBe(2);
  expect(response.body[0]).toHaveProperty("id");
  expect(response.body[0]).toHaveProperty("name");
  expect(response.statusCode).toBe(200);
});

//post user
test("It responds with the newly created student", async () => {
  const res = await request(app).post("/student").send({
    name: "New Student",
  });

  // console.log("new student",newStudent.body)
  // make sure we add it correctly
  expect(res.body).toHaveProperty("id");
  expect(res.body.name).toBe("New Student");
  expect(res.statusCode).toBe(200);

  // make sure we have 3 students now
  const response = await request(app).get("/students");
  expect(response.body.length).toBe(3);
});

//update test
describe("update /student/1", () => {
  test("It responds with an updated student", async () => {
    const res = await request(app).post("/student").send({
      name: "Another one",
    });
    console.log(res.body);
    const resOfUpdate = await request(app)
      .put(`/student/${res.body.id}`)
      .send({ name: "updated" });

    expect(resOfUpdate.body.name).toBe("updated");
    expect(resOfUpdate.body).toHaveProperty("id");
    expect(resOfUpdate.statusCode).toBe(200);

    // make sure we have 3 students
    const response = await request(app).get("/students");
    expect(response.body.length).toBe(3);
  });
});

//delete test
describe("DELETE /student/1", () => {
  test("It responds with a message of Deleted", async () => {
    const res = await request(app).post("/student").send({
      name: "Another one",
    });
    const removedStudent = await request(app).delete(`/student/${res.body.id}`);
    expect(removedStudent.body).toEqual({ message: "Deleted" });
    expect(removedStudent.statusCode).toBe(200);

    // make sure we still have 2 students
    const response = await request(app).get("/students");
    expect(response.body.length).toBe(2);
  });
});
