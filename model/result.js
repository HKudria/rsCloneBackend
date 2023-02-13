const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema({
    email: { type: String},
    startTime: { type: Number, default: null },
    endTime: { type: Number, default: null },
    length: { type: Number },
    errorChar: { type: Number },
    correctChar: { type: Number },
    text: { type: String },
    currIndex: { type: Number },
    percent: { type: Number },
    time: { type: Number, default: null },
    date: { type: String }
});

module.exports = mongoose.model("result", resultSchema);