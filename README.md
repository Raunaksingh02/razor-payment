const mongoose = require('mongoose');

const rewardSchema = new mongoose.Schema({
  label: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  value: {
    type: Number,
    required: true,
  },
  qrIds: [
    {
      qrId: {
        type: String,
        unique: true,
        required: true,
        length: 8,  // 8-digit unique ID
      },
      redeemed: {
        type: Boolean,
        default: false,  // Initially not redeemed
      },
      spinned: {
        type: Boolean,
        default: false,  // Initially not spinned
      },
    }
  ],
});

const Reward = mongoose.model('Reward', rewardSchema);
module.exports = Reward;














