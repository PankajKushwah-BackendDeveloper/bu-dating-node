import interestModel from '../models/interestModel.js';
import Interest from '../models/interestModel.js';

const formatString = (str) => {
    if (typeof str !== 'string') return str;
    return str.trim().toUpperCase();
};

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
            const funItems = await Interest.find({ "Fun.name": { $in: fun.map(item => formatString(item)) } });
            const existingFunNames = funItems.flatMap(item => item.Fun.map(f => f.name));
            updates.Fun = fun.filter(item => !existingFunNames.includes(formatString(item))).map(item => ({ name: formatString(item) }));
        }

        if (music && music.length > 0) {
            const musicItems = await Interest.find({ "Music.name": { $in: music.map(item => formatString(item)) } });
            const existingMusicNames = musicItems.flatMap(item => item.Music.map(m => m.name));
            updates.Music = music.filter(item => !existingMusicNames.includes(formatString(item))).map(item => ({ name: formatString(item) }));
        }

        if (sports && sports.length > 0) {
            const sportsItems = await Interest.find({ "Sports.name": { $in: sports.map(item => formatString(item)) } });
            const existingSportsNames = sportsItems.flatMap(item => item.Sports.map(s => s.name));
            updates.Sports = sports.filter(item => !existingSportsNames.includes(formatString(item))).map(item => ({ name: formatString(item) }));
        }

        if (Object.keys(updates).length === 0 || 
            (updates.Fun && updates.Fun.length === 0) && 
            (updates.Music && updates.Music.length === 0) && 
            (updates.Sports && updates.Sports.length === 0)) {
            return res.status(400).send({
                success: false,
                message: 'All provided interests are already in the database'
            });
        }

        const updatedInterest = await Interest.findOneAndUpdate(
            {},
            { $addToSet: updates },
            { new: true, upsert: true, projection: { _id: 0, __v: 0 } }
        );

        if (!updatedInterest) {
            return res.status(404).send({
                success: false,
                message: 'No interest found or created'
            });
        }

        res.status(200).send({
            success: true,
            data: updatedInterest,
            message: 'Interests added successfully'
        });
    } catch (error) {
        console.error('Error adding interest:', error);
        res.status(500).send({
            success: false,
            message: 'An error occurred while adding interest',
            error: error.message
        });
    }
};

export const getInterests = async(req,res)=>{
    try {
        const interests = await interestModel.find();

        return res.status(200).send({
            success:false,
            message:'Interest fetched',
            interests
        })
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'An error occurred while adding interest',
            error: error.message
        });
    }
}