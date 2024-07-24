import mongoose from 'mongoose'

const tagsSchema = mongoose.Schema({
    tag:{
        type:String,
        required:true,
        set:value=> upperCase(value)
    },
    follower:[{
        type:mongoose.Types.ObjectId,
        
    }]
},{timestamps:true});


function upperCase(value){
if(typeof value !=='string'
) return '';
return value.toUpperCase();
}
const Tags = mongoose.model('Tags',tagsSchema);
export default Tags;