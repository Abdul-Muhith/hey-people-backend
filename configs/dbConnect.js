import express from 'express';
import mongoose from "mongoose";

const app = express();
const { connect, connection } = mongoose;

const dbConnect = (connectionStr, PORT) => {
    try {
        const connection = connect(connectionStr);
        console.log('Database Connected Successfully');

        // app.listen(PORT, () => console.log(`and Server Running on PORT ${PORT}`))

        return connection;
    } catch (error) {
        console.log(`${error} Database did not connect`);
    }
};

export default dbConnect;