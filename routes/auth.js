const { Router } = require("express");
const router = Router();
const User = require("../models/user");

router.get("/signup", (req, res) => {
  return res.send("Signup page!");
});

router.get("/login", (req, res) => {
  return res.send("Login page!");
});

router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    console.log("Received signup request:", { name, email, password });

    await User.create({ name, email, password });

    res.status(200).json({ msg: "Successfully signed up!" });
  } catch (err) {
    console.error("Signup error:", err); e
    res.status(400).json({ msg: "Invalid user!", error: err.message });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const token = await User.matchPasswordAndGenerateToken(email, password);

    if (!token) {
      return res.status(401).json({ error: "Incorrect Email or Password!" });
    }

    res.cookie("token", token);
    return res.status(200).json({ msg: "Login successful!", token });
  } catch (error) {
    console.error("login error:", error);

    if (res.headersSent) return;

    return res.status(500).json({ error: "Something went wrong. Try again." });
  }
});

module.exports=router;
