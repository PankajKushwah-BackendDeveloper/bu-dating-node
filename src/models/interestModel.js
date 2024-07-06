import mongoose from "mongoose";

const interestSchema = new mongoose.Schema({
    Fun: [{
        type: String,
        unique: true
    }],
    Music: [{
        type: String,
        unique: true
    }],
    Sports: [{
        type: String,
        unique: true
    }]
});

const formatString = (str) => {
    if (typeof str !== 'string') return str;
    str = str.trim();
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

interestSchema.pre('save', function (next) {
    this.Fun = this.Fun.map(formatString);
    this.Music = this.Music.map(formatString);
    this.Sports = this.Sports.map(formatString);
    next();
});

export default mongoose.model('Interest', interestSchema);
