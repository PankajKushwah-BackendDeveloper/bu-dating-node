import mongoose from "mongoose";
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

export const updateTag = async (req, res) => {
    try {
        const { tagId } = req.params;
        const { tag } = req.body;

        if (!tagId || !mongoose.Types.ObjectId.isValid(tagId)) {
            return res.status(400).send({
                success: false,
                message: 'Please provide a valid tag id'
            });
        }

        const updatedTag = await Tags.findByIdAndUpdate(
            tagId,
            { $set: {  tag } },
            { new: true, runValidators: true }
        );

        if (!updatedTag) {
            return res.status(404).send({
                success: false,
                message: 'Tag not found'
            });
        }

        res.status(200).send({
            success: true,
            message: 'Tag updated successfully',
            tag: updatedTag
        });

    } catch (error) {
        console.error('Error updating tag:', error);
        res.status(500).send({
            success: false,
            message: 'An error occurred while updating the tag',
            error: error.message
        });
    }
};

export const deleteTag = async(req,res)=>{
    try {
        const {tagId} = req.params;
        if(!tagId|| !mongoose.Types.ObjectId.isValid(tagId)) return res.status(200).send({
            success:false,
            message:'please provide valid id'
        })

        const tag = await Tags.findByIdAndDelete(tagId);

    if(!tag) return res.status(200).send({
        success:false,
        message:'No tag found with this id'
    })

    return res.status(200).send({
        success:true,
        message:`${tag.tag}  tag is deleted`
    })
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'An error occurred while updating the tag',
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