import Interest from "../models/interestModel.js";



export const addInterest = async (req, res) => {
    try {
        const { fun, music, sports } = req.body;

        if ((!fun || fun.length === 0) && (!music || music.length === 0) && (!sports || sports.length === 0)) {
            return res.status(400).send({
                success: false,
                message: 'Please provide at least one of the fields'
            });
        }

        const updates = {};

        if (fun && fun.length > 0) {
            updates.Fun = { $each: fun.map(formatString) };
        }

        if (music && music.length > 0) {
            updates.Music = { $each: music.map(formatString) };
        }

        if (sports && sports.length > 0) {
            updates.Sports = { $each: sports.map(formatString) };
        }

        const updatedInterest = await Interest.findOneAndUpdate(
            {},
            { $addToSet: updates },
            { new: true, upsert: true }
        );

        res.status(200).send({
            success: true,
            data: updatedInterest
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'An error occurred while adding interest',
            error: error.message
        });
    }
};

const formatString = (str) => {
    if (typeof str !== 'string') return str;
    str = str.trim();
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const getInterests = async(req,res)=>{
    try {
        const interests = await Interest.findOne().select('-__v -createdAt -updatedAt ');

        return res.status(200).send({
            success:true,
            message:'Interests are fetched',
            interests
        })
    } catch (error) {
    console.log('error: ', error);
        return res.status(500).send({
            success:false,
            message:'Internal server error',
            error:error.message
        })
    }
}