import Interest from '../models/interestModel.js';

const formatString = (str) => {
    if (typeof str !== 'string') return str;
    return str.trim().toLowerCase(); // Adjusted to lowercase here
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
            updates.Fun = fun.map(item => ({ name: formatString(item) }));
        }

        if (music && music.length > 0) {
            updates.Music = music.map(item => ({ name: formatString(item) }));
        }

        if (sports && sports.length > 0) {
            updates.Sports = sports.map(item => ({ name: formatString(item) }));
        }

        const updatedInterest = await Interest.findOneAndUpdate(
            {}, // Find any document (since there's only one document based on your schema design)
            { $addToSet: updates }, // Add to arrays without duplicates
            { new: true, upsert: true, projection: { _id: 0, __v: 0 } } // Exclude _id and __v fields from the returned document
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
    
}