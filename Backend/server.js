import express from 'express';
import dotenv from 'dotenv';
import ConnectDB from './DataBase/ConnectDB.js';

dotenv.config({path: '../.env'});

const app = express();
const PORT = process.env.PORT||5000;

app.get('/', (req, res) => {
    res.send('Hello World!');
})

app.listen(PORT, (req, res) => {
    console.log(`listening at port http://localhost:${PORT}`);
    console.log(`env: ${process.env.NODE_ENV}`);
    ConnectDB();
})