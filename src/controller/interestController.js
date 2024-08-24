import { Fun, LifeStyle, Music, Sports } from "../models/interestModel.js";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



export const addFun = async (req, res) => {
    try {
        const { name } = req.body;

        if (!req.file) {
            return res.status(400).send({
                success: false,
                message: 'Please select an image for Fun'
            });
        }

const formatName = capitalizeWords(name)
        const isExisting = await Fun.findOne({ 'field.name': formatName });

        if (isExisting) {
            return res.status(400).send({
                success: false,
                message: `${name} already exists in Fun`
            });
        }

        const image = {
            filename: req.file.filename,
            path: req.file.path,
            contentType: req.file.mimetype,
        };

        const imgurl = `${req.protocol}://${req.get("host")}/api/v1/interest/get-image/${req.file.filename}`;

        const newFun = new Fun({
            field: {
                name: formatName,
                image,
                imgurl
            }
        });

        await newFun.save();

        return res.status(201).send({
            success: true,
            message: `${formatName} has been added`,
            newFun
        });
    } catch (error) {
        console.log('Error: ', error);
        return res.status(500).send({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};
export const addMusic = async (req, res) => {
    try {
        const { name } = req.body;

        if (!req.file) {
            return res.status(400).send({
                success: false,
                message: 'Please select an image for Fun'
            });
        }

const formatName = capitalizeWords(name)
        const isExisting = await Music.findOne({ 'field.name': formatName });

        if (isExisting) {
            return res.status(400).send({
                success: false,
                message: `${name} already exists in Music`
            });
        }

        const image = {
            filename: req.file.filename,
            path: req.file.path,
            contentType: req.file.mimetype,
        };

        const imgurl = `${req.protocol}://${req.get("host")}/api/v1/interest/get-image/${req.file.filename}`;

        const newMusic = new Music({
            field: {
                name: formatName,
                image,
                imgurl
            }
        });

        await newMusic.save();

        return res.status(201).send({
            success: true,
            message: `${formatName} has been added`,
            newMusic
        });
    } catch (error) {
        console.log('Error: ', error);
        return res.status(500).send({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};
export const addSports = async (req, res) => {
    try {
        const { name } = req.body;

        if (!req.file) {
            return res.status(400).send({
                success: false,
                message: 'Please select an image for Fun'
            });
        }

const formatName = capitalizeWords(name)
        const isExisting = await Sports.findOne({ 'field.name': formatName });

        if (isExisting) {
            return res.status(400).send({
                success: false,
                message: `${name} already exists in Sport`
            });
        }

        const image = {
            filename: req.file.filename,
            path: req.file.path,
            contentType: req.file.mimetype,
        };

        const imgurl = `${req.protocol}://${req.get("host")}/api/v1/interest/get-image/${req.file.filename}`;

        const newSport = new Sports({
            field: {
                name: formatName,
                image,
                imgurl
            }
        });

        await newSport.save();

        return res.status(201).send({
            success: true,
            message: `${formatName} has been added`,
            newSport
        });
    } catch (error) {
        console.log('Error: ', error);
        return res.status(500).send({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};
export const addLifeStyle = async (req, res) => {
    try {
        const { name } = req.body;

        if (!req.file) {
            return res.status(400).send({
                success: false,
                message: 'Please select an image for Fun'
            });
        }

const formatName = capitalizeWords(name)
        const isExisting = await LifeStyle.findOne({ 'field.name': formatName });

        if (isExisting) {
            return res.status(400).send({
                success: false,
                message: `${name} already exists in LifeStyle`
            });
        }

        const image = {
            filename: req.file.filename,
            path: req.file.path,
            contentType: req.file.mimetype,
        };

        const imgurl = `${req.protocol}://${req.get("host")}/api/v1/interest/get-image/${req.file.filename}`;

        const newLifeStyle = new LifeStyle({
            field: {
                name: formatName,
                image,
                imgurl
            }
        });

        await newLifeStyle.save();

        return res.status(201).send({
            success: true,
            message: `${formatName} has been added`,
            newLifeStyle
        });
    } catch (error) {
        console.log('Error: ', error);
        return res.status(500).send({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

export const getFun = async(req,res)=>{
    try {
        const funList = await Fun.find()
        
        const formattedFun = funList?.map(fun=>({
            name:fun.field.name,
            imgurl:fun.field.imgurl
        }))
        return res.send({
            success:true,
            message:"Fun fetched successfully",
            fun:formattedFun
        })
    } catch (error) {
    console.log('error: ', error);
        return res.status(500).send({
            success:false,
            message:'Internal server error ',
            error:error.message
        })
    }
}
export const getSports = async(req,res)=>{
    try {
        const sportsList = await Sports.find()
        
        const formattedSport= sportsList?.map(sport=>({
            name:sport.field.name,
            imgurl:sport.field.imgurl
        }))
        return res.send({
            success:true,
            message:"Sports fetched successfully",
            sports:formattedSport
        })
    } catch (error) {
    console.log('error: ', error);
        return res.status(500).send({
            success:false,
            message:'Internal server error ',
            error:error.message
        })
    }
}
export const getMusic = async(req,res)=>{
    try {
        const musicList = await Music.find()
        
        const formattedMusic = musicList?.map(music=>({
            name:music.field.name,
            imgurl:music.field.imgurl
        }))

        return res.send({
            success:true,
            message:"Music fetched successfully",
            music:formattedMusic
        })
    } catch (error) {
    console.log('error: ', error);
        return res.status(500).send({
            success:false,
            message:'Internal server error ',
            error:error.message
        })
    }
}
export const getLifeStyle = async(req,res)=>{
    try {
        const lifeStyleList = await LifeStyle.find()
        
        const formattedStyle = lifeStyleList?.map(lifeStyle=>({
            name:lifeStyle.field.name,
            imgurl:lifeStyle.field.imgurl
        }))
        return res.send({
            success:true,
            message:"LifeStyles fetched successfully",
            lifeStyles:formattedStyle
        })
    } catch (error) {
    console.log('error: ', error);
        return res.status(500).send({
            success:false,
            message:'Internal server error ',
            error:error.message
        })
    }
}

export const getInterests = async(req,res)=>{
    try {
        const lifeStyleList = await LifeStyle.find()
        
        const formattedStyle = lifeStyleList?.map(lifeStyle=>({
            name:lifeStyle.field.name,
            imgurl:lifeStyle.field.imgurl,
            _id:lifeStyle._id
        }))
        const musicList = await Music.find()
        
        const formattedMusic = musicList?.map(music=>({
            name:music.field.name,
            imgurl:music.field.imgurl,
            _id:music._id
        }))

        const sportsList = await Sports.find()
        
        const formattedSport= sportsList?.map(sport=>({
            name:sport.field.name,
            imgurl:sport.field.imgurl,
            _id:sport._id
        }))


        const funList = await Fun.find()
        
        const formattedFun = funList?.map(fun=>({
            name:fun.field.name,
            imgurl:fun.field.imgurl,
            _id:fun._id
        }))

const interests = {
    fun:formattedFun,
    music:formattedMusic,
    lifeStyle:formattedStyle,
    sports:formattedSport
}


return res.send({
    success:true,
    message:"Interests are fetched",
    interests
})
    } catch (error) {
    console.log('error: ', error);
    return res.status(500).send({
        success:false,
        message:'Internal server error ',
        error:error.message
    })

    }
}


export const getInterestImage = async (req, res) => {
    try {
      const { fileName } = req.params;
  
      if (!fileName) {
        return res.status(400).send("File name is required");
      }
  
      const directoryPath = path.join(__dirname, "../../public/interest");
  
      if (!fs.existsSync(directoryPath)) {
        return res.status(500).send("Directory not found");
      }
  
      const filePath = path.join(directoryPath, fileName);
      console.log('filePath: ', filePath);
  
      if (!fs.existsSync(filePath)) {
        return res.status(404).send("File not found");
      }
  
      res.setHeader("Content-Disposition", "inline; filename=" + fileName);
      res.sendFile(filePath);
    } catch (error) {
      console.error("Error downloading file:", error);
      res.status(500).send("Internal Server Error");
    }
  };

  const capitalizeWords = (str) => {
    return str
        .toLowerCase() 
        .split(' ')     
        .map(word => word.charAt(0).toUpperCase() + word.slice(1)) 
        .join(' ');     
};