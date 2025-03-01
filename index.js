const express = require("express");
const fs = require("fs");
const mongoose = require("mongoose");
const { start } = require("repl");
const app = express();
const PORT = 8000;

mongoose
.connect("mongodb://127.0.0.1:27017/Users")
.then(()=>console.log("MongoDB connected!"))
.catch((err)=>console.log("MongoDB connection error: ",err))

// Schema
const UserScheme = new mongoose.Schema({
  firstName:{
    type:String,
    required:true,
  },
  lastName:{
    type:String,
    required:false,
  },
  email:{
    type:String,
    required:true,
    unique:true,
  },
  jobtitle:{
    type:String,
  },
  gender:{
    type:String
  },
},
{timestamps:true}
)

const User = mongoose.model("Users",UserScheme)


// Middleware - Plugin
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Routes.
// server side rendering.
// server side rendering.
app.get("/users", async(req, res) => {
  const allDBUsers = await User.find({});
  const html = `
    <ul>
      ${allDBUsers.map((user) => `<li>${user.firstName} ${user.lastName}-  ${user.email}</li>`).join("")}
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
app.get("/api/users", async(req, res) => {
  const allDBUsers = await User.find({});

  return res.json(allDBUsers);
});

/**
 * Get user by ID
 */
app.get("/api/users/:id", async(req, res) => {
  const user = await User.findById(req.params.id)
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  return res.json(user);
});

/**
 * Create a new user
 */
app.post("/api/users", (req, res) => {
  const { first_name, last_name, gender, title, email } = req.body;

  // Check for missing required fields
  if (!first_name || !email) {
    return res.status(400).json({ status: "failed", error: "Missing required fields" });
  }

  // Create user in MongoDB
  User.create({
    firstName: first_name,
    lastName: last_name,
    gender: gender,
    jobtitle: title,
    email: email,
  })
    .then((newUser) => {
      res.status(201).json({ status: "success", message: "User created successfully", data: newUser });
    })
    .catch((error) => {
      console.error("Error creating user:", error);
      res.status(500).json({ status: "failed", error: "Internal server error" });
    });
});


/**
 * Update user by ID
 */
app.patch("/api/users/:uid", async(req, res) => {
  await User.findByIdAndUpdate(req.params.uid,{lastName:"changed"})
  return res.json({status:"success"})
});

/**
 * Delete user by ID
 */
app.delete("/api/users/:uid", async(req, res) => {
  await User.findByIdAndDelete(req.params.uid)
  return res.json({status:"success"})
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
