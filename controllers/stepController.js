import Entry from "../models/Entry.js";

export const getEntryByRPHCode = async (req, res) => {
  try {
    const entry = await Entry.findOne({ rphCode: req.params.rphCode });
    if (!entry) return res.status(404).json({ message: "Entry not found" });
    res.json(entry);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const handleStepOne = async (req, res) => {
  try {
    const {
      rphCode,
      authorName,
      email,
      contactNo,
      packages,
      amount,
      coAuthorName,
      address,
      pincode,
      aboutAuthor,
      referenceName,
      status,
    } = req.body;

    const updatedEntry = await Entry.findOneAndUpdate(
      { rphCode },
      {
        authorName,
        email,
        contactNo,
        packages,
        amount,
        coAuthorName,
        address,
        pincode,
        aboutAuthor,
        referenceName,
        status,
      },
      { new: true }
    );

    if (!updatedEntry) {
      return res.status(404).json({ message: "Entry not found" });
    }

    res
      .status(201)
      .json({ message: "Step 1 submitted successfully", updatedEntry });
  } catch (err) {
    console.error("Step 1 submission error:", err);
    res.status(500).json({ error: "Submission failed", details: err.message });
  }
};


export const handleStepTwo = async (req, res) => {
  const { rphCode } = req.params;
  const {
    title,
    subTitle,
    language,
    paperColor,
    lamination,
    bookSize,
    bookCategory,
    noOfPages,
  } = req.body;

  try {
    const updated = await Entry.findOneAndUpdate(
      { rphCode },
      {
        title,
        subTitle,
        language,
        paperColor,
        lamination,
        bookSize,
        bookCategory,
        noOfPages,
      },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Entry not found" });

    res.json({ message: "Step 2 saved", updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const handleStepThree = async (req, res) => {
  const { rphCode } = req.params;
  const { coverURL, backCoverText } = req.body;

  try {
    // Sirf coverURL aur backCoverText ko update karna hai
    const updateFields = {
      coverURL,
      backCoverText,
    };

    const updated = await Entry.findOneAndUpdate({ rphCode }, updateFields, {
      new: true,
    });

    if (!updated) {
      return res.status(404).json({ message: "Entry not found" });
    }

    res.json({ message: "Step 3 saved", updated });
  } catch (err) {
    console.error("Error in Step 3 handler:", err);
    res.status(500).json({ error: err.message });
  }
};


export const handleStepFour = async (req, res) => {
  try {
    const { rphCode } = req.params;
    const { acHolderName, bankName, acNumber, ifscCode, accountType, upiId } = req.body;

    // Step 1: Find entry by rphCode
    const entry = await Entry.findOne({ rphCode });

    // Step 2: Entry not found
    if (!entry) {
      return res.status(404).json({ message: "Entry not found" });
    }

    // Step 3: Already submitted check
    if (entry.isSubmitted) {
      return res.status(410).json({ message: "Form already submitted" }); // 410 Gone
    }

    // Step 4: Update values
    entry.acHolderName = acHolderName;
    entry.bankName = bankName;
    entry.acNumber = acNumber;
    entry.ifscCode = ifscCode;
    entry.accountType = accountType;
    entry.upiId = upiId;
    entry.isSubmitted = true;
    entry.stepFourSubmittedAt = new Date();
    entry.status = "author completed";

    // Step 6: Save
    await entry.save();

    res.status(200).json({ message: "Step 4 saved successfully", entry });
  } catch (error) {
    console.error("Error saving Step 4:", error);
    res.status(500).json({ error: "Failed to save Step 4" });
  }
};

