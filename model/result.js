const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema({
    email: { type: String, unique: true },
    result_time: { type: Number, default: null },
    correct_input: { type: Number },
    incorrect_input: { type: Number },
    percent: { type: Number },
    text: { type: String },
    timer: { type: Number, default: null },
    timer_percent: { type: Number, default: null },
});

module.exports = mongoose.model("result", resultSchema);