import mongoose from "mongoose";

import colors from "colors";
const uri =
`mongodb+srv://ayush1909kushwah:GHFfJHCkb3weYyS1@cluster0.kxo4atz.mongodb.net/?retryWrites=true&w=majority`;

const connectDB = async () => {
  try {
    const data= await mongoose.connect(uri,{dbName:'bu-dating'});
    // await mongoose.connect("mongodb://127.0.0.1:27017/spir");

    console.log(`Mongodb Connected ${mongoose.connection.host}`.bgBlue.white);
  } catch (error) {
    console.log(error);
  }
};

export default connectDB;

