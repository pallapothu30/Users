const express = require("express");
const users = require("./Dummy Data.json");
const fs = require("fs");
const mongoose = require("mongoose")
const app = express();
const PORT = 8000;


// Middleware - Plugin
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Routes.
// server side rendering.
// server side rendering.
app.get("/users", (req, res) => {
  const users = loadUsers(); // Load fresh data from JSON file

  const html = `
    <ul>
      ${users.map((user) => `<li>${user.first_name}</li>`).join("")}
    </ul>
  `;

  return res.send(html);
});


// defualt route.
app.get("/",(req,res)=>{
  return res.send("Hello from server")
})



// Rest api .
// Get users
app.get("/api/users", (req, res) => {
  return res.json(users);
});

/**
 * Get user by ID
 */
app.get("/api/users/:uid", (req, res) => {
  const uid = Number(req.params.uid);
  const user = users.find((user) => user.id === uid);

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  return res.json(user);
});

/**
 * Create a new user
 */
app.post("/api/users", (req, res) => {
  if (!req.body || !req.body.first_name || !req.body.email) {
    return res.status(400).json({ status: "failed", error: "Missing required fields" });
  }

  // Find the highest ID and increment it
  const maxId = users.length > 0 ? Math.max(...users.map((user) => user.id)) : 0;
  const newUser = { ...req.body, id: maxId + 1 };

  users.push(newUser);

  // Write to file
  fs.writeFile("./Dummy Data.json", JSON.stringify(users, null, 2), (err) => {
    if (err) {
      return res.status(500).json({ status: "failed", error: "Failed to update data file" });
    }
    return res.status(201).json({ status: "success", message: "User created successfully", data: newUser });
  });
});

/**
 * Update user by ID
 */
app.patch("/api/users/:uid", (req, res) => {
  const uid = Number(req.params.uid);
  const userIdx = users.findIndex((user) => user.id === uid);

  if (userIdx === -1) {
    return res.status(404).json({ error: "User not found" });
  }

  users[userIdx] = { ...users[userIdx], ...req.body };

  // Write to file
  fs.writeFile("./Dummy Data.json", JSON.stringify(users, null, 2), (err) => {
    if (err) {
      return res.status(500).json({ status: "failed", error: "Failed to update data file" });
    }
    return res.status(200).json({ status: "success", message: "User updated successfully", data: users[userIdx] });
  });
});

/**
 * Delete user by ID
 */
app.delete("/api/users/:uid", (req, res) => {
  const uid = Number(req.params.uid);
  const userIndex = users.findIndex((user) => user.id === uid);

  if (userIndex === -1) {
    return res.status(404).json({ error: "User not found" });
  }

  users.splice(userIndex, 1);

  // Write to file
  fs.writeFile("./Dummy Data.json", JSON.stringify(users, null, 2), (err) => {
    if (err) {
      return res.status(500).json({ status: "failed", error: "Failed to update data file" });
    }
    return res.status(200).json({ status: "success", message: `User with id ${uid} deleted` });
  });
});

// Routes
app.get("/", (req, res) => res.send("Hello from server"));

app.get("/users", (req, res) => {
  const html = `
    <ul>
      ${users.map((user) => `<li>${user.first_name} ${user.last_name}</li>`).join("")}
    </ul>
  `;
  return res.send(html);
});

// Start Server
app.listen(PORT, () => console.log(`Server started on port: ${PORT}`));
