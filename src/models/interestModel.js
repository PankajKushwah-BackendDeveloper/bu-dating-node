import mongoose from 'mongoose';

const interestSchema = new mongoose.Schema({
    Fun: [{
        name: {
            type: String,
            unique: true,
            trim: true,
            required: true
        }
    }],
    Music: [{
        name: {
            type: String,
            unique: true,
            trim: true,
            required: true
        }
    }],
    Sports: [{
        name: {
            type: String,
            unique: true,
            trim: true,
            required: true
        }
    }]
}, { timestamps: true });

export default mongoose.model('Interest', interestSchema);
