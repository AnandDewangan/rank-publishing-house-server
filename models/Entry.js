import mongoose from "mongoose";

const entrySchema = new mongoose.Schema({
  rphCode: { type: Number, required: true, unique: true },

  // Step 1 Fields
  authorName: String,
  email: String,
  contactNo: String,
  packages: String,
  amount: Number,
  referenceName: String,
  status: String,
  coAuthorName: String,
  address: String,
  pincode: String,
  aboutAuthor: String,
  profileImageUrl: String,
  profileImageId: String,

  // Step 2 Fields
  title: String,
  subTitle: String,
  language: String,
  paperColor: String,
  lamination: String,
  bookSize: String,
  bookCategory: String,
  noOfPages: String,

  // Step 3 Fields
  coverURL: String,
  backCoverText: String,

  // Step 4 Fields
  acHolderName: String,
  bankName: String,
  acNumber: String,
  ifscCode: String,
  accountType: { type: String, enum: ["current", "saving"] },
  upiId: String,
  submittedAt: {
    type: Date,
    default: Date.now,
  },
});

const Entry = mongoose.model("Entry", entrySchema);
export default Entry;
