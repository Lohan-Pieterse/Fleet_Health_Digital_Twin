const express = require("express");

// const pool = require("./db");

const port = 3000;

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api", require("./router/server_route"));

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
