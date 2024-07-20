import Tags from "../models/tagsModel.js";


export const addTags = async (req, res) => {
    try {
        const { tags } = req.body;
        if (!tags || tags.length === 0) {
            return res.status(200).send({
                success: false,
                message: 'please provide tag'
            });
        }

        const newTags = [];
        for (const tag of tags) {
            const newTag = new Tags({
                tag
            });
            await newTag.save();
            newTags.push(newTag);
        }

        return res.status(200).send({
            success: true,
            message: `new tags added`,
            newTags
        });
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
}

export const getAllTags = async (req, res) => {
    try {
        const tags = await Tags.find().select('-__v').lean();

        const tagsWithFollowerCount = tags.map(tag => ({
            ...tag,
            follower: tag.follower.length
        }));

        return res.status(200).send({
            success: true,
            message: 'All tags fetched',
            tags: tagsWithFollowerCount
        });
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
}


export const addFollwer = async(req,res)=>{
    try {
        const {tag } = req.body;
const follower = req.user._id;
       
        if(!tag||!follower) return res.status(200).send({
            success:false,
            message:'tag and follower id both required',
        })

        const existingTag = await Tags.findOne({tag});
        if(!existingTag) return res.status(200).send({
            success:false,
            message:'please select valid tag'
        })
        existingTag.follower.push(follower);
existingTag.save();
return res.status(200).send({
    success:true,
    message:`you are following '${tag}' tag`
})
    } catch (error) {
      return res.status(500).send({
        success:false,
        message:'server error while adding follwer in tags',
        error:error.message
      })  
    }
}