const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const User = require("./user")
require("mongoose-currency").loadType(mongoose);
const Currency = mongoose.Types.Currency;

const questionsSchema = new Schema(
  {
    text: {
      type: String,
      required: true,
      unique: true,
    },
    options: {
      type: Array,
      required: true,
    },
    keywords: {
      type: Array,
      required: true
    },
    correctAnswerIndex: {
        type: Number,
        required: true
      },
}
);

var Question = mongoose.model("Question", questionsSchema);
module.exports = Question;
