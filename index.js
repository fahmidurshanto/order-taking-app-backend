const express = require('express');
require('dotenv').config();
const app = express();
const cors = require('cors');
const PORT = process.env.PORT || 3000 ;

app.use(express.json());
app.use(cors())


app.get('/', (req, res) => {
  res.send('Soudia Tailors API is running...')
})

app.listen(PORT, () =>{
    console.log(`App Server is running on port ${PORT}`)
})