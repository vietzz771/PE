const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;

const quizSchema = new Schema({
    title : {
        type: String,
        required: true,
        unique : true,
    },
    description: {
        type: String,
        required: true
    },
    questions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question",
        required: true
    }]
});
const Quiz = mongoose.model('Quiz', quizSchema);
module.exports = Quiz;