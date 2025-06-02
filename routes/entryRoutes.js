import express from "express";
import Entry from "../models/Entry.js";
import upload from "../middleware/upload.js";
import {
  getEntryByRPHCode,
  handleStepOne,
  handleStepTwo,
  handleStepThree,
  handleStepFour,
} from "../controllers/stepController.js";

const router = express.Router();

router.get("/entry-by-rph/:rphCode", getEntryByRPHCode);
router.post("/step-one", upload.single("profileImage"), handleStepOne);
router.post("/step-two/:rphCode", handleStepTwo);
router.post("/step-three/:rphCode", handleStepThree);
router.post("/step-four/:rphCode", handleStepFour);

router.get("/check/:rphCode", async (req, res) => {
  try {
    const entry = await Entry.findOne({ rphCode });
    if (!entry) return res.status(404).json({ error: "Not found" });

    res.json({ isSubmitted: entry.isSubmitted });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get next RPH Code
router.get("/rph-code", async (req, res) => {
  const lastEntry = await Entry.findOne().sort({ rphCode: -1 });
  const nextCode = lastEntry ? lastEntry.rphCode + 1 : 25448;
  res.json({ rphCode: nextCode });
});

router.get('/all', async (req, res) => {
  try {
    const allEntries = await Entry.find().select("-__v -profileImageId");
    res.json(allEntries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Create Entry
router.post("/create-entry", async (req, res) => {
  try {
    const lastEntry = await Entry.findOne().sort({ rphCode: -1 });
    const nextCode = lastEntry ? lastEntry.rphCode + 1 : 25411;

    const newEntry = new Entry({ ...req.body, rphCode: nextCode });
    await newEntry.save();

    res.json({ rphCode: nextCode });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error saving entry");
  }
});

// Assuming you have Express router and Entry model imported

router.put('/update-status/:rphCode', async (req, res) => {
  try {
    const { rphCode } = req.params;
    const { status } = req.body;

    const validStatuses = [
      "pending",
      "author completed",
      "cover confirmation",
      "isbn confirmation",
      "manuscript confirmation",
      "work completed",
      "cancelled",
    ];

    if (!validStatuses.includes(status.toLowerCase())) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const entry = await Entry.findOne({ rphCode });

    if (!entry) {
      return res.status(404).json({ message: "Entry not found" });
    }

    entry.status = status;
    await entry.save();

    res.status(200).json({ message: "Status updated successfully", entry });
  } catch (error) {
    console.error("Error updating status:", error);
    res.status(500).json({ message: "Server error" });
  }
});


export default router;
