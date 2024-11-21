import express from 'express';
import dotenv from 'dotenv';

dotenv.config({path: '../.env'})

const app = express();
const PORT = process.env.PORT||5000

app.listen(PORT, (req, res) => {
    console.log(`listening at port http://localhost:${PORT}`)
})