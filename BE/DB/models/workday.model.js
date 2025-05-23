const mongoose = require("mongoose");

const workdaySchema = new mongoose.Schema(
  {
    checkInTime: {
      type: Date,
      required: [true, "CheckInTime is required"],
    },
    checkOutTime: {
      type: Date,
    },
    workHours: {
      type: Number,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: [true, "UserId is required"],
    },
    balance: {
      type: Number,
    }
  },
  { timestamps: true }
);


const workdayModel = mongoose.model("workday", workdaySchema);

module.exports = workdayModel;