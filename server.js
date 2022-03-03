import express from "express";
import compression from "compression";
import morgan from "morgan";
import { Server } from "socket.io";
import { createServer } from "http";
import { createRequestHandler } from "@remix-run/express";
import { db } from "./app/db.server";

import * as serverBuild from "@remix-run/dev/server-build";

const app = express();

const httpServer = createServer(app);

const io = new Server(httpServer);

io.on("connection", (socket) => {
  // here you can do whatever you want with the socket of the client, in this
  // example I'm logging the socket.id of the client
  console.log(socket.id, "connected");
  // and I emit an event to the client called `event` with a simple message
  socket.emit("event", "connected!");
  // and I start listening for the event `something`
  socket.on("message", async ({ content, userId, groupId }) => {
    // create message and broadcast to listeners
    const message = await db.message.create({ data: { content, userId, groupId }});
    socket.emit("message:broadcast", message);
  });
  
});

app.use(compression());

// http://expressjs.com/en/advanced/best-practice-security.html#at-a-minimum-disable-x-powered-by-header
app.disable("x-powered-by");

// Remix fingerprints its assets so we can cache forever.
app.use(
  "/build",
  express.static("public/build", { immutable: true, maxAge: "1y" })
);

// Everything else (like favicon.ico) is cached for an hour. You may want to be
// more aggressive with this caching.
app.use(express.static("public/build", { maxAge: "1h" }));

app.use(morgan("tiny"));

app.all(
  "*",
  createRequestHandler({
    build: serverBuild,
    mode: process.env.NODE_ENV,
  })
);

const port = process.env.PORT || 3000;

httpServer.listen(port, () => {
  console.log(`Express server listening on port ${port}`);
});
