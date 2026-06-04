const express = require("express");
const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api", require("./router/server_route"));

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
