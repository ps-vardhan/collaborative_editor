const express = require("express");
const router = express.Router();
const Room = require("../models/Room");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const generateId = (length) =>
  crypto.randomBytes(6).toString("hex").toUpperCase();

router.post("/", async (req, res) => {
  const { name, owner } = req.body;
  try {
    // if (!password) return res.status(400).json({ msg: "Password Required" });

    let roomId = generateId(6);

    while (await Room.findOne({ roomId })) {
      roomId = generateId(6);
    }

    const passwordKey = generateId(3);

    const salt = await bcrypt.genSalt(10); const hashedPassword = await bcrypt.hash(passwordKey, salt);

    const newRoom = new Room({ roomId, name, password: hashedPassword, owner });
    await newRoom.save();

    res.json({ msg: "Room Created", roomId, passwordKey });
  } catch (err) {
    console.error("Create Error:", err);
    res.status(500).json({ error: err.message });
  }
});

router.post("/join", async (req, res) => {
  const { roomId, password } = req.body;
  try {
    const room = await Room.findOne({ roomId });

    if (!room) return res.status(404).json({ msg: "Room not found" });

    const isMatch = await bcrypt.compare(password, room.password);
    if (!isMatch) return res.status(401).json({ msg: "Invalid Password" });

    res.json({ msg: "Acess Granted", roomId: room.roomId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
