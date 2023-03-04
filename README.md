# Clustering in Nodejs | Scaling Nodejs App
Node.js is an event-driven, non-blocking I/O platform that is built on top of Google's V8 JavaScript engine. Node.js provides an easy-to-use API for building high-performance, scalable network applications.

However, while Node.js is great for building fast and scalable applications, it is still a single-threaded process, which means it can only take advantage of a single processor core. This limitation can cause performance bottlenecks, especially when dealing with CPU-intensive tasks.

Fortunately, Node.js provides a solution to this problem with the "cluster" module. In this blog, we'll explore what Node.js clustering is, how it works, and provide an example of how to use it.

# What is Node.js Clustering?

Node.js clustering allows you to create child processes that can share the same server port. These child processes can run on different CPU cores, which allows Node.js applications to take advantage of multi-core systems.

Each child process is created as a separate instance of the Node.js event loop, which means that they can execute JavaScript code independently of each other. This approach allows you to divide your application's workload across multiple processes, which can lead to improved performance and better scalability.

# How Does Node.js Clustering Work?

To use Node.js clustering, you first need to create a master process that will manage the child processes. The master process is responsible for creating child processes and distributing the workload across them.

When you create a child process, it will inherit the same environment and context as the master process, including any open server sockets. The child process will then execute a separate instance of the event loop, which allows it to process requests independently of the other child processes.

The master process can communicate with the child processes using inter-process communication (IPC) channels. This allows the master process to distribute workloads to the child processes and receive responses back.

Example Code

Let's take a look at an example of how to use Node.js clustering to create a simple Express server that runs on multiple CPU cores.

```const express = require("express");
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
```


after starting the server 

In this example, we first check if the current process is the master process. If it is, we fork a child process for each available CPU core using the cluster.fork() method.

We also listen for the exit event on each child process. This event is triggered when a child process dies unexpectedly. In this case, we simply log a message to the console.

If the current process is not the master process, we create an Express server that listens on port 3000. This server will respond to all incoming requests with a "Hello World" message along with the worker that handles the request.

Finally, we log a message to the console indicating that a worker process has started.

# Conclusion

Node.js clustering is a powerful tool that can help you improve the performance and scalability of your Node.js applications. By distributing your application's workload across multiple CPU cores, you can take advantage of the full processing power of your system.
