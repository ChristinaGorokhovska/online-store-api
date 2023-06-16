require("dotenv").config();
import express from "express";
import cors from "cors";
import apiRoutes from "./routes/routes";
import mongoose, { ConnectOptions } from "mongoose";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
const app = express();

app.use(cookieParser());
const corsOptions = {
  origin: true,
  credentials: true,
};
app.use(cors(corsOptions));

mongoose
  .connect(`${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as ConnectOptions)
  .catch((err: any) => console.log(err));

mongoose.connection.on("connected", () => console.log("Connected to db"));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.listen(process.env.APP_PORT, () => {
  console.log(`Server is working on ${process.env.APP_PORT} port`);
});

app.use("/api/v1", apiRoutes);
