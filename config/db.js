const mongoose = require("mongoose");

const connectDB = async() =>{
    try{
        const conn =  await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log(`Database Connected at host: ${conn.connection.host}`)
        
    }catch(error){
        console.log(`ERROR: ${error.message}`);
        process.exit(1)
    }
};


module.exports = connectDB;