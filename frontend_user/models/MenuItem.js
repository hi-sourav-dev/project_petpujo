const mongoose = require("mongoose");

const menuItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    desc: { type: String, trim: true },
    price: { type: Number, required: true },
    img: { type: String, trim: true }, // e.g., "veg.png"
    category: {
      type: String,
      required: true,
      enum: [
        "thali",
        "curry",
        "extrafood",
        "mutton",
        "daysabjidal",
        "dayextra",
        "purevegthali",
      ],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("MenuItem", menuItemSchema);
