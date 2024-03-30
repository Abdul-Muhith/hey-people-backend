import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
// import dotenv from 'dotenv';
import { config as envConfig } from 'dotenv';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';

import routes from './routes/index.js';
import connectDbAndListen from './configs/dbConnect.js';
import { notFound, errorHandler } from './middlewares/errorMiddleware.js';

const app = express();
// dotenv.config()
envConfig();
// app.use(bodyParser.json({ limit: '30mb', extended: true }));
// app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }));
app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(morgan('dev'));
app.use(routes);

// GLOBAL ERROR HANDLER
app.use(notFound);
app.use(errorHandler);

let CONNECTION_URL = process.env.DB_CONNECTION_URL
CONNECTION_URL = CONNECTION_URL.replace('<username>', process.env.DB_USERNAME)
CONNECTION_URL = CONNECTION_URL.replace('<password>', process.env.DB_PASSWORD)
CONNECTION_URL = `${CONNECTION_URL}/${process.env.DB_NAME}?${process.env.DB_URL_QUERY}`

// const DB_NAME = 'memoriesAPI'
// const DB_USERNAME = 'memories'
// const DB_PASSWORD = 'bhn5fzfKA5LC4Kzm'
// const DB_URL_QUERY = 'retryWrites=true&w=majority'

// let CONNECTION_URL = 'mongodb+srv://<username>:<password>@alotmarch.nbxr7id.mongodb.net'
// CONNECTION_URL = CONNECTION_URL.replace('<username>', DB_USERNAME)
// CONNECTION_URL = CONNECTION_URL.replace('<password>', DB_PASSWORD)
// CONNECTION_URL = `${CONNECTION_URL}/${DB_NAME}?${DB_URL_QUERY}`

const PORT = process.env.PORT || 5000

connectDbAndListen(CONNECTION_URL);
// connectDbAndListen('mongodb://localhost:27017/digitic-api');
// আমার বানানো ফাংশনে লিসেন সঠিকভাবে কাজ করছে না, তাই মেনুয়ালি করে নিলাম!
app.listen(PORT, () => console.log(`Server is Running on PORT ${PORT}`));

