const express = require("express");
const errorHandler = require("./middleware/errorHandler");
const connectDB = require("./config/dbConnection");
const bodyParser = require('body-parser')
require('dotenv').config();

const app = express();
const port= process.env.PORT || 5000;



connectDB();

app.use(express.json());
app.use("/api/contacts",require("./routes/contactRoutes") )
app.use("/api/users",require("./routes/userRoutes") )
app.use(errorHandler)


app.listen(port, ()=>{
    console.log(`Server running on port ${port}`);
});



