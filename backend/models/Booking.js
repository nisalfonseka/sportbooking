const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({

  userId:{
    type: mongoose.Schema.Types.ObjectId,
    ref:"User"
  },

  facilityId:{
    type: mongoose.Schema.Types.ObjectId,
    ref:"Facility"
  },

  startTime: Date,
  endTime: Date,

  status:{
    type:String,
    enum:["PENDING","APPROVED","REJECTED","CANCELLED"],
    default:"PENDING"
  },

  approvedBy:{
    type: mongoose.Schema.Types.ObjectId,
    ref:"User"
  },

  approvedAt:Date

},{
  timestamps:true
});

module.exports = mongoose.model("Booking", bookingSchema);