const { Schema, model } = require("mongoose");

const reportSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
      default: 'Point'
    },
    coordinates: {
      type: [Number], 
      required: true
    }
  },
  imageUrl: String,
  
  address: {
    type: String,
    required: false
  }

}, { timestamps: true });

const Report = model("report", reportSchema);

module.exports = Report;
