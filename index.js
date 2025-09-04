const express = require('express');
const router = express.Router();
require('dotenv').config();
const connectDB = require("./config/db");
const app = express();
const cors = require('cors');
const PORT = process.env.PORT || 5000 ;
const orderRoutes = require("./routes/orderRoutes");

app.use(express.json());
app.use(cors())
connectDB()

app.use("/orders", orderRoutes)

app.get('/', (req, res) => {
  res.send('Soudia Tailors API is running...')
})

app.listen(PORT, () =>{
    console.log(`App Server is running on port ${PORT}`)
})