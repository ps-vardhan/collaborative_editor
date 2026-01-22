const { createToken } = require('./livekit-token.js');

const express = require("express");
const mongoose = require("mongoose");
const http = require("http");
const WebSocket = require("ws");
const dotenv = require("dotenv");
const cors = require("cors");
const Y = require("yjs");
const authRoutes = require("./routes/auth");
const roomRoutes = require("./routes/rooms");

const { setupWSConnection } = require("./utils");
// const { MongodbPersistance } = require("y-mongodb-provider");
// const { setPersistance, setupWSConnection } = require("y-websocket/bin/utils");

dotenv.config();

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/rooms", roomRoutes);

mongoose
  .connect(
    process.env.Mongo_URI || "mongodb://localhost:27017/collaborative-editor"
  )
  .then(() => console.log("MongoDb Connected"))
  .catch((err) => console.error("MongoDb Connection Error:", err));

// const mdb = new MongodbPersistance(
//   process.env.MONGO_URI || "mongodb://localhost:27017/collaborative-editor",
//   {
//     collectionName: "yjs-transactions",
//     flushSize: 100,
//     multipleCollections: true,
//   }
// );

// setPersistance({
//   bindState: async (DocumentFragment, ydoc) => {
//     const persistedYdoc = await mdb.getYDoc(docName);
//     const newUpdates = Y.encodeStateAsUpdate(ydoc);
//     mdb.storeUpdate(docName, newUpdates);

//     Y.applyUpdate(ydoc, Y.encodeStateAsUpdate(persistedYdoc));
//   },
//   writeState: async (docName, ydoc) => {
//     await mdb.storeUpdate(docName, Y.encodeStateAsUpdate(ydoc));
//   },
// });

app.get("/api/token", async (req, res) => {
  // res.send("Collaborative Text Editor Server is Running");
  const room = req.query.room;
  const userName = req.query.username || "Guest";
  try {
    const token = await createToken(room, userName);
    res.json({ token });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

const wss = new WebSocket.Server({ server });

wss.on("connection", (conn, req) => {
  setupWSConnection(conn, req, { gc: true });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
