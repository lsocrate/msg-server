import { createServer } from "./server.js";

createServer().then((server) => {
  server.start();

  process.on("SIGINT", server.shutdown);
  process.on("SIGTERM", server.shutdown);
});
