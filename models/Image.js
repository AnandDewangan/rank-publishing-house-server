import mongoose from "mongoose";

const imageSchema = new mongoose.Schema({
  url: { type: String, required: true },
  public_id: { type: String, required: true },
  name: { type: String },  
  title: { type: String },            
  description: { type: String },      
  uploadedAt: { type: Date, default: Date.now }
}); 

export default mongoose.model("Image", imageSchema);
