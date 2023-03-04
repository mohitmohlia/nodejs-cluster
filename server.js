const express = require("express");
const cluster = require("node:cluster");
const totalCPUs = require("node:os").availableParallelism();
const process = require("node:process");

if (cluster.isPrimary) {
  console.log(`Master ${process.pid} is running`);

  for (let i = 0; i < totalCPUs; i++) {
    cluster.fork();
  }
  cluster.on("exit", (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });
} else {
  const app = express();
  const port = 3000;

  app.get("/", (req, res) => {
    res.send(`Hello World! ${process.pid}`);
  });

  app.listen(port, () => {
    console.log(`Worker ${process.pid} started`);
  });
}
