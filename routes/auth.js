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

    if (!name || !email || !password) {
      return res.status(400).json({ msg: "All fields are required!" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ msg: "Email already registered!" });
    }

    await User.create({ name, email, password });

    res.status(200).json({ msg: "Successfully signed up!" });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "All fields are required!" });
  }

  try {
    const token = await User.matchPasswordAndGenerateToken(email, password);

    if (!token) {
      return res.status(401).json({ error: "Incorrect Email or Password!" });
    }

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.status(200).json({ msg: "Login successful!", token });
  } catch (error) {
    console.error("Login error:", error);
    if (res.headersSent) return;
    return res.status(401).json({ error: "Incorrect Email or Password!" });
  }
});

module.exports = router;