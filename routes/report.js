const { Router } = require("express");
const Report = require("../models/report");
const path = require("path");
const multer = require("multer");

const router = Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); 
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); 
  },
});

const upload = multer({ storage });

router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { title, description, latitude, longitude, address } = req.body;

    if (!title || !description || !latitude || !longitude) {
      return res.status(400).json({ msg: "Missing required fields" });
    }

    const newReport = await Report.create({
      title,
      description,
      address,
      location: {
        type: "Point",
        coordinates: [parseFloat(longitude), parseFloat(latitude)],
      },
      imageUrl: req.file ? `/uploads/${req.file.filename}` : "", 
    });

    res.status(201).json({ msg: "Report submitted", report: newReport });
  } catch (err) {
    console.error("Error creating report:", err);
    res.status(500).json({ msg: "Failed to submit report" });
  }
});


router.get("/", async (req, res) => {
  try {
    const reports = await Report.find().sort({ createdAt: -1 });
    res.json(reports);
  } catch (err) {
    console.error("Error fetching reports:", err);
    res.status(500).json({ msg: "Failed to fetch reports" });
  }
});

module.exports = router;