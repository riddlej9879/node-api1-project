const express = require("express");

const db = require("./database.js");

const server = express();

server.use(express.json());

server.get("/", (req, res) => {
  res.json({ message: "Hello new app" });
});

server.listen(8080, () => {
  console.log("Server started on port 8080");
});

server.get("/users", (req, res) => {
  const users = db.getUsers();
  res.status(200).json(users);
});

server.get("/users/:id", (req, res) => {
  const id = req.params.id;
  const user = db.getUserById(id);

  if (user) {
    res.status(200).json(user);
  } else {
    res
      .status(404)
      .json({ message: "The user with the specified ID does not exist" });
  }
});

server.delete("/users/:id", (req, res) => {
  const id = req.params.id;
  const user = db.getUserById(id);

  if (user) {
    db.deleteUser(req.params.id);
    res.status(204).json({ message: "User deleted" });
  }
});

server.post("/users", (req, res) => {
  if (!req.body.name || !req.body.bio) {
    res.status(400).json({ message: "Please enter a name and bio" });
  } else {
    const newUser = db.createUser({
      name: req.body.name,
      bio: req.body.bio,
    });

    res.status(201).json(newUser);
  }
});

server.put("/users/:id", (req, res) => {
  const id = req.params.id;
  const user = db.getUserById(id);

  if (user) {
    const updatedUser = db.updateUser(user.id, {
      name: req.body.name || user.name,
      bio: req.body.bio || user.bio,
    });
    res.status(200).json(updatedUser);
  } else {
    res.status(404).json({ message: "User not found" });
  }
});
