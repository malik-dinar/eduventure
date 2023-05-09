const express = require("express");
const connectDb = require("./Config/dbConnection");
const errorHandler = require("./Middleware/errorHandler");
const cors = require("cors");
const bodyParser = require("body-parser");
const compression = require('./Middleware/compression');
require("dotenv").config();

const app = express();
connectDb();
const port = process.env.PORT || 3001;

const userRoute = require("./Routes/userRoutes");
const tutorRoute = require("./Routes/tutorRoutes");
const adminRoute = require("./Routes/adminRoutes");

app.use(cors());
app.use(compression)
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/api/users", userRoute);
app.use("/api/tutors", tutorRoute);
app.use("/api/admin", adminRoute);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`server is  running in ${port}`);
});
