import mongoose, { Schema } from 'mongoose';

const fieldSchema = new Schema({
    name: {
        type: String,
        unique: true,
        trim: true,
        required: true,
    },
    image: {
        path: String,
        contentType: String,
        filename: String
    },
    imgurl: {
        type: String,
        required: true
    }
}, { _id: false }); 

const funSchema = new Schema({
    field: fieldSchema
}, { timestamps: true });

const sportsSchema = new Schema({
    field: fieldSchema
}, { timestamps: true });

const musicSchema = new Schema({
    field: fieldSchema
}, { timestamps: true });
const lifeStyleSchema = new Schema({
    field: fieldSchema
}, { timestamps: true });

const Fun = mongoose.model('Fun', funSchema);
const Music = mongoose.model('Music', musicSchema);
const Sports = mongoose.model('Sports', sportsSchema);
const LifeStyle = mongoose.model('LifeStyle', lifeStyleSchema);

export { Fun, Music, Sports ,LifeStyle};



