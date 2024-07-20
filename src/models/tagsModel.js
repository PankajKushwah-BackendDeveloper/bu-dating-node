import mongoose from 'mongoose'

const tagsSchema = mongoose.Schema({
    tag:{
        type:String,
        required:true,
    },
    follower:[{
        type:mongoose.Types.ObjectId,
        
    }]
},{timestamps:true});

const Tags = mongoose.model('Tags',tagsSchema);
export default Tags;